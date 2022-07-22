<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    use HasFactory;

    protected $hidden = ['user_id', 'created_at', 'updated_at'];
    protected $fillable = ['name', 'image', 'user_id'];

    public function questions(){
        return $this->hasMany(Question::class, 'category_id');
    }

    public function quizz(){
        return $this->belongsTo(Quizz::class);
    }

}
