<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;
use Illuminate\Http\Request;

class AdminCourseController extends Controller
{
    protected $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    /**
     * Get paginated list of courses
     */
    public function index(Request $request)
    {
        try {
            $filters = [
                'status' => $request->input('status'),
                'grade' => $request->input('grade'),
                'search' => $request->input('search'),
            ];

            $perPage = $request->input('per_page', 15);
            $courses = $this->adminService->getCourses($filters, $perPage);

            return response()->json([
                'success' => true,
                'data' => $courses
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch courses'
            ], 500);
        }
    }

    /**
     * Update course status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:published,draft,archived'
        ]);

        try {
            $course = $this->adminService->updateCourseStatus($id, $request->status);

            return response()->json([
                'success' => true,
                'message' => 'Course status updated successfully',
                'data' => $course
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Delete a course
     */
    public function destroy($id)
    {
        try {
            $this->adminService->deleteCourse($id);

            return response()->json([
                'success' => true,
                'message' => 'Course deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
