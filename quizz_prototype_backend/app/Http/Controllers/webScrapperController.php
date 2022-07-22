<?php

namespace App\Http\Controllers;

use App\Http\Requests\webScrapperRequest;
use Carbon\Carbon;
use App\Models\Question;
use Illuminate\Support\Facades\Storage;

class webScrapperController extends Controller
{
    public function scrapQuizz(webScrapperRequest $request)
    {

        //Seed from todamateria quizzes
        $url = $request->input('url');

        $regex_questions = $request->input('regex_questions') ? $request->input('regex_questions') : '/<h2>(.*?)<\/div>/s';
        $regex_question = $request->input('regex_question') ? $request->input('regex_question') : '/(?<=[0-9]\.\s)(.*)(.*?\?)/m';
        $regex_answers = $request->input('regex_answers') ? $request->input('regex_answers') : '/([A-z]\)\s)(.*?)(?=(\<\/p\>))/s';
        $regex_correct_answer = $request->input('regex_correct_answer') ? $request->input('regex_correct_answer') : '/(?<=Alternativa\s)(.*)(?=:)/ms';
        $regex_image = $request->input('regex_image') ? $request->input('regex_image') : '/\/\/(\S+?(?:jpe?g|png|gif))/is';

        $content = file_get_contents($url);

        preg_match_all($regex_questions, $content, $matches);

        foreach ($matches[0] as $match) {
            preg_match($regex_question, $match, $question);
            preg_match($regex_answers, $match, $answers);
            preg_match($regex_correct_answer, $match, $correct_answer);
            preg_match($regex_image, $match, $image_src);

            if (count($question) == 0 || count($answers) == 0 || count($correct_answer) == 0) {
                continue;
            }

            $question = html_entity_decode(strip_tags($question[0]));
            $answers = html_entity_decode($answers[0]);
            $answers = strip_tags($answers);
            $answers = explode("\n", preg_filter('/([A-z]\)\s)(.*?)/', '', $answers));

            if (count($correct_answer) > 0) {
                $correct_answer = ord(strtoupper($correct_answer[0])) - ord('A');
            }

            if(count($answers) < 4){
                continue;
            }

            $question_image_path = null;

            if(count($image_src) !== 0){

                $img_content = file_get_contents('https:'.$image_src[0]);
                $name = substr($image_src[0], strrpos($image_src[0], '/') + 1);
                $path = 'questions/1/images/'.$name;
                Storage::put($path, $img_content, 'public');
                $question_image_path = $name;
            }

            $correct_answer = $answers[$correct_answer];

            try {
                Question::updateOrCreate([
                    'question' => $question,
                    'user_id' => 1,
                ], [
                    'answer_1' => $answers[0],
                    'answer_2' => $answers[1],
                    'answer_3' => $answers[2],
                    'answer_4' => $answers[3],
                    'answer_5' => $answers[4],
                    'correct_answer' => $correct_answer,
                    'category_id' => 1,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                    'image' => $question_image_path
                ]);
            } catch (\Throwable $th) {
                //throw $th;
            }

        }


        return Question::all();
    }
}
