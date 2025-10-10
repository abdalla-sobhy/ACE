<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\JobPosting;

class NewJobPosted extends Notification implements ShouldQueue
{
    use Queueable;

    protected $jobPosting;

    public function __construct(JobPosting $jobPosting)
    {
        $this->jobPosting = $jobPosting;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('وظيفة جديدة تناسب مهاراتك!')
            ->greeting('مرحباً ' . $notifiable->first_name)
            ->line('تم نشر وظيفة جديدة قد تكون مناسبة لك:')
            ->line('**' . $this->jobPosting->title . '** في ' . $this->jobPosting->company->company_name)
            ->line('نوع الوظيفة: ' . $this->getJobTypeLabel($this->jobPosting->job_type))
                        ->line('الموقع: ' . $this->jobPosting->location)
            ->action('عرض تفاصيل الوظيفة', url('/university_student/jobs/' . $this->jobPosting->id))
            ->line('لا تفوت هذه الفرصة!');
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'new_job',
            'job_id' => $this->jobPosting->id,
            'job_title' => $this->jobPosting->title,
            'company_name' => $this->jobPosting->company->company_name,
            'job_type' => $this->jobPosting->job_type,
            'message' => 'وظيفة جديدة: ' . $this->jobPosting->title,
        ];
    }

    private function getJobTypeLabel($type)
    {
        $labels = [
            'full_time' => 'دوام كامل',
            'part_time' => 'دوام جزئي',
            'internship' => 'تدريب',
            'contract' => 'عقد',
        ];
        return $labels[$type] ?? $type;
    }
}
