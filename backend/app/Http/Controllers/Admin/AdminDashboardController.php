<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;

class AdminDashboardController extends Controller
{
    protected $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    /**
     * Get dashboard statistics
     */
    public function getStats()
    {
        try {
            $stats = $this->adminService->getDashboardStats();

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch dashboard statistics: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard statistics',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get analytics data
     */
    public function getAnalytics($period = '30days')
    {
        try {
            $analytics = $this->adminService->getAnalytics($period);

            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch analytics: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch analytics',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
