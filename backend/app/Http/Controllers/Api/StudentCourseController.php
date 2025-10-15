<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\LessonProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StudentCourseController extends Controller
{
    public function viewCourse($courseId)
{
    try {
        $student = Auth::user();

        // Load course with all necessary relationships
        $course = Course::with([
            'teacher:id,first_name,last_name,email',
            'lessons' => function ($query) {
                $query->orderBy('order_index');
            },
            'sessions'
        ])
        ->where('is_active', true)
        ->find($courseId);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 404);
        }

        // Debug logging
        Log::info('Course data loaded', [
            'course_id' => $courseId,
            'student_id' => $student->id,
            'lessons_count' => $course->lessons->count(),
            'has_teacher' => !is_null($course->teacher)
        ]);

        // Check if student is enrolled
        $isEnrolled = CourseEnrollment::where('student_id', $student->id)
            ->where('course_id', $courseId)
            ->where('status', 'active')
            ->exists();

        // Format lessons with proper data
        $formattedLessons = [];

        foreach ($course->lessons as $lesson) {
            $lessonData = [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'description' => $lesson->description,
                'duration' => $lesson->duration,
                'order_index' => $lesson->order_index,
                'is_preview' => (bool) $lesson->is_preview,
                'video_type' => $lesson->video_type,
                'thumbnail' => null
            ];

            // Add thumbnail URL if exists
            if ($lesson->thumbnail) {
                $lessonData['thumbnail'] = asset('storage/' . $lesson->thumbnail);
            }

            // Only include video URL if enrolled or preview
            if ($isEnrolled || $lesson->is_preview) {
                if ($lesson->video_type === 'upload' && $lesson->video_file_path) {
                    $lessonData['video_url'] = $lesson->video_file_path;
                } else {
                    $lessonData['video_url'] = $lesson->video_url;
                }
            } else {
                $lessonData['video_url'] = null;
                $lessonData['is_locked'] = true;
            }

            // Add progress data if enrolled
            if ($isEnrolled) {
                $progress = LessonProgress::where('user_id', $student->id)
                    ->where('lesson_id', $lesson->id)
                    ->first();

                $lessonData['is_completed'] = $progress ? (bool) $progress->is_completed : false;
                $lessonData['progress'] = $progress ? (float) $progress->progress_percentage : 0;
                $lessonData['watched_seconds'] = $progress ? $progress->watched_seconds : 0;
            } else {
                $lessonData['is_completed'] = false;
                $lessonData['progress'] = 0;
                $lessonData['watched_seconds'] = 0;
            }

            $formattedLessons[] = $lessonData;
        }

        // Calculate overall course progress
        $totalProgress = 0;
        $completedLessonsCount = 0;

        if ($isEnrolled && $course->lessons->count() > 0) {
            $completedLessonsCount = LessonProgress::where('user_id', $student->id)
                ->where('course_id', $courseId)
                ->where('is_completed', true)
                ->count();

            $totalProgress = round(($completedLessonsCount / $course->lessons->count()) * 100, 2);
        }

        // Get actual enrolled students count
        $enrolledStudentsCount = CourseEnrollment::where('course_id', $courseId)
            ->where('status', 'active')
            ->count();

        // Build course data response
        $courseData = [
            'id' => $course->id,
            'title' => $course->title,
            'description' => $course->description,
            'teacher_name' => $course->teacher ? ($course->teacher->first_name . ' ' . $course->teacher->last_name) : 'Unknown',
            'teacher_email' => $course->teacher ? $course->teacher->email : null,
            'price' => (float) $course->price,
            'original_price' => $course->original_price ? (float) $course->original_price : null,
            'duration' => $course->duration,
            'lessons_count' => $course->lessons->count(),
            'students_count' => $enrolledStudentsCount,
            'rating' => (float) ($course->rating ?? 0),
            'thumbnail' => $course->thumbnail ? asset('storage/' . $course->thumbnail) : null,
            'category' => $course->category,
            'grade' => $course->grade,
            'course_type' => $course->course_type,
            'is_active' => (bool) $course->is_active,
            'is_enrolled' => $isEnrolled,
            'progress' => $totalProgress,
            'completed_lessons' => $completedLessonsCount,
            'total_lessons' => $course->lessons->count(),
            'lessons' => $formattedLessons
        ];

        // Add live course specific data
        if ($course->course_type === 'live') {
    $courseData['max_seats'] = $course->max_seats;
    $courseData['enrolled_seats'] = $course->enrolled_seats;
    $courseData['seats_left'] = max(0, ($course->max_seats ?? 0) - ($course->enrolled_seats ?? 0));
    $courseData['is_full'] = ($course->enrolled_seats ?? 0) >= ($course->max_seats ?? 1);
    $courseData['start_date'] = $course->start_date ? $course->start_date->format('Y-m-d') : null;
    $courseData['end_date'] = $course->end_date ? $course->end_date->format('Y-m-d') : null;
    $courseData['sessions_per_week'] = $course->sessions_per_week;

    // Format schedule if sessions exist
    if ($course->sessions && $course->sessions->count() > 0) {
        $courseData['schedule'] = $course->sessions->map(function ($session) {
            // Parse times as simple time strings (no timezone conversion needed for display)
            $startTime = \Carbon\Carbon::createFromFormat('H:i:s', $session->start_time);
            $endTime = \Carbon\Carbon::createFromFormat('H:i:s', $session->end_time);

            return [
                'id' => $session->id,
                'day' => $session->day_of_week,
                'day_arabic' => $this->getDayInArabic($session->day_of_week),
                'start_time' => $startTime->format('h:i A'), // Format: 08:28 PM
                'end_time' => $endTime->format('h:i A'),     // Format: 11:59 PM
                'duration' => $session->duration_minutes ?? null,
                'session_date' => $session->session_date
                    ? \Carbon\Carbon::parse($session->session_date)->toDateString()
                    : null,
            ];
        })->toArray();
    } else {
        $courseData['schedule'] = [];
    }
}

        // Log the final response for debugging
        Log::info('Course view response', [
            'course_id' => $courseId,
            'lessons_returned' => count($formattedLessons),
            'is_enrolled' => $isEnrolled
        ]);

        return response()->json([
            'success' => true,
            'course' => $courseData
        ]);

    } catch (\Exception $e) {
        Log::error('Error in viewCourse', [
            'course_id' => $courseId,
            'student_id' => Auth::id(),
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Error loading course',
            'error' => config('app.debug') ? $e->getMessage() : 'An error occurred while loading the course'
        ], 500);
    }
}

    public function enrollInCourse($courseId)
    {
        try {
            $student = Auth::user();

            $course = Course::where('is_active', true)->find($courseId);

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }

            // Check if already enrolled
            $existingEnrollment = CourseEnrollment::where('student_id', $student->id)
                ->where('course_id', $courseId)
                ->first();

            if ($existingEnrollment) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already enrolled in this course'
                ], 400);
            }

            // Check if course is full (for live courses)
            if ($course->course_type === 'live') {
                $enrolledCount = CourseEnrollment::where('course_id', $courseId)
                    ->where('status', 'active')
                    ->count();

                if ($enrolledCount >= $course->max_seats) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This course is full'
                    ], 400);
                }
            }

            // Create enrollment
            DB::beginTransaction();

            $enrollment = CourseEnrollment::create([
                'student_id' => $student->id,
                'course_id' => $courseId,
                'price_paid' => $course->price,
                'status' => 'active',
                'enrolled_at' => now()
            ]);

            // Update course enrolled seats and students count
            if ($course->course_type === 'live') {
                $course->increment('enrolled_seats');
            }
            $course->increment('students_count');

            // Here you would integrate with payment gateway
            // For now, we'll assume payment is successful

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Successfully enrolled in course',
                'enrollment_id' => $enrollment->id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error enrolling in course: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateLessonProgress(Request $request, $lessonId)
    {
        try {
            $student = Auth::user();

            $request->validate([
                'watched_seconds' => 'required|numeric|min:0'
            ]);

            // Get lesson with course
            $lesson = \App\Models\CourseLesson::with('course')->find($lessonId);

            if (!$lesson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lesson not found'
                ], 404);
            }

            // Check if student is enrolled
            $isEnrolled = CourseEnrollment::where('student_id', $student->id)
                ->where('course_id', $lesson->course_id)
                ->where('status', 'active')
                ->exists();

            if (!$isEnrolled && !$lesson->is_preview) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not enrolled in this course'
                ], 403);
            }

            // Calculate progress percentage
            $durationInSeconds = $this->parseDurationToSeconds($lesson->duration);
            $progressPercentage = min(100, ($request->watched_seconds / $durationInSeconds) * 100);
            $isCompleted = $progressPercentage >= 90; // Consider completed if watched 90%

            // Update or create progress
            $progress = LessonProgress::updateOrCreate(
                [
                    'user_id' => $student->id,
                    'lesson_id' => $lessonId,
                    'course_id' => $lesson->course_id
                ],
                [
                    'watched_seconds' => $request->watched_seconds,
                    'progress_percentage' => $progressPercentage,
                    'is_completed' => $isCompleted,
                    'last_watched_at' => now(),
                    'completed_at' => $isCompleted ? now() : null
                ]
            );

            return response()->json([
                'success' => true,
                'progress' => $progress
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating progress: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getDayInArabic($day)
    {
        $days = [
            'saturday' => 'السبت',
            'sunday' => 'الأحد',
            'monday' => 'الإثنين',
            'tuesday' => 'الثلاثاء',
            'wednesday' => 'الأربعاء',
            'thursday' => 'الخميس',
            'friday' => 'الجمعة'
        ];

        return $days[strtolower($day)] ?? $day;
    }

    private function parseDurationToSeconds($duration)
    {
        // Parse duration like "15:30" or "1:30:00"
        $parts = explode(':', $duration);

        if (count($parts) == 2) {
            // MM:SS format
            return ($parts[0] * 60) + $parts[1];
        } elseif (count($parts) == 3) {
            // HH:MM:SS format
            return ($parts[0] * 3600) + ($parts[1] * 60) + $parts[2];
        }

        return 0;
    }


    public function myEnrolledCourses()
{
    $student = Auth::user();

    $courses = Course::with('teacher:id,first_name,last_name,email')
        ->whereHas('enrollments', function ($q) use ($student) {
            $q->where('student_id', $student->id)
                ->where('status', 'active');
        })
        ->where('is_active', true)
        ->get();

    return response()->json([
        'success' => true,
        'courses' => $courses
    ]);
}


}
