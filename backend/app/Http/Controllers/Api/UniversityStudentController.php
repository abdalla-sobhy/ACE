<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\UniversityStudentProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class UniversityStudentController extends Controller
{
    /**
     * Get all courses available for university students (no grade restriction)
     */
    public function getCourses(Request $request)
    {
        try {
            $user = Auth::user();

            // Verify user is a university student
            if ($user->user_type !== 'university_student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. University students only.'
                ], 403);
            }

            // Get user's profile to access their goal
            $profile = UniversityStudentProfile::where('user_id', $user->id)->first();
            $userGoal = $profile ? $profile->goal : null;

            // Map goals to relevant course categories
            $goalCategoryMap = [
                'career_preparation' => ['programming', 'business', 'marketing', 'soft_skills', 'languages'],
                'skill_development' => ['programming', 'design', 'data', 'marketing', 'soft_skills'],
                'academic_excellence' => ['programming', 'data', 'languages'],
                'research' => ['data', 'programming', 'soft_skills'],
                'entrepreneurship' => ['business', 'marketing', 'soft_skills', 'programming'],
                'graduate_studies' => ['programming', 'data', 'languages', 'soft_skills'],
            ];

            $relevantCategories = $userGoal && isset($goalCategoryMap[$userGoal])
                ? $goalCategoryMap[$userGoal]
                : [];

            $query = Course::with(['teacher:id,first_name,last_name,email'])
                ->where('is_active', true)
                // Exclude school phase courses (prep and secondary)
                ->where(function ($q) {
                    $q->whereNull('grade')
                      ->orWhereNotIn('grade', [
                          'prep_1', 'prep_2', 'prep_3',
                          'secondary_1', 'secondary_2', 'secondary_3',
                          'primary_1', 'primary_2', 'primary_3', 'primary_4', 'primary_5', 'primary_6'
                      ]);
                });

            // Filter by category if provided
            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            // Search by title, description, or teacher name
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                      ->orWhereHas('teacher', function ($teacherQuery) use ($searchTerm) {
                        $teacherQuery->where('first_name', 'LIKE', "%{$searchTerm}%")
                                    ->orWhere('last_name', 'LIKE', "%{$searchTerm}%");
                    });
                });
            }

            // Sort by user's goal relevance, then rating and popularity
            if (!empty($relevantCategories)) {
                $categoriesList = implode('","', $relevantCategories);
                $query->orderByRaw('CASE
                    WHEN category IN ("' . $categoriesList . '") THEN 0
                    WHEN category IN ("programming", "business", "marketing", "data", "design", "soft_skills", "languages") THEN 1
                    ELSE 2
                END');
            } else {
                $query->orderByRaw('CASE
                    WHEN category IN ("programming", "business", "marketing", "data", "design", "soft_skills", "languages") THEN 0
                    ELSE 1
                END');
            }

            $query->orderBy('rating', 'desc')
                  ->orderBy('students_count', 'desc');

            // Pagination
            $perPage = $request->get('per_page', 12);
            $page = $request->get('page', 1);

            $paginatedCourses = $query->paginate($perPage, ['*'], 'page', $page);

            $courses = $paginatedCourses->map(function ($course) use ($user) {
                $courseData = [
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'teacher_id' => $course->teacher_id,
                    'teacher_name' => $course->teacher ? $course->teacher->first_name . ' ' . $course->teacher->last_name : 'Unknown',
                    'teacher_email' => $course->teacher ? $course->teacher->email : null,
                    'price' => (float) $course->price,
                    'original_price' => $course->original_price ? (float) $course->original_price : null,
                    'duration' => $course->duration,
                    'lessons_count' => $course->lessons_count,
                    'students_count' => $course->students_count,
                    'rating' => (float) $course->rating,
                    'thumbnail' => $course->thumbnail ? asset('storage/' . $course->thumbnail) : null,
                    'category' => $course->category,
                    'course_type' => $course->course_type,
                    'is_enrolled' => $course->students->contains($user->id)
                ];

                return $courseData;
            });

            return response()->json([
                'success' => true,
                'courses' => $courses,
                'total' => $paginatedCourses->total(),
                'current_page' => $paginatedCourses->currentPage(),
                'last_page' => $paginatedCourses->lastPage(),
                'per_page' => $paginatedCourses->perPage(),
                'from' => $paginatedCourses->firstItem(),
                'to' => $paginatedCourses->lastItem(),
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching courses for university student', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching courses',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Get university student profile
     */
    public function getProfile()
    {
        try {
            $user = Auth::user();

            if ($user->user_type !== 'university_student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. University students only.'
                ], 403);
            }

            $profile = UniversityStudentProfile::where('user_id', $user->id)->first();

            if (!$profile) {
                // Create default profile if doesn't exist
                $profile = UniversityStudentProfile::create([
                    'user_id' => $user->id,
                    'faculty' => '',
                    'goal' => '',
                ]);
            }

            // Parse JSON fields
            $profileData = $profile->toArray();
            $profileData['skills'] = json_decode($profile->skills, true) ?? [];
            $profileData['achievements'] = json_decode($profile->achievements, true) ?? [];
            $profileData['languages'] = json_decode($profile->languages, true) ?? [];
            $profileData['experience'] = json_decode($profile->experience, true) ?? [];
            $profileData['projects'] = json_decode($profile->projects, true) ?? [];
            $profileData['certifications'] = json_decode($profile->certifications, true) ?? [];
            $profileData['preferred_job_types'] = json_decode($profile->preferred_job_types, true) ?? [];

            // Add CV download URL if exists
            if ($profile->cv_path) {
                $profileData['cv_download_url'] = route('api.university.download-cv');
            }

            return response()->json([
                'success' => true,
                'profile' => $profileData,
                'user' => [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching university profile', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching profile',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Update university student profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = Auth::user();

            if ($user->user_type !== 'university_student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. University students only.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'faculty' => 'nullable|string|max:255',
                'goal' => 'nullable|string',
                'university' => 'nullable|string|max:255',
                'year_of_study' => 'nullable|integer|min:1|max:7',
                'gpa' => 'nullable|numeric|min:0|max:4',
                'bio' => 'nullable|string',
                'skills' => 'nullable|array',
                'linkedin_url' => 'nullable|url',
                'github_url' => 'nullable|url',
                'portfolio_url' => 'nullable|url',
                'achievements' => 'nullable|array',
                'languages' => 'nullable|array',
                'experience' => 'nullable|array',
                'projects' => 'nullable|array',
                'certifications' => 'nullable|array',
                'is_public' => 'nullable|boolean',
                'looking_for_opportunities' => 'nullable|boolean',
                'preferred_job_types' => 'nullable|array',
                'available_from' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $profile = UniversityStudentProfile::firstOrNew(['user_id' => $user->id]);

            // If it's a new profile, set default values
            if (!$profile->exists) {
                $profile->faculty = '';
                $profile->goal = '';
                $profile->save();
            }

            // Update profile data - only include fields that are present in the request
            $updateData = [];
            $fields = [
                'faculty', 'goal', 'university', 'year_of_study', 'gpa',
                'bio', 'linkedin_url', 'github_url', 'portfolio_url',
                'is_public', 'looking_for_opportunities', 'available_from'
            ];

            foreach ($fields as $field) {
                if ($request->has($field)) {
                    $updateData[$field] = $request->input($field);
                }
            }

            // Handle JSON fields - use input() method instead of property access
            if ($request->has('skills')) {
                $updateData['skills'] = json_encode($request->input('skills'));
            }
            if ($request->has('achievements')) {
                $updateData['achievements'] = json_encode($request->input('achievements'));
            }
            if ($request->has('languages')) {
                $updateData['languages'] = json_encode($request->input('languages'));
            }
            if ($request->has('experience')) {
                $updateData['experience'] = json_encode($request->input('experience'));
            }
            if ($request->has('projects')) {
                $updateData['projects'] = json_encode($request->input('projects'));
            }
            if ($request->has('certifications')) {
                $updateData['certifications'] = json_encode($request->input('certifications'));
            }
            if ($request->has('preferred_job_types')) {
                $updateData['preferred_job_types'] = json_encode($request->input('preferred_job_types'));
            }

            $profile->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'profile' => $profile
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating university profile', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error updating profile',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
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

            if ($user->user_type !== 'university_student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. University students only.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $profile = UniversityStudentProfile::where('user_id', $user->id)->first();

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile not found. Please create profile first.'
                ], 404);
            }

            // Delete old profile picture if exists
            if ($profile->profile_picture && Storage::disk('public')->exists($profile->profile_picture)) {
                Storage::disk('public')->delete($profile->profile_picture);
            }

            // Upload new profile picture
            $file = $request->file('profile_picture');
            $filename = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profile_pictures/university_students', $filename, 'public');

            // Update profile with picture path
            $profile->update([
                'profile_picture' => $path
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile picture uploaded successfully',
                'profile_picture_url' => asset('storage/' . $path)
            ]);

        } catch (\Exception $e) {
            Log::error('Profile picture upload failed', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error uploading profile picture',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Upload CV
     */
    public function uploadCV(Request $request)
    {
        try {
            $user = Auth::user();

            if ($user->user_type !== 'university_student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. University students only.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'cv' => 'required|file|mimes:pdf,doc,docx|max:5120', // Max 5MB
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $profile = UniversityStudentProfile::where('user_id', $user->id)->first();

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile not found. Please create profile first.'
                ], 404);
            }

            // Delete old CV if exists
            if ($profile->cv_path && Storage::disk('public')->exists($profile->cv_path)) {
                Storage::disk('public')->delete($profile->cv_path);
            }

            // Upload new CV
            $file = $request->file('cv');
            $filename = 'cv_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('university_cvs', $filename, 'public');

            // Update profile with CV path
            $profile->update([
                'cv_path' => $path,
                'cv_filename' => $file->getClientOriginalName()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'CV uploaded successfully',
                'cv_path' => $path,
                'cv_filename' => $file->getClientOriginalName()
            ]);

        } catch (\Exception $e) {
            Log::error('Error uploading CV', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error uploading CV',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Download CV
     */
    public function downloadCV()
    {
        try {
            $user = Auth::user();

            if ($user->user_type !== 'university_student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized.'
                ], 403);
            }

            $profile = UniversityStudentProfile::where('user_id', $user->id)->first();

            if (!$profile || !$profile->cv_path) {
                return response()->json([
                    'success' => false,
                    'message' => 'No CV found'
                ], 404);
            }

            if (!Storage::disk('public')->exists($profile->cv_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'CV file not found'
                ], 404);
            }

            $filePath = Storage::disk('public')->path($profile->cv_path);
            $fileName = $profile->cv_filename ?? 'cv.pdf';

            return response()->download($filePath, $fileName);

        } catch (\Exception $e) {
            Log::error('Error downloading CV', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error downloading CV',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Get profile statistics
     */
    public function getProfileStats()
    {
        try {
            $user = Auth::user();

            if ($user->user_type !== 'university_student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized.'
                ], 403);
            }

            // Get enrolled courses count
            $enrolledCourses = CourseEnrollment::where('student_id', $user->id)
                ->where('status', 'active')
                ->count();

            // Get completed courses count
            $completedCourses = CourseEnrollment::where('student_id', $user->id)
                ->where('status', 'active')
                ->whereNotNull('completed_at')
                ->count();

            // Get certificates earned (courses with 100% completion)
            $certificatesEarned = CourseEnrollment::where('student_id', $user->id)
                ->where('progress', 100)
                ->count();

            // Get profile
            $profile = UniversityStudentProfile::where('user_id', $user->id)->first();

            // Profile views and CV downloads from profile if it exists
            $profileViews = $profile ? $profile->profile_views : 0;
            $cvDownloads = $profile ? $profile->cv_downloads : 0;

            return response()->json([
                'success' => true,
                'stats' => [
                    'profile_views' => $profileViews,
                    'cv_downloads' => $cvDownloads,
                    'courses_enrolled' => $enrolledCourses,
                    'courses_completed' => $completedCourses,
                    'certificates_earned' => $certificatesEarned,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching profile stats', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching statistics',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Get public profiles for companies/recruiters
     */
    public function getPublicProfiles(Request $request)
    {
        try {
            $query = UniversityStudentProfile::with('user:id,first_name,last_name')
                ->where('is_public', true);

            // Filter by looking for opportunities
            if ($request->has('looking_for_opportunities')) {
                $query->where('looking_for_opportunities', true);
            }

            // Filter by skills
            if ($request->has('skills')) {
                $skills = is_array($request->skills) ? $request->skills : [$request->skills];
                foreach ($skills as $skill) {
                    $query->where('skills', 'LIKE', "%{$skill}%");
                }
            }

            // Filter by faculty
            if ($request->has('faculty')) {
                $query->where('faculty', 'LIKE', "%{$request->faculty}%");
            }

            // Filter by university
            if ($request->has('university')) {
                $query->where('university', 'LIKE', "%{$request->university}%");
            }

            // Sort by GPA if requested
            if ($request->has('sort') && $request->sort === 'gpa') {
                $query->orderBy('gpa', 'desc');
            }

            $profiles = $query->paginate(20);

            // Format profiles for response
            $profiles->getCollection()->transform(function ($profile) {
                return [
                    'id' => $profile->id,
                    'name' => $profile->user->first_name . ' ' . $profile->user->last_name,
                    'faculty' => $profile->faculty,
                    'university' => $profile->university,
                    'year_of_study' => $profile->year_of_study,
                    'gpa' => $profile->gpa,
                    'bio' => $profile->bio,
                    'skills' => json_decode($profile->skills, true) ?? [],
                    'looking_for_opportunities' => $profile->looking_for_opportunities,
                    'available_from' => $profile->available_from,
                    'has_cv' => !empty($profile->cv_path),
                    'linkedin_url' => $profile->linkedin_url,
                    'github_url' => $profile->github_url,
                    'portfolio_url' => $profile->portfolio_url,
                ];
            });

            return response()->json([
                'success' => true,
                'profiles' => $profiles
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching public profiles', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching profiles',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }
}
