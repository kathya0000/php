<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Http;

class AppServiceProvider extends ServiceProvider
{
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
		
        if(config('app.env') !== 'local') {
            $this->app['request']->server->set('HTTPS','on');
            \URL::forceScheme('https');
        }
		
		Http::withOptions([
			'verify' => false,
		]);
    }
}
