<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'teacher_id',
        'price',
        'original_price',
        'duration',
        'lessons_count',
        'students_count',
        'rating',
        'thumbnail',
        'category',
        'grade',
        'course_type',
        'max_seats',
        'enrolled_seats',
        'start_date',
        'end_date',
        'sessions_per_week',
        'is_active',
        'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'rating' => 'decimal:1',
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'max_seats' => 'integer',
        'enrolled_seats' => 'integer',
        'sessions_per_week' => 'integer'
    ];

    // REMOVED 'schedule_summary' from appends since it's causing issues
    protected $appends = ['seats_left', 'is_full'];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function enrollments()
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'course_enrollments', 'course_id', 'student_id')
            ->withPivot('price_paid', 'enrolled_at', 'progress', 'completed_at')
            ->withTimestamps();
    }

    public function sessions()
    {
        return $this->hasMany(LiveSession::class, 'course_id', 'id');
    }

    public function lessons()
    {
        return $this->hasMany(CourseLesson::class)->orderBy('order_index');
    }

    public function getSeatsLeftAttribute()
    {
        if ($this->course_type === 'recorded' || !$this->max_seats) {
            return null;
        }
        return $this->max_seats - $this->enrolled_seats;
    }

    public function getIsFullAttribute()
    {
        if ($this->course_type === 'recorded' || !$this->max_seats) {
            return false;
        }
        return $this->enrolled_seats >= $this->max_seats;
    }

    // FIXED: This method now properly handles string time values
    public function getScheduleSummaryAttribute()
    {
        if ($this->course_type === 'recorded') {
            return null;
        }

        $sessions = $this->sessions()->orderBy('session_date')->get();

        return $sessions->map(function ($session) {
            // Since start_time and end_time are now strings (TIME type from DB),
            // we need to format them properly
            return [
                'date' => $session->session_date ? $session->session_date->format('Y-m-d') : null,
                'start_time' => $session->start_time, // Keep as string (e.g., "20:28:00")
                'end_time' => $session->end_time,     // Keep as string (e.g., "23:59:00")
                'status' => $session->status,
            ];
        });
    }

    // Helper method to get formatted schedule (useful for API responses)
    public function getFormattedSchedule()
    {
        if ($this->course_type === 'recorded') {
            return [];
        }

        return $this->sessions()->orderBy('session_date')->get()->map(function ($session) {
            $startTime = Carbon::createFromFormat('H:i:s', $session->start_time);
            $endTime = Carbon::createFromFormat('H:i:s', $session->end_time);

            return [
                'id' => $session->id,
                'date' => $session->session_date ? $session->session_date->format('Y-m-d') : null,
                'start_time' => $startTime->format('h:i A'),
                'end_time' => $endTime->format('h:i A'),
                'status' => $session->status,
                'day_of_week' => $session->session_date ? $session->session_date->format('l') : null,
            ];
        });
    }

    public function getLessonsCountAttribute()
    {
        return $this->lessons()->count();
    }

    // Scopes
    public function scopeLive($query)
    {
        return $query->where('course_type', 'live');
    }

    public function scopeRecorded($query)
    {
        return $query->where('course_type', 'recorded');
    }

    public function scopeAvailable($query)
    {
        return $query->where(function ($q) {
            $q->where('course_type', 'recorded')
                ->orWhere(function ($q2) {
                    $q2->where('course_type', 'live')
                        ->whereColumn('enrolled_seats', '<', 'max_seats');
                });
        });
    }

    public function scopeUpcoming($query)
    {
        return $query->where('course_type', 'live')
                        ->where('start_date', '>', now());
    }

    public function scopeOngoing($query)
    {
        return $query->where('course_type', 'live')
                        ->where('start_date', '<=', now())
                        ->where('end_date', '>=', now());
    }
}
