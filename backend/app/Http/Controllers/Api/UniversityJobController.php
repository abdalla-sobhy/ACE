<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UniversityJobController extends Controller
{
    /**
     * Get all available job postings for university students
     */
    public function getJobPostings(Request $request)
    {
        try {
            $user = Auth::user();
            $profile = $user->universityStudentProfile;

            $query = JobPosting::with(['company'])
                ->active();

            // Filter by job type
            if ($request->has('job_type') && $request->job_type !== 'all') {
                $query->where('job_type', $request->job_type);
            }

            // Filter by work location
            if ($request->has('work_location') && $request->work_location !== 'all') {
                $query->where('work_location', $request->work_location);
            }

            // Filter by experience level
            if ($request->has('experience_level') && $request->experience_level !== 'all') {
                $query->where('experience_level', $request->experience_level);
            }

            // Search
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                    ->orWhereHas('company', function ($companyQuery) use ($searchTerm) {
                        $companyQuery->where('company_name', 'LIKE', "%{$searchTerm}%");
                    });
                });
            }

            // Match student skills
            if ($request->get('match_skills') && $profile && $profile->skills) {
                $skills = json_decode($profile->skills, true) ?? [];
                if (!empty($skills)) {
                    $query->matchingSkills($skills);
                }
            }

            // Sort
            $sortBy = $request->get('sort', 'created_at');
            if ($sortBy === 'relevance' && $profile && $profile->skills) {
                // Complex relevance sorting would go here
                $query->orderBy('created_at', 'desc');
            } else {
                $query->orderBy($sortBy, 'desc');
            }

            $jobPostings = $query->paginate(12);

            // Transform the data
            $jobPostings->getCollection()->transform(function ($job) use ($user) {
                // Check if user has applied
                $hasApplied = $job->applications()->where('student_id', $user->id)->exists();
                $application = $hasApplied ? $job->applications()->where('student_id', $user->id)->first() : null;

                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => [
                        'id' => $job->company->id,
                        'name' => $job->company->company_name,
                        'logo' => $job->company->logo_url,
                        'industry' => $job->company->industry,
                        'location' => $job->company->location,
                        'is_verified' => $job->company->is_verified,
                    ],
                    'description' => $job->description,
                    'requirements' => $job->requirements,
                    'responsibilities' => $job->responsibilities,
                    'skills_required' => $job->skills_required,
                    'skills_preferred' => $job->skills_preferred,
                    'job_type' => $job->job_type,
                    'work_location' => $job->work_location,
                    'location' => $job->location,
                    'salary_range' => $job->salary_range,
                    'experience_level' => $job->experience_level,
                    'education_requirement' => $job->education_requirement,
                    'positions_available' => $job->positions_available,
                    'application_deadline' => $job->application_deadline,
                    'created_at' => $job->created_at,
                    'has_applied' => $hasApplied,
                    'application_status' => $application ? $application->status : null,
                    'is_expired' => $job->is_expired,
                ];
            });

            return response()->json([
                'success' => true,
                'jobs' => $jobPostings,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching job postings', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching job postings'
            ], 500);
        }
    }

    /**
     * Get single job posting details
     */
    public function getJobPosting($id)
    {
        try {
            $user = Auth::user();
            $job = JobPosting::with(['company'])->findOrFail($id);

            // Increment views
            $job->incrementViews();

            // Check if user has applied
            $application = $job->applications()->where('student_id', $user->id)->first();

            return response()->json([
                'success' => true,
                'job' => [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => [
                        'id' => $job->company->id,
                        'name' => $job->company->company_name,
                        'logo' => $job->company->logo_url,
                        'industry' => $job->company->industry,
                        'location' => $job->company->location,
                        'website' => $job->company->website,
                        'description' => $job->company->description,
                        'company_size' => $job->company->company_size,
                        'is_verified' => $job->company->is_verified,
                    ],
                    'description' => $job->description,
                    'requirements' => $job->requirements,
                    'responsibilities' => $job->responsibilities,
                    'skills_required' => $job->skills_required,
                    'skills_preferred' => $job->skills_preferred,
                    'job_type' => $job->job_type,
                    'work_location' => $job->work_location,
                    'location' => $job->location,
                    'salary_range' => $job->salary_range,
                    'experience_level' => $job->experience_level,
                    'education_requirement' => $job->education_requirement,
                    'faculties_preferred' => $job->faculties_preferred,
                    'positions_available' => $job->positions_available,
                    'application_deadline' => $job->application_deadline,
                    'created_at' => $job->created_at,
                    'views_count' => $job->views_count,
                    'applications_count' => $job->applications_count,
                    'has_applied' => !is_null($application),
                    'application' => $application ? [
                        'id' => $application->id,
                        'status' => $application->status,
                        'created_at' => $application->created_at,
                    ] : null,
                    'is_expired' => $job->is_expired,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching job posting', [
                'job_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching job posting'
            ], 500);
        }
    }

    /**
     * Apply for a job
     */
    public function applyForJob(Request $request, $jobId)
    {
        try {
            $user = Auth::user();
            $profile = $user->universityStudentProfile;

            // Check if profile is complete enough
            if (!$profile || !$profile->cv_path) {
                return response()->json([
                    'success' => false,
                    'message' => 'يجب إكمال ملفك الشخصي ورفع السيرة الذاتية قبل التقديم',
                                    ], 400);
            }

            $job = JobPosting::findOrFail($jobId);

            // Check if job is still active
            if (!$job->is_active || $job->is_expired) {
                return response()->json([
                    'success' => false,
                    'message' => 'هذه الوظيفة لم تعد متاحة'
                ], 400);
            }

            // Check if already applied
            $existingApplication = JobApplication::where('job_posting_id', $jobId)
                ->where('student_id', $user->id)
                ->first();

            if ($existingApplication) {
                return response()->json([
                    'success' => false,
                    'message' => 'لقد تقدمت بالفعل لهذه الوظيفة'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'cover_letter' => 'required|string|min:50',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'يجب كتابة خطاب تقديم لا يقل عن 50 حرف',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Create application
            $application = JobApplication::create([
                'job_posting_id' => $jobId,
                'student_id' => $user->id,
                'cover_letter' => $request->cover_letter,
                'status' => JobApplication::STATUS_PENDING,
                'status_history' => [[
                    'status' => JobApplication::STATUS_PENDING,
                    'changed_at' => now()->toDateTimeString(),
                ]],
            ]);

            // Increment applications count
            $job->increment('applications_count');

            // Notify company
            $job->company->user->notify(new \App\Notifications\NewJobApplication($application));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'تم إرسال طلبك بنجاح',
                'application' => [
                    'id' => $application->id,
                    'status' => $application->status,
                    'created_at' => $application->created_at,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error applying for job', [
                'job_id' => $jobId,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال طلبك'
            ], 500);
        }
    }

    /**
     * Get user's job applications
     */
    public function getMyApplications(Request $request)
    {
        try {
            $user = Auth::user();

            $query = JobApplication::where('student_id', $user->id)
                ->with(['jobPosting.company']);

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Sort
            $sortBy = $request->get('sort', 'created_at');
            $sortOrder = $request->get('order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $applications = $query->paginate(10);

            // Transform the data
            $applications->getCollection()->transform(function ($application) {
                return [
                    'id' => $application->id,
                    'job' => [
                        'id' => $application->jobPosting->id,
                        'title' => $application->jobPosting->title,
                        'company_name' => $application->jobPosting->company->company_name,
                        'company_logo' => $application->jobPosting->company->logo_url,
                        'job_type' => $application->jobPosting->job_type,
                        'work_location' => $application->jobPosting->work_location,
                        'location' => $application->jobPosting->location,
                    ],
                    'status' => $application->status,
                    'status_label' => JobApplication::$statuses[$application->status],
                    'status_color' => $application->status_color,
                    'cover_letter' => $application->cover_letter,
                    'viewed_at' => $application->viewed_at,
                    'interview_date' => $application->interview_date,
                    'interview_location' => $application->interview_location,
                    'created_at' => $application->created_at,
                    'updated_at' => $application->updated_at,
                    'status_history' => $application->status_history,
                ];
            });

            return response()->json([
                'success' => true,
                'applications' => $applications,
                'stats' => [
                    'total' => $user->jobApplications()->count(),
                    'pending' => $user->jobApplications()->where('status', 'pending')->count(),
                    'shortlisted' => $user->jobApplications()->where('status', 'shortlisted')->count(),
                    'interviewed' => $user->jobApplications()->where('status', 'interviewed')->count(),
                    'accepted' => $user->jobApplications()->where('status', 'accepted')->count(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching user applications', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching applications'
            ], 500);
        }
    }

    /**
     * Withdraw job application
     */
    public function withdrawApplication($applicationId)
    {
        try {
            $user = Auth::user();
            $application = JobApplication::where('student_id', $user->id)
                ->where('id', $applicationId)
                ->firstOrFail();

            // Check if can withdraw (only pending/reviewing applications)
            if (!in_array($application->status, ['pending', 'reviewing'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يمكن سحب الطلب في هذه المرحلة'
                ], 400);
            }

            // Update status
            $application->updateStatus('withdrawn', 'تم سحب الطلب بواسطة المتقدم');

            // Decrement applications count
            $application->jobPosting->decrement('applications_count');

            return response()->json([
                'success' => true,
                'message' => 'تم سحب طلبك بنجاح'
            ]);

        } catch (\Exception $e) {
            Log::error('Error withdrawing application', [
                'application_id' => $applicationId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error withdrawing application'
            ], 500);
        }
    }
}
