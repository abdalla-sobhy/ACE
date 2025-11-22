<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_posting_id',
        'student_id',
        'cover_letter',
        'status',
        'status_history',
        'company_notes',
        'viewed_at',
        'interview_date',
        'interview_location',
        'interview_notes',
        'is_favorite',
    ];

    protected $casts = [
        'status_history' => 'array',
        'viewed_at' => 'datetime',
        'interview_date' => 'datetime',
        'is_favorite' => 'boolean',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_REVIEWING = 'reviewing';
    const STATUS_SHORTLISTED = 'shortlisted';
    const STATUS_INTERVIEWED = 'interviewed';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_REJECTED = 'rejected';
    const STATUS_WITHDRAWN = 'withdrawn';

    public static $statuses = [
        self::STATUS_PENDING => 'قيد الانتظار',
        self::STATUS_REVIEWING => 'قيد المراجعة',
        self::STATUS_SHORTLISTED => 'مرشح مبدئياً',
        self::STATUS_INTERVIEWED => 'تمت المقابلة',
        self::STATUS_ACCEPTED => 'مقبول',
        self::STATUS_REJECTED => 'مرفوض',
        self::STATUS_WITHDRAWN => 'تم السحب',
    ];

    public function jobPosting()
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function updateStatus($newStatus, $notes = null)
    {
        $history = $this->status_history ?? [];
        $history[] = [
            'status' => $newStatus,
            'changed_at' => now()->toDateTimeString(),
            'notes' => $notes,
        ];

        $this->update([
            'status' => $newStatus,
            'status_history' => $history,
        ]);

        // Send notification to student
        $this->student->notify(new \App\Notifications\ApplicationStatusUpdated($this));
    }

    public function markAsViewed()
    {
        if (!$this->viewed_at) {
            $this->update(['viewed_at' => now()]);
        }
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeFavorites($query)
    {
        return $query->where('is_favorite', true);
    }

    public function getStatusColorAttribute()
    {
        return [
            self::STATUS_PENDING => '#ffc107',
            self::STATUS_REVIEWING => '#17a2b8',
            self::STATUS_SHORTLISTED => '#58a6ff',
            self::STATUS_INTERVIEWED => '#6f42c1',
            self::STATUS_ACCEPTED => '#3fb950',
            self::STATUS_REJECTED => '#f85149',
            self::STATUS_WITHDRAWN => '#8b949e',
        ][$this->status] ?? '#6e7681';
    }
}
