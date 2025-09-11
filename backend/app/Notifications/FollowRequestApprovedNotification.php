<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

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
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('تمت الموافقة على طلب المتابعة')
            ->greeting('مرحباً ' . $notifiable->first_name)
            ->line('وافق الطالب ' . $this->student->full_name . ' على طلب متابعتك.')
            ->line('يمكنك الآن متابعة تقدمه الدراسي من لوحة التحكم.')
            ->action('عرض الطالب', url('/parent/student/' . $this->student->id))
            ->line('شكراً لاهتمامك بمتابعة التقدم الدراسي.');
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
