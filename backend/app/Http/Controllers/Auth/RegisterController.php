<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\ParentProfile;
use App\Services\DiditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    private $diditService;

    public function __construct(DiditService $diditService)
    {
        $this->diditService = $diditService;
    }

    public function register(Request $request)
    {
        $validator = $this->validateRegistration($request);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if (in_array($request->userType, ['teacher', 'parent'])) {
            $verification = $this->diditService->verifySession($request->diditSessionId);

            if (!$verification['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'فشل التحقق من الهوية'
                ], 400);
            }
        }

        DB::beginTransaction();

        try {
            // Create user
            $user = User::create([
                'first_name' => $request->firstName,
                'last_name' => $request->lastName,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'user_type' => $request->userType,
                'didit_session_id' => $request->diditSessionId ?? null,
                'identity_verified' => in_array($request->userType, ['teacher', 'parent']),
            ]);

            // Create profile based on user type
            switch ($request->userType) {
                case 'student':
                    StudentProfile::create([
                        'user_id' => $user->id,
                        'phone_number' => $request->phoneNumber,
                        'grade' => $request->grade,
                        'birth_date' => $request->birthDate,
                        'preferred_subjects' => $request->preferredSubjects ?? [],
                        'goal' => $request->goal ?? null,
                    ]);
                    break;

                case 'teacher':
                    TeacherProfile::create([
                        'user_id' => $user->id,
                        'specialization' => $request->specialization,
                        'years_of_experience' => $request->yearsOfExperience,
                    ]);
                    break;

                case 'parent':
                    ParentProfile::create([
                        'user_id' => $user->id,
                        'children_count' => $request->childrenCount,
                    ]);
                    break;
            }

            $user->sendEmailVerificationNotification();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الحساب بنجاح',
                'user' => $user->only(['id', 'email', 'user_type'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء الحساب',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function validateRegistration(Request $request)
    {
        $rules = [
            'firstName' => 'required|string|min:2',
            'lastName' => 'required|string|min:2',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|regex:/[A-Z]/|regex:/[0-9]/',
            'userType' => 'required|in:student,teacher,parent',
        ];

        if ($request->userType === 'student') {
            $rules = array_merge($rules, [
                'phoneNumber' => 'required|regex:/^\+20[0-9]{10}$/',
                'grade' => 'required|string',
                'birthDate' => 'required|date|before:-6 years|after:-25 years',
            ]);
        }

        if ($request->userType === 'teacher') {
            $rules = array_merge($rules, [
                'specialization' => 'required|string',
                'yearsOfExperience' => 'required|string',
                'diditSessionId' => 'required|string',
            ]);
        }

        if ($request->userType === 'parent') {
            $rules = array_merge($rules, [
                'childrenCount' => 'required|string',
                'diditSessionId' => 'required|string',
            ]);
        }

        return Validator::make($request->all(), $rules);
    }
}
