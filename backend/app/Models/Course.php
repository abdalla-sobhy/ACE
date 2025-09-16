<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'is_active'
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

    protected $appends = ['seats_left', 'is_full', 'schedule_summary'];

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
        return $this->hasMany(CourseSession::class);
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

    public function getScheduleSummaryAttribute()
    {
        if ($this->course_type === 'recorded') {
            return null;
        }

        $sessions = $this->sessions()->orderByRaw("
            FIELD(day_of_week, 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday')
        ")->get();

        return $sessions->map(function ($session) {
            return [
                'day' => $session->day_of_week,
                'day_arabic' => $session->day_arabic,
                'start_time' => $session->start_time->format('h:i A'),
                'end_time' => $session->end_time->format('h:i A'),
                'duration' => $session->duration_minutes . ' دقيقة'
            ];
        });
    }

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
