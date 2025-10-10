<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CompanyAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'min:8', 'regex:/[A-Z]/', 'regex:/[0-9]/'],
            'first_name' => 'required|string|min:2',
            'last_name' => 'required|string|min:2',
            'phone' => ['required', 'regex:/^\+20[0-9]{10}$/'],
            'company_name' => 'required|string|min:3',
            'industry' => 'required|string',
            'company_size' => 'required|in:1-10,11-50,51-200,201-500,500+',
            'location' => 'required|string',
            'website' => 'nullable|url',
            'registration_number' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create user account
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'user_type' => 'company',
                'status' => 'active',
                'is_approved' => true,
            ]);

            // Create company profile
            Company::create([
                'user_id' => $user->id,
                'company_name' => $request->company_name,
                'industry' => $request->industry,
                'company_size' => $request->company_size,
                'location' => $request->location,
                'website' => $request->website,
                'registration_number' => $request->registration_number,
                'description' => $request->description,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'تم إرسال طلبك بنجاح! سيتم مراجعة حسابك من قبل الإدارة.',
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'type' => $user->user_type,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Company registration error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
