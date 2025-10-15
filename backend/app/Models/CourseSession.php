<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CourseSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'day_of_week',
        'start_time',
        'end_time',
        'session_date',
        'duration_minutes'
    ];

    // Don't cast start_time and end_time as datetime since they're TIME columns
    protected $casts = [
        'session_date' => 'date',
        'duration_minutes' => 'integer'
    ];

    protected $appends = ['day_arabic', 'time_range'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function getDayArabicAttribute()
    {
        $days = [
            'saturday' => 'السبت',
            'sunday' => 'الأحد',
            'monday' => 'الإثنين',
            'tuesday' => 'الثلاثاء',
            'wednesday' => 'الأربعاء',
            'thursday' => 'الخميس',
            'friday' => 'الجمعة'
        ];

        return $days[strtolower($this->day_of_week)] ?? $this->day_of_week;
    }

    public function getTimeRangeAttribute()
    {
        try {
            $startTime = Carbon::createFromFormat('H:i:s', $this->start_time);
            $endTime = Carbon::createFromFormat('H:i:s', $this->end_time);

            return sprintf(
                '%s - %s',
                $startTime->format('h:i A'),
                $endTime->format('h:i A')
            );
        } catch (\Exception $e) {
            return $this->start_time . ' - ' . $this->end_time;
        }
    }

    // Helper method to get formatted start time
    public function getFormattedStartTime()
    {
        try {
            return Carbon::createFromFormat('H:i:s', $this->start_time)->format('h:i A');
        } catch (\Exception $e) {
            return $this->start_time;
        }
    }

    // Helper method to get formatted end time
    public function getFormattedEndTime()
    {
        try {
            return Carbon::createFromFormat('H:i:s', $this->end_time)->format('h:i A');
        } catch (\Exception $e) {
            return $this->end_time;
        }
    }
}
