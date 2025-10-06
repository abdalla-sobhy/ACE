<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API requests, don't redirect - return null to trigger JSON response
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        // Only return route('login') if the login route exists
        if (Route::has('login')) {
            return route('login');
        }

        return null;
    }

    /**
     * Handle unauthenticated users for API requests
     */
    protected function unauthenticated($request, array $guards)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            // Throw an exception with JSON response for API requests
            throw new \Illuminate\Auth\AuthenticationException(
                'Unauthenticated.',
                $guards,
                $this->redirectTo($request)
            );
        }

        parent::unauthenticated($request, $guards);
    }
}
