<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class TeacherRejectedNotification extends Notification
{
    use Queueable;

    protected $reason;

    public function __construct($reason)
    {
        $this->reason = $reason;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        // Get the appropriate email address
        $email = $this->getEmailAddress($notifiable);

        // Arabic content
        $title = 'طلب التسجيل كمحاضر';
        $greeting = 'عزيزي ' . $notifiable->first_name;
        $messageContent = 'نأسف لإبلاغك أنه تم رفض طلبك للتسجيل كمحاضر.';
        $additionalInfo = [
            'السبب: ' . $this->reason,
            'يمكنك التواصل معنا للحصول على مزيد من المعلومات.',
            'شكراً لاهتمامك بالانضمام إلى منصة Edvance.'
        ];

        // English content
        $titleEn = 'Teacher Registration Application';
        $greetingEn = 'Dear ' . $notifiable->first_name;
        $messageContentEn = 'We regret to inform you that your teacher registration application has been rejected.';
        $additionalInfoEn = [
            'Reason: ' . $this->reason,
            'You can contact us for more information.',
            'Thank you for your interest in joining the Edvance platform.'
        ];

        Mail::send('emails.notification', compact(
            'title', 'greeting', 'messageContent', 'additionalInfo',
            'titleEn', 'greetingEn', 'messageContentEn', 'additionalInfoEn'
        ), function ($mail) use ($email, $title) {
            $mail->to($email)->subject($title . ' - Teacher Application Rejected');
        });

        return null;
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'teacher_rejected',
            'title' => 'تم رفض طلب التسجيل',
            'message' => 'تم رفض طلبك للتسجيل كمحاضر. السبب: ' . $this->reason,
            'reason' => $this->reason,
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
