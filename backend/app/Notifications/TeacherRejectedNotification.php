<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

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
        return (new MailMessage)
            ->subject('طلب التسجيل كمحاضر')
            ->greeting('عزيزي ' . $notifiable->first_name)
            ->line('نأسف لإبلاغك أنه تم رفض طلبك للتسجيل كمحاضر.')
            ->line('السبب: ' . $this->reason)
            ->line('يمكنك التواصل معنا للحصول على مزيد من المعلومات.')
            ->line('شكراً لاهتمامك بالانضمام إلى منصة Edvance.');
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
}
