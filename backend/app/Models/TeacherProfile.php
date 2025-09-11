<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherProfile extends Model
{
    protected $fillable = [
        'user_id',
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
}
