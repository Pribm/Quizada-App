<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Models\User;

class EmailVerificationController extends Controller
{

    public function sendVerificationEmail(Request $request)
    {

        if ($request->user()->hasVerifiedEmail()) {
            return [
                'message' => 'Already Verified'
            ];
        }

        $request->user()->sendEmailVerificationNotification();

        return ['status' => 'verification-link-sent'];
    }

    public function verify($user_id, Request $request) {

        if (!$request->hasValidSignature()) {
            return response()->json(["message" => "A url do email é inválida ou expirou"], 401);
        }

        $user = User::findOrFail($user_id);

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            return response()->json(['success' => 'Seu email foi verificado com sucesso!']);
        }

        return response()->json(['message' => 'Seu email já foi verificado, faça seu login com suas credenciais!'], 401);;
    }

    public function resend(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            if ($user->hasVerifiedEmail()) {
                return response()->json(["message" => "Este email já foi verificado."], 400);
            }

            $user->sendEmailVerificationNotification();

            if(isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'].'/' === env('APP_VIEW_URL')){
                return response()->json(['success' => 'Enviamos um novo email de vireificação para você cheque sua caixa de entrada.']);
            }

            return redirect(env('APP_VIEW_URL').'?message=Enviamos+um+novo+email+de+verificação+para+você,+cheque+sua+caixa+de+entrada');
        }

        return response()->json(["message" => "Este email não está cadastrado."]);
    }
}
