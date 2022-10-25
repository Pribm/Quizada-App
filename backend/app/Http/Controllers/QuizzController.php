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

    public function __construct()
    {
        $this->auth_user = auth()->guard('api')->user();
    }

    public function index(Request $request)
    {

        $quizz_list = $this->auth_user->quizz()
            ->withCount('questions')
            ->where(function ($q) use ($request) {
            $q->where('title', 'LIKE', '%' . $request->search . '%')
                ->orWhereHas('category', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            }
            );
        })
            ->orderBy('created_at', 'DESC')
            ->paginate();

        if ($request->showAdminQuizzList) {
            $quizz_list = Quizz::where('public_quizz', 1)
            ->whereHas('user.role', function ($q) {
                return $q->where('role', 'admin')
                ->orWhere('role', 'manager')
                ->where('random_generated', 0);
            })
                ->where(function ($q) use ($request) {
                $q->where('title', 'LIKE', '%' . $request->search . '%')
                    ->orWhereHas('category', function ($q) use ($request) {
                    $q->where('name', 'LIKE', '%' . $request->search . '%');
                }
                );
            })
                ->with(['category' => function ($q) {
                $q->withTrashed();
            }])
                ->orderBy('created_at', 'DESC')
                ->paginate();
        }
        if ($request->showAcceptedQuizzList) {
            $quizz_list = $this->auth_user->quizzInvitationAccepted()->orderBy('created_at', 'DESC')->paginate();
        }
        if ($request->showCompletedQuizzList) {
            $quizz_list = $this->auth_user
            ->quizzCompleteFrom()
            ->with(['user'])
            ->with('invitation', function($q){
                $q->where('invitation_accepted', true)
                ->where('quizz_complete', true)
                ->orderBy('score', 'DESC');
            })
            //->orderBy('updated_at', 'DESC')
            ->paginate()->toArray();
        }
        if ($request->quizzFrom) {
            $quizz_list = $this->auth_user
            ->quizzFrom()
            ->with('category')
            ->withCount('questions')
            ->where(function($q) use($request){
                $q->where('title','LIKE','%'.$request->search.'%')
                ->orWhereHas('category', function($q) use($request){
                    $q->where('name', 'LIKE','%'.$request->search.'%' );
                });
            })
            ->orderBy('updated_at', 'DESC')
            ->paginate();
        }
        if ($request->quizzTo) {
            $quizz_list = $this->auth_user
            ->quizz()
            ->whereHas('invitation', function($q){
                $q->where('user_id', '!=', $this->auth_user->id);
            })
            ->where(function($q) use($request){
                $q->where('title','LIKE','%'.$request->search.'%')
                ->orWhereHas('category', function($q) use($request){
                    $q->where('name', 'LIKE','%'.$request->search.'%' );
                });
            })
            ->paginate();
        }
        return $quizz_list;
    }

    public function store(Request $request)
    {

        $rule = [
            'questions' => 'array',
            'questions.*' => 'integer|distinct',
            'category_id' => 'required|integer|gt:0',
            'limit' => 'integer'
        ];

        $request->validate($rule);
        $questions = $request->questions;
        $limit = $request->limit ? $request->limit : 10;

        $quizz = new Quizz();
        $quizz_image_path = null;


        if ($request->hasFile('image')) {
            $request->validate(['image' => ['max:512', 'mimes:jpg,jpeg,png']]);

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
            'withTime' => $request->withTime == 'true' ? true : false,
            'time_per_question' => $request->time_per_question,
            'limit_questions' => $request->limit_questions,
            'total_time' => ($request->time_per_question * $request->limit),
            'count_time' => $request->count_time,
            'shuffle_answers' => $request->shuffle_answers == 'true' ? true : false,
            'shuffle_questions' => $request->shuffle_questions == 'true' ? true : false,
            'public_quizz' => $request->public_quizz == 'true' ? true : false,
            'immediate_show_wrong_answers' => $request->immediate_show_wrong_answers == 'true' ? true : false,
        ]);

        //Random Generated // Pick only questions generated by the admin
        if (!$request->questions || $request->questions === null || !isset($request->questions)) {

            $questions = Question::whereHas('user.role', function ($q) {
                $q->where('role', 'admin');
            })
            ->whereHas('category', function($q) use($request){
                $q->where('categories.id', $request->category_id);
            })
            ->inRandomOrder()
            ->limit($limit)
            ->pluck('id')->toArray();


            $quizz->random_generated = 1;
            $quizz->category_id = 1;
        }


        if ($quizz->save()) {
            //Salvar lista de questões baseada no critério de regras de ordem e embaralhamento de questões
            // if($request->shuffle_questions == 'true'){
            // }

            if($request->limit_questions){
                shuffle($questions);
                $limited_questions = array_slice($questions, 0, $request->limit_questions);

                DB::table('quizz_question_limit')->updateOrInsert([
                    'quizz_id' => $quizz->id,
                ], [
                    'limited_questions' => json_encode($limited_questions),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);
            }

            foreach ($questions as $question) {
                DB::table('quizz_question')->insert([
                    'quizz_id' => $quizz->id,
                    'question_id' => $question,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);
            }

            return [
                'success' => 'Seu quizz foi criado com sucesso!',
                'quizz' => Quizz::where('token', $quizz->token)->first(),
                'questions' => $this->transformQuestionResult(
                    $quizz->questions->toArray(),
                    $request->shuffle_answers == 'true' ? true : false,
                    $request->shuffle_questions == 'true' ? true : false
                    )
                ];
        }

        return response()->json(['error' => 'o quizz não pôde ser gerado, por favor verifique se todos os parâmetros estão corretos']);
    }

    public function sendToken($token, $guest_user)
    {
        //Só pode enviar token se for o seu
        $quizz = $this->auth_user->quizz()->where('token', $token)->first();

        $guest_user = User::where('id', $guest_user)
            ->whereHas('friends', function ($q) {
            $q->where('id', $this->auth_user->id);
        })->first();

        if (!$guest_user) {
            return response()->json(['error' => 'Você só pode enviar um quizz caso tenha esta pessoa na sua lista de amigos.'], 400);
        }
        if (!$quizz) {
            return response()->json(['error' => 'Você só pode enviar um quizz existente e criado por você.'], 400);
        }

        if (!$quizz->invitation()->find($guest_user->id)) {
            $quizz->invitation()->attach($guest_user->id);

            $this->auth_user->notificationsTo()->attach(
                $guest_user->id,
            [
                'message' => $this->auth_user->name . ' convidou você para fazer o quizz: ' . $quizz->title,
                'notification_type' => 3
            ]
            );

            return response()->json(['success' => 'Parabéns, você acabou de convidar ' . $guest_user->name . ' para o seu quizz!'], 200);
        }
        ;

        return response()->json(['error' => 'Você já convidou este ' . $guest_user->name . ' para este quizz, tente convidá-lo para outro.'], 400);
    }

    public function massInvitation(Request $request)
    {
        foreach ($request->quizzes as $quizz) {
            foreach ($request->friends as $friend) {
                DB::table('quizz_invitation')
                    ->updateOrInsert([
                    'quizz_id' => $quizz,
                    'user_id' => $friend,
                ], [
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);

                $this->auth_user->notificationsTo()->attach(
                    $friend,
                [
                    'message' => $this->auth_user->name . ' convidou você para fazer o quizz: ' . Quizz::find($quizz)->title,
                    'notification_type' => 3
                ]
                );
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

        if (!$quizz) {
            return ['error' => 'Não existe nenhum quizz que corresponda à este token'];
        }

        if ($quizz['error'])
            return $quizz['error'];

        if (DB::table('quizz_invitation')
        ->where('user_id', $this->auth_user->id)
        ->where('quizz_id', $quizz->id)
        ->where('quizz_complete', true)
        ->where('invitation_accepted', true)
        ->first()) {
            return response()->json(['error' => 'Um quizz feito anteriormente não lhe concede pontuação']);
        }


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

        if($quizz->user_id !== $this->auth_user->id){
            $this->auth_user->notificationsTo()->attach(
                $quizz->user_id,
            [
                'message' => $this->auth_user->name . ' fez ' . $request->score . ' pontos no seu quizz: ' . $quizz->title,
                'notification_type' => 5
            ]
            );
        }

        if ($quizz->random_generated && $quizz->user_id === $this->auth_user->id) {
            $quizz->delete();
        }

        return response()->json(['success' => 'Você fez ' . $request->score . ' pontos neste quizz.']);
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

    public function show($token, Request $request)
    {
        $quizz = Quizz::where(function($q) {
        $q->where('user_id', $this->auth_user->id)
        ->orWhereHas('invitation', function($q){
                $q->where('user_id', $this->auth_user->id);
                });
        })
        ->orWhere('public_quizz', 1)
        ->where('token', $token)
        ->first();

        $questions = null;
        $all_questions = null;

        if (!$quizz) {
            return ['error' => 'Não existe nenhum quizz que corresponda à este token'];
        }

        if((boolean)$quizz->shuffle_questions === true){
            $questions = Quizz::find($quizz->id)->questions()->withTrashed()->inRandomOrder()->get();
        }else{
            $questions = Quizz::find($quizz->id)->questions()->withTrashed()->get();
        }

        $quizz_limit = DB::select('select * from quizz_question_limit where quizz_id = ?', [$quizz->id]);


        if($quizz_limit && $quizz->limit_questions >= 1){
            $questions = $questions->filter(function($item) use($quizz_limit){
                if(in_array((string)$item->id, json_decode($quizz_limit[0]->limited_questions))){
                    return $item->id;
                }
            });
        }

        $questions = $this->transformQuestionResult($questions, (boolean)$quizz->shuffle_answers);

        $response_array = collect(['quizz' => $quizz, 'questions' => $questions]);

        if($request->all_questions){
            $all_questions_array = Quizz::find($quizz->id)->questions()->withTrashed()->paginate();
            $response_array = ['questions' => $all_questions_array];
        }

        if($request->all_questions_by_id){
            $all_questions_array = Quizz::find($quizz->id)->questions()->withTrashed()->pluck('questions.id');
            $response_array = ['questions' => $all_questions_array];
        }

        return response()->json($response_array);
    }

    public function deleteQuizzInvitations($token)
    {
        $quizz = $this->auth_user->quizz()->where('token', $token)->first();
        if ($quizz) {
            if ($quizz->invitation()->detach()) {
                return response()->json(['success' => 'Você não possui mais nenhum usuário convidado para este quizz, você pode convidar todos os seus amigos novamente']);
            }
            return response()->json(['error' => 'Este quizz não possui nenhum usuário convidado'], 422);
        }
        return response()->json(['error' => 'Você não pode deletar um convite de um quizz que não foi feito por você'], 422);
    }

    public function resetQuizzInvitations($token)
    {
        $quizz = $this->auth_user->quizz()->where('token', $token)->first();
        if ($quizz) {
            if (count($quizz->invitation) > 0) {
                foreach ($quizz->invitation as $invitation) {
                    $invitation->pivot->invitation_accepted = 1;
                    $invitation->pivot->quizz_complete = 0;
                    $invitation->pivot->score = 0;
                    if($invitation->pivot->save()){
                        if($invitation->pivot->user_id !== $this->auth_user->id){
                            $this->auth_user->notificationsTo()->attach($invitation->pivot->user_id, [
                                'message' => $this->auth_user->name.' reiniciou o quizz '.$quizz->title.', você pode fazê-lo novamente.',
                                'notification_type' => 3
                            ]);
                        }
                    }
                }
                return response()->json(['success' => 'Você não possui mais nenhum usuário convidado para este quizz, você pode convidar todos os seus amigos novamente']);
            }
            return response()->json(['error' => 'Este quizz não possui nenhum usuário convidado'], 422);
        }
        return response()->json(['error' => 'Você não pode deletar um convite de um quizz que não foi feito por você'], 422);
    }

    public function export($id)
    {
        return Excel::download(new QuizzExport($id), 'quizz.xlsx');
    }

    public function update(Request $request, $id)
    {
        $quizz = $this->auth_user->quizz->find($id);

        if($quizz){

            if(isset($request->limit_questions) && $quizz->questions()->count() < $request->limit_questions){
                return response()->json(['error' => 'O limite de questões não pode ser maior que o total de questões do quiz'], 400);
            }

            if($request->questions){
                $q = $quizz->questions()->sync($request->questions);
            }

            $rules = [
                'title' => 'required|max:255',
                'category_id' => 'required|integer|exists:categories,id',
                'withTime' => 'required|boolean',
                'time_per_question' => 'required|integer',
                'immediate_show_wrong_answers' => 'required|boolean',
                'shuffle_answers' => 'required|boolean',
                'shuffle_questions' => 'required|boolean',
                'limitNumQuestions' => 'required|boolean',
                'limit_questions' => 'required_if:limitNumQuestions,==,true'
            ];

            $request->validate($rules);

            $quizz_prev_limit_questions = $quizz->limit_questions;

            //Immutable fields
            $request->request->add(['token' => $quizz->token]);
            $request->request->add(['user_id' => $this->auth_user->id]);

            $quizz->fill($request->all());
            $quizz->random_generated = 0;
            //Atualizar lista de questões

            if(($request->limit_questions > 0 && $quizz_prev_limit_questions !== $request->limit_questions) || $request->questions !== null){

                $questions = Quizz::find($id)->questions()->withTrashed()->pluck('questions.id')->toArray();

                shuffle($questions);
                //Slice the limited questions array
                $limited_questions = array_slice($questions, 0, $request->limit_questions);
                DB::table('quizz_question_limit')->updateOrInsert([
                    'quizz_id' => $id,
                ], [
                    'limited_questions' => json_encode($limited_questions),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);
            }

            if($quizz->save()){
                $this->resetQuizzInvitations($quizz->token);
                return response()->json(['success' => 'Quizz Atualizado com sucesso', 'quizz' => $quizz]);
            }

            return response()->json(['error' => 'Erro ao atualizar quizz'], 400);
        }

        return response()->json(['error'=>'Quizz não encontrado'], 404);
    }

    public function acceptQuizz($id)
    {
        $quizz = $this->auth_user->pendingQuizzFrom()->find($id);

        if ($quizz) {
            if ($this->auth_user
            ->pendingQuizzFrom()
            ->where('quizz_id', $id)
            ->update(['invitation_accepted' => true, 'updated_at' => Carbon::now()])) {
                return $quizz;
            }
            return response()->json(['error' => 'O quizz não pôde ser aceito por algum motivo, tente novamente.']);
        }
        return response()->json(['error' => 'Este quizz não pôde ser aceito, o dono do quizz não lhe enviou o token ou pode ter deletado o quizz.']);
    }

    public function refuseQuizz($id)
    {
        $quizz = Quizz::find($id);
        $quizz_sender = $quizz->user;

        if ($this->auth_user->pendingQuizzFrom()->detach($id)) {
            $this->auth_user->notificationsTo()->attach(
                $quizz_sender->id,
            [
                'message' => $this->auth_user->name . ' recusou o convite para fazer o quizz ' . $quizz->title,
                'notification_type' => 3
            ]
            );
            return response()->json(['success' => 'quizz recusado']);
        }
        return response()->json(['error' => 'Este quizz não pôde ser aceito, o dono do quizz não lhe enviou o token ou pode ter deletado o quizz.']);
    }


    public function destroy($id)
    {
        $quizz = $this->auth_user->quizz()->find($id);
        if ($quizz) {

            if($quizz->limit_questions > 0){
                DB::table('quizz_question_limit')->where('quizz_id', $id)->delete();
            }

            if ($quizz->delete()) {
                return response()->json(['success' => 'quizz deletado com sucesso']);
            }
            return response()->json(['error' => 'erro ao deletar o quizz']);
        }

        return response()->json(['error' => 'quizz Inexistente']);
    }

    private function transformQuestionResult($questionResult, bool $shuffle_answers = true, bool $shuffle_questions = true)
    {

        $questionResult = collect($questionResult)->transform(function ($q) use ($shuffle_answers, $shuffle_questions) {

            $answers = [
                $q['answer_1'],
                $q['answer_2'],
                $q['answer_3'],
                $q['answer_4'],
                $q['answer_5']
            ];

            $question = [
                'id' => $q['id'],
                'question' => $q['question'],
                'answers' => $answers,
                'correct_answer' => $q['correct_answer'],
                'question_comment' => $q['question_comment'],
                'user_id' => $this->auth_user->id,
                //'category_id' => $q['category_id'],
                'image' => $q['image']
            ];

            if ($shuffle_answers === true) {
                shuffle($question['answers']);

                $nda = '';
                $shuffled_answers = [];
                foreach ($question['answers'] as $answer) {
                    if ($answer !== 'nda' && $answer !== 'NDA' ) {
                        $shuffled_answers[] = $answer;
                    }
                    else {
                        $nda = $answer;
                    }
                }

                if ($nda !== '') {
                    array_push($shuffled_answers, $nda);
                    $question['answers'] = $shuffled_answers;
                }

            }
            return $question;

        });

        if($shuffle_questions == true){
            return $questionResult->shuffle();
        }

        return $questionResult;
    }
}
