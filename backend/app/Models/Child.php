<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_profile_id',
        'name',
        'grade',
        'student_user_id',
    ];

    public function parentProfile()
    {
        return $this->belongsTo(ParentProfile::class);
    }

    public function studentAccount()
    {
        return $this->belongsTo(User::class, 'student_user_id');
    }
}
