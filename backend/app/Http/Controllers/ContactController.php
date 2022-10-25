<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\SendMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    private $auth_user;

    public function __construct()
    {
        $this->auth_user = auth()->guard('api')->user();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $rules = [
            'name' => 'required',
            'email' => ['required', 'email', function ($input, $val) {
                $this->auth_user->email === $val;
            }],
            'message' => 'required',
            'subject' => 'required'
        ];

        $request->validate($rules);

        $data = $request->all();

        $app_email = DB::select('select email from app_configurations LIMIT 1')[0]->email;

        Mail::to($app_email)
                ->send(new SendMail($data));


        return response()->json(['success' => 'Seu email foi enviado com sucesso ao Administrador da aplicação, aguarde o contato em breve']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
