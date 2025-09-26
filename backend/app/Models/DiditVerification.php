<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiditVerification extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'session_number',
        'status',
        'vendor_data',
        'metadata',
        'personal_info',
        'checks',
    ];

    protected $casts = [
        'metadata' => 'array',
        'personal_info' => 'array',
        'checks' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
