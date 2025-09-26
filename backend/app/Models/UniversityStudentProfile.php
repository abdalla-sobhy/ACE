<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UniversityStudentProfile extends Model
{
    protected $fillable = [
        'user_id',
        'faculty',
        'goal',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
