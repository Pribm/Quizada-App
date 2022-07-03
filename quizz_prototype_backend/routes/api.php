<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\Auth\UserController;
use App\Models\Categories;
use App\Http\Controllers\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//User register
Route::prefix('user')->group(function(){
    Route::post('register', [UserController::class, 'register']);
});



Route::middleware('auth:api')->prefix('question')->group(function () {
    Route::post('/upload', [QuestionController::class, 'store']);
    Route::get('/list', [QuestionController::class, 'index']);

    Route::apiResource('/categories', CategoryController::class);
});
