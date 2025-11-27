<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class FollowRequestNotification extends Notification
{
    use Queueable;

    protected $parent;

    public function __construct(User $parent)
    {
        $this->parent = $parent;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Send email notification to student about follow request
     */
    public static function sendEmail($notifiable, $parent)
    {
        // Get the appropriate email address
        $email = $notifiable->email;

        // Arabic content
        $title = 'طلب متابعة جديد';
        $greeting = 'مرحباً ' . $notifiable->first_name;
        $messageContent = 'لديك طلب متابعة جديد من ولي الأمر: ' . $parent->full_name;
        $additionalInfo = ['يمكنك قبول أو رفض الطلب من لوحة التحكم الخاصة بك.'];
        $actionUrl = url('/student/follow-requests');
        $actionText = 'عرض الطلب';

        // English content
        $titleEn = 'New Follow Request';
        $greetingEn = 'Hello ' . $notifiable->first_name;
        $messageContentEn = 'You have a new follow request from parent: ' . $parent->full_name;
        $additionalInfoEn = ['You can accept or reject the request from your dashboard.'];
        $actionTextEn = 'View Request';

        Mail::send('emails.notification', compact(
            'title', 'greeting', 'messageContent', 'additionalInfo',
            'titleEn', 'greetingEn', 'messageContentEn', 'additionalInfoEn',
            'actionUrl', 'actionText', 'actionTextEn'
        ), function ($mail) use ($email, $title) {
            $mail->to($email)->subject($title . ' - New Follow Request');
        });
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'follow_request',
            'title' => 'طلب متابعة جديد',
            'message' => 'طلب متابعة من ' . $this->parent->full_name,
            'parent_id' => $this->parent->id,
            'parent_name' => $this->parent->full_name,
        ];
    }
}
