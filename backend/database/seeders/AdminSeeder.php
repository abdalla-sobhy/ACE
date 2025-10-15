<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'Edvance',
            'email' => 'admin@Edvance.com',
            'phone' => '+201234567890',
            'password' => Hash::make('Admin@123'),
            'user_type' => 'admin',
            'is_approved' => true,
            'email_verified_at' => now(),
        ]);
    }
}
