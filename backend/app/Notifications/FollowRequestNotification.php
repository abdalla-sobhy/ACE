<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

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
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('طلب متابعة جديد')
            ->greeting('مرحباً ' . $notifiable->first_name)
            ->line('لديك طلب متابعة جديد من ولي الأمر: ' . $this->parent->full_name)
            ->action('عرض الطلب', url('/student/follow-requests'))
            ->line('يمكنك قبول أو رفض الطلب من لوحة التحكم الخاصة بك.');
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
