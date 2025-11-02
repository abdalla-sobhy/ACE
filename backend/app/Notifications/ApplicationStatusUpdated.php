<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;
use App\Models\JobApplication;

class ApplicationStatusUpdated extends Notification
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
        // Get the appropriate email address (academic email for university students)
        $email = $this->getEmailAddress($notifiable);

        $statusMessages = [
            'reviewing' => 'يتم مراجعة طلبك حالياً',
            'shortlisted' => 'تهانينا! تم ترشيحك مبدئياً للوظيفة',
            'interviewed' => 'تم تحديد موعد مقابلة لك',
            'accepted' => 'تهانينا! تم قبول طلبك',
            'rejected' => 'نأسف، لم يتم قبول طلبك هذه المرة',
        ];

        $statusMessagesEn = [
            'reviewing' => 'Your application is currently under review',
            'shortlisted' => 'Congratulations! You have been shortlisted for the job',
            'interviewed' => 'An interview has been scheduled for you',
            'accepted' => 'Congratulations! Your application has been accepted',
            'rejected' => 'We regret to inform you that your application was not accepted this time',
        ];

        // Arabic content
        $title = 'تحديث حالة طلبك - ' . $this->application->jobPosting->title;
        $greeting = 'مرحباً ' . $notifiable->first_name;
        $message = $statusMessages[$this->application->status] ?? 'تم تحديث حالة طلبك';
        $additionalInfo = [];

        if ($this->application->status === 'interviewed' && $this->application->interview_date) {
            $additionalInfo[] = 'موعد المقابلة: ' . $this->application->interview_date->format('Y-m-d H:i');
            $additionalInfo[] = 'مكان المقابلة: ' . $this->application->interview_location;
        }

        $additionalInfo[] = 'بالتوفيق!';
        $actionUrl = url('/university_student/applications');
        $actionText = 'عرض تفاصيل الطلب';

        // English content
        $titleEn = 'Application Status Update - ' . $this->application->jobPosting->title;
        $greetingEn = 'Hello ' . $notifiable->first_name;
        $messageEn = $statusMessagesEn[$this->application->status] ?? 'Your application status has been updated';
        $additionalInfoEn = [];

        if ($this->application->status === 'interviewed' && $this->application->interview_date) {
            $additionalInfoEn[] = 'Interview Date: ' . $this->application->interview_date->format('Y-m-d H:i');
            $additionalInfoEn[] = 'Interview Location: ' . $this->application->interview_location;
        }

        $additionalInfoEn[] = 'Good luck!';
        $actionTextEn = 'View Application Details';

        Mail::send('emails.notification', compact(
            'title', 'greeting', 'message', 'additionalInfo',
            'titleEn', 'greetingEn', 'messageEn', 'additionalInfoEn',
            'actionUrl', 'actionText', 'actionTextEn'
        ), function ($mail) use ($email, $title) {
            $mail->to($email)->subject($title . ' - Application Status Updated');
        });

        return null;
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
