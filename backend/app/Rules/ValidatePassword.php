<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ValidatePassword implements Rule
{
    private $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }


    public function passes($attribute, $value)
    {
        return Hash::check($value, $this->user->password);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'A senha não corresponde à que você tem no banco de dados';
    }
}
