<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsTeacher
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->user_type !== 'teacher') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Teachers only.'
            ], 403);
        }

        return $next($request);
    }
}
