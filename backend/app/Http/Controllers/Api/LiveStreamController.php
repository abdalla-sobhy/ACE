<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LiveSession;
use App\Models\Course;
use App\Services\AgoraService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class LiveStreamController extends Controller
{
    private $agoraService;

    public function __construct(AgoraService $agoraService)
    {
        $this->agoraService = $agoraService;
    }

    public function getUpcomingSessions()
    {
        $user = Auth::user();

        $sessions = LiveSession::with(['course', 'course.teacher'])
            ->whereHas('course.enrollments', function ($q) use ($user) {
                $q->where('student_id', $user->id)
                  ->where('status', 'active');
            })
            ->where('session_date', '>=', Carbon::today())
            ->where('status', '!=', 'cancelled')
            ->orderBy('session_date')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'success' => true,
            'sessions' => $sessions
        ]);
    }

    public function joinSession($sessionId)
    {
        $user = Auth::user();
        $session = LiveSession::with('course')->find($sessionId);

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found'
            ], 404);
        }

        // Check if user can join
        if (!$session->canJoin($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Not enrolled in this course'
            ], 403);
        }

        // Generate Agora token
        $token = $this->agoraService->generateToken(
            $session->id,
            $user->id,
            $user->type === 'teacher' ? 'host' : 'audience'
        );

        // Record attendance
        \App\Models\SessionAttendance::updateOrCreate(
            [
                'session_id' => $sessionId,
                'student_id' => $user->id
            ],
            [
                'joined_at' => now()
            ]
        );

        return response()->json([
            'success' => true,
            'stream_data' => [
                'channel' => 'session_' . $sessionId,
                'token' => $token,
                'uid' => $user->id,
                'role' => $user->type === 'teacher' ? 'host' : 'audience',
                'app_id' => config('services.agora.app_id')
            ]
        ]);
    }

    public function startSession(Request $request, $sessionId)
    {
        $teacher = Auth::user();
        $session = LiveSession::with('course')->find($sessionId);

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found'
            ], 404);
        }

        // Verify teacher owns the course
        if ($session->course->teacher_id !== $teacher->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Update session status
        $session->update([
            'status' => 'live',
            'start_time' => now()
        ]);

        // Notify students (implement with websockets)
        // broadcast(new SessionStarted($session));

        return response()->json([
            'success' => true,
            'message' => 'Session started'
        ]);
    }

    public function endSession($sessionId)
    {
        $teacher = Auth::user();
        $session = LiveSession::with('course')->find($sessionId);

        if (!$session || $session->course->teacher_id !== $teacher->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $session->update([
            'status' => 'ended',
            'end_time' => now()
        ]);

        // Update attendance records
        \App\Models\SessionAttendance::where('session_id', $sessionId)
            ->whereNull('left_at')
            ->update(['left_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Session ended'
        ]);
    }


    public function getNextSession($courseId)
{
    $user = Auth::user();

    // Check enrollment
    $isEnrolled = \App\Models\CourseEnrollment::where('student_id', $user->id)
        ->where('course_id', $courseId)
        ->where('status', 'active')
        ->exists();

    // Check if teacher
    $course = Course::find($courseId);
    $isTeacher = $course && $course->teacher_id == $user->id;

    if (!$isEnrolled && !$isTeacher) {
        return response()->json([
            'success' => false,
            'message' => 'Not enrolled in this course'
        ], 403);
    }

    // Get next upcoming session
    $nextSession = LiveSession::where('course_id', $courseId)
        ->where('session_date', '>=', Carbon::today())
        ->whereIn('status', ['scheduled', 'live'])
        ->orderBy('session_date')
        ->orderBy('start_time')
        ->first();

    if (!$nextSession) {
        return response()->json([
            'success' => false,
            'message' => 'No upcoming sessions',
            'session' => null
        ]);
    }

    // Debug: Log the raw values
    Log::info('Session data debugging', [
        'session_id' => $nextSession->id,
        'session_date' => $nextSession->session_date,
        'session_date_type' => gettype($nextSession->session_date),
        'start_time' => $nextSession->start_time,
        'start_time_type' => gettype($nextSession->start_time),
    ]);

    // Fix the date parsing - handle different start_time formats
    try {
        // If start_time is already a Carbon instance or full datetime
        if ($nextSession->start_time instanceof \Carbon\Carbon) {
            $sessionDateTime = $nextSession->start_time;
        }
        // If start_time is a time string like "09:08:00"
        elseif (preg_match('/^\d{2}:\d{2}:\d{2}$/', $nextSession->start_time)) {
            $sessionDateTime = Carbon::parse($nextSession->session_date->format('Y-m-d') . ' ' . $nextSession->start_time);
        }
        // If start_time is already a full datetime string
        elseif (strpos($nextSession->start_time, ' ') !== false) {
            $sessionDateTime = Carbon::parse($nextSession->start_time);
        }
        // Default: try to parse as is
        else {
            $sessionDateTime = Carbon::parse($nextSession->session_date->format('Y-m-d') . ' ' . $nextSession->start_time);
        }
    } catch (\Exception $e) {
        Log::error('Date parsing error in getNextSession', [
            'session_id' => $nextSession->id,
            'session_date' => $nextSession->session_date,
            'start_time' => $nextSession->start_time,
            'error' => $e->getMessage()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Error parsing session time'
        ], 500);
    }

    $now = Carbon::now();
    $minutesUntilSession = $now->diffInMinutes($sessionDateTime, false);

    // Allow joining 15 minutes before and up to 2 hours after start time
    $canJoin = $minutesUntilSession <= 15 && $minutesUntilSession >= -120;

    Log::info('Session time calculations', [
        'session_datetime' => $sessionDateTime->toDateTimeString(),
        'current_time' => $now->toDateTimeString(),
        'minutes_until_session' => $minutesUntilSession,
        'can_join' => $canJoin
    ]);

    return response()->json([
        'success' => true,
        'session' => [
            'id' => $nextSession->id,
            'date' => $nextSession->session_date->format('Y-m-d'),
            'start_time' => $nextSession->start_time,
            'end_time' => $nextSession->end_time,
            'status' => $nextSession->status,
            'can_join' => $canJoin,
            'minutes_until_start' => $minutesUntilSession
        ]
    ]);
}
}
