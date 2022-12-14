<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Staudenmeir\LaravelMergedRelations\Eloquent\HasMergedRelationships;
use League\OAuth2\Server\Exception\OAuthServerException;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasMergedRelationships;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'nickname',
        'custom_avatar',
        'email_verified_at'
    ];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'created_at',
        'updated_at',
        'email_verified_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function findForPassport($username)
    {
        $user = $this->where('nickname', $username)->orWhere('email',$username)->first();

        if($user){
            if(!$user->hasVerifiedEmail()){
                throw new OAuthServerException('Seu email ainda não foi verificado, cheque sua caixa de entrada e de spam', '401', 'unverified_user');
            }
            return $user;
        }
        throw new OAuthServerException('Usuário não encontrado', '401', 'not_found_user');
    }

    public function socialAccounts(){
        return $this->hasMany(SocialAccounts::class);
    }

    public function score()
    {
        return $this->hasOne(Score::class);
    }

    public function questions(){
        return $this->hasMany(Question::class, 'user_id');
    }

    public function adminQuizz(){
        return Quizz::where('user_id', function($q){
            $q->belongsTo(User::class)
            ->where('role.role', 'admin');
        })
        ->with([ 'category' => function($q){
            $q->withTrashed();
        }])
        ->where('random_generated', false);
    }

    public function quizz(){
        return $this->hasMany(Quizz::class, 'user_id')
        ->with([ 'category' => function($q){
            $q->withTrashed();
        }])
        ->with('invitation', function($q){
            return $q->orderByRaw('quizz_invitation.score DESC, quizz_invitation.updated_at ASC');
        })
        ->where('random_generated', false);
    }

    public function quizzFrom(){
        return $this
        ->belongsToMany(Quizz::class, 'quizz_invitation','user_id', 'quizz_id')
        ->wherePivot('invitation_accepted', false)
        ->with('user');
    }

    public function quizzInvitationAccepted(){
        return $this->belongsToMany(Quizz::class, 'quizz_invitation', 'user_id', 'quizz_id')
        ->withPivot('quizz_complete')
        ->with(['user'])
        ->where('quizz.user_id','!=',$this->id)
        ->wherePivot('quizz_complete', false)
        ->wherePivot('invitation_accepted', true)
        ->withTimestamps();
    }

    public function quizzCompleteFrom(){
        return $this
        ->belongsToMany(Quizz::class, 'quizz_invitation', 'user_id', 'quizz_id')
        ->wherePivot('quizz_complete', true)
        ->wherePivot('invitation_accepted', true)
        ->withPivot('quizz_complete')
        ->withPivot('invitation_accepted');
    }

    public function pendingQuizzFrom(){
        return $this->belongsToMany(Quizz::class, 'quizz_invitation', 'user_id', 'quizz_id')
        ->withPivot('invitation_accepted')
        ->with('user')
        ->wherePivot('quizz_complete', false)
        ->wherePivot('invitation_accepted', false)
        ->withTimestamps();
    }

    public function role(){
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function categories(){
        return $this->hasMany(Categories::class, 'user_id');
    }

    public function adminCategories(){
        return Categories::where('user_id', function($q){
            $q->belongsTo(User::class)->where('role.role', 'admin');
        });
    }

    public function followableUsers(){
        return $this
        ->whereDoesntHave('pendingFriendsFrom', function($q){
            $q->where('friends.user_id',$this->id);
        })
        ->whereDoesntHave('acceptedFriendsFrom', function($q){
            $q->where('friends.user_id', $this->id);
        })
        ->whereDoesntHave('pendingFriendsTo', function($q){
            $q->where('friends.friend_id',$this->id);
        })
        ->whereDoesntHave('acceptedFriendsTo', function($q){
            $q->where('friends.friend_id', $this->id);
        })->where('id','!=',$this->id);
    }

    public function friends()
    {
        return $this->mergedRelationWithModel(User::class, 'friends_view');
    }

    public function friendsTo()
    {
        return $this->belongsToMany(User::class, 'friends', 'user_id', 'friend_id')
            ->withPivot('accepted')
            ->withTimestamps();
    }

    public function friendsFrom()
    {
        return $this->belongsToMany(User::class, 'friends', 'friend_id', 'user_id')
            ->withPivot('accepted')
            ->withTimestamps();
    }

    public function pendingFriendsTo()
    {
        return $this->friendsTo()->wherePivot('accepted', false);
    }

    public function pendingFriendsFrom()
    {
        return $this->friendsFrom()->wherePivot('accepted', false);
    }

    public function acceptedFriendsTo()
    {
        return $this->friendsTo()->wherePivot('accepted', true);
    }

    public function acceptedFriendsFrom()
    {
        return $this->friendsFrom()->wherePivot('accepted', true);
    }

    public function notificationsTo(){
        return $this->belongsToMany(User::class, 'notifications', 'notifier_id', 'notified_id')
        ->withPivot(['id','message', 'notification_type','opened_notification'])
        ->withTimestamps();
    }

    public function notificationsFrom(){
        return $this->belongsToMany(User::class, 'notifications', 'notified_id' , 'notifier_id')
        ->withPivot(['id','message', 'notification_type','opened_notification'])
        ->withTimestamps();
    }

    public function admInvitationTo(){
        return $this->belongsToMany(User::class, 'adm_invitation', 'inviter_user', 'invitated_user')
        ->withPivot(['accepted', 'to_role'])
        ->withTimestamps();
    }
    public function admInvitationFrom(){
        return $this->belongsToMany(User::class, 'adm_invitation', 'invitated_user', 'inviter_user')
        ->withPivot(['accepted', 'to_role', 'id'])
        ->withTimestamps();
    }
}
