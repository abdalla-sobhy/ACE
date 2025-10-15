<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $message = (new MailMessage)
            ->subject('مرحباً بك في Edvance')
            ->greeting('أهلاً ' . $notifiable->first_name . '!')
            ->line('نحن سعداء بانضمامك إلى عائلة Edvance.');

        if ($notifiable->user_type === 'teacher' && !$notifiable->is_approved) {
            $message->line('طلبك قيد المراجعة حالياً. سنخطرك فور الموافقة على حسابك.')
                    ->line('يستغرق هذا عادة من 1-2 يوم عمل.');
        } else {
            $message->line('يمكنك الآن تسجيل الدخول والبدء في استخدام المنصة.')
                    ->action('تسجيل الدخول', url('http://localhost:3000/login'));
        }

        return $message->line('شكراً لاختيارك Edvance!');
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'welcome',
            'title' => 'مرحباً بك في Edvance',
            'message' => $notifiable->user_type === 'teacher' && !$notifiable->is_approved
                ? 'طلبك قيد المراجعة. سنخطرك فور الموافقة.'
                : 'حسابك جاهز الآن. يمكنك البدء في استخدام المنصة.',
        ];
    }
}
