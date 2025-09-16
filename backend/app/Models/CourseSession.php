<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'day_of_week',
        'start_time',
        'end_time'
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i'
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

        return $days[$this->day_of_week] ?? $this->day_of_week;
    }

    public function getTimeRangeAttribute()
    {
        return sprintf(
            '%s - %s',
            $this->start_time->format('h:i A'),
            $this->end_time->format('h:i A')
        );
    }
}
