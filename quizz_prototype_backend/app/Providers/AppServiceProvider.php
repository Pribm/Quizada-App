<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Coderello\SocialGrant\Resolvers\SocialUserResolverInterface;
use App\Services\SocialUserResolver;

class AppServiceProvider extends ServiceProvider
{
    public $bindings = [
        SocialUserResolverInterface::class => SocialUserResolver::class
    ];
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);
    }
}
