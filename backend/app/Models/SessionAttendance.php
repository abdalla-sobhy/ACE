<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionAttendance extends Model
{
    use HasFactory;

    protected $table = 'session_attendance';

    protected $fillable = [
        'session_id',
        'student_id',
        'joined_at',
        'left_at',
        'duration_minutes'
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
        'duration_minutes' => 'integer'
    ];

    public function session()
    {
        return $this->belongsTo(LiveSession::class, 'session_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
