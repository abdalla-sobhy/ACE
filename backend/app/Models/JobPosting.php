<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'title',
        'description',
        'requirements',
        'responsibilities',
        'skills_required',
        'skills_preferred',
        'job_type',
        'work_location',
        'location',
        'salary_range',
        'experience_level',
        'education_requirement',
        'faculties_preferred',
        'positions_available',
        'application_deadline',
        'is_active',
        'views_count',
        'applications_count',
    ];

    protected $casts = [
        'requirements' => 'array',
        'responsibilities' => 'array',
        'skills_required' => 'array',
        'skills_preferred' => 'array',
        'faculties_preferred' => 'array',
        'application_deadline' => 'date',
        'is_active' => 'boolean',
        'positions_available' => 'integer',
        'views_count' => 'integer',
        'applications_count' => 'integer',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('application_deadline')
                    ->orWhere('application_deadline', '>=', now());
            });
    }

    public function scopeMatchingSkills($query, $skills)
    {
        return $query->where(function ($q) use ($skills) {
            foreach ($skills as $skill) {
                $q->orWhereJsonContains('skills_required', $skill)
                ->orWhereJsonContains('skills_preferred', $skill);
            }
        });
    }

    public function incrementViews()
    {
        $this->increment('views_count');
    }

    public function getIsExpiredAttribute()
    {
        return $this->application_deadline && $this->application_deadline->isPast();
    }

    public function getApplicationsStatusCountAttribute()
    {
        return $this->applications()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }
}
