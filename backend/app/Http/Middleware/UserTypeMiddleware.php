<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserTypeMiddleware
{
    public function handle(Request $request, Closure $next, ...$types)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if (!in_array(Auth::user()->user_type, $types)) {
            return response()->json([
                'message' => 'غير مصرح لك بالوصول إلى هذا المحتوى'
            ], 403);
        }

        return $next($request);
    }
}
