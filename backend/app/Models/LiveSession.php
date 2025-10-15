<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class LiveSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'session_date',
        'start_time',
        'end_time',
        'status',
        'stream_url',
        'stream_key',
        'recording_url',
        'attendees_count'
    ];

    protected $casts = [
        'session_date' => 'date',
        // Don't cast start_time and end_time as datetime since they're TIME columns
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function attendance()
    {
        return $this->hasMany(SessionAttendance::class, 'session_id');
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'session_id');
    }

    public function isLive()
    {
        return $this->status === 'live';
    }

    public function canJoin($userId)
    {
        // Check if user is the teacher
        if ($this->course->teacher_id == $userId) {
            return true;
        }

        // Check if user is enrolled
        return $this->course->enrollments()
            ->where('student_id', $userId)
            ->where('status', 'active')
            ->exists();
    }

    // Helper to get full datetime in Cairo timezone
    public function getSessionStartDateTime()
    {
        return Carbon::parse($this->session_date->format('Y-m-d') . ' ' . $this->start_time, 'Africa/Cairo');
    }

    public function getSessionEndDateTime()
    {
        return Carbon::parse($this->session_date->format('Y-m-d') . ' ' . $this->end_time, 'Africa/Cairo');
    }
}
