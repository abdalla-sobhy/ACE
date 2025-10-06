<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
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
}

// ===================================
// app/Models/SessionAttendance.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionAttendance extends Model
{
    use HasFactory;

    protected $table = 'session_attendance';

    protected $fillable = [
        'session_id',
        'student_id',
        'joined_at',
        'left_at',
        'duration_minutes'
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
        'duration_minutes' => 'integer'
    ];

    public function session()
    {
        return $this->belongsTo(LiveSession::class, 'session_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}

// ===================================
// app/Models/ChatMessage.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'user_id',
        'message',
        'is_announcement'
    ];

    protected $casts = [
        'is_announcement' => 'boolean'
    ];

    public function session()
    {
        return $this->belongsTo(LiveSession::class, 'session_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
