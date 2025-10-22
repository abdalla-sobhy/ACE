<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class CompanyJobController extends Controller
{
    /**
     * Get all job postings for the company
     */
    public function getJobPostings(Request $request)
    {
        try {
            $company = Auth::user()->company;

            if (!$company) {
                return response()->json([
                    'success' => false,
                    'message' => 'Company profile not found'
                ], 404);
            }

            $query = $company->jobPostings()->with(['applications']);

            // Filter by status
            if ($request->has('status')) {
                if ($request->status === 'active') {
                    $query->where('is_active', true);
                } elseif ($request->status === 'inactive') {
                    $query->where('is_active', false);
                }
            }

            // Sort
            $sortBy = $request->get('sort', 'created_at');
            $sortOrder = $request->get('order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $jobPostings = $query->get()->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'description' => $job->description,
                    'job_type' => $job->job_type,
                    'work_location' => $job->work_location,
                    'location' => $job->location,
                    'salary_range' => $job->salary_range,
                    'experience_level' => $job->experience_level,
                    'positions_available' => $job->positions_available,
                    'application_deadline' => $job->application_deadline,
                    'is_active' => $job->is_active,
                    'views_count' => $job->views_count,
                    'applications_count' => $job->applications_count,
                    'applications_status' => $job->applications_status_count,
                    'created_at' => $job->created_at,
                    'is_expired' => $job->is_expired,
                ];
            });

            return response()->json([
                'success' => true,
                'job_postings' => $jobPostings,
                'stats' => [
                    'total_jobs' => $company->jobPostings()->count(),
                    'active_jobs' => $company->activeJobPostings()->count(),
                    'total_applications' => $company->total_applications,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching company job postings', [
                'company_id' => Auth::user()->company->id ?? null,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching job postings'
            ], 500);
        }
    }

    /**
     * Create a new job posting
     */
    public function createJobPosting(Request $request)
    {
        try {
            $company = Auth::user()->company;

            if (!$company) {
                return response()->json([
                    'success' => false,
                    'message' => 'Company profile not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'requirements' => 'required|array',
                'responsibilities' => 'required|array',
                'skills_required' => 'required|array',
                'skills_preferred' => 'nullable|array',
                'job_type' => 'required|in:full_time,part_time,internship,contract',
                'work_location' => 'required|in:onsite,remote,hybrid',
                'location' => 'nullable|string',
                'salary_range' => 'nullable|string',
                'experience_level' => 'required|in:entry,junior,mid,senior',
                'education_requirement' => 'nullable|string',
                'faculties_preferred' => 'nullable|array',
                'positions_available' => 'required|integer|min:1',
                'application_deadline' => 'nullable|date|after:today',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $jobPosting = $company->jobPostings()->create($request->all());

            // Notify relevant university students
            $this->notifyRelevantStudents($jobPosting);

            return response()->json([
                'success' => true,
                'message' => 'تم نشر الوظيفة بنجاح',
                'job_posting' => $jobPosting
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating job posting', [
                'company_id' => Auth::user()->company->id ?? null,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error creating job posting'
            ], 500);
        }
    }

    /**
     * Update job posting
     */
    public function updateJobPosting(Request $request, $id)
    {
        try {
            $company = Auth::user()->company;
            $jobPosting = $company->jobPostings()->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'string|max:255',
                'description' => 'string',
                'requirements' => 'array',
                'responsibilities' => 'array',
                'skills_required' => 'array',
                'skills_preferred' => 'array',
                'job_type' => 'in:full_time,part_time,internship,contract',
                'work_location' => 'in:onsite,remote,hybrid',
                'location' => 'nullable|string',
                'salary_range' => 'nullable|string',
                'experience_level' => 'in:entry,junior,mid,senior',
                'education_requirement' => 'nullable|string',
                'faculties_preferred' => 'nullable|array',
                'positions_available' => 'integer|min:1',
                'application_deadline' => 'nullable|date|after:today',
                'is_active' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $jobPosting->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الوظيفة بنجاح',
                'job_posting' => $jobPosting
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating job posting', [
                'job_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error updating job posting'
            ], 500);
        }
    }

    /**
     * Get applications for a specific job
     */
    public function getJobApplications($jobId)
    {
        try {
            $company = Auth::user()->company;
            $jobPosting = $company->jobPostings()->findOrFail($jobId);

            $applications = $jobPosting->applications()
                ->with(['student.universityStudentProfile'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($application) {
                    $student = $application->student;
                    $profile = $student->universityStudentProfile;

                    return [
                        'id' => $application->id,
                        'student' => [
                            'id' => $student->id,
                            'name' => $student->first_name . ' ' . $student->last_name,
                            'email' => $student->email,
                            'phone' => $student->phone,
                            'faculty' => $profile->faculty ?? null,
                            'university' => $profile->university ?? null,
                            'year_of_study' => $profile->year_of_study ?? null,
                            'gpa' => $profile->gpa ?? null,
                            'skills' => $profile->skills ?? [],
                            'cv_available' => !empty($profile->cv_path),
                            'linkedin_url' => $profile->linkedin_url ?? null,
                            'github_url' => $profile->github_url ?? null,
                            'portfolio_url' => $profile->portfolio_url ?? null,
                        ],
                        'cover_letter' => $application->cover_letter,
                        'status' => $application->status,
                        'status_color' => $application->status_color,
                        'viewed_at' => $application->viewed_at,
                        'is_favorite' => $application->is_favorite,
                        'created_at' => $application->created_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'applications' => $applications,
                'job' => [
                    'id' => $jobPosting->id,
                    'title' => $jobPosting->title,
                    'applications_count' => $jobPosting->applications_count,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching job applications', [
                'job_id' => $jobId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching applications'
            ], 500);
        }
    }

    /**
     * Get single application details by ID
     */
    public function getApplicationDetails($applicationId)
    {
        try {
            $application = JobApplication::with([
                'student.universityStudentProfile',
                'jobPosting'
            ])->findOrFail($applicationId);

            // Verify the application belongs to the company
            if ($application->jobPosting->company_id !== Auth::user()->company->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Mark as viewed
            $application->markAsViewed();

            $student = $application->student;
            $profile = $student->universityStudentProfile;
            $jobPosting = $application->jobPosting;

            return response()->json([
                'success' => true,
                'application' => [
                    'id' => $application->id,
                    'cover_letter' => $application->cover_letter,
                    'status' => $application->status,
                    'status_color' => $application->status_color,
                    'status_history' => $application->status_history ?? [],
                    'company_notes' => $application->company_notes,
                    'viewed_at' => $application->viewed_at,
                    'is_favorite' => $application->is_favorite,
                    'interview_date' => $application->interview_date,
                    'interview_location' => $application->interview_location,
                    'interview_notes' => $application->interview_notes,
                    'created_at' => $application->created_at,
                    'updated_at' => $application->updated_at,
                    'student' => [
                        'id' => $student->id,
                        'name' => $student->first_name . ' ' . $student->last_name,
                        'email' => $student->email,
                        'phone' => $student->phone,
                        'faculty' => $profile->faculty ?? null,
                        'university' => $profile->university ?? null,
                        'year_of_study' => $profile->year_of_study ?? null,
                        'gpa' => $profile->gpa ?? null,
                        'bio' => $profile->bio ?? null,
                        'skills' => $profile->skills ?? [],
                        'languages' => $profile->languages ?? [],
                        'experience' => $profile->experience ?? [],
                        'projects' => $profile->projects ?? [],
                        'certifications' => $profile->certifications ?? [],
                        'achievements' => $profile->achievements ?? [],
                        'cv_available' => !empty($profile->cv_path),
                        'linkedin_url' => $profile->linkedin_url ?? null,
                        'github_url' => $profile->github_url ?? null,
                        'portfolio_url' => $profile->portfolio_url ?? null,
                    ],
                    'job' => [
                        'id' => $jobPosting->id,
                        'title' => $jobPosting->title,
                        'description' => $jobPosting->description,
                        'job_type' => $jobPosting->job_type,
                        'work_location' => $jobPosting->work_location,
                        'location' => $jobPosting->location,
                        'salary_range' => $jobPosting->salary_range,
                        'experience_level' => $jobPosting->experience_level,
                    ],
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching application details', [
                'application_id' => $applicationId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching application details'
            ], 500);
        }
    }

    /**
     * Update application status
     */
    public function updateApplicationStatus(Request $request, $applicationId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:pending,reviewing,shortlisted,interviewed,accepted,rejected',
                'notes' => 'nullable|string',
                'interview_date' => 'nullable|date|required_if:status,interviewed',
                'interview_location' => 'nullable|string|required_if:status,interviewed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $application = JobApplication::findOrFail($applicationId);

            // Verify the application belongs to the company
            if ($application->jobPosting->company_id !== Auth::user()->company->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Mark as viewed
            $application->markAsViewed();

            // Update status
            $application->updateStatus($request->status, $request->notes);

            // Update interview details if provided
            if ($request->status === 'interviewed') {
                $application->update([
                    'interview_date' => $request->interview_date,
                    'interview_location' => $request->interview_location,
                    'interview_notes' => $request->interview_notes ?? null,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة الطلب بنجاح',
                'application' => $application
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating application status', [
                'application_id' => $applicationId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error updating application status'
            ], 500);
        }
    }

        /**
     * Toggle favorite status of an application
     */
    public function toggleApplicationFavorite($applicationId)
    {
        try {
            $application = JobApplication::findOrFail($applicationId);

            // Verify the application belongs to the company
            if ($application->jobPosting->company_id !== Auth::user()->company->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $application->update(['is_favorite' => !$application->is_favorite]);

            return response()->json([
                'success' => true,
                'is_favorite' => $application->is_favorite,
                'message' => $application->is_favorite ? 'تم إضافة الطلب للمفضلة' : 'تم إزالة الطلب من المفضلة'
            ]);

        } catch (\Exception $e) {
            Log::error('Error toggling application favorite', [
                'application_id' => $applicationId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error updating favorite status'
            ], 500);
        }
    }

    /**
     * Download student CV
     */
    public function downloadStudentCV($studentId)
    {
        try {
            // Verify the student has applied to one of company's jobs
            $hasApplication = JobApplication::whereHas('jobPosting', function ($query) {
                $query->where('company_id', Auth::user()->company->id);
            })->where('student_id', $studentId)->exists();

            if (!$hasApplication) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $student = User::findOrFail($studentId);
            $profile = $student->universityStudentProfile;

            if (!$profile || !$profile->cv_path) {
                return response()->json([
                    'success' => false,
                    'message' => 'CV not found'
                ], 404);
            }

            // Increment CV downloads
            $profile->incrementCvDownloads();

            $filePath = storage_path('app/public/' . $profile->cv_path);
            $fileName = $profile->cv_filename ?? 'cv_' . $student->first_name . '_' . $student->last_name . '.pdf';

            return response()->download($filePath, $fileName);

        } catch (\Exception $e) {
            Log::error('Error downloading student CV', [
                'student_id' => $studentId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error downloading CV'
            ], 500);
        }
    }

    /**
     * Get company dashboard stats
     */
    public function getDashboardStats()
    {
        try {
            $company = Auth::user()->company;

            $stats = [
                'total_jobs' => $company->jobPostings()->count(),
                'active_jobs' => $company->activeJobPostings()->count(),
                'total_applications' => $company->total_applications,
                'new_applications' => JobApplication::whereHas('jobPosting', function ($query) use ($company) {
                    $query->where('company_id', $company->id);
                })->where('status', 'pending')->count(),
                'shortlisted_candidates' => JobApplication::whereHas('jobPosting', function ($query) use ($company) {
                    $query->where('company_id', $company->id);
                })->where('status', 'shortlisted')->count(),
                'interviews_scheduled' => JobApplication::whereHas('jobPosting', function ($query) use ($company) {
                    $query->where('company_id', $company->id);
                })->where('status', 'interviewed')
                ->where('interview_date', '>=', now())
                ->count(),
            ];

            // Recent applications
            $recentApplications = JobApplication::whereHas('jobPosting', function ($query) use ($company) {
                $query->where('company_id', $company->id);
            })
            ->with(['student', 'jobPosting'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($application) {
                return [
                    'id' => $application->id,
                    'student_name' => $application->student->first_name . ' ' . $application->student->last_name,
                    'job_title' => $application->jobPosting->title,
                    'status' => $application->status,
                    'created_at' => $application->created_at,
                ];
            });

            return response()->json([
                'success' => true,
                'stats' => $stats,
                'recent_applications' => $recentApplications,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching dashboard stats', [
                'company_id' => Auth::user()->company->id ?? null,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching stats'
            ], 500);
        }
    }

    /**
     * Notify relevant students about new job posting
     */
    private function notifyRelevantStudents($jobPosting)
    {
        // This would be better as a queued job
        $query = \App\Models\UniversityStudentProfile::where('is_public', true)
            ->where('looking_for_opportunities', true);

        // Match by skills
        if (!empty($jobPosting->skills_required)) {
            $query->where(function ($q) use ($jobPosting) {
                foreach ($jobPosting->skills_required as $skill) {
                    $q->orWhereJsonContains('skills', $skill);
                }
            });
        }

        // Match by faculties
        if (!empty($jobPosting->faculties_preferred)) {
            $query->whereIn('faculty', $jobPosting->faculties_preferred);
        }

        $students = $query->with('user')->limit(100)->get();

        foreach ($students as $profile) {
            try {
                $profile->user->notify(new \App\Notifications\NewJobPosted($jobPosting));
            } catch (\Exception $e) {
                Log::error('Failed to notify student', ['student_id' => $profile->user_id]);
            }
        }
    }
}
