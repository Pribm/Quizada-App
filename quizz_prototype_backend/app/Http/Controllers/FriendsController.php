<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class FriendsController extends Controller
{
    private $auth_user;

    public function __construct(){
        $this->auth_user = auth('api')->user();
    }

    public function index(Request $request)
    {

        if($request->showQuizzRequests){
            $quizz_requests = $this->auth_user->pendingQuizzInvitation()->withCount('questions')->orderBy('updated_at', 'Desc')->paginate(10);
            return $quizz_requests;
        }

        if($request->showUnfollowedUsers){
            $followable_users = $this->auth_user
            ->followableUsers()
            ->where('id', '!=', $this->auth_user->id)
            ->where(function($q) use($request){
                $q->where('name', 'LIKE', '%'.$request->search.'%')
                ->orWhere('nickname', 'LIKE', '%'.$request->search.'%')
                ->orWhere('email', 'LIKE', '%'.$request->search.'%');
            })
            ->orderBy('updated_at', 'Desc')->paginate(10);
            return $followable_users;
        }

        if($request->showFriendshipRequests){
            $friendship_requests = $this->auth_user->pendingFriendsFrom()->orderBy('updated_at', 'Desc')->paginate(10);
            return $friendship_requests;
        }

        if($request->showUserFriendshipRequests){
            $friendship_requests = $this->auth_user->pendingFriendsTo()->orderBy('updated_at', 'Desc')->paginate(10);
            return $friendship_requests;
        }

        if($request->showFriendsList){
            $friends_list = User::where(function($q) use ($request){
                $q->where("name",'LIKE',"%".$request->search."%")->orWhere("email",'LIKE',"%".$request->search."%")
                ->orWhere("nickname",'LIKE',"%".$request->search."%")->orWhere("email",'LIKE',"%".$request->search."%")
                ->orWhere("email",'LIKE',"%".$request->search."%")->orWhere("email",'LIKE',"%".$request->search."%");
            })
            ->whereHas('friends',function($q){
                $q->where('id', $this->auth_user->id);
            })->paginate(10);

            return $friends_list;
        }

        return response()->json(['message' => 'No data returned, you must pass a url parameter',
        'possible_parameters' => [
            'showQuizzRequests=boolean',
            'showUnfollowedUsers=boolean',
            'showFriendshipRequests=boolean',
            'showUserFriendshipRequests=boolean',
            'showFriendsList=boolean'
        ]]);
    }


    public function store(Request $request)
    {
        //
    }

    public function show($id)
    {
        //
    }


    public function update(Request $request, $id)
    {
        $friendship_request_exists = $this->auth_user->friendsTo()->where('friend_id', $id)->exists();

        if(!$friendship_request_exists){
            //Send a friendship request
            $this->auth_user->friendsTo()->attach($id);
            $this->auth_user->notificationsTo()->attach($id, [
                'message' => $this->auth_user->name.' enviou uma solicitação de amizade para você',
                'notification_type' => 1
            ]);
            return $this->auth_user->friendsTo()->where('friend_id', $id)->first();
        }

        //Revoke a invitation
        $this->auth_user->friendsTo()->detach($id);
        $this->auth_user->friendsFrom()->detach($id);
        $this->auth_user->notificationsTo()->detach($id);
        return User::find($id);
    }

    public function invitationConfirm(Request $request, $id){

        $request->validate([
            'accept_invitation' => 'required'
        ]);

        if($request->accept_invitation === true){
            $this->auth_user->pendingFriendsFrom()->updateExistingPivot($id,['accepted' => true]);
            $this->auth_user->notificationsTo()->attach($id, [
                'message' => User::find($id)->name.' aceitou sua solicitação de amizade',
                'notification_type' => 2
            ]);
            return ['accepted' => true, 'user' => User::find($id)];
        }
        //Revoke a invitation
        $this->auth_user->friendsFrom()->detach($id);
        return ['accepted' => false, 'user' => User::find($id)];

    }


    public function destroy($id)
    {
        //
    }
}
