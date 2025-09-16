<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseSession;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class LiveCourseSeeder extends Seeder
{
    public function run()
    {
        $teachers = User::where('user_type', 'teacher')->get();

        if ($teachers->isEmpty()) {
            $this->command->error('No teachers found. Please run TestDataSeeder first.');
            return;
        }

        $liveCourses = [
            [
                'title' => 'دورة مكثفة في الرياضيات - بث مباشر',
                'description' => 'دورة تفاعلية مباشرة مع حل التمارين والأسئلة المباشرة',
                'category' => 'math',
                'sessions' => [
                    ['day' => 'saturday', 'start' => '16:00', 'end' => '19:00'],
                    ['day' => 'wednesday', 'start' => '09:00', 'end' => '12:00']
                ],
                'max_seats' => 30,
                'enrolled_seats' => 12
            ],
            [
                'title' => 'مراجعة نهائية للعلوم - جلسات مباشرة',
                'description' => 'مراجعة شاملة مع تجارب عملية مباشرة وتفاعل مع الطلاب',
                'category' => 'science',
                'sessions' => [
                    ['day' => 'sunday', 'start' => '17:00', 'end' => '19:00'],
                    ['day' => 'tuesday', 'start' => '17:00', 'end' => '19:00'],
                    ['day' => 'thursday', 'start' => '17:00', 'end' => '19:00']
                ],
                'max_seats' => 25,
                'enrolled_seats' => 20
            ],
            [
                'title' => 'اللغة العربية - نحو وصرف مباشر',
                'description' => 'شرح تفاعلي مع تطبيق فوري وتصحيح الأخطاء مباشرة',
                'category' => 'arabic',
                'sessions' => [
                    ['day' => 'monday', 'start' => '18:00', 'end' => '20:00'],
                    ['day' => 'thursday', 'start' => '18:00', 'end' => '20:00']
                ],
                'max_seats' => 20,
                'enrolled_seats' => 18
            ],
            [
                'title' => 'محادثة إنجليزية تفاعلية',
                'description' => 'ممارسة المحادثة المباشرة مع تصحيح النطق والقواعد',
                'category' => 'english',
                'sessions' => [
                    ['day' => 'saturday', 'start' => '10:00', 'end' => '12:00'],
                    ['day' => 'tuesday', 'start' => '19:00', 'end' => '21:00']
                ],
                'max_seats' => 15,
                'enrolled_seats' => 8
            ]
        ];

        $grades = ['prep_1', 'prep_2', 'prep_3', 'secondary_1'];

        foreach ($grades as $grade) {
            foreach ($liveCourses as $courseData) {
                $teacher = $teachers->random();

                $course = Course::create([
                    'title' => $courseData['title'] . ' - ' . $this->getGradeLabel($grade),
                    'description' => $courseData['description'],
                    'teacher_id' => $teacher->id,
                    'price' => rand(200, 400),
                    'original_price' => rand(400, 600),
                    'duration' => count($courseData['sessions']) * 12 . ' ساعة', // 12 weeks
                    'lessons_count' => count($courseData['sessions']) * 12,
                    'students_count' => $courseData['enrolled_seats'],
                    'rating' => rand(42, 50) / 10,
                    'category' => $courseData['category'],
                    'grade' => $grade,
                    'course_type' => 'live',
                    'max_seats' => $courseData['max_seats'],
                    'enrolled_seats' => $courseData['enrolled_seats'],
                    'start_date' => Carbon::now()->addDays(rand(7, 30)),
                    'end_date' => Carbon::now()->addDays(rand(90, 120)),
                    'sessions_per_week' => count($courseData['sessions']),
                    'is_active' => true
                ]);

                // Create sessions
                foreach ($courseData['sessions'] as $session) {
                    CourseSession::create([
                        'course_id' => $course->id,
                        'day_of_week' => $session['day'],
                        'start_time' => $session['start'],
                        'end_time' => $session['end']
                    ]);
                }
            }
        }

        $this->command->info('✅ Live courses created successfully!');
        $this->command->info('📹 Created ' . count($liveCourses) * count($grades) . ' live courses with schedules');
    }

    private function getGradeLabel($grade)
    {
        $labels = [
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
