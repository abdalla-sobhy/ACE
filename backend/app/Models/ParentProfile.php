<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParentProfile extends Model
{
    protected $fillable = [
        'user_id',
        'children_count',
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
