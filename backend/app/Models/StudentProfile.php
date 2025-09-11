<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentProfile extends Model
{
    protected $fillable = [
        'user_id',
        'grade',
        'birth_date',
        'preferred_subjects',
        'goal',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'preferred_subjects' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
