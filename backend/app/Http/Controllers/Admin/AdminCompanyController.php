<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;
use Illuminate\Http\Request;

class AdminCompanyController extends Controller
{
    protected $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    /**
     * Get paginated list of companies
     */
    public function index(Request $request)
    {
        try {
            $filters = [
                'is_verified' => $request->input('is_verified'),
                'search' => $request->input('search'),
            ];

            $perPage = $request->input('per_page', 15);
            $companies = $this->adminService->getCompanies($filters, $perPage);

            return response()->json([
                'success' => true,
                'data' => $companies
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch companies'
            ], 500);
        }
    }

    /**
     * Verify a company
     */
    public function verify($id)
    {
        try {
            $company = $this->adminService->verifyCompany($id);

            return response()->json([
                'success' => true,
                'message' => 'Company verified successfully',
                'data' => $company
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Unverify a company
     */
    public function unverify($id)
    {
        try {
            $company = $this->adminService->unverifyCompany($id);

            return response()->json([
                'success' => true,
                'message' => 'Company unverified successfully',
                'data' => $company
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
