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
        $quizz->makeHidden(['id', 'user_id', 'category_id', 'type']);
        $quizz[0] = [
            'question',
            'answer_1',
            'answer_2',
            'answer_3',
            'answer_4',
            'answer_5',
            'correct_answer',
            'question_comment',
            'type'
        ];
        return $quizz;
    }
}
