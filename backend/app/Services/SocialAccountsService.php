<?php
namespace App\Services;
use App\Models\User;
use App\Models\LinkedSocialAccount;
use Laravel\Socialite\Two\User as ProviderUser;
use App\Models\SocialAccounts;
use Carbon\Carbon;
class SocialAccountsService
{
    /**
     * Find or create user instance by provider user instance and provider name.
     *
     * @param ProviderUser $providerUser
     * @param string $provider
     *
     * @return User
     */
    public function findOrCreate(ProviderUser $providerUser, string $provider): User
    {
        $socialAccount = SocialAccounts::where('provider_name', $provider)
            ->where('provider_id', $providerUser->getId())
            ->first();
        if ($socialAccount) {
            $user = $socialAccount->user;
            if(!$user->custom_avatar){
                $user->update(['avatar' => $providerUser->avatar]);
            }
            return $user;
        } else {
            $user = null;
            if ($email = $providerUser->getEmail()) {
                $user = User::where('email', $email)->first();

                if($user !== null && !$user->custom_avatar){
                    $user->update(['avatar' => $providerUser->avatar]);
                }
            }
            if (! $user) {
                $user = User::create([
                    'name' => $providerUser->getName(),
                    'email' => $providerUser->getEmail(),
                    'avatar' => $providerUser->avatar,
                    'email_verified_at' => Carbon::now()
                ]);
            }
            $user->socialAccounts()->create([
                'provider_id' => $providerUser->getId(),
                'provider_name' => $provider,
            ]);

            $user->score()->create([
                'user_id' => $user->id,
                'score' => 0,
            ]);

            return $user;
        }
    }
}
