<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\RegisterController;

// Public routes (no authentication needed)
Route::post('/register', [AuthController::class, 'register']);


Route::post('/login', [AuthController::class, 'login']);



Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail']);
// didit route
Route::prefix('auth')->group(function () {
    Route::post('/register', [RegisterController::class, 'register']);
});


// Protected routes (need authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

// Test route, No one delete this I will delete it myself. Remind me if I forgot.
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});
