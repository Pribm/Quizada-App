<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $table = 'questions';

    protected $hidden = ['id', 'created_at', 'updated_at'];

    protected $guarded = ['id'];
    protected $fillable = [
        'question',
        'answer_1',
        'answer_2',
        'answer_3',
        'answer_4',
        'answer_5',
        'correct_answer',
        'question_comment',
        'user_id',
        'category_id',
    ];
}
