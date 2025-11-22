<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Models\JobApplication;
use App\Services\JSearchService;
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
            $jobSource = $request->get('job_source', 'both'); // platform, external, both

            $platformJobs = [];
            $externalJobs = [];
            $totalPages = 1;
            $currentPage = $request->get('page', 1);

            // Fetch platform jobs if needed
            if (in_array($jobSource, ['platform', 'both'])) {
                $platformJobsData = $this->getPlatformJobs($request, $user, $profile);
                $platformJobs = $platformJobsData['jobs'];
                $totalPages = $platformJobsData['total_pages'];
            }

            // Fetch external jobs if needed
            if (in_array($jobSource, ['external', 'both'])) {
                $externalJobsData = $this->getExternalJobs($request);
                $externalJobs = $externalJobsData['jobs'];
            }

            // Combine jobs
            $allJobs = array_merge($platformJobs, $externalJobs);

            // Manual pagination for combined results
            if ($jobSource === 'both') {
                $perPage = 12;
                $total = count($allJobs);
                $totalPages = ceil($total / $perPage);
                $offset = ($currentPage - 1) * $perPage;
                $allJobs = array_slice($allJobs, $offset, $perPage);
            }

            // Create pagination-like response
            $response = [
                'success' => true,
                'jobs' => [
                    'data' => $allJobs,
                    'current_page' => (int) $currentPage,
                    'last_page' => $totalPages,
                    'per_page' => 12,
                    'total' => count($allJobs),
                ],
            ];

            // Add warning if external jobs were requested but API key not configured
            if (in_array($jobSource, ['external', 'both']) && isset($externalJobsData['error'])) {
                $response['warning'] = 'External job listings are currently unavailable. Please configure JSEARCH_API_KEY.';
            }

            return response()->json($response);

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
     * Get platform jobs
     */
    private function getPlatformJobs(Request $request, $user, $profile)
    {
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
            $query->orderBy('created_at', 'desc');
        } else {
            $query->orderBy($sortBy, 'desc');
        }

        $jobPostings = $query->paginate(12);

        // Transform the data
        $jobs = $jobPostings->getCollection()->map(function ($job) use ($user) {
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
                'source' => 'platform',
            ];
        })->toArray();

        return [
            'jobs' => $jobs,
            'total_pages' => $jobPostings->lastPage(),
        ];
    }

    /**
     * Get external jobs from JSearch API
     */
    private function getExternalJobs(Request $request)
    {
        // Check if JSearch API key is configured
        if (empty(config('services.jsearch.api_key'))) {
            Log::warning('JSearch API requested but API key not configured', [
                'user_id' => Auth::id(),
                'params' => $request->all(),
            ]);

            return [
                'jobs' => [],
                'total' => 0,
                'error' => 'External job source not configured',
            ];
        }

        $jSearchService = new JSearchService();

        // Handle empty search parameter - use default if empty
        $searchTerm = $request->get('search');
        if (empty($searchTerm)) {
            $searchTerm = 'developer OR engineer OR intern';
        }

        // Build parameters for JSearch
        $params = [
            'search' => $searchTerm,
            'page' => $request->get('page', 1),
            'location' => config('services.jsearch.default_location', 'United States'), // Default location
        ];

        // Map work location filter
        if ($request->has('work_location') && $request->work_location === 'remote') {
            $params['remote_only'] = true;
        }

        // Map job type filter
        if ($request->has('job_type') && $request->job_type !== 'all') {
            $typeMap = [
                'full_time' => 'FULLTIME',
                'part_time' => 'PARTTIME',
                'contract' => 'CONTRACTOR',
                'internship' => 'INTERN',
            ];
            $params['employment_types'] = $typeMap[$request->job_type] ?? null;
        }

        Log::info('Fetching external jobs from JSearch', [
            'params' => $params,
            'user_id' => Auth::id(),
        ]);

        $result = $jSearchService->searchJobs($params);

        Log::info('JSearch results', [
            'jobs_count' => count($result['jobs']),
            'total' => $result['total'],
        ]);

        return [
            'jobs' => $result['jobs'],
            'total' => $result['total'],
        ];
    }

    /**
     * Get single job posting details
     */
    public function getJobPosting($id)
    {
        try {
            $user = Auth::user();

            // Check if this is an external job (starts with 'ext_')
            if (str_starts_with($id, 'ext_')) {
                return $this->getExternalJobDetails($id);
            }

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
                    'source' => 'platform',
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
     * Get external job details
     */
    private function getExternalJobDetails($id)
    {
        try {
            // Remove 'ext_' prefix to get actual job ID
            $actualJobId = substr($id, 4);

            $jSearchService = new JSearchService();
            $job = $jSearchService->getJobDetails($actualJobId);

            if (!$job) {
                return response()->json([
                    'success' => false,
                    'message' => 'Job not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'job' => $job,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching external job details', [
                'job_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching job details'
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
                ->whereHas('jobPosting', function ($q) {
                    $q->whereHas('company');
                })
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

            // Transform the data and filter out applications with deleted job postings
            $applications->getCollection()->transform(function ($application) {
                // Skip applications where job posting has been deleted
                if (!$application->jobPosting || !$application->jobPosting->company) {
                    return null;
                }

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
                    'status_label' => JobApplication::$statuses[$application->status] ?? $application->status,
                    'status_color' => $application->status_color,
                    'cover_letter' => $application->cover_letter,
                    'viewed_at' => $application->viewed_at,
                    'interview_date' => $application->interview_date,
                    'interview_location' => $application->interview_location,
                    'created_at' => $application->created_at,
                    'updated_at' => $application->updated_at,
                    'status_history' => $application->status_history,
                ];
            })->filter();

            return response()->json([
                'success' => true,
                'applications' => $applications,
                'stats' => [
                    'total' => $user->jobApplications()
                        ->whereHas('jobPosting', function ($q) {
                            $q->whereHas('company');
                        })
                        ->count(),
                    'pending' => $user->jobApplications()
                        ->whereHas('jobPosting', function ($q) {
                            $q->whereHas('company');
                        })
                        ->where('status', 'pending')->count(),
                    'shortlisted' => $user->jobApplications()
                        ->whereHas('jobPosting', function ($q) {
                            $q->whereHas('company');
                        })
                        ->where('status', 'shortlisted')->count(),
                    'interviewed' => $user->jobApplications()
                        ->whereHas('jobPosting', function ($q) {
                            $q->whereHas('company');
                        })
                        ->where('status', 'interviewed')->count(),
                    'accepted' => $user->jobApplications()
                        ->whereHas('jobPosting', function ($q) {
                            $q->whereHas('company');
                        })
                        ->where('status', 'accepted')->count(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching user applications', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
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

            // Decrement applications count (check if job posting still exists)
            if ($application->jobPosting) {
                $application->jobPosting->decrement('applications_count');
            }

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

    /**
     * Test JSearch API integration
     * GET /api/university/test-jsearch
     */
    public function testJSearch(Request $request)
    {
        try {
            $jSearchService = new JSearchService();

            // Test with a simple search
            $params = [
                'search' => $request->get('search', 'developer'),
                'location' => $request->get('location', 'Egypt'),
                'page' => 1,
            ];

            Log::info('Testing JSearch API', $params);

            $result = $jSearchService->searchJobs($params);

            return response()->json([
                'success' => true,
                'message' => 'JSearch API test completed',
                'config' => [
                    'api_key_configured' => !empty(config('services.jsearch.api_key')),
                    'api_key_preview' => substr(config('services.jsearch.api_key'), 0, 10) . '...',
                ],
                'params' => $params,
                'result' => [
                    'jobs_count' => count($result['jobs']),
                    'total' => $result['total'],
                    'sample_job' => $result['jobs'][0] ?? null,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }
}
