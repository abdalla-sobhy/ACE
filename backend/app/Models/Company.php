<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'industry',
        'company_size',
        'website',
        'description',
        'logo_path',
        'profile_picture',
        'location',
        'founded_year',
        'benefits',
        'linkedin_url',
        'registration_number',
        'is_verified',
    ];

    protected $casts = [
        'benefits' => 'array',
        'is_verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class);
    }

    public function activeJobPostings()
    {
        return $this->hasMany(JobPosting::class)->where('is_active', true);
    }

    public function getLogoUrlAttribute()
    {
        return $this->logo_path ? asset('storage/' . $this->logo_path) : null;
    }

    public function getProfilePictureUrlAttribute()
    {
        return $this->profile_picture ? asset('storage/' . $this->profile_picture) : null;
    }

    public function getTotalApplicationsAttribute()
    {
        return $this->jobPostings()->sum('applications_count');
    }

    public function getActiveJobsCountAttribute()
    {
        return $this->activeJobPostings()->count();
    }
}
