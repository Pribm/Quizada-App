<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quizz;
use App\Models\User;
use App\Models\Question;
use Dirape\Token\Token;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


use Maatwebsite\Excel\Facades\Excel;
use App\Exports\QuizzExport;
use Carbon\Carbon;
use App\Models\Score;

class QuizzController extends Controller
{

    private $auth_user;

    public function __construct(){
        $this->auth_user = auth()->guard('api')->user();
    }

    public function index(Request $request)
    {

        $quizz_list = $this->auth_user->quizzOwner()
        ->where(function($q) use ($request){
            $q->where('title', 'LIKE', '%'.$request->search.'%')
            ->orWhereHas('category', function($q) use($request){
                $q->where('name', 'LIKE', '%'.$request->search.'%');
            });
        })
        ->orderBy('created_at', 'DESC')
        ->paginate(10);

        if($request->showAdminQuizzList){
            $quizz_list = Quizz::whereHas('user.role', function($q){
                return $q->where('role', 'admin')
                ->where('random_generated', 0);
            })
            ->where(function($q) use ($request){
                $q->where('title', 'LIKE', '%'.$request->search.'%')
                ->orWhereHas('category', function($q) use($request){
                    $q->where('name', 'LIKE', '%'.$request->search.'%');
                });
            })
            ->with('invitation', function($q){
                $q->where('quizz_complete', 1);
            })
            ->with(['category'])
            ->paginate(10);
        }

        if($request->showAcceptedQuizzList){
            $quizz_list = $this->auth_user->quizzInvitationAccepted()->orderBy('created_at', 'DESC')->paginate(10);
        }
        if($request->showCompletedQuizzList){
            $quizz_list = $this->auth_user
            ->quizzComplete()
            ->where(function($q) use ($request){
                $q->where('title', 'LIKE', '%'.$request->search.'%')
                ->orWhereHas('category', function($q) use($request){
                    $q->where('name', 'LIKE', '%'.$request->search.'%');
                });
            })
            ->orderBy('updated_at', 'DESC')
            ->paginate(10);
        }
        return $quizz_list;
    }

    public function store(Request $request)
    {

        $rule = [
            'questions' => 'array',
            'questions.*' => 'integer|distinct',
            'category_id' => 'required|integer',
            'limit' => 'integer'
        ];

        $request->validate($rule);

        $questions = $request->questions;
        $limit = $request->limit ? $request->limit : 10;

        $quizz = new Quizz();
        $quizz_image_path = null;


        if($request->hasFile('image')){
            $request->validate(['image' => ['max:512','mimes:jpg,jpeg,png']]);

            $path = 'quizz/images';
            $image_url = Storage::disk('local')->put($path, $request->file('image'));
            $quizz_image_path = basename($image_url);
        }

        $quizz->fill([
            'user_id' => $this->auth_user->id,
            'token' => (new Token())->Unique('quizz', 'token', 6),
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'image' => $quizz_image_path,
            'withTime' => $request->withTime === 'true' ? true : false,
            'time_per_question' => $request->time_per_question,
            'total_time' =>  ($request->time_per_question * $request->limit),
            'count_time' => $request->count_time+1,
            'shuffle_answers' => $request->shuffle_answers === 'true' ? true : false,
            'shuffle_questions' => $request->shuffle_questions === 'true' ? true : false,
            'immediate_show_wrong_answers' => $request->immediate_show_wrong_answers === 'true' ? true : false,
        ]);



        //Random Generated // Pick only questions generated by the admin
        if(!$request->questions || $request->questions === null || !isset($request->questions)){
            $quizz->user_id = $this->auth_user->id;

            $questions = Question::whereHas('user', function ($q) {
                $q->where('role_id', env('ADMIN_ROLE_ID'));
            })
                ->where(function ($q) use ($request) {
                if (isset($request->category_id) && $request->category_id !== 0) {
                    return $q->where('category_id', $request->category_id);
                }
            })
                ->inRandomOrder()
                ->limit($limit)
                ->pluck('id')->toArray();

            $quizz->random_generated = 1;
            $quizz->category_id = 1;

        }


        if($quizz->save()){
            foreach ($questions as $question) {
                DB::table('quizz_question')->insert([
                    'quizz_id' => $quizz->id,
                    'question_id' => $question,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);
            }

            return ['success' => 'Seu quizz foi criado com sucesso!', 'quizz' => Quizz::where('token', $quizz->token)->first(), 'questions' => $this->transformQuestionResult($quizz->questions->toArray(), true)];
        }

        return response()->json(['error' => 'o quizz não pôde ser gerado, por favor verifique se todos os parâmetros estão corretos']);
    }

    public function sendToken($token, $guest_user){
        //Só pode enviar token se for o seu
        $quizz = $this->auth_user->quizzOwner()->where('token', $token)->first();

        $guest_user = User::where('id', $guest_user)
        ->whereHas('friends',function($q){
            $q->where('id', $this->auth_user->id);
        })->first();

        if(!$guest_user){
            return response()->json(['error' => 'Você só pode enviar um quizz caso tenha esta pessoa na sua lista de amigos.'], 400);
        }
        if(!$quizz){
            return response()->json(['error' => 'Você só pode enviar um quizz existente e criado por você.'], 400);
        }

        if(!$quizz->invitation()->find($guest_user->id)){
            $quizz->invitation()->attach($guest_user->id);
            return response()->json(['success' => 'Parabéns, você acabou de convidar '.$guest_user->name.' para o seu quizz!'], 200);
        };

        return response()->json(['error' => 'Você já convidou este '.$guest_user->name.' para este quizz, tente convidá-lo para outro.'], 400);
    }

    public function massInvitation(Request $request){
        foreach ($request->quizzes as $quizz) {
                foreach($request->friends as $friend){
                    DB::table('quizz_invitation')
                    ->updateOrInsert([
                        'quizz_id' => $quizz,
                        'user_id' => $friend,
                    ],[
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now()
                    ]);
            }
        }

        return response()->json(['success' => 'Seus convites foram enviados, aguarde a resposta dos usuários e verifique a o ranking com seus quizzes']);
    }

    public function storeScore(Request $request)
    {
        $rules = [
            'score' => 'integer|required',
            'token' => 'min:6|required'
        ];

        $request->validate($rules);

        //Get the quizz wich refers que requested one
        $quizz = $quizz = Quizz::where('token', $request->token)->first();

        if(!$quizz){
            return ['error' => 'Não existe nenhum quizz que corresponda à este token'];
        }

        if($quizz['error']) return $quizz['error'];

        if(DB::table('quizz_invitation')
        ->where('user_id', $this->auth_user->id)
        ->where('quizz_id', $quizz->id)
        ->where('quizz_complete', true)
        ->where('invitation_accepted', true)
        ->first()){
            return response()->json(['error' => 'Um quizz feito anteriormente não lhe concede pontuação']);
        }

        //If the generated quizz is not generated by yourself || only permitted if is randomic generated
        if($quizz->user_id !== $this->auth_user->id || $quizz->random_generated){
            //Get the current user score
            $curr_score = $this->auth_user->score->score;
            $score = $this->auth_user->score;

            $score->fill([
                'user_id' => $this->auth_user->id,
                'score' => $curr_score + $request->score
            ]);

            if($score->save()){
                DB::table('quizz_invitation')->updateOrInsert([
                    'user_id' => $this->auth_user->id,
                    'quizz_id' => $quizz->id,
                    'invitation_accepted' => true
                ], [
                    'score' => $request->score,
                    'quizz_complete' => true,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);
            }

            if($quizz->random_generated && $quizz->user_id === $this->auth_user->id){
               $quizz->delete();
            }

            return response()->json(['success' => 'Você fez '.$request->score.' pontos neste quizz.']);
        }

        return response()->json(['error' => 'Um quizz que você mesmo gerou não concede pontuação para o ranking, para isso, você precisa fazer o quizz de um amigo']);
    }

    public function ranking($id)
    {
        $quizz = $this->auth_user->quizzComplete()->find($id);

        $user_quizz_ranking_query = "
        WITH QuizzRanking AS
        (
            SELECT q_i.score, q_i.quizz_id, u.*,
            RANK() OVER (ORDER BY q_i.score DESC ) AS 'Ranking'
            FROM users as u
            JOIN
            quizz_invitation as q_i
            ON
			u.id = q_i.user_id
            WHERE q_i.quizz_id = ?
        )
        SELECT id, name, nickname, email, avatar,custom_avatar, Ranking, score, email_verified_at
        FROM QuizzRanking";

        $ranking = DB::select($user_quizz_ranking_query, [$id]);

        return compact(['quizz', 'ranking']);
    }

    public function show($token)
    {

        $quizz = Quizz::where('token', $token)->first();
        $questions = Quizz::find($quizz->id)->questions()->withTrashed()->get();

        $questions = $this->transformQuestionResult($questions, true);

        if(!$quizz){
            return ['error' => 'Não existe nenhum quizz que corresponda à este token'];
        }

        return response()->json(['quizz' => $quizz, 'questions' => $questions]);
    }

    public function export($id)
    {
        return Excel::download(new QuizzExport($id), 'quizz.xlsx');
    }

    public function update(Request $request, $id)
    {

    }

    public function acceptQuizz($id)
    {
        $quizz = $this->auth_user->pendingQuizzInvitation()->find($id);
        if($quizz){
            if($this->auth_user->pendingQuizzInvitation()->update(['invitation_accepted' => true, 'updated_at' => Carbon::now()])){
                return $quizz;
            }
            return response()->json(['error' => 'O quizz não pôde ser aceito por algum motivo, tente novamente.']);
        }
        return response()->json(['error' => 'Este quizz não pôde ser aceito, o dono do quizz não lhe enviou o token ou pode ter deletado o quizz.']);
    }


    public function destroy($id)
    {
        $quizz = $this->auth_user->quizzOwner()->find($id);
        if($quizz){
            if($quizz->delete()){
                return response()->json(['success' => 'quizz deletado com sucesso']);
            }
            return response()->json(['error' => 'erro ao deletar o quizz']);
        }

        return response()->json(['error' => 'quizz Inexistente']);
    }

    private function transformQuestionResult($questionResult, bool $shuffle_answers){

        $questionResult = collect($questionResult)->transform(function($q) use ($shuffle_answers){
            $question =  [
                'question' => $q['question'],
                'answers' => [$q['answer_1'],
                            $q['answer_2'],
                            $q['answer_3'],
                            $q['answer_4'],
                            $q['answer_5']],
                'correct_answer' => $q['correct_answer'],
                'question_comment' => $q['question_comment'],
                'user_id' => $this->auth_user->id,
                'category_id' => $q['category_id'],
                'image' => $q['image']
            ];
            if($shuffle_answers === true){
                shuffle($question['answers']);

                $nda = '';
                $shuffled_answers = [];
                foreach ($question['answers'] as $answer) {
                    if($answer !== 'nda'){
                        $shuffled_answers[] = $answer;
                    }else{
                        $nda = $answer;
                    }
                }


               if($nda !== '') {
                array_push($shuffled_answers, $nda);
                $question['answers'] = $shuffled_answers;
               }

            }
            return $question;

        });

        return $questionResult;
    }
}
