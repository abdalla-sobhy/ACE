<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DiditController;
use App\Http\Controllers\Api\ParentStudentController;
use App\Http\Controllers\Api\StudentController;   // from studentRegister
use App\Http\Controllers\Api\CourseController;    // from main
use App\Http\Controllers\Api\TeacherController;   // from main
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
        return $request->user()->load([
            'studentProfile',
            'teacherProfile',
            'parentProfile'
        ]);
    });

    // Courses
    Route::get('/courses', [CourseController::class, 'index']);

    // Teacher routes
    Route::prefix('teacher')->group(function () {
        Route::get('/courses', [TeacherController::class, 'getCourses']);
        Route::get('/stats', [TeacherController::class, 'getStats']);
        Route::post('/courses', [TeacherController::class, 'createCourse']);
        Route::delete('/courses/{id}', [TeacherController::class, 'deleteCourse']);
    });

    // Parent routes
    Route::middleware('user-type:parent')->prefix('parent')->group(function () {
        Route::post('/search-student', [ParentStudentController::class, 'searchStudent']);
        Route::post('/follow-request', [ParentStudentController::class, 'sendFollowRequest']);
        Route::get('/followed-students', [ParentStudentController::class, 'getFollowedStudents']);
        Route::get('/student/{id}', [ParentStudentController::class, 'getStudentDetails']);
        Route::delete('/unfollow/{id}', [ParentStudentController::class, 'unfollowStudent']);
    });

    // Student routes
    Route::middleware('user-type:student')->prefix('student')->group(function () {
        Route::get('/follow-requests', [ParentStudentController::class, 'getFollowRequests']);
        Route::post('/follow-request/{id}', [ParentStudentController::class, 'handleFollowRequest']);
    });
});
