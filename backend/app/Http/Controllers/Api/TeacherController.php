<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\TeacherProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
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
                        'thumbnail' => $course->thumbnail ? url('api/storage/' . $course->thumbnail) : null,
                        'category' => $course->category,
                        'grade' => $course->grade,
                        'course_type' => $course->course_type,
                        'is_active' => $course->is_active,
                        'max_seats' => $course->max_seats,
                        'enrolled_seats' => $course->enrolled_seats,
                        'seats_left' => $course->seats_left,
                        'is_full' => $course->is_full,
                        'start_date' => $course->start_date ? Carbon::parse($course->start_date)->format('Y-m-d') : null,
                        'end_date' => $course->end_date ? Carbon::parse($course->end_date)->format('Y-m-d') : null,
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

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string',
                'grade' => 'required|string',
                'course_type' => 'required|in:recorded,live',
                'price' => 'required|numeric|min:0',
                'duration' => 'required|string',
                'lessons_count' => 'required|integer|min:1',
                'thumbnail' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:5120',

                'max_seats' => 'required_if:course_type,live|nullable|integer|min:1',
                'start_date' => 'required_if:course_type,live|nullable|date|after_or_equal:today',
                'end_date' => 'required_if:course_type,live|nullable|date|after:start_date',
                'sessions' => 'required_if:course_type,live|nullable|array|min:1',
                'sessions.*.day_of_week' => 'required|string',
                'sessions.*.start_time' => 'required|date_format:H:i',
                'sessions.*.end_time' => 'required|date_format:H:i',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            try {
                $courseData = [
                    'teacher_id' => $teacher->id,
                    'title' => $request->title,
                    'description' => $request->description,
                    'category' => $request->category,
                    'grade' => $request->grade,
                    'course_type' => $request->course_type,
                    'price' => $request->price,
                    'original_price' => $request->original_price,
                    'duration' => $request->duration,
                    'lessons_count' => $request->lessons_count,
                    'is_active' => $request->is_active ?? true,
                ];

                if ($request->course_type === 'live') {
                    $courseData['max_seats'] = $request->max_seats;
                    $courseData['start_date'] = $request->start_date;
                    $courseData['end_date'] = $request->end_date;
                    $courseData['sessions_per_week'] = count($request->sessions);
                }

                if ($request->hasFile('thumbnail')) {
                    $file = $request->file('thumbnail');
                    $filename = 'course_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('courses/thumbnails', $filename, 'public');
                    $courseData['thumbnail'] = $path;
                }

                $course = Course::create($courseData);

                if ($request->course_type === 'live') {
                    $this->createLiveSessions($course, $request->sessions, $request->start_date, $request->end_date);
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Course created successfully',
                    'course' => $course
                ], 201);

            } catch (\Exception $e) {
                DB::rollback();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function createLiveSessions($course, $sessions, $startDate, $endDate)
{
    $start = Carbon::parse($startDate);
    $end = Carbon::parse($endDate);

    $dayMapping = [
        'saturday' => Carbon::SATURDAY,
        'sunday' => Carbon::SUNDAY,
        'monday' => Carbon::MONDAY,
        'tuesday' => Carbon::TUESDAY,
        'wednesday' => Carbon::WEDNESDAY,
        'thursday' => Carbon::THURSDAY,
        'friday' => Carbon::FRIDAY,
    ];

    $sessionsCreated = 0;

    foreach ($sessions as $session) {
        $dayOfWeek = $dayMapping[$session['day_of_week']] ?? null;

        if (!$dayOfWeek) {
            continue;
        }

        $currentDate = $start->copy();

        while ($currentDate->dayOfWeek !== $dayOfWeek && $currentDate->lte($end)) {
            $currentDate->addDay();
        }

        while ($currentDate->lte($end)) {
            \App\Models\LiveSession::create([
                'course_id' => $course->id,
                'session_date' => $currentDate->toDateString(),
                'start_time' => $session['start_time'],
                'end_time' => $session['end_time'],
                'status' => 'scheduled',
                'attendees_count' => 0,
            ]);

            $sessionsCreated++;

            $currentDate->addWeek();
        }
    }

    Log::info("Created {$sessionsCreated} live sessions for course {$course->id}");
}

    /**
     * Get teacher profile
     */
    public function getProfile()
    {
        try {
            $user = Auth::user();
            $profile = $user->teacherProfile;

            if (!$profile) {
                // Create default profile if doesn't exist
                $profile = \App\Models\TeacherProfile::create([
                    'user_id' => $user->id,
                    'specialization' => '',
                    'years_of_experience' => 0,
                ]);
            }

            // Parse JSON fields
            $profileData = $profile->toArray();
            if (is_string($profileData['didit_data'] ?? null)) {
                $profileData['didit_data'] = json_decode($profileData['didit_data'], true) ?? [];
            }

            // Add profile picture URL if exists
            if ($profile->profile_picture) {
                $profileData['profile_picture_url'] = url('api/storage/' . $profile->profile_picture);
            }

            return response()->json([
                'success' => true,
                'user' => $user,
                'profile' => $profileData
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching teacher profile: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile'
            ], 500);
        }
    }

    /**
     * Update teacher profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'specialization' => 'nullable|string|max:255',
                'years_of_experience' => 'nullable|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $profile = Auth::user()->teacherProfile;

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Teacher profile not found'
                ], 404);
            }

            $updateData = $request->only([
                'specialization',
                'years_of_experience',
            ]);

            $profile->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'profile' => $profile->fresh()
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating teacher profile: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile'
            ], 500);
        }
    }

    /**
     * Upload teacher CV
     */
    public function uploadCV(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'cv' => 'required|file|mimes:pdf,doc,docx|max:5120'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $profile = Auth::user()->teacherProfile;

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Teacher profile not found'
                ], 404);
            }

            // Delete old CV if exists
            if ($profile->cv_path) {
                \Storage::delete('public/' . $profile->cv_path);
            }

            // Store new CV
            $cv = $request->file('cv');
            $cvPath = $cv->store('teacher_cvs', 'public');

            $profile->update(['cv_path' => $cvPath]);

            return response()->json([
                'success' => true,
                'message' => 'CV uploaded successfully',
                'cv_path' => $cvPath
            ]);
        } catch (\Exception $e) {
            Log::error('Error uploading teacher CV: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload CV'
            ], 500);
        }
    }

    /**
     * Upload profile picture
     */
    public function uploadProfilePicture(Request $request)
    {
        try {
            $user = Auth::user();

            if ($user->user_type !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Teachers only.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $profile = TeacherProfile::where('user_id', $user->id)->first();

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Teacher profile not found'
                ], 404);
            }

            // Delete old profile picture if exists
            if ($profile->profile_picture && Storage::disk('public')->exists($profile->profile_picture)) {
                Storage::disk('public')->delete($profile->profile_picture);
            }

            // Store new profile picture
            $file = $request->file('profile_picture');
            $filename = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profile_pictures/teachers', $filename, 'public');

            $profile->update(['profile_picture' => $path]);

            return response()->json([
                'success' => true,
                'message' => 'Profile picture uploaded successfully',
                'profile_picture_url' => url('api/storage/' . $path)
            ]);
        } catch (\Exception $e) {
            Log::error('Error uploading teacher profile picture: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload profile picture'
            ], 500);
        }
    }

    /**
     * Update course
     */
    public function updateCourse(Request $request, $id)
    {
        try {
            $teacher = Auth::user();

            if ($teacher->user_type !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Teachers only.'
                ], 403);
            }

            $course = Course::find($id);

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }

            // Check if teacher owns this course
            if ($course->teacher_id !== $teacher->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only edit your own courses.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string',
                'grade' => 'required|string',
                'course_type' => 'required|in:recorded,live',
                'price' => 'required|numeric|min:0',
                'duration' => 'required|string',
                'lessons_count' => 'required|integer|min:1',
                'thumbnail' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:5120',

                'max_seats' => 'required_if:course_type,live|nullable|integer|min:1',
                'start_date' => 'required_if:course_type,live|nullable|date',
                'end_date' => 'required_if:course_type,live|nullable|date|after:start_date',
                'sessions' => 'required_if:course_type,live|nullable|array|min:1',
                'sessions.*.day_of_week' => 'required|string',
                'sessions.*.start_time' => 'required|date_format:H:i',
                'sessions.*.end_time' => 'required|date_format:H:i',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            try {
                $courseData = [
                    'title' => $request->title,
                    'description' => $request->description,
                    'category' => $request->category,
                    'grade' => $request->grade,
                    'course_type' => $request->course_type,
                    'price' => $request->price,
                    'original_price' => $request->original_price,
                    'duration' => $request->duration,
                    'lessons_count' => $request->lessons_count,
                    'is_active' => $request->is_active ?? $course->is_active,
                ];

                if ($request->course_type === 'live') {
                    $courseData['max_seats'] = $request->max_seats;
                    $courseData['start_date'] = $request->start_date;
                    $courseData['end_date'] = $request->end_date;
                    $courseData['sessions_per_week'] = count($request->sessions);
                }

                if ($request->hasFile('thumbnail')) {
                    // Delete old thumbnail if exists
                    if ($course->thumbnail) {
                        \Storage::delete('public/' . $course->thumbnail);
                    }

                    $file = $request->file('thumbnail');
                    $filename = 'course_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('courses/thumbnails', $filename, 'public');
                    $courseData['thumbnail'] = $path;
                }

                $course->update($courseData);

                // Update live sessions if course type is live and sessions are provided
                if ($request->course_type === 'live' && $request->has('sessions')) {
                    // Delete existing sessions
                    \App\Models\LiveSession::where('course_id', $course->id)->delete();

                    // Create new sessions
                    $this->createLiveSessions($course, $request->sessions, $request->start_date, $request->end_date);
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Course updated successfully',
                    'course' => $course->fresh()
                ], 200);

            } catch (\Exception $e) {
                DB::rollback();
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Error updating course: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete course
     */
    public function deleteCourse($id)
    {
        try {
            $teacher = Auth::user();

            if ($teacher->user_type !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Teachers only.'
                ], 403);
            }

            $course = Course::find($id);

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }

            // Check if teacher owns this course
            if ($course->teacher_id !== $teacher->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only delete your own courses.'
                ], 403);
            }

            // Check if course has enrollments
            $enrollmentsCount = CourseEnrollment::where('course_id', $course->id)->count();
            if ($enrollmentsCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete course with active enrollments. Please contact support.'
                ], 400);
            }

            // Delete thumbnail if exists
            if ($course->thumbnail) {
                \Storage::delete('public/' . $course->thumbnail);
            }

            // Delete associated live sessions
            \App\Models\LiveSession::where('course_id', $course->id)->delete();

            // Delete the course
            $course->delete();

            return response()->json([
                'success' => true,
                'message' => 'Course deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error deleting course: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting course',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
