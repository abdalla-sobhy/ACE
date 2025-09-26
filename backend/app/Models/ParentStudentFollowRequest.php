<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParentStudentFollowRequest extends Model
{
    protected $fillable = [
        'parent_id',
        'student_id',
        'status',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
