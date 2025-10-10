<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\JobApplication;

class ApplicationStatusUpdated extends Notification implements ShouldQueue
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
        $statusMessages = [
            'reviewing' => 'يتم مراجعة طلبك حالياً',
            'shortlisted' => 'تهانينا! تم ترشيحك مبدئياً للوظيفة',
            'interviewed' => 'تم تحديد موعد مقابلة لك',
            'accepted' => 'تهانينا! تم قبول طلبك',
            'rejected' => 'نأسف، لم يتم قبول طلبك هذه المرة',
        ];

        $mailMessage = (new MailMessage)
            ->subject('تحديث حالة طلبك - ' . $this->application->jobPosting->title)
            ->greeting('مرحباً ' . $notifiable->first_name)
            ->line($statusMessages[$this->application->status] ?? 'تم تحديث حالة طلبك');

        if ($this->application->status === 'interviewed' && $this->application->interview_date) {
            $mailMessage->line('موعد المقابلة: ' . $this->application->interview_date->format('Y-m-d H:i'))
                       ->line('مكان المقابلة: ' . $this->application->interview_location);
        }

        return $mailMessage->action('عرض تفاصيل الطلب', url('/university_student/applications'))
                            ->line('بالتوفيق!');
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'application_update',
            'application_id' => $this->application->id,
            'job_title' => $this->application->jobPosting->title,
            'company_name' => $this->application->jobPosting->company->company_name,
            'new_status' => $this->application->status,
            'message' => 'تم تحديث حالة طلبك للوظيفة: ' . $this->application->jobPosting->title,
        ];
    }
}
