<?php

namespace App\Exports;

use App\Models\Quizz;
use Maatwebsite\Excel\Concerns\FromCollection;

class QuizzExport implements FromCollection
{
    private $quizz_id;

    public function __construct($id){
        $this->quizz_id = $id;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $quizz = Quizz::find($this->quizz_id)->questions()->get();
        $quizz->makeHidden(['id', 'user_id', 'category_id', 'type','deleted_at']);

        $quizz->transform(function($item, $key){
            $answers = $item->only([
            'answer_1',
            'answer_2',
            'answer_3',
            'answer_4',
            'answer_5',
            ]);

            foreach ($answers as $key => $answer) {
                if($item->correct_answer === $answer){
                    $item->correct_answer = str_replace('answer_', '', $key);
                }
            }
            return $item;
        });

        $quizz[0] = [
            'question',
            'answer_1',
            'answer_2',
            'answer_3',
            'answer_4',
            'answer_5',
            'correct_answer',
            'question_comment',
            'type',

        ];

        return $quizz;
    }
}
