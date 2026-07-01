<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Behind Render's HTTPS proxy the app receives plain HTTP, so force
        // every generated URL (assets, links) to https to avoid mixed content.
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
