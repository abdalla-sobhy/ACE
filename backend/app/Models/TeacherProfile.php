<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherProfile extends Model
{
    protected $fillable = [
        'user_id',
        'profile_picture',
        'specialization',
        'years_of_experience',
        'cv_path',
        'didit_data',
    ];

    protected $casts = [
        'didit_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the profile picture URL.
     */
    public function getProfilePictureUrlAttribute()
    {
        return $this->profile_picture ? url('api/storage/' . $this->profile_picture) : null;
    }
}
