<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\UniversityStudentProfile;
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
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        DB::beginTransaction();

        try {
            $userType = $request->input('userType');

            if (!in_array($userType, ['student', 'teacher', 'parent', 'university_student'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'نوع المستخدم غير صحيح'
                ], 400);
            }

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

            $additionalRules = [];

            if ($userType === 'student') {
                $additionalRules = [
                    'basicData.grade' => 'required|string',
                    'basicData.birthDate' => 'required|date|before:-6 years|after:-25 years',
                ];
            } elseif ($userType === 'university_student') {
                $additionalRules = [
                    'universityData.faculty' => 'required|string',
                    'basicData.email' => [
                        'required',
                        'email',
                        'unique:users,email',
                        'regex:/^[\w.+-]+@(cu\.edu\.eg|aus\.edu\.eg|alexu\.edu\.eg|helwan\.edu\.eg|mans\.edu\.eg|tanta\.edu\.eg|asu\.edu\.eg|aswu\.edu\.eg|psu\.edu\.eg|su\.edu\.eg|mu\.edu\.eg|bsu\.edu\.eg|du\.edu\.eg|fu\.edu\.eg|kfs\.edu\.eg|nvu\.edu\.eg)$/'
                    ],
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

            $basicData = $request->input('basicData');
            $user = User::create([
                'first_name' => $basicData['firstName'],
                'last_name' => $basicData['lastName'],
                'email' => $basicData['email'],
                'phone' => $basicData['phone'],
                'password' => Hash::make($basicData['password']),
                'user_type' => $userType,
                'is_approved' => $userType !== 'teacher',
            ]);

            if ($userType === 'student') {
                StudentProfile::create([
                    'user_id' => $user->id,
                    'grade' => $basicData['grade'],
                    'birth_date' => $basicData['birthDate'],
                ]);
            } elseif ($userType === 'university_student') {
                $universityData = $request->input('universityData');
                UniversityStudentProfile::create([
                    'user_id' => $user->id,
                    'faculty' => $universityData['faculty'],
                    'goal' => $universityData['goal'] ?? null,
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

                if ($request->has('diditData')) {
                    $this->saveDiditVerification($user->id, $request);
                }
            }

            $user->notify(new WelcomeNotification());

            if ($userType === 'teacher') {
                // I should notify admin here, I think
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
            'remember_me' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $key = 'login_attempts_' . $request->ip();
        $attempts = cache()->get($key, 0);

        if ($attempts >= 5) {
            return response()->json([
                'success' => false,
                'message' => 'محاولات كثيرة جداً. حاول مرة أخرى بعد 15 دقيقة.'
            ], 429);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            cache()->put($key, $attempts + 1, now()->addMinutes(15));

            return response()->json([
                'success' => false,
                'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            ], 401);
        }

        cache()->forget($key);

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

        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
            'last_login_user_agent' => $request->userAgent(),
        ]);

        $tokenName = 'auth_token';
        $abilities = ['*'];

        $expiration = $request->remember_me
            ? now()->addDays(90)
            : now()->addDay();

        $token = $user->createToken($tokenName, $abilities, $expiration)->plainTextToken;

        $user->load(['studentProfile', 'teacherProfile', 'parentProfile', 'universityStudentProfile']);

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => [
                'id' => $user->id,
                'name' => $user->full_name,
                'email' => $user->email,
                'type' => $user->user_type,
                'profile' => $this->getUserProfile($user),
            ],
            'token' => $token,
            'expires_at' => $expiration->toISOString(),
            'remember_me' => $request->remember_me ?? false
        ]);
    }

    private function getUserProfile($user)
    {
        switch ($user->user_type) {
            case 'student':
                return $user->studentProfile;
            case 'university_student':
                return $user->universityStudentProfile;
            case 'teacher':
                return $user->teacherProfile;
            case 'parent':
                return $user->parentProfile;
            default:
                return null;
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الخروج بنجاح'
        ]);
    }

    public function sendOtp(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'institution_name' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'البيانات غير صحيحة',
            'errors' => $validator->errors()
        ], 422);
    }

    $existingUser = User::where('email', $request->email)->first();
    if ($existingUser) {
        return response()->json([
            'success' => false,
            'message' => 'البريد الإلكتروني مسجل بالفعل'
        ], 400);
    }

    $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

    $cacheKey = 'otp_' . md5($request->email);
    cache()->put($cacheKey, [
        'otp' => $otp,
        'email' => $request->email,
        'institution_name' => $request->institution_name,
        'attempts' => 0
    ], now()->addMinutes(10));

    try {
        Mail::send('emails.otp', [
            'otp' => $otp,
            'institution_name' => $request->institution_name
        ], function ($message) use ($request) {
            $message->to($request->email)
                    ->subject('رمز التحقق من EduEgypt');
        });

        Log::info('OTP sent', ['email' => $request->email, 'otp' => $otp]);

        return response()->json([
            'success' => true,
            'message' => 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'
        ]);

    } catch (\Exception $e) {
        Log::error('Failed to send OTP email: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'فشل في إرسال رمز التحقق. حاول مرة أخرى.'
        ], 500);
    }
}

public function verifyOtp(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'otp' => 'required|string|size:6',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'البيانات غير صحيحة',
            'errors' => $validator->errors()
        ], 422);
    }

    $cacheKey = 'otp_' . md5($request->email);
    $otpData = cache()->get($cacheKey);

    if (!$otpData) {
        return response()->json([
            'success' => false,
            'message' => 'رمز التحقق منتهي الصلاحية أو غير موجود'
        ], 400);
    }

    $otpData['attempts']++;
    cache()->put($cacheKey, $otpData, now()->addMinutes(10));

    if ($otpData['attempts'] > 3) {
        cache()->forget($cacheKey);
        return response()->json([
            'success' => false,
            'message' => 'تجاوزت عدد المحاولات المسموح. حاول مرة أخرى.'
        ], 429);
    }

    if ($otpData['otp'] !== $request->otp) {
        return response()->json([
            'success' => false,
            'message' => 'رمز التحقق غير صحيح'
        ], 400);
    }

    cache()->forget($cacheKey);

    return response()->json([
        'success' => true,
        'message' => 'تم التحقق بنجاح',
        'institution_name' => $otpData['institution_name']
    ]);
}
}
