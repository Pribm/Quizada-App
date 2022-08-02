<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quizz extends Model
{
    use HasFactory;

    protected $table = 'quizz';

    protected $fillable = [
        'user_id',
        'token',
        'title',
        'description',
        'image',
        'category_id',
        'withTime',
        'time_per_question',
        'total_time',
        'count_time',
        'shuffle_answers',
        'shuffle_questions',
        'immediate_show_wrong_answers',
        
    ];

    protected $hidden = [ 'created_at', 'updated_at', 'pivot'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function invitation()
    {
        return $this->belongsToMany(User::class, 'quizz_invitation', 'quizz_id', 'user_id')
        ->withPivot(['invitation_accepted', 'quizz_complete', 'score'])
        ->withTimestamps();
    }

    public function questions() {
        return $this->belongsToMany(Question::class, 'quizz_question', 'quizz_id', 'question_id');
    }

    public function category(){
        return $this->belongsTo(Categories::class);
    }


}
