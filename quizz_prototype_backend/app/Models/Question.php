<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'questions';

    protected $casts = ['questions' => 'json'];

    protected $hidden = [ 'created_at', 'updated_at', 'pivot'];

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
        'image'
    ];

    public function quizzes(){
        return $this->belongsToMany(Quizz::class, 'quizz_question', 'question_id', 'quizz_id');
    }

    public function category(){
        return $this->belongsToMany(Categories::class,'question_category','question_id', 'category_id')->withTimestamps();
    }

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
