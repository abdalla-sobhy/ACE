<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\JobApplication;

class NewJobApplication extends Notification implements ShouldQueue
{
    use Queueable;

    protected $application;

    public function __construct(JobApplication $application)
    {
        $this->application = $application;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('طلب جديد للوظيفة: ' . $this->application->jobPosting->title)
            ->greeting('مرحباً ' . $notifiable->first_name)
            ->line('تلقيت طلب توظيف جديد:')
            ->line('المتقدم: ' . $this->application->student->first_name . ' ' . $this->application->student->last_name)
            ->line('الوظيفة: ' . $this->application->jobPosting->title)
            ->action('عرض الطلب', url('/company/applications/' . $this->application->id))
            ->line('شكراً لاستخدامك منصتنا!');
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'new_application',
            'application_id' => $this->application->id,
            'job_id' => $this->application->job_posting_id,
            'job_title' => $this->application->jobPosting->title,
            'student_name' => $this->application->student->first_name . ' ' . $this->application->student->last_name,
            'message' => 'طلب جديد من ' . $this->application->student->first_name . ' للوظيفة: ' . $this->application->jobPosting->title,
        ];
    }
}
