<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'user_type',
        'status',
        'is_approved',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_approved' => 'boolean',
        'password' => 'hashed',
    ];

    public function studentProfile()
    {
        return $this->hasOne(StudentProfile::class);
    }

    public function teacherProfile()
    {
        return $this->hasOne(TeacherProfile::class);
    }

    public function parentProfile()
    {
        return $this->hasOne(ParentProfile::class);
    }
    public function universityStudentProfile()
    {
        return $this->hasOne(UniversityStudentProfile::class);
    }
    public function diditVerification()
    {
        return $this->hasOne(DiditVerification::class);
    }

    public function followRequests()
    {
        return $this->hasMany(ParentStudentFollowRequest::class, 'parent_id');
    }

    public function parentRequests()
    {
        return $this->hasMany(ParentStudentFollowRequest::class, 'student_id');
    }

    public function followedStudents()
    {
        return $this->belongsToMany(User::class, 'parent_student_follow_requests', 'parent_id', 'student_id')
                    ->wherePivot('status', 'approved')
                    ->withTimestamps();
    }

    public function followingParents()
    {
        return $this->belongsToMany(User::class, 'parent_student_follow_requests', 'student_id', 'parent_id')
                    ->wherePivot('status', 'approved')
                    ->withTimestamps();
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function teachingCourses()
    {
        return $this->hasMany(Course::class, 'teacher_id');
    }

    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'course_enrollments', 'student_id', 'course_id')
            ->withPivot('price_paid', 'enrolled_at', 'progress', 'completed_at')
            ->withTimestamps();
    }

    public function company()
    {
        return $this->hasOne(Company::class);
    }

    public function jobApplications()
    {
        return $this->hasMany(JobApplication::class, 'student_id');
    }
}
