<?php

namespace App\Services;

use App\Models\User;
use App\Models\Course;
use App\Models\Company;
use App\Models\Enrollment;
use App\Models\JobPosting;
use App\Models\JobApplication;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminService
{
    /**
     * Get platform-wide statistics for admin dashboard
     */
    public function getDashboardStats()
    {
        return [
            'users' => [
                'total' => User::count(),
                'students' => User::where('user_type', 'student')->count(),
                'university_students' => User::where('user_type', 'university_student')->count(),
                'teachers' => User::where('user_type', 'teacher')->count(),
                'parents' => User::where('user_type', 'parent')->count(),
                'companies' => User::where('user_type', 'company')->count(),
                'admins' => User::where('user_type', 'admin')->count(),
                'pending_approval' => User::where('is_approved', false)->count(),
                'suspended' => User::where('status', 'suspended')->count(),
            ],
            'teachers' => [
                'total' => User::where('user_type', 'teacher')->count(),
                'approved' => User::where('user_type', 'teacher')->where('is_approved', true)->count(),
                'pending' => User::where('user_type', 'teacher')->where('is_approved', false)->count(),
            ],
            'courses' => [
                'total' => Course::count(),
                'published' => Course::where('status', 'published')->count(),
                'draft' => Course::where('status', 'draft')->count(),
            ],
            'enrollments' => [
                'total' => Enrollment::count(),
                'active' => Enrollment::where('status', 'active')->count(),
                'completed' => Enrollment::where('status', 'completed')->count(),
            ],
            'companies' => [
                'total' => Company::count(),
                'verified' => Company::where('is_verified', true)->count(),
                'unverified' => Company::where('is_verified', false)->count(),
            ],
            'jobs' => [
                'total' => JobPosting::count(),
                'active' => JobPosting::where('status', 'active')->count(),
                'applications' => JobApplication::count(),
            ],
            'recent_activity' => [
                'new_users_today' => User::whereDate('created_at', today())->count(),
                'new_courses_this_week' => Course::whereBetween('created_at', [now()->startOfWeek(), now()])->count(),
                'new_enrollments_this_week' => Enrollment::whereBetween('created_at', [now()->startOfWeek(), now()])->count(),
            ],
        ];
    }

    /**
     * Get paginated list of all users with filters
     */
    public function getUsers($filters = [], $perPage = 15)
    {
        $query = User::query();

        if (isset($filters['user_type'])) {
            $query->where('user_type', $filters['user_type']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['is_approved']) && $filters['is_approved'] !== null) {
            $query->where('is_approved', $filters['is_approved']);
        }

        if (isset($filters['search']) && $filters['search']) {
            $query->where(function ($q) use ($filters) {
                $q->where('first_name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('last_name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->with([
            'studentProfile',
            'teacherProfile',
            'parentProfile',
            'universityStudentProfile',
            'company'
        ])->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get user details by ID
     */
    public function getUserDetails($userId)
    {
        return User::with([
            'studentProfile',
            'teacherProfile',
            'parentProfile',
            'universityStudentProfile',
            'company'
        ])->findOrFail($userId);
    }

    /**
     * Update user status (active, suspended, pending)
     */
    public function updateUserStatus($userId, $status)
    {
        $user = User::findOrFail($userId);

        if (!in_array($status, ['active', 'suspended', 'pending'])) {
            throw new \InvalidArgumentException('Invalid status');
        }

        $user->update(['status' => $status]);

        return $user;
    }

    /**
     * Suspend a user account
     */
    public function suspendUser($userId, $reason = null)
    {
        $user = User::findOrFail($userId);

        if ($user->user_type === 'admin') {
            throw new \Exception('Cannot suspend admin users');
        }

        $user->update(['status' => 'suspended']);

        // TODO: Send suspension notification with reason

        return $user;
    }

    /**
     * Activate a suspended user account
     */
    public function activateUser($userId)
    {
        $user = User::findOrFail($userId);
        $user->update(['status' => 'active']);

        // TODO: Send activation notification

        return $user;
    }

    /**
     * Delete a user account permanently
     */
    public function deleteUser($userId)
    {
        $user = User::findOrFail($userId);

        if ($user->user_type === 'admin') {
            throw new \Exception('Cannot delete admin users');
        }

        DB::transaction(function () use ($user) {
            // Delete related profiles
            $user->studentProfile()->delete();
            $user->teacherProfile()->delete();
            $user->parentProfile()->delete();
            $user->universityStudentProfile()->delete();
            $user->company()->delete();

            // Delete the user
            $user->delete();
        });

        return true;
    }

    /**
     * Get all courses with pagination and filters
     */
    public function getCourses($filters = [], $perPage = 15)
    {
        $query = Course::with('teacher');

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['grade'])) {
            $query->where('grade', $filters['grade']);
        }

        if (isset($filters['search']) && $filters['search']) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Update course status
     */
    public function updateCourseStatus($courseId, $status)
    {
        $course = Course::findOrFail($courseId);

        if (!in_array($status, ['published', 'draft', 'archived'])) {
            throw new \InvalidArgumentException('Invalid status');
        }

        $course->update(['status' => $status]);

        return $course;
    }

    /**
     * Delete a course
     */
    public function deleteCourse($courseId)
    {
        $course = Course::findOrFail($courseId);

        DB::transaction(function () use ($course) {
            // Delete related enrollments, lessons, etc.
            $course->enrollments()->delete();
            $course->lessons()->delete();
            $course->delete();
        });

        return true;
    }

    /**
     * Get all companies with pagination and filters
     */
    public function getCompanies($filters = [], $perPage = 15)
    {
        $query = Company::with('user');

        if (isset($filters['is_verified']) && $filters['is_verified'] !== null) {
            $query->where('is_verified', $filters['is_verified']);
        }

        if (isset($filters['search']) && $filters['search']) {
            $query->where(function ($q) use ($filters) {
                $q->where('company_name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('industry', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Verify a company
     */
    public function verifyCompany($companyId)
    {
        $company = Company::findOrFail($companyId);
        $company->update(['is_verified' => true]);

        // TODO: Send verification notification

        return $company;
    }

    /**
     * Unverify a company
     */
    public function unverifyCompany($companyId)
    {
        $company = Company::findOrFail($companyId);
        $company->update(['is_verified' => false]);

        return $company;
    }

    /**
     * Get analytics data for charts and reports
     */
    public function getAnalytics($period = '30days')
    {
        $startDate = match($period) {
            '7days' => now()->subDays(7),
            '30days' => now()->subDays(30),
            '90days' => now()->subDays(90),
            '1year' => now()->subYear(),
            default => now()->subDays(30),
        };

        return [
            'user_growth' => User::where('created_at', '>=', $startDate)
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
            'enrollment_growth' => Enrollment::where('created_at', '>=', $startDate)
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
            'course_creation' => Course::where('created_at', '>=', $startDate)
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
            'user_type_distribution' => User::selectRaw('user_type, COUNT(*) as count')
                ->groupBy('user_type')
                ->get(),
        ];
    }

    /**
     * Create a new admin user
     */
    public function createAdmin($data)
    {
        return DB::transaction(function () use ($data) {
            return User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => Hash::make($data['password']),
                'user_type' => 'admin',
                'status' => 'active',
                'is_approved' => true,
                'email_verified_at' => now(),
            ]);
        });
    }
}
