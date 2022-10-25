<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Psr\Http\Message\ServerRequestInterface;

class CustomAccessTokenController extends Controller
{
     /**
     * Hooks in before the AccessTokenController issues a token
     *
     *
     * @param  ServerRequestInterface $request
     * @return mixed
     */
    public function issueUserToken(ServerRequestInterface $request)
    {
        $httpRequest = request();

        // 1.
        if ($httpRequest->grant_type == 'password') {
            // 2.
            $user = User::where('email', $httpRequest->username)->first();

            // Perform your validation here
            if(!$user->hasVerifiedEmail()){
                return response()->json(['message' => 'O seu e-mail ainda não foi verificado, cheque sua caixa de entrada ou de spam']);
            }

            // If the validation is successfull:
            return $this->issueToken($request);
        }
    }
}
