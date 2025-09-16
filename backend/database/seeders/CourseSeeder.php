<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run()
    {
        $teachers = User::where('user_type', 'teacher')->get();

        if ($teachers->isEmpty()) {
            $this->command->info('No teachers found. Please create teacher accounts first.');
            return;
        }

        $courses = [
            [
                'title' => 'أساسيات الرياضيات للصف الأول الإعدادي',
                'description' => 'كورس شامل يغطي جميع دروس الرياضيات للصف الأول الإعدادي بطريقة سهلة ومبسطة',
                'category' => 'math',
                'grade' => 'prep_1',
                'price' => 150,
                'original_price' => 200,
                'duration' => '20 ساعة',
                'lessons_count' => 45
            ],
            [

                'title' => 'اللغة العربية - قواعد النحو',
                'description' => 'شرح مفصل لقواعد النحو والصرف للمرحلة الإعدادية مع تدريبات عملية',
                'category' => 'arabic',
                'grade' => 'prep_1',
                'price' => 120,
                'original_price' => 180,
                'duration' => '15 ساعة',
                'lessons_count' => 30
            ],
            [
                'title' => 'العلوم - الفيزياء والكيمياء',
                'description' => 'دروس تفاعلية في الفيزياء والكيمياء مع تجارب عملية',
                'category' => 'science',
                'grade' => 'prep_1',
                'price' => 180,
                'original_price' => 250,
                'duration' => '25 ساعة',
                'lessons_count' => 50
            ],
            [
                'title' => 'اللغة الإنجليزية - المحادثة والقواعد',
                'description' => 'تحسين مهارات المحادثة والقواعد الأساسية في اللغة الإنجليزية',
                'category' => 'english',
                'grade' => 'prep_1',
                'price' => 160,
                'duration' => '18 ساعة',
                'lessons_count' => 40
            ],
            [
                'title' => 'الدراسات الاجتماعية - التاريخ والجغرافيا',
                'description' => 'رحلة شيقة عبر التاريخ المصري والجغرافيا',
                'category' => 'social',
                'grade' => 'prep_1',
                'price' => 100,
                'original_price' => 150,
                'duration' => '12 ساعة',
                'lessons_count' => 25
            ]
        ];

        foreach ($courses as $courseData) {
            Course::create([
                ...$courseData,
                'teacher_id' => $teachers->random()->id,
                'students_count' => rand(50, 500),
                'rating' => rand(35, 50) / 10, // 3.5 to 5.0
                'is_active' => true
            ]);
        }

        $this->command->info('Courses seeded successfully!');
    }
}
