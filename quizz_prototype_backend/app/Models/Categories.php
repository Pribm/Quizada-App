<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    use HasFactory;

    protected $hidden = ['user_id'];
    protected $fillable = ['name', 'image', 'user_id'];

}
