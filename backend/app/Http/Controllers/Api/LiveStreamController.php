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
            ->where('session_date', '>=', Carbon::today('Africa/Cairo'))
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

        // Check if user is the teacher
        $isTeacher = $session->course->teacher_id == $user->id;

        // Check if user can join (teacher or enrolled student)
        if (!$isTeacher && !$session->canJoin($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Not enrolled in this course'
            ], 403);
        }

        // Generate Agora token (optional - for Jitsi we don't need this)
        try {
            $token = $this->agoraService->generateToken(
                $session->id,
                $user->id,
                $isTeacher ? 'host' : 'audience'
            );
        } catch (\Exception $e) {
            // If Agora service fails, continue without token (for Jitsi)
            $token = null;
            Log::warning('Agora token generation failed', [
                'error' => $e->getMessage(),
                'session_id' => $sessionId
            ]);
        }

        // Record attendance only for students (not teachers)
        if (!$isTeacher) {
            \App\Models\SessionAttendance::updateOrCreate(
                [
                    'session_id' => $sessionId,
                    'student_id' => $user->id
                ],
                [
                    'joined_at' => now()
                ]
            );
        }

        return response()->json([
            'success' => true,
            'session' => [
                'id' => $session->id,
                'course_id' => $session->course_id,
                'course_title' => $session->course->title,
                'is_teacher' => $isTeacher,
                'status' => $session->status
            ],
            'stream_data' => [
                'channel' => 'session_' . $sessionId,
                'token' => $token,
                'uid' => $user->id,
                'role' => $isTeacher ? 'host' : 'audience',
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

        // Update session status to live
        $session->update([
            'status' => 'live'
        ]);

        Log::info('Session started', [
            'session_id' => $sessionId,
            'teacher_id' => $teacher->id,
            'course_id' => $session->course_id
        ]);

        // TODO: Notify students via websockets/notifications
        // broadcast(new SessionStarted($session));

        return response()->json([
            'success' => true,
            'message' => 'Session started successfully'
        ]);
    }

    public function endSession($sessionId)
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

        // Update session status to ended
        $session->update([
            'status' => 'ended'
        ]);

        // Update all attendance records - set left_at for students still in session
        \App\Models\SessionAttendance::where('session_id', $sessionId)
            ->whereNull('left_at')
            ->update(['left_at' => now()]);

        Log::info('Session ended', [
            'session_id' => $sessionId,
            'teacher_id' => $teacher->id,
            'course_id' => $session->course_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Session ended successfully'
        ]);
    }

    public function getNextSession($courseId)
    {
        $user = Auth::user();

        // Check if user is enrolled as student
        $isEnrolled = \App\Models\CourseEnrollment::where('student_id', $user->id)
            ->where('course_id', $courseId)
            ->where('status', 'active')
            ->exists();

        // Check if user is the teacher of this course
        $course = Course::find($courseId);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 404);
        }

        $isTeacher = $course->teacher_id == $user->id;

        // User must be either enrolled or the teacher
        if (!$isEnrolled && !$isTeacher) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized to access this course'
            ], 403);
        }

        // Get next upcoming session
        $nextSession = LiveSession::where('course_id', $courseId)
            ->where('session_date', '>=', Carbon::today('Africa/Cairo'))
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

        try {
            // Parse the session datetime in Cairo timezone
            $sessionDateTime = Carbon::parse(
                $nextSession->session_date->format('Y-m-d') . ' ' . $nextSession->start_time,
                'Africa/Cairo'
            );

            // Get current time in Cairo timezone
            $now = Carbon::now('Africa/Cairo');

            // Calculate minutes difference
            $minutesUntilSession = $now->diffInMinutes($sessionDateTime, false);

            // Teachers can join anytime, students have restrictions
            if ($isTeacher) {
                $canJoin = true; // Teachers can always join their sessions
            } else {
                // Students: Allow joining 15 minutes before and up to 2 hours after start time
                $canJoin = $minutesUntilSession <= 15 && $minutesUntilSession >= -120;
            }

            Log::info('Session time calculations', [
                'user_id' => $user->id,
                'user_type' => $user->type,
                'is_teacher' => $isTeacher,
                'session_id' => $nextSession->id,
                'session_datetime' => $sessionDateTime->toDateTimeString(),
                'current_time' => $now->toDateTimeString(),
                'minutes_until_session' => $minutesUntilSession,
                'can_join' => $canJoin,
                'timezone' => 'Africa/Cairo'
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
                    'is_teacher' => $isTeacher,
                    'minutes_until_start' => round($minutesUntilSession)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Date parsing error in getNextSession', [
                'session_id' => $nextSession->id,
                'session_date' => $nextSession->session_date,
                'start_time' => $nextSession->start_time,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error parsing session time'
            ], 500);
        }
    }
}
