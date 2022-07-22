<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Rules\ValidatePassword;
use App\Models\Score;
use Illuminate\Support\Facades\DB;



class UserController extends Controller
{
    private $auth_user;
    public function __construct()
    {
        $this->auth_user = auth()->guard('api')->user();
    }

    public function index(Request $request)
    {
        //See if user have a password or not
        $user = array_merge($this->auth_user->with('score')->first()->toArray(),
        (!$this->auth_user->password || $this->auth_user->password === '')
        ?
        ['password_is_null' => true]
            :
        ['password_is_null' => false]
        );

        $countUsers = User::count() < 99 ? User::count() : 100;


        $query = "WITH MyTable AS
        (
            SELECT users.*, score.score,

            RANK() OVER (ORDER BY score.score DESC ) AS 'Ranking'
            FROM users
            JOIN
            score
            ON
            users.id = score.user_id
        )
        SELECT id, name, nickname, email, avatar,custom_avatar, Ranking, score, email_verified_at
        FROM MyTable
        WHERE id LIKE ?
        LIMIT ?
        ";

        $user = DB::select($query, [$this->auth_user->id, $countUsers])[0];

        $users = ['data' => DB::select($query, ['%' , $countUsers])];

        return compact('user', 'users');

    }

    public function update(Request $request)
    {
        $user = User::find($this->auth_user->id);

        $password_rules = [
            'string',
            'min:10',
            'regex:/[a-z]/',
            'regex:/[A-Z]/',
            'regex:/[0-9]/',
            'regex:/[@$!%*#?&_]/',
        ];

        //criação de senha
        if(!$user->password || $user->password === ''){
            array_push($password_rules, 'same:password_confirm');
        }

        //Atualização de senha
        if(($user->password || $user->password !== '') ){
            array_push($password_rules, new ValidatePassword($this->auth_user));
        }


        $rules = [
            'name' => 'min:4|required',
            'email' => ['email', Rule::unique('users')->ignore($this->auth_user)],
            'nickname' => ['min:4', Rule::unique('users')->ignore($this->auth_user)],
            'avatar' => 'mimes:jpg,jpeg,png|max:1024',
            'password' => $password_rules,
            'password_confirm' => [
                'string',
                'min:10',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*#?&_]/',
            ]
        ];

        $feedback = [
            'password_confirm.regex' => 'Para a sua segurança, a senha precisa de letras maiúsculas, minúsculas, caracteres especiais e números',
            'password.regex' => 'Para a sua segurança, a senha precisa de letras maiúsculas, minúsculas, caracteres especiais e números'
        ];

        $request->validate($rules, $feedback);

        $fileName = $request->avatar ? $request->avatar : $user->avatar;

        if ($request->hasFile('avatar')) {
            $path = 'user/avatar/' . $this->auth_user->id;
            if (Storage::exists($path)) {
                Storage::deleteDirectory($path);
            }
            $image_url = Storage::disk('local')->put($path, $request->file('avatar'));
            $fileName = basename($image_url);
        }

        $user->fill([
            'name' => $request->name,
            'nickname' => $request->nickname,
            'avatar' => $fileName,
            'email' => $request->email,
            'custom_avatar' => 1,
            'password' => ($request->password && $request->password_confirm) ? Hash::make($request->password_confirm) : $user->password
        ]);

        if ($user->save()) {
            return response()->json([
                'success' => 'Seus dados foram atualizados com sucesso!',
                'user' => array_merge($user->toArray(),
                (!$user->password || $user->password === '')
                ?
                ['password_is_null' => true]
                :
                ['password_is_null' => false])]);
        }

        return response()->json(['errors' => 'Erro ao atualizar seus dados', 422]);
    }

    public function register(Request $request)
    {

        $rules = [
            'name' => 'required',
            'nickname' => 'unique:users|required',
            'email' => 'unique:users|required',
            'password' => [
                'string',
                'min:10',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*#?&_]/',
                'same:passwordConfirm'
            ],
        ];

        $feedback = [
            'password_confirm.regex' => 'Para a sua segurança, a senha precisa de letras maiúsculas, minúsculas, caracteres especiais e números',
            'password.regex' => 'Para a sua segurança, a senha precisa de letras maiúsculas, minúsculas, caracteres especiais e números'
        ];

        $request->validate($rules, $feedback);

        $name = $request->name;
        $email = $request->email;
        $password = $request->password;
        $user = User::create(['name' => $name, 'email' => $email,'nickname' => $request->nickname,'password' => Hash::make($password)]);

        if ($user->id) {
            $score = new Score();
            $score->fill([
                'user_id' => $user->id,
                'score' => 0,
            ]);
            $score->save();
            $user->sendEmailVerificationNotification();
            return response()->json([
                'success' => 'Enviamos um email para você, cheque sua caixa de mensagens ou a caixa de spam',
                'access_token' => $user->createToken('auth-api')->accessToken
            ]);
        }

        return response()->json(['Error' => 'Erro ao registrar usuário']);
    }
}
