<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Categories extends Model
{
    use HasFactory, SoftDeletes;

    protected $hidden = ['user_id', 'created_at', 'updated_at'];
    protected $fillable = ['name', 'image', 'user_id'];

    public function questions(){
        return $this->belongsToMany(Question::class,'question_category', 'category_id', 'question_id');
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function quizz(){
        return $this->belongsTo(Quizz::class);
    }

}
