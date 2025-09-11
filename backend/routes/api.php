<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DiditController;
use App\Http\Controllers\Api\ParentStudentController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Didit verification routes
Route::post('/didit/create-session', [DiditController::class, 'createSession']);
Route::get('/didit/session-status/{sessionId}', [DiditController::class, 'getSessionStatus']);
Route::post('/didit/webhook', [DiditController::class, 'webhook']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', function (Request $request) {
        return $request->user()->load(['studentProfile', 'teacherProfile', 'parentProfile']);
    });

    // Parent-Student relationship routes
    Route::middleware('user-type:parent')->prefix('parent')->group(function () {
        Route::post('/search-student', [ParentStudentController::class, 'searchStudent']);
        Route::post('/follow-request', [ParentStudentController::class, 'sendFollowRequest']);
        Route::get('/followed-students', [ParentStudentController::class, 'getFollowedStudents']);
        Route::get('/student/{id}', [ParentStudentController::class, 'getStudentDetails']);
        Route::delete('/unfollow/{id}', [ParentStudentController::class, 'unfollowStudent']);
    });

    Route::middleware('user-type:student')->prefix('student')->group(function () {
        Route::get('/follow-requests', [ParentStudentController::class, 'getFollowRequests']);
        Route::post('/follow-request/{id}', [ParentStudentController::class, 'handleFollowRequest']);
    });
});
