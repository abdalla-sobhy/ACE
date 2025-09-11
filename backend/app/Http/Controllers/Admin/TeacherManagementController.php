<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TeacherProfile;
use App\Services\UserService;
use Illuminate\Http\Request;

class TeacherManagementController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function getPendingTeachers()
    {
        $teachers = User::where('user_type', 'teacher')
                        ->where('is_approved', false)
                        ->with(['teacherProfile', 'diditVerification'])
                        ->paginate(20);

        return response()->json([
            'success' => true,
            'teachers' => $teachers
        ]);
    }

    public function getTeacherDetails($teacherId)
    {
        $teacher = User::where('id', $teacherId)
                        ->where('user_type', 'teacher')
                        ->with(['teacherProfile', 'diditVerification'])
                        ->firstOrFail();

        return response()->json([
            'success' => true,
            'teacher' => $teacher
        ]);
    }

    public function approveTeacher($teacherId)
    {
        try {
            $this->userService->approveTeacher($teacherId);

            return response()->json([
                'success' => true,
                'message' => 'تم الموافقة على المعلم بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الموافقة على المعلم'
            ], 500);
        }
    }

    public function rejectTeacher(Request $request, $teacherId)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $teacher = User::where('id', $teacherId)
                        ->where('user_type', 'teacher')
                        ->firstOrFail();

        $teacher->update(['status' => 'suspended']);

        // Send rejection notification with reason
        $teacher->notify(new \App\Notifications\TeacherRejectedNotification($request->reason));

        return response()->json([
            'success' => true,
            'message' => 'تم رفض طلب المعلم'
        ]);
    }

    public function downloadCV($teacherId)
    {
        try {
            $cvContent = $this->userService->getTeacherCV($teacherId);
            $teacher = User::find($teacherId);

            return response($cvContent)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $teacher->full_name . '_CV.pdf"');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم العثور على السيرة الذاتية'
            ], 404);
        }
    }
}
