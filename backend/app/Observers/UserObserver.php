<?php

namespace App\Observers;

use App\Models\User;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\ParentProfile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserObserver
{
    public function created(User $user)
    {
        // Log user creation
        Log::info('New user registered', [
            'user_id' => $user->id,
            'email' => $user->email,
            'type' => $user->user_type
        ]);
    }

    public function deleted(User $user)
    {
        // Handle cascading deletes for relationships not handled by foreign keys
        if ($user->user_type === 'teacher' && $user->teacherProfile) {
            // Delete CV file
            if ($user->teacherProfile->cv_path) {
                Storage::disk('private')->delete($user->teacherProfile->cv_path);
            }
        }
    }

    public function updated(User $user)
    {
        // If teacher gets approved, send notification
        if ($user->user_type === 'teacher' &&
            $user->isDirty('is_approved') &&
            $user->is_approved) {
            $user->notify(new \App\Notifications\TeacherApprovedNotification());
        }
    }
}
