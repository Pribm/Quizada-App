<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categories;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Models\Question;
use App\Models\User;

class CategoryController extends Controller
{
    private $auth_user;

    public function __construct(){
        $this->auth_user = auth()->guard('api')->user();
    }

    public function index(Request $request)
    {
        //All Registered Questions Categories
        if($request->getAllCategoriesWithQuestions){
            $categories = Categories::
            whereHas('questions', function($q){
                $q->where('user_id', $this->auth_user->id)
                ->orWhereHas('user.role', function($q){
                    $q->where('role', 'admin');
                });
            })
            ->get(['name', 'id']);
        }

        //User Registered questions categories
        else if($request->getUserCategoriesWithQuestions){
            $categories = Categories::
            whereHas('questions', function($q){
                $q->where('user_id', $this->auth_user->id);
            })
            ->get(['name', 'id']);
        }

        //Adm Registered Questions Categories
        else if($request->getAdmCategoriesWithQuestions){
            $categories = Categories::
            whereHas('questions', function($q){
                $q->whereHas('user.role', function($q){
                    $q->where('role', 'admin');
                });
            })
            ->get(['name', 'id']);
        }else if($request->getUserCategories){
            $categories = Categories::
                where('user_id', $this->auth_user->id)
                ->get(['name', 'id']);
        }else{
            $categories = Categories::
                where('user_id', $this->auth_user->id)
                ->orWhereHas('user.role', function ($q) {
                $q->where('role', 'admin');
            })
                ->get(['name', 'id']);
        }


        return $categories;
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => ['required','min:5', Rule::unique('categories')->where(fn ($query) => $query->where('user_id', $this->auth_user->id))],
            'image' => 'max:512,mimes:png,jpg,jpeg',
        ];

        $feedback = [
            'name.required' => 'O campo de categoria é obrigatório',
            'name.min' => 'O campo de categoria precisa ter no mínimo 5 caracteres',
            'name.unique' => 'Esta categoria já foi cadastrada por você'
        ];

        $request->validate($rules, $feedback);

        $image_url = null;

        if($request->hasFile('image')){
            $path = 'quizz_categories/'.$this->auth_user->id;
            $image_url = Storage::put($path, $request->file('image'));
        }

            $category = Categories::firstOrCreate([
                'user_id' => $this->auth_user->id,
                'name' => $request->name
            ], ['image' => $image_url]);

            return response()->json(['success' => $category]);
    }

    public function show($id)
    {
        //
    }


    public function update(Request $request, $id)
    {
        //
    }


    public function destroy($id)
    {
        $category = Categories::find($id);
        
        if($this->auth_user->role_id !== 1 ){
            $category = Categories::where('user_id', $this->auth_user->id)->find($id);
        }

        if($category){
            if($category->delete()){
                return response()->json(['success' => 'Esta categoria foi excluída com sucesso da base de dados!', 'deleted_id' => $category->id]);
            }
            return response()->json(['error' => 'Erro ao excluir a categoria da base de dados']);
        }

        return response()->json(['error' => 'Esta categoria não existe na nossa base de dados']);
    }
}
