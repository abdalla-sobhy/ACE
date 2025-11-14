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
use App\Http\Controllers\Api\CompanyAuthController;
use App\Http\Controllers\Api\CompanyJobController;
use App\Http\Controllers\Api\UniversityJobController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminCourseController;
use App\Http\Controllers\Admin\AdminCompanyController;
use App\Http\Controllers\Admin\TeacherManagementController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook']);

// Company registration (PUBLIC - moved outside of auth:sanctum)
Route::post('/company/register', [CompanyAuthController::class, 'register']);

// Didit verification routes
Route::post('/didit/create-session', [DiditController::class, 'createSession']);
Route::get('/didit/session-status/{sessionId}', [DiditController::class, 'getSessionStatus']);
Route::post('/didit/webhook', [DiditController::class, 'webhook']);

// Public profiles for companies/recruiters (optional authentication)
Route::get('/university/public-profiles', [UniversityStudentController::class, 'getPublicProfiles']);

// Video streaming route (handles its own authentication via token in query parameter)
Route::get('/stream/lesson/{lessonId}', [VideoStreamController::class, 'streamLesson']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', function (Request $request) {
        return $request->user()->load([
            'studentProfile',
            'teacherProfile',
            'parentProfile',
            'universityStudentProfile',
            'company'
        ]);
    });

    // Notification routes (available to all authenticated users)
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'getUnreadCount']);
        Route::put('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
        Route::delete('/read/all', [NotificationController::class, 'deleteAllRead']);
    });

    // Admin routes
    Route::prefix('admin')->middleware(\App\Http\Middleware\UserTypeMiddleware::class . ':admin')->group(function () {
        // Dashboard
        Route::get('/dashboard/stats', [AdminDashboardController::class, 'getStats']);
        Route::get('/analytics/{period?}', [AdminDashboardController::class, 'getAnalytics']);

        // User management
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/users/{id}', [AdminUserController::class, 'show']);
        Route::put('/users/{id}/status', [AdminUserController::class, 'updateStatus']);
        Route::post('/users/{id}/suspend', [AdminUserController::class, 'suspend']);
        Route::post('/users/{id}/activate', [AdminUserController::class, 'activate']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
        Route::post('/users/create-admin', [AdminUserController::class, 'createAdmin']);

        // Teacher management
        Route::get('/teachers/pending', [TeacherManagementController::class, 'getPendingTeachers']);
        Route::get('/teachers/{id}', [TeacherManagementController::class, 'getTeacherDetails']);
        Route::post('/teachers/{id}/approve', [TeacherManagementController::class, 'approveTeacher']);
        Route::post('/teachers/{id}/reject', [TeacherManagementController::class, 'rejectTeacher']);
        Route::get('/teachers/{id}/cv', [TeacherManagementController::class, 'downloadCV']);

        // Course management
        Route::get('/courses', [AdminCourseController::class, 'index']);
        Route::put('/courses/{id}/status', [AdminCourseController::class, 'updateStatus']);
        Route::delete('/courses/{id}', [AdminCourseController::class, 'destroy']);

        // Company management
        Route::get('/companies', [AdminCompanyController::class, 'index']);
        Route::post('/companies/{id}/verify', [AdminCompanyController::class, 'verify']);
        Route::post('/companies/{id}/unverify', [AdminCompanyController::class, 'unverify']);
    });

        Route::get('/courses', [CourseController::class, 'index']);

        Route::prefix('company')->middleware(\App\Http\Middleware\UserTypeMiddleware::class . ':company')->group(function () {
        // Dashboard
        Route::get('/dashboard/stats', [CompanyJobController::class, 'getDashboardStats']);

        // Profile management
        Route::get('/profile', [CompanyJobController::class, 'getProfile']);
        Route::put('/profile', [CompanyJobController::class, 'updateProfile']);
        Route::post('/upload-logo', [CompanyJobController::class, 'uploadLogo']);

        // Job postings management
        Route::get('/jobs', [CompanyJobController::class, 'getJobPostings']);
        Route::get('/jobs/{id}', [CompanyJobController::class, 'getJobPosting']);
        Route::post('/jobs', [CompanyJobController::class, 'createJobPosting']);
        Route::put('/jobs/{id}', [CompanyJobController::class, 'updateJobPosting']);
        Route::delete('/jobs/{id}', [CompanyJobController::class, 'deleteJobPosting']);

        // Applications management
        Route::get('/applications', [CompanyJobController::class, 'getAllApplications']);
        Route::get('/jobs/{jobId}/applications', [CompanyJobController::class, 'getJobApplications']);
        Route::get('/applications/{id}', [CompanyJobController::class, 'getApplicationDetails']);
        Route::put('/applications/{id}/status', [CompanyJobController::class, 'updateApplicationStatus']);
        Route::post('/applications/{id}/favorite', [CompanyJobController::class, 'toggleApplicationFavorite']);
        Route::get('/students/{studentId}/cv', [CompanyJobController::class, 'downloadStudentCV']);
    });

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

        // Job board
        Route::get('/jobs', [UniversityJobController::class, 'getJobPostings']);
        Route::get('/jobs/{id}', [UniversityJobController::class, 'getJobPosting']);
        Route::post('/jobs/{id}/apply', [UniversityJobController::class, 'applyForJob']);
        Route::get('/test-jsearch', [UniversityJobController::class, 'testJSearch']);

        // Applications
        Route::get('/applications', [UniversityJobController::class, 'getMyApplications']);
        Route::delete('/applications/{id}', [UniversityJobController::class, 'withdrawApplication']);
    });

    // Teacher routes
    Route::prefix('teacher')->group(function () {
        // Profile management
        Route::get('/profile', [TeacherController::class, 'getProfile']);
        Route::put('/profile', [TeacherController::class, 'updateProfile']);
        Route::post('/upload-cv', [TeacherController::class, 'uploadCV']);

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
    Route::prefix('parent')->group(function () {
        // Profile management
        Route::get('/profile', [ParentStudentController::class, 'getProfile']);
        Route::put('/profile', [ParentStudentController::class, 'updateProfile']);

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
        // Profile management
        Route::get('/profile', [StudentCourseController::class, 'getProfile']);
        Route::put('/profile', [StudentCourseController::class, 'updateProfile']);

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
});
