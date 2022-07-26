<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\QuizzController;

use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\webScrapperController;
use App\Http\Controllers\FriendsController;
use App\Http\Controllers\PaymentController;



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
Route::post('webscrapping', [webScrapperController::class, 'scrapQuizz']);

//User register
Route::prefix('user')->group(function(){
    Route::post('register', [UserController::class, 'register']);
    Route::post('forgot-password', [ForgotPasswordController::class, 'forgot']);
    Route::post('reset-password', [ForgotPasswordController::class, 'reset']);

    Route::apiResource('/friends',FriendsController::class);
    Route::post('/friends/invitation-confirm/{id}', [FriendsController::class, 'invitationConfirm']);
});

Route::get('email/verify/{id}', [EmailVerificationController::class, 'verify'])->name('verification.verify');
Route::get('email/resend', [EmailVerificationController::class, 'resend'])->name('verification.resend');

Route::middleware(['auth:api', 'verified'])->prefix('question')->group(function () {
    Route::post('/upload', [QuestionController::class, 'store']);
    Route::get('/list', [QuestionController::class, 'index']);
    Route::delete('/', [QuestionController::class, 'destroy']);

    //get parameters = name,
    Route::apiResource('/categories', CategoryController::class);
});

Route::post('/process_payment', [PaymentController::class, 'pix']);

Route::middleware(['auth:api', 'verified'])->prefix('user')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('ranking', [UserController::class, 'ranking']);
    Route::put('/', [UserController::class, 'update']);
});

Route::get('/quizz/export/{id}', [QuizzController::class, 'export'])->middleware(['auth:api', 'verified']);
Route::post('/quizz/score', [QuizzController::class, 'storeScore'])->middleware(['auth:api', 'verified']);
Route::get('/quizz/ranking/{id}', [QuizzController::class, 'ranking'])->middleware(['auth:api', 'verified']);
Route::put('/quizz/accept/{id}', [QuizzController::class, 'acceptQuizz'])->middleware(['auth:api', 'verified']);
Route::get('/quizz/make-invitation/{token}/{guest_user}', [QuizzController::class, 'sendToken'])->middleware(['auth:api', 'verified']);
Route::apiResource('/quizz', QuizzController::class)->middleware(['auth:api', 'verified']);
