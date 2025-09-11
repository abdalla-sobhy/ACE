<?php
// app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\ParentProfile;
use App\Models\DiditVerification;
use App\Notifications\WelcomeNotification;
use App\Notifications\TeacherApplicationReceived;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        DB::beginTransaction();

        try {
            // Extract and validate user type
            $userType = $request->input('userType');

            if (!in_array($userType, ['student', 'teacher', 'parent'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'نوع المستخدم غير صحيح'
                ], 400);
            }

            // Prepare basic validation rules
            $basicRules = [
                'basicData.firstName' => 'required|string|min:2',
                'basicData.lastName' => 'required|string|min:2',
                'basicData.email' => 'required|email|unique:users,email',
                'basicData.phone' => ['required', 'regex:/^\+20[0-9]{10}$/'],
                'basicData.password' => [
                    'required',
                    'min:8',
                    'regex:/[A-Z]/',
                    'regex:/[0-9]/'
                ],
            ];

            // Add type-specific validation rules
            $additionalRules = [];

            if ($userType === 'student') {
                $additionalRules = [
                    'basicData.grade' => 'required|string',
                    'basicData.birthDate' => 'required|date|before:-6 years|after:-25 years',
                ];
            } elseif ($userType === 'teacher') {
                $additionalRules = [
                    'teacherData.specialization' => 'required|string',
                    'teacherData.yearsOfExperience' => 'required|string',
                    'cv' => 'required|file|mimes:pdf,doc,docx|max:5120',
                    'diditData.sessionId' => 'required|string',
                    'diditData.sessionNumber' => 'required|integer',
                    'diditData.status' => 'required|string|in:Approved',
                ];
            } elseif ($userType === 'parent') {
                $additionalRules = [
                    'parentData.childrenCount' => 'required|string',
                    'diditData.sessionId' => 'required|string',
                    'diditData.sessionNumber' => 'required|integer',
                    'diditData.status' => 'required|string|in:Approved',
                ];
            }

            $validator = Validator::make($request->all(), array_merge($basicRules, $additionalRules));

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'بيانات غير صحيحة',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Create user
            $basicData = $request->input('basicData');
            $user = User::create([
                'first_name' => $basicData['firstName'],
                'last_name' => $basicData['lastName'],
                'email' => $basicData['email'],
                'phone' => $basicData['phone'],
                'password' => Hash::make($basicData['password']),
                'user_type' => $userType,
                'is_approved' => $userType !== 'teacher', // Teachers need approval
            ]);

                        // Create type-specific profile
            if ($userType === 'student') {
                StudentProfile::create([
                    'user_id' => $user->id,
                    'grade' => $basicData['grade'],
                    'birth_date' => $basicData['birthDate'],
                ]);
            } elseif ($userType === 'teacher') {
                $cvPath = null;
                if ($request->hasFile('cv')) {
                    $cvPath = $request->file('cv')->store('cvs');
                }

                $teacherData = $request->input('teacherData');
                TeacherProfile::create([
                    'user_id' => $user->id,
                    'specialization' => $teacherData['specialization'],
                    'years_of_experience' => $teacherData['yearsOfExperience'],
                    'cv_path' => $cvPath,
                    'didit_data' => $request->input('diditData'),
                ]);

                // Save Didit verification data
                if ($request->has('diditData')) {
                    $this->saveDiditVerification($user->id, $request);
                }
            } elseif ($userType === 'parent') {
                $parentData = $request->input('parentData');
                ParentProfile::create([
                    'user_id' => $user->id,
                    'children_count' => $parentData['childrenCount'],
                    'didit_data' => $request->input('diditData'),
                ]);

                // Save Didit verification data
                if ($request->has('diditData')) {
                    $this->saveDiditVerification($user->id, $request);
                }
            }

            // Send notifications
            $user->notify(new WelcomeNotification());

            if ($userType === 'teacher') {
                // Notify admin about new teacher application
                // You can implement admin notification here
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $userType === 'teacher'
                    ? 'تم إرسال طلبك بنجاح! سيتم مراجعته قريباً.'
                    : 'تم إنشاء حسابك بنجاح!',
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'type' => $user->user_type,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    private function saveDiditVerification($userId, Request $request)
    {
        $diditData = $request->input('diditData');
        $personalInfo = $request->input('personalInfo');

        DiditVerification::create([
            'user_id' => $userId,
            'session_id' => $diditData['sessionId'],
            'session_number' => $diditData['sessionNumber'],
            'status' => $diditData['status'],
            'vendor_data' => $diditData['vendorData'] ?? null,
            'metadata' => $diditData['metadata'] ?? null,
            'personal_info' => $personalInfo,
            'checks' => $diditData['checks'] ?? null,
        ]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            ], 401);
        }

        if (!$user->is_approved) {
            return response()->json([
                'success' => false,
                'message' => 'حسابك قيد المراجعة. سيتم إخطارك عند الموافقة.'
            ], 403);
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'success' => false,
                'message' => 'تم تعليق حسابك. يرجى التواصل مع الدعم.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => [
                'id' => $user->id,
                'name' => $user->full_name,
                'email' => $user->email,
                'type' => $user->user_type,
            ],
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الخروج بنجاح'
        ]);
    }
}
