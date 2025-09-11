<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => '+2012' . $this->faker->numerify('########'),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'user_type' => $this->faker->randomElement(['student', 'teacher', 'parent']),
            'is_approved' => true,
            'remember_token' => Str::random(10),
        ];
    }

    public function student()
    {
        return $this->state(function (array $attributes) {
            return [
                'user_type' => 'student',
            ];
        });
    }

    public function teacher()
    {
        return $this->state(function (array $attributes) {
            return [
                'user_type' => 'teacher',
            ];
        });
    }

    public function parent()
    {
        return $this->state(function (array $attributes) {
            return [
                'user_type' => 'parent',
            ];
        });
    }

    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }

    public function unapproved()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_approved' => false,
            ];
        });
    }
}
