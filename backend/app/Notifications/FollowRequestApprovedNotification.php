<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class FollowRequestApprovedNotification extends Notification
{
    use Queueable;

    protected $student;

    public function __construct(User $student)
    {
        $this->student = $student;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Send email notification to parent about follow request approval
     */
    public static function sendEmail($notifiable, $student)
    {
        // Get the appropriate email address
        $email = $notifiable->email;

        // Arabic content
        $title = 'تمت الموافقة على طلب المتابعة';
        $greeting = 'مرحباً ' . $notifiable->first_name;
        $messageContent = 'وافق الطالب ' . $student->full_name . ' على طلب متابعتك.';
        $additionalInfo = [
            'يمكنك الآن متابعة تقدمه الدراسي من لوحة التحكم.',
            'شكراً لاهتمامك بمتابعة التقدم الدراسي.'
        ];
        $actionUrl = url('/parent/student/' . $student->id);
        $actionText = 'عرض الطالب';

        // English content
        $titleEn = 'Follow Request Approved';
        $greetingEn = 'Hello ' . $notifiable->first_name;
        $messageContentEn = 'Student ' . $student->full_name . ' has approved your follow request.';
        $additionalInfoEn = [
            'You can now track their academic progress from your dashboard.',
            'Thank you for your interest in following their academic progress.'
        ];
        $actionTextEn = 'View Student';

        Mail::send('emails.notification', compact(
            'title', 'greeting', 'messageContent', 'additionalInfo',
            'titleEn', 'greetingEn', 'messageContentEn', 'additionalInfoEn',
            'actionUrl', 'actionText', 'actionTextEn'
        ), function ($mail) use ($email, $title) {
            $mail->to($email)->subject($title . ' - Follow Request Approved');
        });
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'follow_request_approved',
            'title' => 'تمت الموافقة على طلب المتابعة',
            'message' => 'وافق ' . $this->student->full_name . ' على طلب متابعتك',
            'student_id' => $this->student->id,
            'student_name' => $this->student->full_name,
        ];
    }
}
