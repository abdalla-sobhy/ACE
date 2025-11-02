<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;
use App\Models\JobPosting;

class NewJobPosted extends Notification
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
        // Get the appropriate email address (academic email for university students)
        $email = $this->getEmailAddress($notifiable);

        // Arabic content
        $title = 'وظيفة جديدة تناسب مهاراتك!';
        $greeting = 'مرحباً ' . $notifiable->first_name;
        $message = 'تم نشر وظيفة جديدة قد تكون مناسبة لك:';
        $additionalInfo = [
            '**' . $this->jobPosting->title . '** في ' . $this->jobPosting->company->company_name,
            'نوع الوظيفة: ' . $this->getJobTypeLabel($this->jobPosting->job_type),
            'الموقع: ' . $this->jobPosting->location,
            'لا تفوت هذه الفرصة!'
        ];
        $actionUrl = url('/university_student/jobs/' . $this->jobPosting->id);
        $actionText = 'عرض تفاصيل الوظيفة';

        // English content
        $titleEn = 'New Job Matching Your Skills!';
        $greetingEn = 'Hello ' . $notifiable->first_name;
        $messageEn = 'A new job opportunity has been posted that might be suitable for you:';
        $additionalInfoEn = [
            '**' . $this->jobPosting->title . '** at ' . $this->jobPosting->company->company_name,
            'Job Type: ' . $this->getJobTypeLabelEn($this->jobPosting->job_type),
            'Location: ' . $this->jobPosting->location,
            'Don\'t miss this opportunity!'
        ];
        $actionTextEn = 'View Job Details';

        Mail::send('emails.notification', compact(
            'title', 'greeting', 'message', 'additionalInfo',
            'titleEn', 'greetingEn', 'messageEn', 'additionalInfoEn',
            'actionUrl', 'actionText', 'actionTextEn'
        ), function ($mail) use ($email, $title) {
            $mail->to($email)->subject($title . ' - New Job Posted');
        });

        return null;
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

    private function getJobTypeLabelEn($type)
    {
        $labels = [
            'full_time' => 'Full Time',
            'part_time' => 'Part Time',
            'internship' => 'Internship',
            'contract' => 'Contract',
        ];
        return $labels[$type] ?? $type;
    }

    /**
     * Get the email address for the notification
     * For university students, use their academic email
     */
    private function getEmailAddress($notifiable)
    {
        // University students should receive emails at their academic email
        if ($notifiable->user_type === 'university_student' && $notifiable->email) {
            return $notifiable->email;
        }

        return $notifiable->email;
    }
}
