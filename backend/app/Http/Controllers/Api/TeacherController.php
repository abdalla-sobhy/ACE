<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\CourseSession;
use Illuminate\Support\Facades\Log;

class TeacherController extends Controller
{
    public function getCourses(Request $request)
    {
        try {
            $teacher = Auth::user();

            if ($teacher->user_type !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Teachers only.'
                ], 403);
            }

            $courses = Course::with(['sessions'])
                ->where('teacher_id', $teacher->id)
                ->get()
                ->map(function ($course) {
                    $totalRevenue = CourseEnrollment::where('course_id', $course->id)
                        ->sum('price_paid');

                    return [
                        'id' => $course->id,
                        'title' => $course->title,
                        'description' => $course->description,
                        'price' => $course->price,
                        'original_price' => $course->original_price,
                        'duration' => $course->duration,
                        'lessons_count' => $course->lessons_count,
                        'students_count' => $course->students_count,
                        'rating' => $course->rating,
                        'thumbnail' => $course->thumbnail ? asset('storage/' . $course->thumbnail) : null,
                        'category' => $course->category,
                        'grade' => $course->grade,
                        'course_type' => $course->course_type,
                        'is_active' => $course->is_active,
                        'max_seats' => $course->max_seats,
                        'enrolled_seats' => $course->enrolled_seats,
                        'seats_left' => $course->seats_left,
                        'is_full' => $course->is_full,
                        'start_date' => $course->start_date ? $course->start_date->format('Y-m-d') : null,
                        'end_date' => $course->end_date ? $course->end_date->format('Y-m-d') : null,
                        'sessions_per_week' => $course->sessions_per_week,
                        'schedule' => $course->schedule_summary,
                        'total_revenue' => $totalRevenue,
                        'completion_rate' => $course->enrollments()->where('completed_at', '!=', null)->count() / max($course->students_count, 1) * 100
                    ];
                });

            return response()->json([
                'success' => true,
                'courses' => $courses
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getStats(Request $request)
    {
        try {
            $teacher = Auth::user();

            if ($teacher->user_type !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Teachers only.'
                ], 403);
            }

            $courses = Course::where('teacher_id', $teacher->id);

            $stats = [
                'total_courses' => $courses->count(),
                'active_courses' => $courses->where('is_active', true)->count(),
                'live_courses' => $courses->where('course_type', 'live')->count(),
                'recorded_courses' => $courses->where('course_type', 'recorded')->count(),
                'total_students' => CourseEnrollment::whereIn('course_id', $courses->pluck('id'))->count(),
                'total_revenue' => CourseEnrollment::whereIn('course_id', $courses->pluck('id'))->sum('price_paid'),
                'average_rating' => $courses->avg('rating') ?? 0,
                'upcoming_sessions' => Course::where('teacher_id', $teacher->id)
                    ->where('course_type', 'live')
                    ->where('start_date', '>', now())
                    ->count()
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createCourse(Request $request)
{
    try {
        $teacher = Auth::user();

        if ($teacher->user_type !== 'teacher') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Teachers only.'
            ], 403);
        }

        // Check if it's a multipart request
        $contentType = $request->header('Content-Type');
        Log::info('Request Content-Type: ' . $contentType);

        // Log all incoming data
        Log::info('Incoming request data:', [
            'all_data' => $request->all(),
            'has_files' => count($request->allFiles()) > 0,
            'files_list' => array_keys($request->allFiles()),
        ]);

        // Check file upload before validation
        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');

            Log::info('File upload details:', [
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
                'is_valid' => $file->isValid(),
                'error' => $file->getError(),
                'error_message' => $file->getErrorMessage(),
                'max_upload_size' => ini_get('upload_max_filesize'),
                'max_post_size' => ini_get('post_max_size'),
            ]);

            // Check if file is valid before validation
            if (!$file->isValid()) {
                return response()->json([
                    'success' => false,
                    'message' => 'File upload failed',
                    'error' => 'Invalid file: ' . $file->getErrorMessage(),
                    'php_error_code' => $file->getError()
                ], 422);
            }
        }

        // Validation rules
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'grade' => 'required|string',
            'course_type' => 'required|in:recorded,live',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'duration' => 'required|string',
            'lessons_count' => 'required|integer|min:1',
            'is_active' => 'nullable|boolean',
        ];

        // Only add thumbnail validation if file is present
        if ($request->hasFile('thumbnail')) {
            $rules['thumbnail'] = 'image|mimes:jpeg,jpg,png,gif|max:5120';
        }

        // Additional validation for live courses
        if ($request->course_type === 'live') {
            $rules['max_seats'] = 'required|integer|min:1';
            $rules['start_date'] = 'required|date|after_or_equal:today';
            $rules['end_date'] = 'required|date|after:start_date';
            $rules['sessions'] = 'required|array|min:1';
            $rules['sessions.*.day_of_week'] = 'required|in:saturday,sunday,monday,tuesday,wednesday,thursday,friday';
            $rules['sessions.*.start_time'] = 'required|date_format:H:i';
            $rules['sessions.*.end_time'] = 'required|date_format:H:i|after:sessions.*.start_time';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            Log::error('Validation errors:', $validator->errors()->toArray());

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Create course
            $courseData = [
                'title' => $request->title,
                'description' => $request->description,
                'teacher_id' => $teacher->id,
                'category' => $request->category,
                'grade' => $request->grade,
                'course_type' => $request->course_type,
                'price' => $request->price,
                'original_price' => $request->original_price,
                'duration' => $request->duration,
                'lessons_count' => $request->lessons_count,
                'students_count' => 0,
                'rating' => 0,
                'is_active' => $request->is_active ?? true,
            ];

            // Add live course specific fields
            if ($request->course_type === 'live') {
                $courseData['max_seats'] = $request->max_seats;
                $courseData['enrolled_seats'] = 0;
                $courseData['start_date'] = $request->start_date;
                $courseData['end_date'] = $request->end_date;
                $courseData['sessions_per_week'] = count($request->sessions);
            }

            // Handle thumbnail upload
            if ($request->hasFile('thumbnail') && $request->file('thumbnail')->isValid()) {
                try {
                    $file = $request->file('thumbnail');

                    // Generate a unique filename
                    $filename = 'course_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

                    // Store the file
                    $path = $file->storeAs('courses', $filename, 'public');

                    // Verify the file was stored
                    $fullPath = storage_path('app/public/' . $path);
                    if (!file_exists($fullPath)) {
                        throw new \Exception('File was not saved to disk');
                    }

                    $courseData['thumbnail'] = $path;

                    Log::info('File uploaded successfully:', [
                        'path' => $path,
                        'full_path' => $fullPath,
                        'exists' => file_exists($fullPath)
                    ]);

                } catch (\Exception $e) {
                    Log::error('File upload error:', [
                        'message' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);

                    DB::rollback();

                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to save thumbnail',
                        'error' => $e->getMessage()
                    ], 500);
                }
            }

            $course = Course::create($courseData);

            // Create sessions for live courses
            if ($request->course_type === 'live' && $request->has('sessions')) {
                foreach ($request->sessions as $session) {
                    CourseSession::create([
                        'course_id' => $course->id,
                        'day_of_week' => $session['day_of_week'],
                        'start_time' => $session['start_time'],
                        'end_time' => $session['end_time']
                    ]);
                }
            }

            DB::commit();

            // Load relationships
            $course->load('sessions');

            // Format response
            $responseData = $course->toArray();
            if ($course->thumbnail) {
                $responseData['thumbnail_url'] = asset('storage/' . $course->thumbnail);
            }

            return response()->json([
                'success' => true,
                'message' => 'Course created successfully',
                'course' => $responseData
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }

    } catch (\Exception $e) {
        Log::error('Course creation error:', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Error creating course',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function deleteCourse($id)
    {
        try {
            $teacher = Auth::user();

            $course = Course::where('teacher_id', $teacher->id)
                ->where('id', $id)
                ->first();

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }

            // Check if course has enrollments
            if ($course->enrollments()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete course with enrolled students'
                ], 400);
            }

            $course->delete();

            return response()->json([
                'success' => true,
                'message' => 'Course deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting course',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
