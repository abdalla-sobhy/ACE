<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseLesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'video_url',
        'video_type',
        'video_file_path',
        'thumbnail',
        'duration',
        'order_index',
        'is_preview',
        'attachments'
    ];

    protected $casts = [
        'is_preview' => 'boolean',
        'attachments' => 'array',
        'order_index' => 'integer'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function progress()
    {
        return $this->hasMany(LessonProgress::class, 'lesson_id');
    }

    public function userProgress($userId = null)
    {
        $userId = $userId ?? auth()->id();
        return $this->hasOne(LessonProgress::class, 'lesson_id')
                    ->where('user_id', $userId);
    }

    public function getVideoEmbedUrlAttribute()
    {
        switch ($this->video_type) {
            case 'youtube':
                if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/', $this->video_url, $matches)) {
                    return "https://www.youtube.com/embed/{$matches[1]}";
                }
                return $this->video_url;

            case 'vimeo':
                if (preg_match('/vimeo\.com\/(\d+)/', $this->video_url, $matches)) {
                    return "https://player.vimeo.com/video/{$matches[1]}";
                }
                return $this->video_url;

            case 'upload':
                return $this->video_file_path ? url('api/storage/' . $this->video_file_path) : null;

            default:
                return $this->video_url;
        }
    }

    public function getDurationInSecondsAttribute()
    {
        $parts = explode(':', $this->duration);
        $seconds = 0;

        if (count($parts) == 3) {
            // HH:MM:SS
            $seconds = $parts[0] * 3600 + $parts[1] * 60 + $parts[2];
        } elseif (count($parts) == 2) {
            // MM:SS
            $seconds = $parts[0] * 60 + $parts[1];
        }

        return $seconds;
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order_index');
    }

    public function scopePreview($query)
    {
        return $query->where('is_preview', true);
    }
}
