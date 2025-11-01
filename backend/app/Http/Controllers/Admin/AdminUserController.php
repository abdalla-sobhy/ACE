<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    protected $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    /**
     * Get paginated list of users
     */
    public function index(Request $request)
    {
        try {
            $filters = [
                'user_type' => $request->input('user_type'),
                'status' => $request->input('status'),
                'is_approved' => $request->input('is_approved'),
                'search' => $request->input('search'),
            ];

            $perPage = $request->input('per_page', 15);
            $users = $this->adminService->getUsers($filters, $perPage);

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users'
            ], 500);
        }
    }

    /**
     * Get user details
     */
    public function show($id)
    {
        try {
            $user = $this->adminService->getUserDetails($id);

            return response()->json([
                'success' => true,
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }
    }

    /**
     * Update user status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,suspended,pending'
        ]);

        try {
            $user = $this->adminService->updateUserStatus($id, $request->status);

            return response()->json([
                'success' => true,
                'message' => 'User status updated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Suspend a user
     */
    public function suspend(Request $request, $id)
    {
        $request->validate([
            'reason' => 'nullable|string|max:500'
        ]);

        try {
            $user = $this->adminService->suspendUser($id, $request->reason);

            return response()->json([
                'success' => true,
                'message' => 'User suspended successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Activate a user
     */
    public function activate($id)
    {
        try {
            $user = $this->adminService->activateUser($id);

            return response()->json([
                'success' => true,
                'message' => 'User activated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Delete a user
     */
    public function destroy($id)
    {
        try {
            $this->adminService->deleteUser($id);

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Create a new admin user
     */
    public function createAdmin(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            $admin = $this->adminService->createAdmin($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Admin user created successfully',
                'data' => $admin
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
