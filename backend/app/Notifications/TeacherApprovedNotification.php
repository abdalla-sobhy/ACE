<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class TeacherApprovedNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        // Arabic content
        $title = 'تمت الموافقة على حسابك!';
        $greeting = 'مبروك ' . $notifiable->first_name . '!';
        $messageContent = 'تمت الموافقة على طلبك للانضمام كمحاضر في Edvance.';
        $additionalInfo = [
            'يمكنك الآن تسجيل الدخول والبدء في إنشاء المحاضرات.',
            'نتطلع لرؤية محتواك التعليمي المميز!'
        ];
        $actionUrl = url('/login');
        $actionText = 'تسجيل الدخول';

        // English content
        $titleEn = 'Your Account Has Been Approved!';
        $greetingEn = 'Congratulations ' . $notifiable->first_name . '!';
        $messageContentEn = 'Your request to join as a teacher on Edvance has been approved.';
        $additionalInfoEn = [
            'You can now log in and start creating lectures.',
            'We look forward to seeing your amazing educational content!'
        ];
        $actionTextEn = 'Login';

        return (new MailMessage)
            ->subject($title . ' - Teacher Account Approved')
            ->view('emails.notification', compact(
                'title', 'greeting', 'messageContent', 'additionalInfo',
                'titleEn', 'greetingEn', 'messageContentEn', 'additionalInfoEn',
                'actionUrl', 'actionText', 'actionTextEn'
            ));
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'teacher_approved',
            'title' => 'تمت الموافقة على حسابك',
            'message' => 'يمكنك الآن البدء في استخدام المنصة كمحاضر',
        ];
    }
}
