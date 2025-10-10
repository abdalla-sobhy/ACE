<?php
// database/seeders/TestDataSeeder.php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\ParentProfile;
use App\Models\UniversityStudentProfile;
use App\Models\JobPosting;
use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run()
    {

        // Create test companies
$companies = [
    [
        'user' => [
            'first_name' => 'أحمد',
            'last_name' => 'السيد',
            'email' => 'company1@test.com',
            'phone' => '+201234567890',
            'password' => Hash::make('password123'),
            'user_type' => 'company',
            'is_approved' => true,
        ],
        'company' => [
            'company_name' => 'شركة التقنية المتقدمة',
            'industry' => 'تكنولوجيا المعلومات',
            'company_size' => '51-200',
            'location' => 'القاهرة، مصر',
            'website' => 'https://example.com',
            'description' => 'شركة رائدة في مجال تطوير البرمجيات والحلول التقنية',
            'is_verified' => true,
        ]
    ],
    [
        'user' => [
            'first_name' => 'سارة',
            'last_name' => 'محمد',
            'email' => 'company2@test.com',
            'phone' => '+201234567891',
            'password' => Hash::make('password123'),
            'user_type' => 'company',
            'is_approved' => true,
        ],
        'company' => [
            'company_name' => 'مجموعة النيل للاستثمار',
            'industry' => 'الخدمات المالية',
            'company_size' => '201-500',
            'location' => 'الجيزة، مصر',
            'description' => 'مجموعة استثمارية رائدة في مجال الخدمات المالية',
            'is_verified' => true,
        ]
    ]
];

foreach ($companies as $companyData) {
    $user = User::create($companyData['user']);
    Company::create(array_merge(
        ['user_id' => $user->id],
        $companyData['company']
    ));
}

// Create job postings
$jobPostings = [
        [
        'company_id' => 1,
        'title' => 'متدرب تطوير تطبيقات الموبايل',
        'description' => 'فرصة تدريب ممتازة في تطوير تطبيقات الموبايل باستخدام React Native',
        'requirements' => ['طالب في كلية حاسبات أو هندسة', 'معرفة أساسية بـ JavaScript', 'شغف بتطوير التطبيقات'],
        'responsibilities' => ['المساعدة في تطوير التطبيقات', 'التعلم من الفريق', 'المشاركة في الاجتماعات'],
        'skills_required' => ['JavaScript', 'React basics', 'Problem Solving'],
        'skills_preferred' => ['React Native', 'Mobile Development', 'UI/UX'],
        'job_type' => 'internship',
        'work_location' => 'onsite',
        'location' => 'القاهرة الجديدة',
        'salary_range' => '3,000 - 5,000 جنيه',
        'experience_level' => 'entry',
        'education_requirement' => 'طالب جامعي في السنة الثالثة أو الرابعة',
        'faculties_preferred' => ['كلية الحاسبات والمعلومات', 'كلية الهندسة - قسم حاسبات'],
        'positions_available' => 3,
        'application_deadline' => now()->addDays(30),
    ],
    [
        'company_id' => 2,
        'title' => 'محلل مالي Junior',
        'description' => 'نبحث عن محلل مالي مبتدئ للانضمام لفريق التحليل المالي',
        'requirements' => ['بكالوريوس تجارة أو اقتصاد', 'إجادة Excel', 'مهارات تحليلية قوية'],
        'responsibilities' => ['إعداد التقارير المالية', 'تحليل البيانات', 'دعم الفريق المالي'],
        'skills_required' => ['Excel', 'Financial Analysis', 'Data Analysis'],
        'skills_preferred' => ['PowerBI', 'SQL', 'Python'],
        'job_type' => 'full_time',
        'work_location' => 'onsite',
        'location' => 'الجيزة',
        'salary_range' => '8,000 - 12,000 جنيه',
        'experience_level' => 'entry',
        'education_requirement' => 'بكالوريوس تجارة - قسم المحاسبة أو المالية',
        'faculties_preferred' => ['كلية التجارة', 'كلية الاقتصاد والعلوم السياسية'],
        'positions_available' => 1,
        'application_deadline' => now()->addDays(45),
    ],
];

foreach ($jobPostings as $job) {
    JobPosting::create(array_merge($job, [
        'is_active' => true,
        'views_count' => rand(50, 300),
        'applications_count' => rand(5, 50),
    ]));
}

$this->command->info('');
$this->command->info('🏢 Companies created:');
$this->command->info('   - company1@test.com (شركة التقنية المتقدمة)');
$this->command->info('   - company2@test.com (مجموعة النيل للاستثمار)');
$this->command->info('');
$this->command->info('💼 Job postings created with various opportunities for university students');
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
            'cv_path' => null,
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

        // Create university student teachers for professional courses
        $techTeacher = User::create([
            'first_name' => 'كريم',
            'last_name' => 'يوسف',
            'email' => 'karim.youssef@teacher.com',
            'phone' => '+201001234570',
            'password' => Hash::make('password123'),
            'user_type' => 'teacher',
            'status' => 'active',
            'is_approved' => 1,
            'email_verified_at' => now(),
        ]);

        TeacherProfile::create([
            'user_id' => $techTeacher->id,
            'specialization' => 'programming',
            'years_of_experience' => '5-10',
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

        // Create University Students
        $universityStudents = [
            [
                'first_name' => 'ياسمين',
                'last_name' => 'أحمد',
                'email' => 'yasmin.ahmed@university.com',
                'faculty' => 'كلية الهندسة - قسم الحاسبات والمعلومات',
                'university' => 'جامعة القاهرة',
                'year_of_study' => 3,
                'gpa' => 3.4,
                'goal' => 'أطمح للعمل كمطور برمجيات في شركة تقنية رائدة والمساهمة في تطوير حلول مبتكرة',
                'bio' => 'طالبة هندسة حاسبات شغوفة بالذكاء الاصطناعي وتطوير الويب. أعمل على عدة مشاريع شخصية وأشارك في المسابقات البرمجية.',
                'skills' => ['Python', 'JavaScript', 'React', 'Node.js', 'Machine Learning', 'SQL', 'Git'],
                'looking_for_opportunities' => true,
                'linkedin_url' => 'https://linkedin.com/in/yasmin-ahmed',
                'github_url' => 'https://github.com/yasmin-ahmed',
            ],
            [
                'first_name' => 'أحمد',
                'last_name' => 'خالد',
                'email' => 'ahmed.khaled@university.com',
                'faculty' => 'كلية التجارة - قسم إدارة الأعمال',
                'university' => 'الجامعة الأمريكية بالقاهرة',
                'year_of_study' => 4,
                'gpa' => 3.7,
                'goal' => 'أسعى للحصول على فرصة تدريب في مجال الاستشارات الإدارية أو التسويق الرقمي',
                'bio' => 'طالب إدارة أعمال متميز، حاصل على عدة شهادات في التسويق الرقمي وتحليل البيانات. رئيس نادي ريادة الأعمال بالجامعة.',
                'skills' => ['Digital Marketing', 'Data Analysis', 'Excel', 'PowerBI', 'Project Management', 'Business Strategy'],
                'looking_for_opportunities' => true,
                'portfolio_url' => 'https://ahmed-khaled-portfolio.com',
            ],
            [
                'first_name' => 'مريم',
                'last_name' => 'حسين',
                'email' => 'mariam.hussein@university.com',
                'faculty' => 'كلية الطب البشري',
                'university' => 'جامعة عين شمس',
                'year_of_study' => 5,
                'gpa' => 3.9,
                'goal' => 'أطمح لإكمال دراستي التخصصية في طب الأطفال والعمل في مستشفى متخصص',
                'bio' => 'طالبة طب متفوقة، مهتمة بالبحث العلمي والعمل التطوعي. شاركت في عدة أبحاث منشورة وحملات توعية صحية.',
                'skills' => ['Clinical Research', 'Medical Writing', 'SPSS', 'Patient Care', 'Emergency Medicine'],
                'looking_for_opportunities' => false,
                'achievements' => [
                    'المركز الأول على دفعتي للسنة الرابعة',
                    'نشر بحث في مجلة طبية محكمة',
                    'متطوعة في مستشفى 57357'
                ],
            ],
            [
                'first_name' => 'عمر',
                'last_name' => 'سالم',
                'email' => 'omar.salem@university.com',
                'faculty' => 'كلية الفنون التطبيقية - قسم التصميم الجرافيكي',
                'university' => 'جامعة حلوان',
                'year_of_study' => 2,
                'gpa' => 3.2,
                'goal' => 'أريد أن أصبح مصمم UI/UX محترف وأعمل في شركات التقنية الناشئة',
                'bio' => 'مصمم جرافيك طموح، أعمل كفريلانسر بجانب دراستي. متخصص في تصميم الهوية البصرية وواجهات المستخدم.',
                'skills' => ['Adobe Photoshop', 'Illustrator', 'Figma', 'UI/UX Design', 'Branding', 'Typography'],
                'looking_for_opportunities' => true,
                'portfolio_url' => 'https://behance.net/omar-salem',
                'linkedin_url' => 'https://linkedin.com/in/omar-salem',
            ],
            [
                'first_name' => 'نور',
                'last_name' => 'محمود',
                'email' => 'nour.mahmoud@university.com',
                'faculty' => 'كلية الإعلام - قسم الصحافة',
                'university' => 'جامعة القاهرة',
                'year_of_study' => 3,
                'gpa' => 3.5,
                'goal' => 'أطمح للعمل كصحفية استقصائية في مؤسسة إعلامية رائدة',
                'bio' => 'صحفية طموحة، أكتب في عدة منصات رقمية وورقية. مهتمة بالصحافة الاستقصائية وصحافة البيانات.',
                'skills' => ['Content Writing', 'Investigative Journalism', 'Social Media', 'Video Editing', 'Data Journalism'],
                'looking_for_opportunities' => true,
                'achievements' => [
                    'جائزة أفضل تقرير صحفي من نقابة الصحفيين',
                    'منحة التميز الصحفي من مؤسسة الأهرام'
                ],
            ]
        ];

        foreach ($universityStudents as $studentData) {
            $student = User::create([
                'first_name' => $studentData['first_name'],
                'last_name' => $studentData['last_name'],
                'email' => $studentData['email'],
                'phone' => '+2011' . rand(10000000, 99999999),
                'password' => Hash::make('password123'),
                'user_type' => 'university_student',
                'status' => 'active',
                'is_approved' => 1,
                'email_verified_at' => now(),
            ]);

            UniversityStudentProfile::create([
                'user_id' => $student->id,
                'faculty' => $studentData['faculty'],
                'university' => $studentData['university'] ?? null,
                'year_of_study' => $studentData['year_of_study'] ?? null,
                'gpa' => $studentData['gpa'] ?? null,
                'goal' => $studentData['goal'],
                'bio' => $studentData['bio'] ?? null,
                'skills' => json_encode($studentData['skills'] ?? []),
                'linkedin_url' => $studentData['linkedin_url'] ?? null,
                'github_url' => $studentData['github_url'] ?? null,
                'portfolio_url' => $studentData['portfolio_url'] ?? null,
                'achievements' => json_encode($studentData['achievements'] ?? []),
                'is_public' => true,
                'looking_for_opportunities' => $studentData['looking_for_opportunities'] ?? false,
                'languages' => json_encode([
                    ['name' => 'العربية', 'level' => 'Native'],
                    ['name' => 'English', 'level' => 'Fluent'],
                ]),
                'available_from' => now()->addMonths(3)->format('Y-m-d'),
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

        // Define course templates for school students
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
                    'course_type' => 'recorded',
                    'is_active' => true,
                ]);
            }
        }

        // Create professional development courses for university students
        $professionalCourses = [
            [
                'title' => 'أساسيات البرمجة بلغة Python',
                'category' => 'programming',
                'description' => 'تعلم البرمجة من الصفر باستخدام لغة Python مع تطبيقات عملية',
                'teacher_id' => $techTeacher->id,
                'price' => 199,
                'original_price' => 299,
            ],
            [
                'title' => 'تطوير تطبيقات الويب باستخدام React',
                'category' => 'programming',
                'description' => 'احترف بناء واجهات المستخدم التفاعلية باستخدام React.js',
                'teacher_id' => $techTeacher->id,
                'price' => 249,
                'original_price' => 349,
            ],
            [
                'title' => 'التسويق الرقمي المتقدم',
                'category' => 'marketing',
                'description' => 'استراتيجيات التسويق الرقمي وإدارة الحملات الإعلانية',
                'teacher_id' => $teacher1->id,
                'price' => 179,
                'original_price' => 279,
            ],
            [
                'title' => 'تحليل البيانات باستخدام Excel و PowerBI',
                'category' => 'data',
                'description' => 'احترف تحليل البيانات وإنشاء التقارير التفاعلية',
                'teacher_id' => $teacher2->id,
                'price' => 199,
                'original_price' => 299,
            ],
            [
                'title' => 'أساسيات تصميم UI/UX',
                'category' => 'design',
                'description' => 'تعلم مبادئ تصميم واجهات المستخدم وتجربة المستخدم',
                'teacher_id' => $techTeacher->id,
                'price' => 229,
                'original_price' => 329,
            ],
            [
                'title' => 'مهارات التواصل الفعال والعرض التقديمي',
                'category' => 'soft_skills',
                'description' => 'طور مهاراتك في التواصل والعرض التقديمي للنجاح المهني',
                'teacher_id' => $teacher3->id,
                'price' => 149,
                'original_price' => 199,
            ],
            [
                'title' => 'إدارة المشاريع Agile و Scrum',
                'category' => 'business',
                'description' => 'احترف إدارة المشاريع بمنهجيات Agile و Scrum',
                'teacher_id' => $teacher1->id,
                'price' => 189,
                'original_price' => 289,
            ],
            [
                'title' => 'اللغة الإنجليزية للأعمال',
                'category' => 'languages',
                'description' => 'طور مهاراتك في اللغة الإنجليزية للتواصل المهني',
                'teacher_id' => $teacher2->id,
                'price' => 159,
                'original_price' => 259,
            ],
        ];

        foreach ($professionalCourses as $course) {
            Course::create([
                'title' => $course['title'],
                'description' => $course['description'],
                'teacher_id' => $course['teacher_id'],
                'category' => $course['category'],
                'price' => $course['price'],
                'original_price' => $course['original_price'],
                'duration' => rand(10, 25) . ' ساعة',
                'lessons_count' => rand(20, 40),
                'students_count' => rand(100, 500),
                'rating' => rand(42, 50) / 10,
                'grade' => null, // No grade restriction for professional courses
                'course_type' => 'recorded',
                'is_active' => true,
            ]);
        }

        $this->command->info('✅ Test data created successfully!');
        $this->command->info('');
        $this->command->info('👨‍🏫 Teachers created:');
        $this->command->info('   - ahmed.mohamed@teacher.com');
        $this->command->info('   - fatma.ali@teacher.com');
        $this->command->info('   - mahmoud.hassan@teacher.com');
        $this->command->info('   - karim.youssef@teacher.com');
        $this->command->info('');
        $this->command->info('👨‍🎓 Students created:');
        $this->command->info('   - student1@test.com (prep_1)');
        $this->command->info('   - student2@test.com (prep_2)');
        $this->command->info('   - student3@test.com (secondary_1)');
        $this->command->info('');
        $this->command->info('🎓 University Students created:');
        $this->command->info('   - yasmin.ahmed@university.com (Computer Engineering)');
        $this->command->info('   - ahmed.khaled@university.com (Business Administration)');
        $this->command->info('   - mariam.hussein@university.com (Medicine)');
        $this->command->info('   - omar.salem@university.com (Graphic Design)');
        $this->command->info('   - nour.mahmoud@university.com (Journalism)');
        $this->command->info('');
        $this->command->info('👨‍👩‍👧‍👦 Parent created:');
        $this->command->info('   - parent@test.com');
        $this->command->info('');
        $this->command->info('🔐 Password for all accounts: password123');
        $this->command->info('');
        $this->command->info('📚 Courses created:');
        $this->command->info('   - School courses for grades: prep_1, prep_2, prep_3, secondary_1, secondary_2, secondary_3');
        $this->command->info('   - Professional development courses for university students (programming, marketing, design, etc.)');
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
