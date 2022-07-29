<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use App\Models\Quizz;

use Dirape\Token\Token;
use Illuminate\Support\Facades\Storage;


class QuestionController extends Controller
{
    private $auth_user;
    public function __construct()
    {
        $this->auth_user = Auth()->guard('api')->user();
    }

    public function index(Request $request)
    {

        if (!isset($request->random_questions)) {

            $questions = Question::with('category')
                ->where('user_id', $this->auth_user->id)
                ->where(function ($q) use ($request) {
                if ($request->category_id || $request->category_id != 0) {
                    return $q->where('category_id', $request->category_id);
                }
            })
                ->where(function ($q) use ($request) {
                if ($request->question || $request->question != '') {
                    return $q->where('question', 'like', '%' . $request->question . '%');
                }
            })
                ->orderBy('created_at', 'DESC')
                ->Paginate($request->per_page);
        }
        else {
            $questions = Question::where(function ($q) use ($request) {
                if (isset($request->category_id) && $request->category_id != 0) {
                    return $q->where('user_id', 1)->where('category_id', $request->category_id);
                }
                return $q->where('user_id', 1);
            })
                ->inRandomOrder()
                ->limit($request->limit ? $request->limit : null)
                ->get();
        }

        return $questions;
    }


    public function store(Request $request)
    {

        $quizz_image_path = null;
        $file_questions_array = $request->questions ? array_map(function($q){return json_decode($q, true);}, $request->questions) : null;

        if ($request->hasFile('image')) {
            $request->validate(['image' => ['max:512', 'mimes:jpg,jpeg,png']]);

            $path = 'quizz/images';
            $image_url = Storage::disk('local')->put($path, $request->file('image'));
            $quizz_image_path = basename($image_url);
        }

        if ($request->hasFile('question_file')) {
            if($request->createQuizz){
                $rules = [
                    'category_id' => 'required|integer',
                ];

                $request->validate($rules);
            }

            $file_questions_array = $this->uploadCSVFile($request);
        }

        if($request->createQuizz){
            $quizz = Quizz::create([
                'user_id' => $this->auth_user->id,
                'image' => $quizz_image_path,
                'token' => (new Token())->Unique('quizz', 'token', 6),
                'category_id' => $request->category_id,
                'title' => $request->title,
                'description' => $request->description,
                'withTime' => (bool)$request->withTime,
                'time_per_question' => $request->time_per_question,
                'count_time' => $request->count_time+1,
                'shuffle_answers' => (bool)$request->shuffle_answers,
                'shuffle_questions' => (bool)$request->shuffle_questions,
                'immediate_show_wrong_answers' => (bool)$request->immediate_show_wrong_answers,
            ]);
        }

        foreach ($file_questions_array as $key => $question) {
            $question_image_path = '';
            if($request->hasFile('question_image_'.$key)){
                $path = 'questions/'.$this->auth_user->id.'/images';
                $image_url = Storage::disk('local')->put($path, $request->file('question_image_'.$key));
                $question_image_path = basename($image_url);
            }

            $question_model = new Question();

            $question_model->fill(array_merge($question, ['image' => $question_image_path]));


            $question = Question::firstOrCreate(['question' => $question['question'], 'user_id' => $this->auth_user->id], $question_model->toArray());
            if($request->createQuizz){
                DB::table('quizz_question')->insert([
                    'question_id' => $question->id,
                    'quizz_id' => $quizz->id,
                    'created_at' => date('Y-m-d H:m:s'),
                    'updated_at' => date('Y-m-d H:m:s'),
                ]);
            }
        }

        if($request->createQuizz){
            return response()->json(['success' => 'Suas questões foram adicionadas com sucesso à base de dados', 'token' => $quizz->token]);
        }
        return response()->json(['success' => 'Suas questões foram adicionadas com sucesso à base de dados']);
    }


    public function update(Request $request, $id)
    {
    //
    }


    public function destroy(Request $request)
    {

        $rules = [
            'question' => 'array|required',
            'question.*' => 'integer'
        ];

        $request->validate($rules);

        $deleted_questions = $this->auth_user->questions()->whereIn('id', $request->question)->pluck('id');
        if($this->auth_user->questions()->whereIn('id', $request->question)->delete()){
            return response()->json(['success' => 'suas questões foram deletadas com sucesso da nossa base de dados', 'deleted_ids' => $deleted_questions]);
        }
        return response()->json(['errors' => 'estas questões não podem ser deletadas, pois não existem mais no banco de dados ou pertencem à outro usuário.']);
    }


    private function uploadCSVFile($request)
    {

        $rules = [
            'question_file' => 'file|mimes:csv,txt,xls,xlsx'
        ];

        $request->validate($rules);

        $file = $request->file('question_file');

        //Se o arquivo for um CSV válido
        if ($file->getMimeType() === "text/plain" && ($open = fopen($file, "r")) !== FALSE) {
            while (($data = fgetcsv($open, 1000, ",")) !== FALSE) {
                $questions[] = $data;
            }
            fclose($open);
        }
        else {
            //Carrega a planilha do excel
            $spreadSheet = IOFactory::load($file);
            $questions = $spreadSheet->getActiveSheet()->toArray();
        }


        $header = $questions[0];

        $csv_questions_array = array_map(function ($question, $index) use ($header) {

            $assoc_array = [];

            foreach ($question as $key => $question_column) {
                if (count($question) === 9) {
                    $assoc_array[$header[$key]] = $question[$key];

                    if ($key === 6 && is_numeric($question[$key])) {
                        $assoc_array[$header[$key]] = $question[(int)$question[$key]];

                    }
                }
            }
            return $assoc_array;
        }, $questions, array_keys($questions));

        //Drop que csv header
        array_shift($csv_questions_array);

        //Filter the invalid questions
        $csv_questions_array = array_filter($csv_questions_array, function ($csv_question) {
            if (count($csv_question) === 9) {
                return $csv_question;
            }
        });

        $csv_questions_array = array_unique($csv_questions_array, SORT_REGULAR);

        //Add authenticated user and category to question array
        $csv_questions_array = array_map(function ($question) use ($request) {
            $question['user_id'] = $this->auth_user->id;
            $question['category_id'] = $request->category_id;
            return $question;
        }, $csv_questions_array);

        return $csv_questions_array;
    }
}
