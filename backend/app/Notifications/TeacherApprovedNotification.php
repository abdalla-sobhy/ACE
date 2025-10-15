<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeacherApprovedNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('تمت الموافقة على حسابك!')
            ->greeting('مبروك ' . $notifiable->first_name . '!')
            ->line('تمت الموافقة على طلبك للانضمام كمحاضر في Edvance.')
            ->line('يمكنك الآن تسجيل الدخول والبدء في إنشاء المحاضرات.')
            ->action('تسجيل الدخول', url('/login'))
            ->line('نتطلع لرؤية محتواك التعليمي المميز!');
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
