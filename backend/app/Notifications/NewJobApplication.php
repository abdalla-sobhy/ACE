<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;
use App\Models\JobApplication;

class NewJobApplication extends Notification
{
    use Queueable;

    protected $application;

    public function __construct(JobApplication $application)
    {
        $this->application = $application;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toMail($notifiable)
    {
        // Get the appropriate email address
        $email = $this->getEmailAddress($notifiable);

        // Arabic content
        $title = 'طلب جديد للوظيفة: ' . $this->application->jobPosting->title;
        $greeting = 'مرحباً ' . $notifiable->first_name;
        $message = 'تلقيت طلب توظيف جديد:';
        $additionalInfo = [
            'المتقدم: ' . $this->application->student->first_name . ' ' . $this->application->student->last_name,
            'الوظيفة: ' . $this->application->jobPosting->title,
            'شكراً لاستخدامك منصتنا!'
        ];
        $actionUrl = url('/company/applications/' . $this->application->id);
        $actionText = 'عرض الطلب';

        // English content
        $titleEn = 'New Job Application: ' . $this->application->jobPosting->title;
        $greetingEn = 'Hello ' . $notifiable->first_name;
        $messageEn = 'You have received a new job application:';
        $additionalInfoEn = [
            'Applicant: ' . $this->application->student->first_name . ' ' . $this->application->student->last_name,
            'Job: ' . $this->application->jobPosting->title,
            'Thank you for using our platform!'
        ];
        $actionTextEn = 'View Application';

        Mail::send('emails.notification', compact(
            'title', 'greeting', 'message', 'additionalInfo',
            'titleEn', 'greetingEn', 'messageEn', 'additionalInfoEn',
            'actionUrl', 'actionText', 'actionTextEn'
        ), function ($mail) use ($email, $title) {
            $mail->to($email)->subject($title . ' - New Job Application');
        });

        return null;
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

    /**
     * Get the email address for the notification
     */
    private function getEmailAddress($notifiable)
    {
        return $notifiable->email;
    }
}
