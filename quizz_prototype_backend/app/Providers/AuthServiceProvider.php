<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Laravel\Passport\Passport;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\CustomAccessTokenController;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
         'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        VerifyEmail::toMailUsing(function ($notifiable, $url) {
            $url_https = (env('APP_ENV') === 'local') ? $url : str_replace(['http://'],'https://',$url);
            $spaUrl = env('APP_VIEW_URL')."?verify_email=".$url_https;

            return (new MailMessage)
                ->view('email.verification', ['url' => $spaUrl, 'email' => $notifiable->email])
                ->subject('Verifique seu endereço de Email')
                ->line('Clique no botão abaixo para verificar seu endereço de email');
        });

        if (! $this->app->routesAreCached()) {

                Passport::routes();
        }
    }
}
