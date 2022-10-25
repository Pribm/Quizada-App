<?php
namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Password;
use App\Http\Requests\ForgotRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Message;
use App\Http\Requests\ResetRequest;
use Illuminate\Support\Facades\Hash;



class ForgotPasswordController extends Controller
{
    public function forgot(ForgotRequest $request){
        $email = $request->input('email');

        if(User::where('email', $email)->doesntExist()){
            return response([
                'message' => 'User doesn\'t exists.'
            ], 404);
        }

        $token = Str::random(10);

        try {
            DB::table('password_resets')->insert([
                'email' => $email,
                'token' => $token
            ]);

            //Send email

            Mail::send('email.forgot', ['token' => $token], function (Message $message) use ($email) {
                $message->to($email);
                $message->subject('Redefinição de senha');
            });

            return response(['message' => 'Enviamos um email para que você possa redefinir sua senha'], 200);
        } catch (\Exception $e) {
            return response([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function reset(ResetRequest $request) {

        $passwordResets = $request->token ? DB::table('password_resets')->where('token', $request->token) : null;

        if(!$passwordResets->first()){
            return response([
                'errors' => 'O email de renovação expirou, por favor envie uma nova solicitação de troca de senha para o seu e-mail'
            ], 400);
        }

        /** @var User $user */
        if(!$user = User::where('email', $passwordResets->first()->email)->first()){
            return response([
                'errors' => 'Usuário inexistente!'
            ], 400);
        }

        $user->password = Hash::make($request->input('password'));

        if($user->save()){

            $passwordResets->delete();

            return response([
                'success' => 'Sua senha foi redefinida com sucesso!'
            ]);
        }

        return response([
            'errors' => 'Falha ao redefinir senha.'
        ], 400);

    }
}
