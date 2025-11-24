<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user();

            $studentGrade = $user->studentProfile->grade ?? null;

            if (!$studentGrade) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student grade not found'
                ], 400);
            }

            $query = Course::with(['teacher:id,first_name,last_name,email', 'sessions'])
                ->where('is_active', true)
                ->where('grade', $studentGrade);

            if ($request->has('course_type') && in_array($request->course_type, ['live', 'recorded'])) {
                $query->where('course_type', $request->course_type);
            }

            if ($request->has('teacher_name') && !empty($request->teacher_name)) {
                $searchTerms = explode(' ', trim($request->teacher_name));

                $query->whereHas('teacher', function ($q) use ($searchTerms) {
                    $q->where(function ($query) use ($searchTerms) {
                        foreach ($searchTerms as $term) {
                            $query->orWhere('first_name', 'LIKE', "%{$term}%")
                                    ->orWhere('last_name', 'LIKE', "%{$term}%");
                        }
                    });
                });
            }

            if ($request->has('available_only') && $request->available_only) {
                $query->available();
            }

            $courses = $query->get()->map(function ($course) use ($user) {
                $courseData = [
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'teacher_id' => $course->teacher_id,
                    'teacher_name' => $course->teacher->first_name . ' ' . $course->teacher->last_name,
                    'teacher_email' => $course->teacher->email,
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
                    'is_enrolled' => $course->students->contains($user->id)
                ];

                if ($course->course_type === 'live') {
                    $courseData['max_seats'] = $course->max_seats;
                    $courseData['enrolled_seats'] = $course->enrolled_seats;
                    $courseData['seats_left'] = $course->seats_left;
                    $courseData['is_full'] = $course->is_full;
                    $courseData['start_date'] = $course->start_date ? $course->start_date->format('Y-m-d') : null;
                    $courseData['end_date'] = $course->end_date ? $course->end_date->format('Y-m-d') : null;
                    $courseData['sessions_per_week'] = $course->sessions_per_week;
                    $courseData['schedule'] = $course->schedule_summary;
                }

                return $courseData;
            });

            return response()->json([
                'success' => true,
                'courses' => $courses,
                'total' => $courses->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
