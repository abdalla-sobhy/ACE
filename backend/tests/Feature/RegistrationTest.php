<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\StudentProfile;
use App\Models\ParentProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_student_can_register()
    {
        $response = $this->postJson('/api/auth/register', [
            'userType' => 'student',
            'basicData' => [
                'firstName' => 'أحمد',
                'lastName' => 'محمد',
                'email' => 'student@example.com',
                'phone' => '+201234567890',
                'password' => 'Password123',
                'grade' => 'secondary-1',
                'birthDate' => '2007-01-01',
            ]
        ]);

        $response->assertStatus(201)
                    ->assertJson([
                        'success' => true,
                        'message' => 'تم إنشاء حسابك بنجاح!'
                    ]);

        $this->assertDatabaseHas('users', [
            'email' => 'student@example.com',
            'user_type' => 'student'
        ]);
    }

    public function test_teacher_registration_requires_cv()
    {
        $response = $this->postJson('/api/auth/register', [
            'userType' => 'teacher',
            'basicData' => [
                'firstName' => 'محمد',
                'lastName' => 'أحمد',
                'email' => 'teacher@example.com',
                'phone' => '+201234567890',
                'password' => 'Password123',
            ],
            'teacherData' => [
                'specialization' => 'math',
                'yearsOfExperience' => '3-5',
            ],
            'diditData' => [
                'sessionId' => 'test-session-123',
                'sessionNumber' => 12345,
                'status' => 'Approved',
            ]
            // Missing CV
        ]);

        $response->assertStatus(422)
                    ->assertJsonValidationErrors(['cv']);
    }

    public function test_teacher_can_register_with_cv()
    {
        $cv = UploadedFile::fake()->create('cv.pdf', 1000);

        $response = $this->postJson('/api/auth/register', [
            'userType' => 'teacher',
            'basicData' => [
                'firstName' => 'محمد',
                'lastName' => 'أحمد',
                'email' => 'teacher@example.com',
                'phone' => '+201234567890',
                'password' => 'Password123',
            ],
            'teacherData' => [
                'specialization' => 'math',
                'yearsOfExperience' => '3-5',
            ],
            'cv' => $cv,
            'diditData' => [
                'sessionId' => 'test-session-123',
                'sessionNumber' => 12345,
                'status' => 'Approved',
            ],
            'personalInfo' => [
                'dateOfBirth' => '1990-01-01',
                'nationalId' => '29001011234567',
            ]
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'teacher@example.com',
            'user_type' => 'teacher',
            'is_approved' => false
        ]);
    }

    public function test_parent_student_follow_request()
    {
        // Create parent and student users with explicit type casting
        /** @var User $parent */
        $parent = User::factory()->create(['user_type' => 'parent']);

        /** @var User $student */
        $student = User::factory()->create(['user_type' => 'student']);

        // Create student profile
        StudentProfile::create([
            'user_id' => $student->id,
            'grade' => 'secondary-1',
            'birth_date' => '2007-01-01'
        ]);

        $this->actingAs($parent, 'sanctum');

        $response = $this->postJson('/api/parent/follow-request', [
            'student_id' => $student->id
        ]);

        $response->assertStatus(200)
                    ->assertJson([
                        'success' => true,
                        'message' => 'تم إرسال طلب المتابعة بنجاح'
                    ]);

        $this->assertDatabaseHas('parent_student_follow_requests', [
            'parent_id' => $parent->id,
            'student_id' => $student->id,
            'status' => 'pending'
        ]);
    }
}
