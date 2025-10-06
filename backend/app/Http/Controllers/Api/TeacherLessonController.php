<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseLesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TeacherLessonController extends Controller
{
    public function getCourseWithLessons($courseId)
    {
        try {
            $teacher = Auth::user();

            $course = Course::with(['lessons' => function ($query) {
                $query->ordered();
            }])
            ->where('teacher_id', $teacher->id)
            ->where('id', $courseId)
            ->first();

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'course' => $course
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createLesson(Request $request, $courseId)
{
    try {
        $teacher = Auth::user();

        // Verify course ownership
        $course = Course::where('teacher_id', $teacher->id)
            ->where('id', $courseId)
            ->first();

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_url' => 'required_if:video_type,youtube,vimeo,embed|nullable|string',
            'video_type' => 'required|in:youtube,vimeo,upload,embed',
            'video_file' => 'required_if:video_type,upload|nullable|file|mimes:mp4,mov,avi,wmv|max:512000',
            'duration' => 'required|string',
            'is_preview' => 'nullable|boolean',
            'order_index' => 'nullable|integer|min:0',
            'thumbnail' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:5120' // ADD THIS LINE!
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
            $lessonData = [
                'course_id' => $courseId,
                'title' => $request->title,
                'description' => $request->description,
                'video_type' => $request->video_type,
                'duration' => $request->duration,
                'is_preview' => $request->is_preview ?? false,
                'order_index' => $request->order_index ?? CourseLesson::where('course_id', $courseId)->count() + 1
            ];

            // Handle video based on type
            if ($request->video_type === 'upload' && $request->hasFile('video_file')) {
                $file = $request->file('video_file');
                $filename = 'lesson_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('lessons/videos', $filename, 'public');
                $lessonData['video_file_path'] = $path;
            } else {
                $lessonData['video_url'] = $request->video_url;
            }

            // ADD THIS THUMBNAIL HANDLING CODE!
            if ($request->hasFile('thumbnail')) {
                $thumbnailFile = $request->file('thumbnail');
                $thumbnailFilename = 'lesson_thumb_' . time() . '_' . uniqid() . '.' . $thumbnailFile->getClientOriginalExtension();
                $thumbnailPath = $thumbnailFile->storeAs('lessons/thumbnails', $thumbnailFilename, 'public');
                $lessonData['thumbnail'] = $thumbnailPath;
            }

            $lesson = CourseLesson::create($lessonData);

            // Update course lessons count
            $course->update(['lessons_count' => $course->lessons()->count()]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Lesson created successfully',
                'lesson' => $lesson
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error creating lesson',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function updateLesson(Request $request, $lessonId)
    {
        try {
            $teacher = Auth::user();

            $lesson = CourseLesson::whereHas('course', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })->find($lessonId);

            if (!$lesson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lesson not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'video_url' => 'nullable|string',
                'video_type' => 'nullable|in:youtube,vimeo,upload,embed',
                'duration' => 'nullable|string',
                'is_preview' => 'nullable|boolean',
                'order_index' => 'nullable|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $lesson->update($request->only([
                'title', 'description', 'video_url', 'video_type',
                'duration', 'is_preview', 'order_index'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Lesson updated successfully',
                'lesson' => $lesson
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating lesson',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteLesson($lessonId)
    {
        try {
            $teacher = Auth::user();

            $lesson = CourseLesson::whereHas('course', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })->find($lessonId);

            if (!$lesson) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lesson not found'
                ], 404);
            }

            // Delete video file if uploaded
            if ($lesson->video_type === 'upload' && $lesson->video_file_path) {
                Storage::disk('public')->delete($lesson->video_file_path);
            }

            $courseId = $lesson->course_id;
            $lesson->delete();

            // Update course lessons count
            Course::find($courseId)->update([
                'lessons_count' => CourseLesson::where('course_id', $courseId)->count()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Lesson deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting lesson',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function reorderLessons(Request $request, $courseId)
    {
        try {
            $teacher = Auth::user();

            $course = Course::where('teacher_id', $teacher->id)
                ->where('id', $courseId)
                ->first();

            if (!$course) {
                // Continue app/Http/Controllers/Api/TeacherLessonController.php

                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'lessons' => 'required|array',
                'lessons.*.id' => 'required|exists:course_lessons,id',
                'lessons.*.order_index' => 'required|integer|min:0'
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
                foreach ($request->lessons as $lessonData) {
                    CourseLesson::where('id', $lessonData['id'])
                        ->where('course_id', $courseId)
                        ->update(['order_index' => $lessonData['order_index']]);
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Lessons reordered successfully'
                ]);

            } catch (\Exception $e) {
                DB::rollback();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error reordering lessons',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
