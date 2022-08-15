<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialAccounts extends Model
{
    use HasFactory;

    protected $model = 'social_accounts';

    protected $fillable = [
        'user_id',
        'provider_name',
        'provider_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
