#!/usr/bin/env php
<?php

/*
 * Standalone script to create admin user
 * Run with: php create-admin.php
 */

require __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Hash;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    // Check if admin already exists
    $existing = DB::table('users')
        ->where('email', 'admin@edvance.com')
        ->orWhere('user_type', 'admin')
        ->first();

    if ($existing) {
        echo "✗ Admin user already exists!\n";
        echo "  Email: " . $existing->email . "\n";
        echo "  Type: " . $existing->user_type . "\n\n";
        echo "To reset password, delete this user first or use a different email.\n";
        exit(1);
    }

    // Create admin user
    DB::table('users')->insert([
        'first_name' => 'Admin',
        'last_name' => 'Edvance',
        'email' => 'admin@edvance.com',
        'phone' => '+201234567890',
        'password' => '$2y$12$dF7A7NIDyiD2g.nNc3s/KOG6bCYPE6CsTAahBo2BhQYxBjiZakxpe', // Admin@123
        'user_type' => 'admin',
        'status' => 'active',
        'is_approved' => true,
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    echo "✓ Admin user created successfully!\n\n";
    echo "Login credentials:\n";
    echo "  Email: admin@edvance.com\n";
    echo "  Password: Admin@123\n\n";
    echo "You can now login to the admin panel at /admin/dashboard\n";

} catch (\Exception $e) {
    echo "✗ Error creating admin user:\n";
    echo "  " . $e->getMessage() . "\n\n";
    echo "Please check your database connection and try again.\n";
    exit(1);
}
