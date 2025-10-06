<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DiditController;
use App\Http\Controllers\Api\ParentStudentController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\TeacherLessonController;
use App\Http\Controllers\Api\StudentCourseController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\UniversityStudentController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\StripeWebhookController;
use App\Http\Controllers\Api\VideoStreamController;
use App\Http\Controllers\Api\LiveStreamController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook']);

// Didit verification routes
Route::post('/didit/create-session', [DiditController::class, 'createSession']);
Route::get('/didit/session-status/{sessionId}', [DiditController::class, 'getSessionStatus']);
Route::post('/didit/webhook', [DiditController::class, 'webhook']);

// Public profiles for companies/recruiters (optional authentication)
Route::get('/university/public-profiles', [UniversityStudentController::class, 'getPublicProfiles']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', function (Request $request) {
        return $request->user()->load([
            'studentProfile',
            'teacherProfile',
            'parentProfile',
            'universityStudentProfile'
        ]);
    });

    Route::get('/courses', [CourseController::class, 'index']);

    // University Student routes
    Route::prefix('university')->middleware(\App\Http\Middleware\UserTypeMiddleware::class . ':university_student')->group(function () {
        // Course browsing (no grade restriction)
        Route::get('/courses', [UniversityStudentController::class, 'getCourses']);

        // Profile management
        Route::get('/profile', [UniversityStudentController::class, 'getProfile']);
        Route::put('/profile', [UniversityStudentController::class, 'updateProfile']);

        // CV management
        Route::post('/upload-cv', [UniversityStudentController::class, 'uploadCV']);
        Route::get('/download-cv', [UniversityStudentController::class, 'downloadCV'])->name('api.university.download-cv');

        // Statistics
        Route::get('/profile-stats', [UniversityStudentController::class, 'getProfileStats']);

        // Course enrollment (shares same logic as regular students)
        Route::get('/courses/{id}/view', [StudentCourseController::class, 'viewCourse']);
        Route::post('/courses/{id}/enroll', [StudentCourseController::class, 'enrollInCourse']);
        Route::post('/lessons/{id}/progress', [StudentCourseController::class, 'updateLessonProgress']);
        Route::get('/my-courses', [StudentCourseController::class, 'myEnrolledCourses']);
    });

    // Teacher routes
    Route::prefix('teacher')->group(function () {
        Route::get('/courses', [TeacherController::class, 'getCourses']);
        Route::get('/stats', [TeacherController::class, 'getStats']);
        Route::post('/courses', [TeacherController::class, 'createCourse']);
        Route::delete('/courses/{id}', [TeacherController::class, 'deleteCourse']);

        // Lesson management
        Route::get('/courses/{id}', [TeacherLessonController::class, 'getCourseWithLessons']);
        Route::post('/courses/{course}/lessons', [TeacherLessonController::class, 'createLesson']);
        Route::put('/lessons/{lesson}', [TeacherLessonController::class, 'updateLesson']);
        Route::delete('/lessons/{lesson}', [TeacherLessonController::class, 'deleteLesson']);
        Route::post('/courses/{course}/lessons/reorder', [TeacherLessonController::class, 'reorderLessons']);
    });

    // Parent routes
    Route::middleware('user.type:parent')->prefix('parent')->group(function () {
        Route::post('/search-student', [ParentStudentController::class, 'searchStudent']);
        Route::post('/follow-request', [ParentStudentController::class, 'sendFollowRequest']);
        Route::get('/followed-students', [ParentStudentController::class, 'getFollowedStudents']);
        Route::get('/student/{id}', [ParentStudentController::class, 'getStudentDetails']);
        Route::delete('/unfollow/{id}', [ParentStudentController::class, 'unfollowStudent']);
    });

    // Student routes
    Route::get('/follow-requests', [ParentStudentController::class, 'getFollowRequests']);
    Route::post('/follow-request/{id}', [ParentStudentController::class, 'handleFollowRequest']);

    Route::prefix('student')->group(function () {
        Route::get('/courses/{id}/view', [StudentCourseController::class, 'viewCourse']);
        Route::post('/courses/{id}/enroll', [StudentCourseController::class, 'enrollInCourse']);
        Route::post('/lessons/{id}/progress', [StudentCourseController::class, 'updateLessonProgress']);
        Route::get('/my-courses', [StudentCourseController::class, 'myEnrolledCourses']);
    });

    // Payment routes
    Route::prefix('payment')->group(function () {
        // Stripe payment routes
        Route::post('/stripe/create-intent/{courseId}', [PaymentController::class, 'createPaymentIntent']);
        Route::post('/stripe/confirm', [PaymentController::class, 'confirmPayment']);

        // PayPal payment routes
        Route::post('/paypal/create-order/{courseId}', [PaymentController::class, 'createPayPalOrder']);
        Route::post('/paypal/confirm', [PaymentController::class, 'confirmPayPalPayment']);

        // Payment history
        Route::get('/history', [PaymentController::class, 'getPaymentHistory']);
    });

    // Live streaming routes
    Route::prefix('live')->group(function () {
        // Student routes
        Route::get('/sessions/upcoming', [LiveStreamController::class, 'getUpcomingSessions']);
        Route::post('/session/{sessionId}/join', [LiveStreamController::class, 'joinSession']);
        Route::get('/course/{courseId}/next-session', [LiveStreamController::class, 'getNextSession']);

        // Teacher routes
        Route::post('/session/{sessionId}/start', [LiveStreamController::class, 'startSession']);
        Route::post('/session/{sessionId}/end', [LiveStreamController::class, 'endSession']);

        // Chat routes
        Route::get('/session/{sessionId}/messages', [LiveStreamController::class, 'getMessages']);
        Route::post('/session/{sessionId}/message', [LiveStreamController::class, 'sendMessage']);
    });

    // Video streaming route
    Route::get('/stream/lesson/{lessonId}', [VideoStreamController::class, 'streamLesson']);
});
