<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Course;
use App\Models\LiveSession;
use Carbon\Carbon;

class GenerateLiveSessions extends Command
{
    protected $signature = 'sessions:generate {courseId?}';
    protected $description = 'Generate live sessions for live courses';

    public function handle()
    {
        $courseId = $this->argument('courseId');

        $query = Course::where('course_type', 'live')
            ->where('is_active', true);

        if ($courseId) {
            $query->where('id', $courseId);
        }

        $courses = $query->get();

        foreach ($courses as $course) {
            $this->generateSessionsForCourse($course);
        }

        $this->info('Live sessions generated successfully!');
    }

    private function generateSessionsForCourse($course)
    {
        if (!$course->sessions || $course->sessions->count() == 0) {
            $this->warn("No schedule found for course: {$course->title}");
            return;
        }

        $startDate = $course->start_date ?? Carbon::now();
        $endDate = $course->end_date ?? Carbon::now()->addMonths(3);

        foreach ($course->sessions as $schedule) {
            $current = Carbon::parse($startDate);

            while ($current <= $endDate) {
                if (strtolower($current->format('l')) == $schedule->day_of_week) {
                    // Check if session already exists
                    $exists = LiveSession::where('course_id', $course->id)
                        ->where('session_date', $current->format('Y-m-d'))
                        ->exists();

                    if (!$exists) {
                        LiveSession::create([
                            'course_id' => $course->id,
                            'session_date' => $current->format('Y-m-d'),
                            'start_time' => $schedule->start_time,
                            'end_time' => $schedule->end_time,
                            'status' => 'scheduled'
                        ]);

                        $this->info("Created session for {$course->title} on {$current->format('Y-m-d')}");
                    }
                }
                $current->addDay();
            }
        }
        $this->activateLiveSessions();
    }

    private function activateLiveSessions()
{
    $now = Carbon::now();

    $sessions = LiveSession::where('status', 'scheduled')
        ->whereDate('session_date', $now->toDateString())
        ->get();

    foreach ($sessions as $session) {
        $startDateTime = Carbon::parse($session->start_time);
$endDateTime = Carbon::parse($session->end_time);


        if ($now->between($startDateTime->subMinutes(10), $endDateTime)) {
            $session->update(['status' => 'live']);
            $this->info("Activated session {$session->id} for course {$session->course_id}");
        }

        if ($now->greaterThan($endDateTime)) {
            $session->update(['status' => 'ended']);
            $this->info("Ended session {$session->id} for course {$session->course_id}");
        }
    }
}

}
