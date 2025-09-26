<?php

namespace App\Services;

use App\Models\User;
use App\Models\TeacherProfile;
use App\Models\ParentStudentFollowRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UserService
{
    public function approveTeacher($teacherId)
    {
        DB::transaction(function () use ($teacherId) {
            $teacher = User::where('id', $teacherId)
                            ->where('user_type', 'teacher')
                            ->firstOrFail();

            $teacher->update(['is_approved' => true]);

            // Send approval notification
            $teacher->notify(new \App\Notifications\TeacherApprovedNotification());
        });
    }

    public function getTeacherCV($teacherId)
    {
        $teacher = User::where('id', $teacherId)
                        ->where('user_type', 'teacher')
                        ->with('teacherProfile')
                        ->firstOrFail();

        if (!$teacher->teacherProfile->cv_path) {
            throw new \Exception('CV not found');
        }

        return Storage::disk('private')->get($teacher->teacherProfile->cv_path);
    }

    public function getParentDashboardData($parentId)
    {
        $parent = User::findOrFail($parentId);

        return [
            'followedStudents' => $parent->followedStudents()
                                        ->with('studentProfile')
                                        ->get(),
            'pendingRequests' => ParentStudentFollowRequest::where('parent_id', $parentId)
                                                            ->where('status', 'pending')
                                                            ->count(),
            'profile' => $parent->parentProfile,
        ];
    }

    public function getStudentDashboardData($studentId)
    {
        $student = User::findOrFail($studentId);

        return [
            'profile' => $student->studentProfile,
            'followingParents' => $student->followingParents()->get(),
            'pendingRequests' => ParentStudentFollowRequest::where('student_id', $studentId)
                                                            ->where('status', 'pending')
                                                            ->count(),
        ];
    }
}
