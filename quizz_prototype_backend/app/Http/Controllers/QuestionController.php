<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


class QuestionController extends Controller
{
    private $auth_user;
    public function __construct(){
        $this->auth_user = Auth()->guard('api')->user();
    }

    public function index()
    {
        $questions = Question::inRandomOrder()->limit(10)->get();

        $questions->transform(function($question, $key) {

            $answers = [
                $question->answer_1,
                $question->answer_2,
                $question->answer_3,
                $question->answer_4,
                $question->answer_5,
            ];

            shuffle($answers);

            $temp= array();
            foreach($answers as $index => $value){
                if($value == 'nda') {
                    array_push($temp, $value);
                    unset ($answers[$index]);
                }
            }
            $result = array_merge($answers, $temp);

            return [
                'question' => $question->question,
                'correct_answer' => $question->correct_answer,
                'question_comment' => $question->question_comment,
                'answers' => $result
                ];
            });

        return $questions;
    }


    public function store(Request $request)
    {

        if($request->hasFile('question_file')){
            return $this->uploadCSVFile($request);
        }

        return response()->json(['error' => 'The request is incorrect'], 400);
    }


    public function update(Request $request, $id)
    {
        //
    }


    public function destroy($id)
    {
        //
    }


    private function uploadCSVFile($request){

        $rules = [
            'question_file' => 'file|mimes:csv,txt,xls,xlsx'
        ];

        $request->validate($rules);

        $file = $request->file('question_file');

        //Se o arquivo for um CSV válido
        if ($file->getMimeType() === "text/plain" && ($open = fopen($file, "r")) !== FALSE)
        {
            while (($data = fgetcsv($open, 1000, ",")) !== FALSE)
            {
              $questions[] = $data;
            }
            fclose($open);
        }else{
            //Carrega a planilha do excel

            $spreadSheet = IOFactory::load($file);
            $questions = $spreadSheet->getActiveSheet()->toArray();
        }


        $header = $questions[0];

        $csv_questions_array = array_map(function($question, $index) use ($header){

            $assoc_array = [];

            foreach ($question as $key => $question_column) {
                if(count($question) === 9){
                    $assoc_array[$header[$key]] = $question[$key];

                    if($key === 6 && is_numeric($question[$key])){
                        $assoc_array[$header[$key]] = $question[(int)$question[$key]];

                    }
                }
            }
            return $assoc_array;
        },$questions, array_keys($questions));

        //Drop que csv header
        array_shift($csv_questions_array);

        //Filter the invalid questions
        $csv_questions_array = array_filter($csv_questions_array, function($csv_question){
            if(count($csv_question) === 9){
                return $csv_question;
            }
        });

        $csv_questions_array = array_unique($csv_questions_array, SORT_REGULAR);

        //Add authenticated user and category to question array
        $csv_questions_array = array_map(function($question){
            $question['user_id'] = $this->auth_user->id;
            return $question;
        }, $csv_questions_array);

        $csv_validation_rules = [
            'questions.*.question' => 'unique:questions'
        ];

        $validation = Validator::make(['questions' => $csv_questions_array], $csv_validation_rules);

        if($validation->fails()){
            $errors = [];
            foreach ($validation->errors()->toArray() as $key => $error) {
                $i = explode('.',$key)[1];
                $error = 'A pergunta: "'.$csv_questions_array[$i]['question']. '" já existe no banco de dados';
                $errors[] = $error;
            }

            return response()->json(['errors' => $errors]);
        }

        dd($csv_questions_array);
        $questions = Question::insert($csv_questions_array);

        return response()->json(['success' => 'Seu Arquivo foi adicionado com sucesso à base de dados']);
    }
}
