<?php
// database/seeders/TestDataSeeder.php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\ParentProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Create teachers
        $teacher1 = User::create([
            'first_name' => 'أحمد',
            'last_name' => 'محمد',
            'email' => 'ahmed.mohamed@teacher.com',
            'phone' => '+201001234567',
            'password' => Hash::make('password123'),
            'user_type' => 'teacher',
            'status' => 'active',
            'is_approved' => 1,
            'email_verified_at' => now(),
        ]);

        TeacherProfile::create([
            'user_id' => $teacher1->id,
            'specialization' => 'math',
            'years_of_experience' => '5-10',
            'cv_path' => null,  // Optional
            'didit_data' => json_encode([
                'verified' => true,
                'verification_date' => now()->toDateString()
            ])
        ]);

        $teacher2 = User::create([
            'first_name' => 'فاطمة',
            'last_name' => 'علي',
            'email' => 'fatma.ali@teacher.com',
            'phone' => '+201001234568',
            'password' => Hash::make('password123'),
            'user_type' => 'teacher',
            'status' => 'active',
            'is_approved' => 1,
            'email_verified_at' => now(),
        ]);

        TeacherProfile::create([
            'user_id' => $teacher2->id,
            'specialization' => 'science',
            'years_of_experience' => '3-5',
            'cv_path' => null,
            'didit_data' => json_encode([
                'verified' => true,
                'verification_date' => now()->toDateString()
            ])
        ]);

        $teacher3 = User::create([
            'first_name' => 'محمود',
            'last_name' => 'حسن',
            'email' => 'mahmoud.hassan@teacher.com',
            'phone' => '+201001234569',
            'password' => Hash::make('password123'),
            'user_type' => 'teacher',
            'status' => 'active',
            'is_approved' => 1,
            'email_verified_at' => now(),
        ]);

        TeacherProfile::create([
            'user_id' => $teacher3->id,
            'specialization' => 'arabic',
            'years_of_experience' => '10+',
            'cv_path' => null,
            'didit_data' => json_encode([
                'verified' => true,
                'verification_date' => now()->toDateString()
            ])
        ]);

        // Create test students for different grades
        $students = [
            ['name' => 'محمد علي', 'email' => 'student1@test.com', 'grade' => 'prep_1'],
            ['name' => 'سارة أحمد', 'email' => 'student2@test.com', 'grade' => 'prep_2'],
            ['name' => 'عمر حسن', 'email' => 'student3@test.com', 'grade' => 'secondary_1'],
        ];

        foreach ($students as $studentData) {
            $names = explode(' ', $studentData['name']);
            $student = User::create([
                'first_name' => $names[0],
                'last_name' => $names[1] ?? '',
                'email' => $studentData['email'],
                'phone' => '+2010' . rand(10000000, 99999999),
                'password' => Hash::make('password123'),
                'user_type' => 'student',
                'status' => 'active',
                'is_approved' => 1,
                'email_verified_at' => now(),
            ]);

            StudentProfile::create([
                'user_id' => $student->id,
                'grade' => $studentData['grade'],
                'birth_date' => now()->subYears(15)->format('Y-m-d'),
            ]);
        }

        // Create a test parent
        $parent = User::create([
            'first_name' => 'عبد الله',
            'last_name' => 'محمد',
            'email' => 'parent@test.com',
            'phone' => '+201098765432',
            'password' => Hash::make('password123'),
            'user_type' => 'parent',
            'status' => 'active',
            'is_approved' => 1,
            'email_verified_at' => now(),
        ]);

        ParentProfile::create([
            'user_id' => $parent->id,
            'children_count' => '2',
            'didit_data' => json_encode([
                'verified' => true,
                'verification_date' => now()->toDateString()
            ])
        ]);

        // Define course templates
        $courseTemplates = [
            [
                'title_template' => 'الرياضيات - {grade}',
                'category' => 'math',
                'description' => 'كورس شامل في الرياضيات يغطي جميع دروس المنهج بشرح مبسط وتدريبات متنوعة',
                'teacher_id' => $teacher1->id,
            ],
            [
                'title_template' => 'العلوم - {grade}',
                'category' => 'science',
                'description' => 'شرح مفصل لمنهج العلوم مع التجارب العملية والأنشطة التفاعلية',
                'teacher_id' => $teacher2->id,
            ],
            [
                'title_template' => 'اللغة العربية - {grade}',
                'category' => 'arabic',
                'description' => 'دروس شاملة في النحو والصرف والبلاغة والنصوص والقراءة',
                'teacher_id' => $teacher3->id,
            ],
            [
                'title_template' => 'اللغة الإنجليزية - {grade}',
                'category' => 'english',
                'description' => 'تطوير مهارات اللغة الإنجليزية في القراءة والكتابة والمحادثة والاستماع',
                'teacher_id' => $teacher1->id,
            ],
            [
                'title_template' => 'الدراسات الاجتماعية - {grade}',
                'category' => 'social',
                'description' => 'رحلة شيقة في التاريخ والجغرافيا مع الخرائط والوسائل التوضيحية',
                'teacher_id' => $teacher2->id,
            ],
        ];

        // Create courses for specific grades
        $grades = ['prep_1', 'prep_2', 'prep_3', 'secondary_1', 'secondary_2', 'secondary_3'];

        foreach ($grades as $grade) {
            foreach ($courseTemplates as $template) {
                Course::create([
                    'title' => str_replace('{grade}', $this->getGradeLabel($grade), $template['title_template']),
                    'description' => $template['description'],
                    'teacher_id' => $template['teacher_id'],
                    'category' => $template['category'],
                    'price' => rand(100, 250),
                    'original_price' => rand(250, 400),
                    'duration' => rand(15, 30) . ' ساعة',
                    'lessons_count' => rand(30, 60),
                    'students_count' => rand(50, 300),
                    'rating' => rand(40, 50) / 10,
                    'grade' => $grade,
                    'is_active' => true,
                ]);
            }
        }

        $this->command->info('✅ Test data created successfully!');
        $this->command->info('');
        $this->command->info('👨‍🏫 Teachers created:');
        $this->command->info('   - ahmed.mohamed@teacher.com');
        $this->command->info('   - fatma.ali@teacher.com');
        $this->command->info('   - mahmoud.hassan@teacher.com');
        $this->command->info('');
        $this->command->info('👨‍🎓 Students created:');
        $this->command->info('   - student1@test.com (prep_1)');
        $this->command->info('   - student2@test.com (prep_2)');
        $this->command->info('   - student3@test.com (secondary_1)');
        $this->command->info('');
        $this->command->info('👨‍👩‍👧‍👦 Parent created:');
        $this->command->info('   - parent@test.com');
        $this->command->info('');
        $this->command->info('🔐 Password for all accounts: password123');
        $this->command->info('');
        $this->command->info('📚 Courses created for grades: prep_1, prep_2, prep_3, secondary_1, secondary_2, secondary_3');
    }

    private function getGradeLabel($grade)
    {
        $labels = [
            'primary_1' => 'الصف الأول الابتدائي',
            'primary_2' => 'الصف الثاني الابتدائي',
            'primary_3' => 'الصف الثالث الابتدائي',
            'primary_4' => 'الصف الرابع الابتدائي',
            'primary_5' => 'الصف الخامس الابتدائي',
            'primary_6' => 'الصف السادس الابتدائي',
            'prep_1' => 'الصف الأول الإعدادي',
            'prep_2' => 'الصف الثاني الإعدادي',
            'prep_3' => 'الصف الثالث الإعدادي',
            'secondary_1' => 'الصف الأول الثانوي',
            'secondary_2' => 'الصف الثاني الثانوي',
            'secondary_3' => 'الصف الثالث الثانوي',
        ];
        return $labels[$grade] ?? $grade;
    }
}
