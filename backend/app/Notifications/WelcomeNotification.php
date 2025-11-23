<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class WelcomeNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toMail($notifiable)
    {
        $isPendingTeacher = $notifiable->user_type === 'teacher' && !$notifiable->is_approved;

        // Get the appropriate email address
        $email = $this->getEmailAddress($notifiable);

        // Arabic content
        $title = 'مرحباً بك في Edvance';
        $greeting = 'أهلاً ' . $notifiable->first_name . '!';
        $message = 'نحن سعداء بانضمامك إلى عائلة Edvance.';

        $additionalInfo = [];
        if ($isPendingTeacher) {
            $additionalInfo[] = 'طلبك قيد المراجعة حالياً. سنخطرك فور الموافقة على حسابك.';
            $additionalInfo[] = 'يستغرق هذا عادة من 1-2 يوم عمل.';
        } else {
            $additionalInfo[] = 'يمكنك الآن تسجيل الدخول والبدء في استخدام المنصة.';
        }

        $footer = 'شكراً لاختيارك Edvance!';

        // English content
        $titleEn = 'Welcome to Edvance';
        $greetingEn = 'Hello ' . $notifiable->first_name . '!';
        $messageEn = 'We are happy to have you join the Edvance family.';

        $additionalInfoEn = [];
        if ($isPendingTeacher) {
            $additionalInfoEn[] = 'Your application is currently under review. We will notify you once your account is approved.';
            $additionalInfoEn[] = 'This usually takes 1-2 business days.';
        } else {
            $additionalInfoEn[] = 'You can now log in and start using the platform.';
        }

        $footerEn = 'Thank you for choosing Edvance!';

        $actionUrl = !$isPendingTeacher ? url('/login') : null;
        $actionText = !$isPendingTeacher ? 'تسجيل الدخول' : null;
        $actionTextEn = !$isPendingTeacher ? 'Login' : null;

        Mail::send('emails.notification', compact(
            'title', 'greeting', 'message', 'additionalInfo', 'footer',
            'titleEn', 'greetingEn', 'messageEn', 'additionalInfoEn', 'footerEn',
            'actionUrl', 'actionText', 'actionTextEn'
        ), function ($mail) use ($email, $title) {
            $mail->to($email)->subject($title . ' - Welcome to Edvance');
        });

        return null;
    }

    public function toDatabase($notifiable)
    {
        $isPendingTeacher = $notifiable->user_type === 'teacher' && !$notifiable->is_approved;

        return [
            'type' => 'welcome',
            'title' => 'مرحباً بك في Edvance',
            'message' => $isPendingTeacher
                ? 'طلبك قيد المراجعة. سنخطرك فور الموافقة.'
                : 'حسابك جاهز الآن. يمكنك البدء في استخدام المنصة.',
        ];
    }

    /**
     * Get the email address for the notification
     * For university users, use their academic email
     */
    private function getEmailAddress($notifiable)
    {
        // For university students with academic email, use that
        if ($notifiable->user_type === 'university_student' && $notifiable->email) {
            return $notifiable->email;
        }

        // For other users, use their regular email
        return $notifiable->email;
    }
}
