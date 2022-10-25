<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Rules\TransparentBackground;

use App\Models\AppConfiguration;

class App extends Controller
{
    private $auth_user;

    public function __construct()
    {
        $this->auth_user = Auth()->guard('api')->user();
    }

    public function index()
    {
        $app_info = AppConfiguration::find(1)->first();
        if(!$app_info){
            return response()->json(['error' => 'Erro ao buscar as informaçõe do App no servidor,
            por favor recarregue a página ou cheque sua conexão de internet'], 404);
        }

        return response()->json(['success' => $app_info]);
    }

    public function update(Request $request)
    {
        $rules = [
            'email' => 'required|email',
            'payment_button' => 'required|max:40',
            'payment_title' => 'required|max:60',
            'payment_text'=> 'required|max:220',
        ];

        $request->validate($rules);

        if($this->auth_user->role->role !== 'admin' ){
            return response()->json(['error' => 'As configurações só podem ser alteradas pelos adm da aplicação'], 401);
        }


        $cfg = AppConfiguration::updateOrCreate([
            'id' => 1
        ], [
            'email' => $request->email,
            'payment_button' =>  $request->payment_button,
            'payment_title' => $request->payment_title,
            'payment_text' => $request->payment_text,
        ]);

        if($cfg){
            return response()->json(['success' => 'As configurações da Aplicação foram alteradas com sucesso!', 'data' => $cfg]);
        }

        return response()->json(['error' => 'As configurações não puderam ser alteradas'], 400);
    }
}
