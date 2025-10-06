<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UniversityStudentProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'faculty',
        'goal',
        'university',
        'year_of_study',
        'gpa',
        'bio',
        'skills',
        'achievements',
        'languages',
        'experience',
        'projects',
        'certifications',
        'cv_path',
        'cv_filename',
        'linkedin_url',
        'github_url',
        'portfolio_url',
        'is_public',
        'looking_for_opportunities',
        'preferred_job_types',
        'available_from',
        'profile_views',
        'cv_downloads',
    ];

    protected $casts = [
        'year_of_study' => 'integer',
        'gpa' => 'decimal:2',
        'is_public' => 'boolean',
        'looking_for_opportunities' => 'boolean',
        'available_from' => 'date',
        'profile_views' => 'integer',
        'cv_downloads' => 'integer',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get skills as array
     */
    public function getSkillsArrayAttribute()
    {
        return json_decode($this->skills, true) ?? [];
    }

    /**
     * Get achievements as array
     */
    public function getAchievementsArrayAttribute()
    {
        return json_decode($this->achievements, true) ?? [];
    }

    /**
     * Get languages as array
     */
    public function getLanguagesArrayAttribute()
    {
        return json_decode($this->languages, true) ?? [];
    }

    /**
     * Get experience as array
     */
    public function getExperienceArrayAttribute()
    {
        return json_decode($this->experience, true) ?? [];
    }

    /**
     * Get projects as array
     */
    public function getProjectsArrayAttribute()
    {
        return json_decode($this->projects, true) ?? [];
    }

    /**
     * Get certifications as array
     */
    public function getCertificationsArrayAttribute()
    {
        return json_decode($this->certifications, true) ?? [];
    }

    /**
     * Get preferred job types as array
     */
    public function getPreferredJobTypesArrayAttribute()
    {
        return json_decode($this->preferred_job_types, true) ?? [];
    }

    /**
     * Calculate profile completeness percentage
     */
    public function getCompletenessPercentageAttribute()
    {
        $fields = [
            'faculty',
            'goal',
            'university',
            'year_of_study',
            'gpa',
            'bio',
            'skills',
            'cv_path',
            'linkedin_url',
            'languages'
        ];

        $completed = 0;
        foreach ($fields as $field) {
            if (!empty($this->$field)) {
                $completed++;
            }
        }

        return round(($completed / count($fields)) * 100);
    }

    /**
     * Scope for public profiles
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope for profiles looking for opportunities
     */
    public function scopeLookingForOpportunities($query)
    {
        return $query->where('looking_for_opportunities', true);
    }

    /**
     * Scope for profiles available from a certain date
     */
    public function scopeAvailableFrom($query, $date)
    {
        return $query->where('available_from', '<=', $date);
    }

    /**
     * Increment profile views
     */
    public function incrementViews()
    {
        $this->increment('profile_views');
    }

    /**
     * Increment CV downloads
     */
    public function incrementCvDownloads()
    {
        $this->increment('cv_downloads');
    }
}
