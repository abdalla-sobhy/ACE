<?php
// app/Http/Controllers/Api/ParentStudentController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ParentStudentFollowRequest;
use App\Notifications\FollowRequestNotification;
use App\Notifications\FollowRequestApprovedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; // Add this import

class ParentStudentController extends Controller
{
    public function searchStudent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $student = User::where('email', $request->email)
                      ->where('user_type', 'student')
                      ->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على طالب بهذا البريد الإلكتروني'
            ], 404);
        }

        // Fix: Use Auth facade
        $existingRequest = ParentStudentFollowRequest::where('parent_id', Auth::id())
                                                     ->where('student_id', $student->id)
                                                     ->first();

        return response()->json([
            'success' => true,
            'student' => [
                'id' => $student->id,
                'name' => $student->full_name,
                'email' => $student->email,
                'grade' => $student->studentProfile->grade ?? null,
            ],
            'followStatus' => $existingRequest ? $existingRequest->status : 'none'
        ]);
    }

    public function sendFollowRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $student = User::find($request->student_id);

        if ($student->user_type !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'المستخدم المحدد ليس طالباً'
            ], 400);
        }

        // Fix: Use Auth facade
        $existingRequest = ParentStudentFollowRequest::where('parent_id', Auth::id())
                                                     ->where('student_id', $student->id)
                                                     ->first();

        if ($existingRequest) {
            if ($existingRequest->status === 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'لديك طلب متابعة معلق بالفعل'
                ], 400);
            } elseif ($existingRequest->status === 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'أنت تتابع هذا الطالب بالفعل'
                ], 400);
            }
        }

        // Create or update follow request
        $followRequest = ParentStudentFollowRequest::updateOrCreate(
            [
                'parent_id' => Auth::id(),
                'student_id' => $student->id,
            ],
            [
                'status' => 'pending'
            ]
        );

        // Fix: Use Auth facade
        $student->notify(new FollowRequestNotification(Auth::user()));

        return response()->json([
            'success' => true,
            'message' => 'تم إرسال طلب المتابعة بنجاح'
        ]);
    }

    public function getFollowRequests()
    {
        // Fix: Use Auth facade
        $requests = ParentStudentFollowRequest::where('student_id', Auth::id())
                                              ->where('status', 'pending')
                                              ->with('parent:id,first_name,last_name,email')
                                              ->get();

        return response()->json([
            'success' => true,
            'requests' => $requests->map(function ($request) {
                return [
                    'id' => $request->id,
                    'parent' => [
                        'id' => $request->parent->id,
                        'name' => $request->parent->full_name,
                        'email' => $request->parent->email,
                    ],
                    'created_at' => $request->created_at->format('Y-m-d H:i:s'),
                ];
            })
        ]);
    }

    public function handleFollowRequest(Request $request, $requestId)
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:approve,reject'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Fix: Use Auth facade
        $followRequest = ParentStudentFollowRequest::where('id', $requestId)
                                                   ->where('student_id', Auth::id())
                                                   ->where('status', 'pending')
                                                   ->first();

        if (!$followRequest) {
            return response()->json([
                'success' => false,
                'message' => 'طلب المتابعة غير موجود'
            ], 404);
        }

        if ($request->action === 'approve') {
            $followRequest->update([
                'status' => 'approved',
                'approved_at' => now()
            ]);

            // Notify the parent
            $followRequest->parent->notify(new FollowRequestApprovedNotification($followRequest->student));

            return response()->json([
                'success' => true,
                'message' => 'تم قبول طلب المتابعة'
            ]);
        } else {
            $followRequest->update(['status' => 'rejected']);

            return response()->json([
                'success' => true,
                'message' => 'تم رفض طلب المتابعة'
            ]);
        }
    }

     public function getFollowedStudents()
    {
        /** @var User $user */
        $user = Auth::user();

        // Now IntelliSense should recognize followedStudents
        $students = $user->followedStudents()
                            ->with('studentProfile')
                            ->get();

        return response()->json([
            'success' => true,
            'students' => $students->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->full_name,
                    'email' => $student->email,
                    'grade' => $student->studentProfile->grade ?? null,
                    'birth_date' => $student->studentProfile->birth_date ?? null,
                    'follow_date' => $student->pivot->created_at->format('Y-m-d'),
                ];
            })
        ]);
    }

    public function getStudentDetails($studentId)
    {
        /** @var User $user */
        $user = Auth::user();

        // Fix: Use proper type hinting
        $isFollowing = $user->followedStudents()
                            ->where('student_id', $studentId)
                            ->exists();

        if (!$isFollowing) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح لك بعرض بيانات هذا الطالب'
            ], 403);
        }

        $student = User::with(['studentProfile'])->find($studentId);

        return response()->json([
            'success' => true,
            'student' => [
                'id' => $student->id,
                'name' => $student->full_name,
                'email' => $student->email,
                'phone' => $student->phone,
                'profile' => [
                    'grade' => $student->studentProfile->grade,
                    'birth_date' => $student->studentProfile->birth_date,
                    'preferred_subjects' => $student->studentProfile->preferred_subjects,
                    'goal' => $student->studentProfile->goal,
                ],
                'grades' => [],
                'attendance' => [],
            ]
        ]);
    }

    public function unfollowStudent($studentId)
    {
        // Fix: Use Auth facade
        $followRequest = ParentStudentFollowRequest::where('parent_id', Auth::id())
                                                   ->where('student_id', $studentId)
                                                   ->where('status', 'approved')
                                                   ->first();

        if (!$followRequest) {
            return response()->json([
                'success' => false,
                'message' => 'لا تتابع هذا الطالب'
            ], 404);
        }

        $followRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم إلغاء متابعة الطالب'
        ]);
    }

    /**
     * Get parent profile
     */
    public function getProfile()
    {
        try {
            $user = Auth::user();
            $profile = $user->parentProfile;

            if (!$profile) {
                // Create default profile if doesn't exist
                $profile = \App\Models\ParentProfile::create([
                    'user_id' => $user->id,
                    'children_count' => 0,
                ]);
            }

            // Parse JSON fields
            $profileData = $profile->toArray();
            if (is_string($profileData['didit_data'] ?? null)) {
                $profileData['didit_data'] = json_decode($profileData['didit_data'], true) ?? [];
            }

            return response()->json([
                'success' => true,
                'user' => $user,
                'profile' => $profileData
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching parent profile: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile'
            ], 500);
        }
    }

    /**
     * Update parent profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $validator = \Validator::make($request->all(), [
                'children_count' => 'nullable|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $profile = Auth::user()->parentProfile;

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Parent profile not found'
                ], 404);
            }

            $updateData = $request->only([
                'children_count',
            ]);

            $profile->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'profile' => $profile->fresh()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating parent profile: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile'
            ], 500);
        }
    }

    /**
     * Upload profile picture
     */
    public function uploadProfilePicture(Request $request)
    {
        try {
            $user = Auth::user();

            $validator = \Validator::make($request->all(), [
                'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $profile = $user->parentProfile;

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Parent profile not found'
                ], 404);
            }

            // Delete old profile picture if exists
            if ($profile->profile_picture && \Storage::disk('public')->exists($profile->profile_picture)) {
                \Storage::disk('public')->delete($profile->profile_picture);
            }

            // Store new profile picture
            $file = $request->file('profile_picture');
            $filename = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profile_pictures/parents', $filename, 'public');

            $profile->update(['profile_picture' => $path]);

            return response()->json([
                'success' => true,
                'message' => 'Profile picture uploaded successfully',
                'profile_picture_url' => asset('storage/' . $path)
            ]);
        } catch (\Exception $e) {
            \Log::error('Error uploading parent profile picture: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload profile picture'
            ], 500);
        }
    }
}
