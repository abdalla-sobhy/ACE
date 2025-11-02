<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class TeacherApprovedNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        // Get the appropriate email address
        $email = $this->getEmailAddress($notifiable);

        // Arabic content
        $title = 'تمت الموافقة على حسابك!';
        $greeting = 'مبروك ' . $notifiable->first_name . '!';
        $message = 'تمت الموافقة على طلبك للانضمام كمحاضر في Edvance.';
        $additionalInfo = [
            'يمكنك الآن تسجيل الدخول والبدء في إنشاء المحاضرات.',
            'نتطلع لرؤية محتواك التعليمي المميز!'
        ];
        $actionUrl = url('/login');
        $actionText = 'تسجيل الدخول';

        // English content
        $titleEn = 'Your Account Has Been Approved!';
        $greetingEn = 'Congratulations ' . $notifiable->first_name . '!';
        $messageEn = 'Your request to join as a teacher on Edvance has been approved.';
        $additionalInfoEn = [
            'You can now log in and start creating lectures.',
            'We look forward to seeing your amazing educational content!'
        ];
        $actionTextEn = 'Login';

        Mail::send('emails.notification', compact(
            'title', 'greeting', 'message', 'additionalInfo',
            'titleEn', 'greetingEn', 'messageEn', 'additionalInfoEn',
            'actionUrl', 'actionText', 'actionTextEn'
        ), function ($mail) use ($email, $title) {
            $mail->to($email)->subject($title . ' - Teacher Account Approved');
        });

        return null;
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'teacher_approved',
            'title' => 'تمت الموافقة على حسابك',
            'message' => 'يمكنك الآن البدء في استخدام المنصة كمحاضر',
        ];
    }

    /**
     * Get the email address for the notification
     */
    private function getEmailAddress($notifiable)
    {
        return $notifiable->email;
    }
}
