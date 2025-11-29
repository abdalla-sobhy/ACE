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
use App\Models\JobApplication;
use App\Models\ParentStudentFollowRequest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run()
    {

        // Create test companies (8 total with diverse industries)
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
            'website' => 'https://tech-advanced.com',
            'description' => 'شركة رائدة في مجال تطوير البرمجيات والحلول التقنية المبتكرة. نعمل على مشاريع في الذكاء الاصطناعي، تطوير التطبيقات، والحلول السحابية.',
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
            'website' => 'https://nile-investment.com',
            'description' => 'مجموعة استثمارية رائدة في مجال الخدمات المالية والاستثمار. نقدم خدمات إدارة الأصول، الاستشارات المالية، والتحليل الاقتصادي.',
            'is_verified' => true,
        ]
    ],
    [
        'user' => [
            'first_name' => 'كريم',
            'last_name' => 'حسن',
            'email' => 'company3@test.com',
            'phone' => '+201234567892',
            'password' => Hash::make('password123'),
            'user_type' => 'company',
            'is_approved' => true,
        ],
        'company' => [
            'company_name' => 'إبداع للتسويق الرقمي',
            'industry' => 'التسويق والإعلان',
            'company_size' => '11-50',
            'location' => 'القاهرة الجديدة، مصر',
            'website' => 'https://ebdaa-marketing.com',
            'description' => 'وكالة تسويق رقمي متخصصة في إدارة حملات السوشيال ميديا، تحسين محركات البحث، والتسويق بالمحتوى.',
            'is_verified' => true,
        ]
    ],
    [
        'user' => [
            'first_name' => 'منى',
            'last_name' => 'عبد العزيز',
            'email' => 'company4@test.com',
            'phone' => '+201234567893',
            'password' => Hash::make('password123'),
            'user_type' => 'company',
            'is_approved' => true,
        ],
        'company' => [
            'company_name' => 'فاركو للصناعات الدوائية',
            'industry' => 'الصناعات الدوائية',
            'company_size' => '500+',
            'location' => 'الإسكندرية، مصر',
            'website' => 'https://pharco.com',
            'description' => 'شركة رائدة في صناعة وتوزيع الأدوية والمستحضرات الطبية. نعمل على البحث والتطوير في مجال الصناعات الدوائية.',
            'is_verified' => true,
        ]
    ],
    [
        'user' => [
            'first_name' => 'محمد',
            'last_name' => 'يوسف',
            'email' => 'company5@test.com',
            'phone' => '+201234567894',
            'password' => Hash::make('password123'),
            'user_type' => 'company',
            'is_approved' => true,
        ],
        'company' => [
            'company_name' => 'تصاميم الحداثة للاستشارات الهندسية',
            'industry' => 'الهندسة والاستشارات',
            'company_size' => '51-200',
            'location' => 'القاهرة، مصر',
            'website' => 'https://modern-designs.com',
            'description' => 'مكتب استشارات هندسية متخصص في التصميم المعماري، الإنشائي، والميكانيكي للمشاريع السكنية والتجارية.',
            'is_verified' => true,
        ]
    ],
    [
        'user' => [
            'first_name' => 'ليلى',
            'last_name' => 'إبراهيم',
            'email' => 'company6@test.com',
            'phone' => '+201234567895',
            'password' => Hash::make('password123'),
            'user_type' => 'company',
            'is_approved' => true,
        ],
        'company' => [
            'company_name' => 'الأهرام للإعلام والنشر',
            'industry' => 'الإعلام والنشر',
            'company_size' => '201-500',
            'location' => 'القاهرة، مصر',
            'website' => 'https://ahram.com',
            'description' => 'مؤسسة إعلامية رائدة في مجال الصحافة والنشر الرقمي. نبحث عن كتاب ومحررين موهوبين للانضمام لفريقنا.',
            'is_verified' => true,
        ]
    ],
    [
        'user' => [
            'first_name' => 'طارق',
            'last_name' => 'فهمي',
            'email' => 'company7@test.com',
            'phone' => '+201234567896',
            'password' => Hash::make('password123'),
            'user_type' => 'company',
            'is_approved' => true,
        ],
        'company' => [
            'company_name' => 'إيجيبت تورز للسياحة',
            'industry' => 'السياحة والضيافة',
            'company_size' => '11-50',
            'location' => 'الأقصر، مصر',
            'website' => 'https://egypt-tours.com',
            'description' => 'شركة سياحة متخصصة في تنظيم الرحلات السياحية والبرامج الثقافية. نبحث عن مرشدين سياحيين محترفين.',
            'is_verified' => false,
        ]
    ],
    [
        'user' => [
            'first_name' => 'نادية',
            'last_name' => 'سامي',
            'email' => 'company8@test.com',
            'phone' => '+201234567897',
            'password' => Hash::make('password123'),
            'user_type' => 'company',
            'is_approved' => true,
        ],
        'company' => [
            'company_name' => 'القانونية للاستشارات والمحاماة',
            'industry' => 'الخدمات القانونية',
            'company_size' => '11-50',
            'location' => 'القاهرة، مصر',
            'website' => 'https://legal-consultants.com',
            'description' => 'مكتب محاماة واستشارات قانونية متخصص في قانون الشركات، الملكية الفكرية، والقضايا التجارية.',
            'is_verified' => true,
        ]
    ],
];

foreach ($companies as $companyData) {
    $user = User::create($companyData['user']);
    Company::create(array_merge(
        ['user_id' => $user->id],
        $companyData['company']
    ));
}

// Create job postings (18 total covering all scenarios)
$jobPostings = [
        // Company 1: Tech Company - 3 jobs
        [
        'company_id' => 1,
        'title' => 'متدرب تطوير تطبيقات الموبايل',
        'description' => 'فرصة تدريب ممتازة في تطوير تطبيقات الموبايل باستخدام React Native. ستعمل مع فريق متمرس وتتعلم أفضل الممارسات في تطوير التطبيقات.',
        'requirements' => ['طالب في كلية حاسبات أو هندسة', 'معرفة أساسية بـ JavaScript', 'شغف بتطوير التطبيقات', 'القدرة على العمل ضمن فريق'],
        'responsibilities' => ['المساعدة في تطوير ميزات جديدة للتطبيقات', 'التعلم من الفريق وحضور ورش العمل', 'المشاركة في الاجتماعات اليومية', 'كتابة تقارير عن التقدم'],
        'skills_required' => ['JavaScript', 'React basics', 'Problem Solving', 'Git'],
        'skills_preferred' => ['React Native', 'Mobile Development', 'UI/UX', 'TypeScript'],
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
        'company_id' => 1,
        'title' => 'مطور Full Stack - عقد دائم',
        'description' => 'مطور Full Stack محترف للعمل على تطوير تطبيقات ويب معقدة باستخدام React و Node.js.',
        'requirements' => ['خبرة 2-3 سنوات في تطوير الويب', 'إتقان React و Node.js', 'خبرة في قواعد البيانات', 'شهادة جامعية في علوم الحاسب أو ما يعادلها'],
        'responsibilities' => ['تطوير وصيانة تطبيقات الويب', 'التعاون مع فريق التصميم', 'مراجعة الكود', 'حل المشاكل التقنية'],
        'skills_required' => ['React', 'Node.js', 'MongoDB', 'RESTful APIs', 'Git'],
        'skills_preferred' => ['TypeScript', 'Docker', 'AWS', 'Redis'],
        'job_type' => 'full_time',
        'work_location' => 'hybrid',
        'location' => 'القاهرة',
        'salary_range' => '15,000 - 25,000 جنيه',
        'experience_level' => 'mid',
        'education_requirement' => 'بكالوريوس علوم حاسب أو هندسة',
        'faculties_preferred' => ['كلية الحاسبات والمعلومات', 'كلية الهندسة'],
        'positions_available' => 2,
        'application_deadline' => now()->addDays(45),
    ],
    [
        'company_id' => 1,
        'title' => 'مهندس ذكاء اصطناعي - Remote',
        'description' => 'مهندس ذكاء اصطناعي متخصص للعمل على مشاريع Machine Learning و Deep Learning مع إمكانية العمل عن بعد.',
        'requirements' => ['ماجستير أو بكالوريوس في علوم الحاسب مع خبرة قوية', 'خبرة عملية في ML/DL', 'منشورات بحثية تعتبر ميزة'],
        'responsibilities' => ['تطوير نماذج الذكاء الاصطناعي', 'تحسين الخوارزميات', 'البحث والتطوير', 'توثيق الكود والعمل'],
        'skills_required' => ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning'],
        'skills_preferred' => ['Computer Vision', 'NLP', 'MLOps', 'Research Publications'],
        'job_type' => 'full_time',
        'work_location' => 'remote',
        'location' => 'العمل عن بعد',
        'salary_range' => '25,000 - 40,000 جنيه',
        'experience_level' => 'senior',
        'education_requirement' => 'بكالوريوس علوم حاسب (ماجستير مفضل)',
        'faculties_preferred' => ['كلية الحاسبات والمعلومات', 'كلية الهندسة - AI'],
        'positions_available' => 1,
        'application_deadline' => now()->addDays(60),
    ],

    // Company 2: Financial - 2 jobs
    [
        'company_id' => 2,
        'title' => 'محلل مالي Junior',
        'description' => 'نبحث عن محلل مالي مبتدئ للانضمام لفريق التحليل المالي والاستثماري.',
        'requirements' => ['بكالوريوس تجارة أو اقتصاد', 'إجادة Excel و PowerPoint', 'مهارات تحليلية قوية', 'إجادة اللغة الإنجليزية'],
        'responsibilities' => ['إعداد التقارير المالية الدورية', 'تحليل البيانات المالية', 'دعم الفريق المالي', 'متابعة الأسواق المالية'],
        'skills_required' => ['Excel', 'Financial Analysis', 'Data Analysis', 'PowerPoint'],
        'skills_preferred' => ['PowerBI', 'SQL', 'Python', 'Bloomberg Terminal'],
        'job_type' => 'full_time',
        'work_location' => 'onsite',
        'location' => 'الجيزة',
        'salary_range' => '8,000 - 12,000 جنيه',
        'experience_level' => 'entry',
        'education_requirement' => 'بكالوريوس تجارة - قسم المحاسبة أو المالية',
        'faculties_preferred' => ['كلية التجارة', 'كلية الاقتصاد والعلوم السياسية'],
        'positions_available' => 2,
        'application_deadline' => now()->addDays(45),
    ],
    [
        'company_id' => 2,
        'title' => 'متدرب تحليل استثماري - صيفي',
        'description' => 'برنامج تدريب صيفي في مجال التحليل الاستثماري وإدارة المحافظ.',
        'requirements' => ['طالب في السنة الثالثة أو الرابعة', 'معدل تراكمي جيد جداً', 'شغف بالأسواق المالية'],
        'responsibilities' => ['مساعدة فريق الاستثمار', 'إعداد تقارير بحثية', 'تحليل الشركات المدرجة', 'حضور اجتماعات العملاء'],
        'skills_required' => ['Excel', 'Financial Basics', 'English', 'Analytical Skills'],
        'skills_preferred' => ['Financial Modeling', 'Valuation', 'Bloomberg'],
        'job_type' => 'internship',
        'work_location' => 'onsite',
        'location' => 'الجيزة',
        'salary_range' => '4,000 - 6,000 جنيه',
        'experience_level' => 'entry',
        'education_requirement' => 'طالب في كلية التجارة أو الاقتصاد',
        'faculties_preferred' => ['كلية التجارة', 'كلية الاقتصاد'],
        'positions_available' => 5,
        'application_deadline' => now()->addDays(20),
    ],

    // Company 3: Marketing - 3 jobs
    [
        'company_id' => 3,
        'title' => 'متخصص تسويق على السوشيال ميديا',
        'description' => 'متخصص تسويق رقمي لإدارة حسابات السوشيال ميديا للعملاء وإنشاء محتوى إبداعي.',
        'requirements' => ['خبرة 1-2 سنة في التسويق الرقمي', 'معرفة قوية بمنصات السوشيال ميديا', 'مهارات كتابة محتوى ممتازة'],
        'responsibilities' => ['إدارة حسابات السوشيال ميديا', 'إنشاء محتوى إبداعي', 'تحليل الأداء', 'التفاعل مع المتابعين'],
        'skills_required' => ['Social Media Management', 'Content Creation', 'Copywriting', 'Analytics'],
        'skills_preferred' => ['Photoshop', 'Video Editing', 'Facebook Ads', 'Google Analytics'],
        'job_type' => 'full_time',
        'work_location' => 'onsite',
        'location' => 'القاهرة الجديدة',
        'salary_range' => '7,000 - 10,000 جنيه',
        'experience_level' => 'junior',
        'education_requirement' => 'بكالوريوس إعلام أو تسويق',
        'faculties_preferred' => ['كلية الإعلام', 'كلية التجارة', 'كلية الآداب'],
        'positions_available' => 2,
        'application_deadline' => now()->addDays(30),
    ],
    [
        'company_id' => 3,
        'title' => 'كاتب محتوى إبداعي',
        'description' => 'كاتب محتوى مبدع لإنشاء محتوى تسويقي باللغتين العربية والإنجليزية.',
        'requirements' => ['خبرة في كتابة المحتوى التسويقي', 'إبداع في الكتابة', 'إتقان العربية والإنجليزية'],
        'responsibilities' => ['كتابة محتوى للمواقع والمدونات', 'إنشاء نصوص إعلانية', 'تحرير ومراجعة المحتوى'],
        'skills_required' => ['Content Writing', 'Copywriting', 'Arabic', 'English'],
        'skills_preferred' => ['SEO', 'WordPress', 'Marketing Knowledge'],
        'job_type' => 'part_time',
        'work_location' => 'remote',
        'location' => 'العمل عن بعد',
        'salary_range' => '4,000 - 7,000 جنيه',
        'experience_level' => 'entry',
        'education_requirement' => 'بكالوريوس إعلام أو لغات أو آداب',
        'faculties_preferred' => ['كلية الإعلام', 'كلية الآداب', 'كلية الألسن'],
        'positions_available' => 3,
        'application_deadline' => now()->addDays(40),
    ],
    [
        'company_id' => 3,
        'title' => 'متدرب تصميم جرافيك',
        'description' => 'فرصة تدريب في التصميم الجرافيكي وتصميم المحتوى البصري للسوشيال ميديا.',
        'requirements' => ['طالب في كلية الفنون التطبيقية', 'معرفة بأساسيات التصميم', 'إتقان Photoshop و Illustrator'],
        'responsibilities' => ['تصميم منشورات السوشيال ميديا', 'المساعدة في الحملات الإعلانية', 'تعديل الصور'],
        'skills_required' => ['Photoshop', 'Illustrator', 'Design Basics'],
        'skills_preferred' => ['After Effects', 'Figma', 'Typography'],
        'job_type' => 'internship',
        'work_location' => 'onsite',
        'location' => 'القاهرة الجديدة',
        'salary_range' => '2,500 - 4,000 جنيه',
        'experience_level' => 'entry',
        'education_requirement' => 'طالب في كلية الفنون التطبيقية',
        'faculties_preferred' => ['كلية الفنون التطبيقية'],
        'positions_available' => 2,
        'application_deadline' => now()->addDays(25),
    ],

    // Company 4: Pharma - 2 jobs
    [
        'company_id' => 4,
        'title' => 'صيدلي في قسم مراقبة الجودة',
        'description' => 'صيدلي للعمل في قسم مراقبة الجودة والرقابة الدوائية.',
        'requirements' => ['بكالوريوس صيدلة', 'خبرة 0-2 سنة', 'معرفة بمعايير الجودة الدوائية'],
        'responsibilities' => ['فحص جودة المنتجات', 'إعداد تقارير الجودة', 'متابعة معايير الأمان', 'التفتيش على خطوط الإنتاج'],
        'skills_required' => ['Pharmaceutical Analysis', 'Quality Control', 'GMP', 'Documentation'],
        'skills_preferred' => ['HPLC', 'Spectroscopy', 'Validation', 'ISO Standards'],
        'job_type' => 'full_time',
        'work_location' => 'onsite',
        'location' => 'الإسكندرية',
        'salary_range' => '9,000 - 14,000 جنيه',
        'experience_level' => 'entry',
        'education_requirement' => 'بكالوريوس صيدلة',
        'faculties_preferred' => ['كلية الصيدلة'],
        'positions_available' => 3,
        'application_deadline' => now()->addDays(35),
    ],
    [
        'company_id' => 4,
        'title' => 'متدرب في قسم البحث والتطوير',
        'description' => 'برنامج تدريب في قسم البحث والتطوير للطلاب المتفوقين.',
        'requirements' => ['طالب صيدلة في السنة الرابعة أو الخامسة', 'معدل ممتاز', 'اهتمام بالبحث العلمي'],
        'responsibilities' => ['المساعدة في الأبحاث', 'إجراء التجارب المعملية', 'توثيق النتائج', 'حضور الاجتماعات العلمية'],
        'skills_required' => ['Pharmaceutical Research', 'Lab Skills', 'Documentation', 'Analysis'],
        'skills_preferred' => ['HPLC', 'Research Methods', 'Scientific Writing'],
        'job_type' => 'internship',
        'work_location' => 'onsite',
        'location' => 'الإسكندرية',
        'salary_range' => '3,500 - 5,000 جنيه',
        'experience_level' => 'entry',
        'education_requirement' => 'طالب صيدلة - السنة الرابعة أو الخامسة',
        'faculties_preferred' => ['كلية الصيدلة'],
        'positions_available' => 4,
        'application_deadline' => now()->addDays(30),
    ],

    // Company 5: Engineering Consulting - 2 jobs
    [
        'company_id' => 5,
        'title' => 'مهندس معماري مبتدئ',
        'description' => 'مهندس معماري للعمل على مشاريع التصميم المعماري للمباني السكنية والتجارية.',
        'requirements' => ['بكالوريوس هندسة معمارية', 'خبرة 0-1 سنة', 'إتقان برامج التصميم'],
        'responsibilities' => ['المشاركة في التصميم المعماري', 'إعداد الرسومات التنفيذية', 'التنسيق مع الفرق الهندسية'],
        'skills_required' => ['AutoCAD', 'Revit', 'Architectural Design', '3D Modeling'],
        'skills_preferred' => ['3ds Max', 'SketchUp', 'Photoshop', 'BIM'],
        'job_type' => 'full_time',
        'work_location' => 'onsite',
        'location' => 'القاهرة',
        'salary_range' => '8,000 - 12,000 جنيه',
        'experience_level' => 'entry',
        'education_requirement' => 'بكالوريوس هندسة معمارية',
        'faculties_preferred' => ['كلية الهندسة - قسم العمارة'],
        'positions_available' => 2,
        'application_deadline' => now()->addDays(40),
    ],
    [
        'company_id' => 5,
        'title' => 'مهندس ميكانيكا - أنظمة التكييف',
        'description' => 'مهندس ميكانيكا متخصص في تصميم أنظمة التكييف والتهوية.',
        'requirements' => ['بكالوريوس هندسة ميكانيكية', 'خبرة 2-3 سنوات في HVAC', 'معرفة بالمعايير الهندسية'],
        'responsibilities' => ['تصميم أنظمة التكييف', 'إعداد الحسابات الهندسية', 'متابعة التنفيذ', 'مراجعة المخططات'],
        'skills_required' => ['HVAC Design', 'AutoCAD', 'Load Calculations', 'Technical Drawing'],
        'skills_preferred' => ['Revit MEP', 'HAP', 'Energy Simulation', 'LEED'],
        'job_type' => 'full_time',
        'work_location' => 'onsite',
        'location' => 'القاهرة',
        'salary_range' => '12,000 - 18,000 جنيه',
        'experience_level' => 'mid',
        'education_requirement' => 'بكالوريوس هندسة ميكانيكية',
        'faculties_preferred' => ['كلية الهندسة - قسم الميكانيكا'],
        'positions_available' => 1,
        'application_deadline' => now()->addDays(50),
    ],

    // Company 6: Media - 2 jobs
    [
        'company_id' => 6,
        'title' => 'صحفي محرر',
        'description' => 'صحفي للعمل في قسم التحرير وكتابة التقارير الصحفية.',
        'requirements' => ['بكالوريوس إعلام - صحافة', 'خبرة 1-2 سنة', 'مهارات كتابة ممتازة'],
        'responsibilities' => ['كتابة التقارير والمقالات', 'تحرير المحتوى', 'تغطية الأحداث', 'إجراء المقابلات'],
        'skills_required' => ['Journalism', 'News Writing', 'Editing', 'Research'],
        'skills_preferred' => ['Investigative Journalism', 'Photography', 'Video Editing'],
        'job_type' => 'full_time',
        'work_location' => 'onsite',
        'location' => 'القاهرة',
        'salary_range' => '7,000 - 11,000 جنيه',
        'experience_level' => 'junior',
        'education_requirement' => 'بكالوريوس إعلام - قسم الصحافة',
        'faculties_preferred' => ['كلية الإعلام'],
        'positions_available' => 2,
        'application_deadline' => now()->addDays(30),
    ],
    [
        'company_id' => 6,
        'title' => 'محرر فيديو ومونتاج',
        'description' => 'محرر فيديو محترف للعمل على المحتوى المرئي والإخباري.',
        'requirements' => ['خبرة في المونتاج والإخراج', 'إتقان برامج المونتاج', 'القدرة على العمل تحت الضغط'],
        'responsibilities' => ['مونتاج الفيديوهات الإخبارية', 'إضافة المؤثرات', 'تحرير المقاطع', 'العمل مع الفريق الإعلامي'],
        'skills_required' => ['Video Editing', 'Premiere Pro', 'After Effects', 'Color Grading'],
        'skills_preferred' => ['Motion Graphics', 'Audio Editing', 'Final Cut Pro'],
        'job_type' => 'full_time',
        'work_location' => 'onsite',
        'location' => 'القاهرة',
        'salary_range' => '8,000 - 13,000 جنيه',
        'experience_level' => 'mid',
        'education_requirement' => 'دبلومة أو بكالوريوس في الإعلام أو ما يعادلها',
        'faculties_preferred' => ['كلية الإعلام', 'كلية الفنون التطبيقية'],
        'positions_available' => 1,
        'application_deadline' => now()->addDays(35),
    ],

    // Company 7: Tourism - 2 jobs
    [
        'company_id' => 7,
        'title' => 'مرشد سياحي',
        'description' => 'مرشد سياحي لمرافقة المجموعات السياحية وتقديم المعلومات التاريخية والثقافية.',
        'requirements' => ['ترخيص إرشاد سياحي', 'إجادة لغتين أجنبيتين على الأقل', 'معرفة واسعة بالتاريخ المصري'],
        'responsibilities' => ['مرافقة المجموعات السياحية', 'شرح المعالم الأثرية', 'الترجمة', 'تنسيق البرامج السياحية'],
        'skills_required' => ['Tour Guiding', 'History Knowledge', 'English', 'Communication'],
        'skills_preferred' => ['French', 'German', 'Italian', 'First Aid'],
        'job_type' => 'contract',
        'work_location' => 'onsite',
        'location' => 'الأقصر',
        'salary_range' => '6,000 - 10,000 جنيه + عمولة',
        'experience_level' => 'entry',
        'education_requirement' => 'بكالوريوس سياحة أو ترخيص إرشاد سياحي',
        'faculties_preferred' => ['كلية السياحة والفنادق'],
        'positions_available' => 5,
        'application_deadline' => now()->addDays(20),
    ],
    [
        'company_id' => 7,
        'title' => 'منسق برامج سياحية',
        'description' => 'منسق لتخطيط وتنظيم البرامج السياحية والتنسيق مع الفنادق ووسائل النقل.',
        'requirements' => ['خبرة في تنسيق البرامج السياحية', 'مهارات تنظيمية ممتازة', 'إجادة اللغة الإنجليزية'],
        'responsibilities' => ['تخطيط البرامج السياحية', 'التنسيق مع الموردين', 'متابعة الحجوزات', 'حل المشاكل'],
        'skills_required' => ['Event Planning', 'Coordination', 'Customer Service', 'English'],
        'skills_preferred' => ['Tourism Software', 'Negotiation', 'Multiple Languages'],
        'job_type' => 'full_time',
        'work_location' => 'onsite',
        'location' => 'الأقصر',
        'salary_range' => '7,000 - 11,000 جنيه',
        'experience_level' => 'junior',
        'education_requirement' => 'بكالوريوس سياحة',
        'faculties_preferred' => ['كلية السياحة والفنادق'],
        'positions_available' => 2,
        'application_deadline' => now()->addDays(30),
    ],

    // Company 8: Legal - 1 job
    [
        'company_id' => 8,
        'title' => 'محامي متدرب - قانون الشركات',
        'description' => 'محامي متدرب للعمل في قسم قانون الشركات والاستشارات القانونية.',
        'requirements' => ['بكالوريوس حقوق', 'قيد نقابة المحامين', 'مهارات بحث قانوني ممتازة', 'إجادة اللغة الإنجليزية'],
        'responsibilities' => ['البحث القانوني', 'إعداد المذكرات', 'مراجعة العقود', 'حضور الجلسات'],
        'skills_required' => ['Legal Research', 'Legal Writing', 'Contract Analysis', 'English'],
        'skills_preferred' => ['Corporate Law', 'IP Law', 'Legal Software', 'Negotiation'],
        'job_type' => 'full_time',
        'work_location' => 'onsite',
        'location' => 'القاهرة',
        'salary_range' => '6,000 - 9,000 جنيه',
        'experience_level' => 'entry',
        'education_requirement' => 'بكالوريوس حقوق مع قيد نقابة',
        'faculties_preferred' => ['كلية الحقوق'],
        'positions_available' => 2,
        'application_deadline' => now()->addDays(40),
    ],
];

$createdJobPostings = [];
foreach ($jobPostings as $job) {
    $jobPosting = JobPosting::create(array_merge($job, [
        'is_active' => true,
        'views_count' => rand(50, 300),
        'applications_count' => rand(5, 50),
    ]));
    $createdJobPostings[] = $jobPosting;
}

$this->command->info('');
$this->command->info('🏢 Companies created:');
$this->command->info('   - company1@test.com (شركة التقنية المتقدمة)');
$this->command->info('   - company2@test.com (مجموعة النيل للاستثمار)');
$this->command->info('');
$this->command->info('💼 Job postings created with various opportunities for university students');
        // Create teachers (12 total with diverse specializations and experience)
        $teachers = [
            // School teachers
            [
                'name' => 'أحمد محمد',
                'email' => 'ahmed.mohamed@teacher.com',
                'specialization' => 'math',
                'experience' => '5-10',
                'verified' => true,
                'approved' => true,
            ],
            [
                'name' => 'فاطمة علي',
                'email' => 'fatma.ali@teacher.com',
                'specialization' => 'science',
                'experience' => '3-5',
                'verified' => true,
                'approved' => true,
            ],
            [
                'name' => 'محمود حسن',
                'email' => 'mahmoud.hassan@teacher.com',
                'specialization' => 'arabic',
                'experience' => '10+',
                'verified' => true,
                'approved' => true,
            ],
            [
                'name' => 'سارة إبراهيم',
                'email' => 'sara.ibrahim@teacher.com',
                'specialization' => 'english',
                'experience' => '5-10',
                'verified' => true,
                'approved' => true,
            ],
            [
                'name' => 'خالد يوسف',
                'email' => 'khaled.youssef@teacher.com',
                'specialization' => 'social',
                'experience' => '3-5',
                'verified' => true,
                'approved' => true,
            ],
            [
                'name' => 'نور عبد الله',
                'email' => 'nour.abdullah@teacher.com',
                'specialization' => 'math',
                'experience' => '1-3',
                'verified' => false,
                'approved' => true,
            ],
            [
                'name' => 'ياسر طارق',
                'email' => 'yasser.tarek@teacher.com',
                'specialization' => 'science',
                'experience' => '10+',
                'verified' => true,
                'approved' => true,
            ],
            [
                'name' => 'هدى سامي',
                'email' => 'hoda.samy@teacher.com',
                'specialization' => 'english',
                'experience' => '3-5',
                'verified' => true,
                'approved' => false, // Pending approval
            ],
            [
                'name' => 'عمرو فهمي',
                'email' => 'amr.fahmy@teacher.com',
                'specialization' => 'arabic',
                'experience' => '5-10',
                'verified' => false,
                'approved' => true,
            ],

            // Professional/Technical teachers
            [
                'name' => 'كريم يوسف',
                'email' => 'karim.youssef@teacher.com',
                'specialization' => 'programming',
                'experience' => '5-10',
                'verified' => true,
                'approved' => true,
            ],
            [
                'name' => 'دينا أحمد',
                'email' => 'dina.ahmed@teacher.com',
                'specialization' => 'design',
                'experience' => '3-5',
                'verified' => true,
                'approved' => true,
            ],
            [
                'name' => 'مصطفى رمضان',
                'email' => 'mostafa.ramadan@teacher.com',
                'specialization' => 'business',
                'experience' => '10+',
                'verified' => true,
                'approved' => true,
            ],
        ];

        $createdTeachers = [];
        foreach ($teachers as $index => $teacherData) {
            $names = explode(' ', $teacherData['name']);
            $teacher = User::create([
                'first_name' => $names[0],
                'last_name' => $names[1] ?? '',
                'email' => $teacherData['email'],
                'phone' => '+20100' . str_pad($index + 1234567, 7, '0', STR_PAD_LEFT),
                'password' => Hash::make('password123'),
                'user_type' => 'teacher',
                'status' => 'active',
                'is_approved' => $teacherData['approved'] ? 1 : 0,
                'email_verified_at' => now(),
            ]);

            TeacherProfile::create([
                'user_id' => $teacher->id,
                'specialization' => $teacherData['specialization'],
                'years_of_experience' => $teacherData['experience'],
                'cv_path' => null,
                'didit_data' => json_encode([
                    'verified' => $teacherData['verified'],
                    'verification_date' => $teacherData['verified'] ? now()->subDays(rand(10, 100))->toDateString() : null
                ])
            ]);

            $createdTeachers[] = $teacher;
        }

        // Store specific teachers for course assignment
        $teacher1 = $createdTeachers[0];
        $teacher2 = $createdTeachers[1];
        $teacher3 = $createdTeachers[2];
        $techTeacher = $createdTeachers[9];

        $this->command->info('');
        $this->command->info('👨‍🏫 Teachers created (12 total):');
        $this->command->info('   - School subjects: 9 teachers (Math, Science, Arabic, English, Social)');
        $this->command->info('   - Professional/Technical: 3 teachers (Programming, Design, Business)');
        $this->command->info('   - Verified: 9 teachers | Not verified: 3 teachers');
        $this->command->info('   - Approved: 11 teachers | Pending approval: 1 teacher');
        $this->command->info('');

        // Create test students for different grades (15 total covering all grades)
        $students = [
            // Primary students
            ['name' => 'زياد محمود', 'email' => 'student1@test.com', 'grade' => 'primary_1', 'age' => 7],
            ['name' => 'ملك أحمد', 'email' => 'student2@test.com', 'grade' => 'primary_2', 'age' => 8],
            ['name' => 'آدم حسن', 'email' => 'student3@test.com', 'grade' => 'primary_3', 'age' => 9],
            ['name' => 'جنى عبد الله', 'email' => 'student4@test.com', 'grade' => 'primary_4', 'age' => 10],
            ['name' => 'عمر سعيد', 'email' => 'student5@test.com', 'grade' => 'primary_5', 'age' => 11],
            ['name' => 'ريم طارق', 'email' => 'student6@test.com', 'grade' => 'primary_6', 'age' => 12],

            // Prep students
            ['name' => 'محمد علي', 'email' => 'student7@test.com', 'grade' => 'prep_1', 'age' => 13],
            ['name' => 'سارة أحمد', 'email' => 'student8@test.com', 'grade' => 'prep_1', 'age' => 13],
            ['name' => 'كريم يوسف', 'email' => 'student9@test.com', 'grade' => 'prep_2', 'age' => 14],
            ['name' => 'نور محمود', 'email' => 'student10@test.com', 'grade' => 'prep_2', 'age' => 14],
            ['name' => 'حسن إبراهيم', 'email' => 'student11@test.com', 'grade' => 'prep_3', 'age' => 15],

            // Secondary students
            ['name' => 'عمر حسن', 'email' => 'student12@test.com', 'grade' => 'secondary_1', 'age' => 16],
            ['name' => 'فاطمة علي', 'email' => 'student13@test.com', 'grade' => 'secondary_1', 'age' => 16],
            ['name' => 'أحمد خالد', 'email' => 'student14@test.com', 'grade' => 'secondary_2', 'age' => 17],
            ['name' => 'ياسمين صلاح', 'email' => 'student15@test.com', 'grade' => 'secondary_3', 'age' => 18],
        ];

        $createdStudents = [];
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
                'birth_date' => now()->subYears($studentData['age'])->format('Y-m-d'),
            ]);

            $createdStudents[] = ['user' => $student, 'grade' => $studentData['grade']];
        }

        $this->command->info('');
        $this->command->info('👨‍🎓 Regular Students created (15 total):');
        $this->command->info('   - Primary: 6 students (grades 1-6)');
        $this->command->info('   - Prep: 5 students (grades 1-3)');
        $this->command->info('   - Secondary: 4 students (grades 1-3)');
        $this->command->info('');

        // Create University Students (15 total with diverse profiles)
        $universityStudents = [
            // Student 1: Main showcase student with ALL job application statuses
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
                'experience' => [
                    ['title' => 'Freelance Web Developer', 'company' => 'Self-Employed', 'duration' => '6 months'],
                ],
                'projects' => [
                    ['name' => 'E-Commerce Platform', 'description' => 'Built with React & Node.js'],
                    ['name' => 'AI Chatbot', 'description' => 'NLP-powered customer service bot'],
                ],
                'certifications' => ['AWS Cloud Practitioner', 'Meta React Certification'],
            ],
            // Student 2: Business student
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
                'linkedin_url' => 'https://linkedin.com/in/ahmed-khaled',
                'certifications' => ['Google Digital Marketing', 'HubSpot Content Marketing'],
                'achievements' => ['President of Entrepreneurship Club', 'Dean\'s List 3 semesters'],
            ],
            // Student 3: Medical student (not looking)
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
            // Student 4: Design student
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
                'projects' => [
                    ['name' => 'Mobile App Redesign', 'description' => 'Complete UI/UX overhaul for e-commerce app'],
                    ['name' => 'Brand Identity Project', 'description' => 'Created complete brand identity for startup'],
                ],
            ],
            // Student 5: Journalism student
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
                'linkedin_url' => 'https://linkedin.com/in/nour-mahmoud',
                'achievements' => [
                    'جائزة أفضل تقرير صحفي من نقابة الصحفيين',
                    'منحة التميز الصحفي من مؤسسة الأهرام'
                ],
            ],
            // Student 6: Law student - High achiever
            [
                'first_name' => 'كريم',
                'last_name' => 'إبراهيم',
                'email' => 'karim.ibrahim@university.com',
                'faculty' => 'كلية الحقوق',
                'university' => 'جامعة القاهرة',
                'year_of_study' => 4,
                'gpa' => 3.8,
                'goal' => 'أطمح للعمل في مجال الاستشارات القانونية للشركات والعمل في مكتب محاماة دولي',
                'bio' => 'طالب قانون متميز، شارك في عدة مسابقات محاكاة المحاكم وفزت بالمركز الأول. مهتم بقانون الشركات والملكية الفكرية.',
                'skills' => ['Legal Research', 'Contract Analysis', 'Legal Writing', 'Public Speaking', 'Negotiation'],
                'looking_for_opportunities' => true,
                'linkedin_url' => 'https://linkedin.com/in/karim-ibrahim',
                'achievements' => [
                    'الفائز بمسابقة محاكاة المحاكم الوطنية',
                    'عضو فريق البحث القانوني بالكلية',
                ],
                'certifications' => ['Intellectual Property Law - WIPO', 'Corporate Law Fundamentals'],
            ],
            // Student 7: Engineering student - Mechanical
            [
                'first_name' => 'هند',
                'last_name' => 'عبد الرحمن',
                'email' => 'hend.abdelrahman@university.com',
                'faculty' => 'كلية الهندسة - قسم الهندسة الميكانيكية',
                'university' => 'جامعة الإسكندرية',
                'year_of_study' => 3,
                'gpa' => 3.3,
                'goal' => 'أرغب في العمل في مجال تصميم الأنظمة الميكانيكية والطاقة المتجددة',
                'bio' => 'طالبة هندسة ميكانيكية، شغوفة بالطاقة المتجددة والتصميم باستخدام CAD. شاركت في مشروع تخرج حول الطاقة الشمسية.',
                'skills' => ['AutoCAD', 'SolidWorks', 'MATLAB', 'Thermodynamics', 'Renewable Energy', 'Project Management'],
                'looking_for_opportunities' => true,
                'linkedin_url' => 'https://linkedin.com/in/hend-abdelrahman',
                'projects' => [
                    ['name' => 'Solar Panel Optimization System', 'description' => 'Senior project on solar energy efficiency'],
                ],
            ],
            // Student 8: Economics student - Lower GPA
            [
                'first_name' => 'محمد',
                'last_name' => 'علي',
                'email' => 'mohamed.ali@university.com',
                'faculty' => 'كلية الاقتصاد والعلوم السياسية - قسم الاقتصاد',
                'university' => 'جامعة القاهرة',
                'year_of_study' => 2,
                'gpa' => 2.8,
                'goal' => 'أطمح لتطوير مهاراتي في التحليل الاقتصادي والعمل في مجال البحث الاقتصادي',
                'bio' => 'طالب اقتصاد مهتم بالاقتصاد التنموي والسياسات العامة. أسعى لتحسين مهاراتي الأكاديمية والعملية.',
                'skills' => ['Economic Analysis', 'Statistics', 'Excel', 'Research', 'Report Writing'],
                'looking_for_opportunities' => true,
                'linkedin_url' => 'https://linkedin.com/in/mohamed-ali-econ',
            ],
            // Student 9: Pharmacy student
            [
                'first_name' => 'سلمى',
                'last_name' => 'حسن',
                'email' => 'salma.hassan@university.com',
                'faculty' => 'كلية الصيدلة',
                'university' => 'جامعة عين شمس',
                'year_of_study' => 4,
                'gpa' => 3.6,
                'goal' => 'أطمح للعمل في مجال الصناعات الدوائية والبحث والتطوير',
                'bio' => 'طالبة صيدلة متميزة، مهتمة بصناعة الدواء والرقابة الدوائية. شاركت في عدة ورش عمل حول الجودة الدوائية.',
                'skills' => ['Pharmaceutical Analysis', 'Drug Development', 'Quality Control', 'Research', 'Medical Terminology'],
                'looking_for_opportunities' => true,
                'linkedin_url' => 'https://linkedin.com/in/salma-hassan',
                'achievements' => [
                    'شهادة تدريب من شركة فاركو للأدوية',
                    'ورشة عمل حول الجودة الدوائية - منظمة الصحة العالمية',
                ],
            ],
            // Student 10: Agriculture student
            [
                'first_name' => 'يوسف',
                'last_name' => 'مصطفى',
                'email' => 'youssef.mostafa@university.com',
                'faculty' => 'كلية الزراعة - قسم الإنتاج النباتي',
                'university' => 'جامعة القاهرة',
                'year_of_study' => 3,
                'gpa' => 3.1,
                'goal' => 'أطمح للعمل في مجال الزراعة المستدامة والأمن الغذائي',
                'bio' => 'طالب زراعة مهتم بالزراعة المستدامة والتكنولوجيا الزراعية الحديثة. أعمل على مشروع تخرج حول الزراعة العضوية.',
                'skills' => ['Sustainable Agriculture', 'Crop Management', 'Soil Science', 'Agricultural Technology', 'Research'],
                'looking_for_opportunities' => true,
                'linkedin_url' => 'https://linkedin.com/in/youssef-mostafa',
            ],
            // Student 11: Computer Science - AI focus
            [
                'first_name' => 'لينا',
                'last_name' => 'سعيد',
                'email' => 'lina.saeed@university.com',
                'faculty' => 'كلية الحاسبات والمعلومات - علوم الحاسب',
                'university' => 'جامعة عين شمس',
                'year_of_study' => 4,
                'gpa' => 3.9,
                'goal' => 'أطمح للعمل في مجال الذكاء الاصطناعي والتعلم الآلي في شركة تقنية عالمية',
                'bio' => 'طالبة علوم حاسب متفوقة، متخصصة في الذكاء الاصطناعي والتعلم العميق. نشرت ورقة بحثية في مؤتمر دولي.',
                'skills' => ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'Computer Vision', 'NLP', 'Data Science'],
                'looking_for_opportunities' => true,
                'github_url' => 'https://github.com/lina-saeed',
                'linkedin_url' => 'https://linkedin.com/in/lina-saeed',
                'portfolio_url' => 'https://lina-ai-portfolio.com',
                'achievements' => [
                    'نشر ورقة بحثية في مؤتمر IEEE الدولي',
                    'الفائز بمسابقة Kaggle - Computer Vision Challenge',
                    'منحة التميز الأكاديمي من الجامعة',
                ],
                'projects' => [
                    ['name' => 'Medical Image Classification', 'description' => 'Deep learning model for disease detection'],
                    ['name' => 'Arabic NLP System', 'description' => 'Sentiment analysis for Arabic text'],
                ],
                'certifications' => ['Deep Learning Specialization - Coursera', 'TensorFlow Developer Certificate'],
            ],
            // Student 12: Architecture student
            [
                'first_name' => 'آدم',
                'last_name' => 'رمضان',
                'email' => 'adam.ramadan@university.com',
                'faculty' => 'كلية الهندسة - قسم الهندسة المعمارية',
                'university' => 'جامعة القاهرة',
                'year_of_study' => 5,
                'gpa' => 3.5,
                'goal' => 'أطمح للعمل في مكتب استشارات هندسية والمشاركة في مشاريع معمارية مبتكرة',
                'bio' => 'طالب عمارة شغوف بالتصميم المستدام والعمارة الخضراء. شارك في عدة مسابقات معمارية دولية.',
                'skills' => ['AutoCAD', 'Revit', '3ds Max', 'SketchUp', 'Architectural Design', 'Sustainable Design', 'BIM'],
                'looking_for_opportunities' => true,
                'portfolio_url' => 'https://behance.net/adam-ramadan',
                'linkedin_url' => 'https://linkedin.com/in/adam-ramadan',
                'achievements' => [
                    'الفائز بالمركز الثالث في مسابقة التصميم المعماري الدولية',
                    'مشارك في معرض العمارة المستدامة',
                ],
                'projects' => [
                    ['name' => 'Eco-Friendly Housing Complex', 'description' => 'Sustainable residential design project'],
                    ['name' => 'Cultural Center Design', 'description' => 'Modern cultural space with traditional elements'],
                ],
            ],
            // Student 13: Languages student - English
            [
                'first_name' => 'دينا',
                'last_name' => 'عادل',
                'email' => 'dina.adel@university.com',
                'faculty' => 'كلية الآداب - قسم اللغة الإنجليزية',
                'university' => 'جامعة الإسكندرية',
                'year_of_study' => 2,
                'gpa' => 3.4,
                'goal' => 'أطمح للعمل في مجال الترجمة وتدريس اللغة الإنجليزية',
                'bio' => 'طالبة لغة إنجليزية شغوفة بالأدب والترجمة. أعمل كمترجمة مستقلة وأدرس شهادة CELTA.',
                'skills' => ['Translation', 'English Teaching', 'Content Writing', 'Proofreading', 'Interpretation', 'Creative Writing'],
                'looking_for_opportunities' => true,
                'linkedin_url' => 'https://linkedin.com/in/dina-adel',
                'experience' => [
                    ['title' => 'Freelance Translator', 'company' => 'Upwork', 'duration' => '1 year'],
                    ['title' => 'English Tutor', 'company' => 'Private', 'duration' => '8 months'],
                ],
                'certifications' => ['IELTS - Band 8', 'CELTA (In Progress)'],
            ],
            // Student 14: Tourism student
            [
                'first_name' => 'تامر',
                'last_name' => 'فوزي',
                'email' => 'tamer.fawzy@university.com',
                'faculty' => 'كلية السياحة والفنادق - قسم الإرشاد السياحي',
                'university' => 'جامعة حلوان',
                'year_of_study' => 3,
                'gpa' => 3.0,
                'goal' => 'أطمح للعمل كمرشد سياحي محترف وتطوير السياحة المستدامة في مصر',
                'bio' => 'طالب سياحة شغوف بالتاريخ المصري والثقافة. أعمل كمرشد سياحي بدوام جزئي وأتحدث 3 لغات.',
                'skills' => ['Tour Guiding', 'Customer Service', 'History Knowledge', 'Event Planning', 'Hospitality Management'],
                'looking_for_opportunities' => true,
                'linkedin_url' => 'https://linkedin.com/in/tamer-fawzy',
                'certifications' => ['Licensed Tour Guide - Ministry of Tourism', 'First Aid Certificate'],
            ],
            // Student 15: Veterinary student
            [
                'first_name' => 'ريم',
                'last_name' => 'طارق',
                'email' => 'reem.tarek@university.com',
                'faculty' => 'كلية الطب البيطري',
                'university' => 'جامعة القاهرة',
                'year_of_study' => 4,
                'gpa' => 3.7,
                'goal' => 'أطمح للعمل في مجال الطب البيطري الإكلينيكي والجراحة البيطرية',
                'bio' => 'طالبة طب بيطري متميزة، مهتمة برعاية الحيوانات الأليفة والطب البيطري الوقائي. تطوعت في عدة عيادات بيطرية.',
                'skills' => ['Veterinary Medicine', 'Animal Care', 'Surgery Basics', 'Clinical Diagnosis', 'Emergency Care'],
                'looking_for_opportunities' => false,
                'achievements' => [
                    'التدريب الصيفي في عيادة بيطرية متخصصة',
                    'عضو فريق الطوارئ البيطرية بالجامعة',
                ],
            ],
        ];

        $createdUniversityStudents = [];
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
                'experience' => json_encode($studentData['experience'] ?? []),
                'projects' => json_encode($studentData['projects'] ?? []),
                'certifications' => json_encode($studentData['certifications'] ?? []),
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

            $createdUniversityStudents[] = $student;
        }

        // ============================================
        // COMPREHENSIVE JOB APPLICATIONS SECTION
        // ============================================

        // Create job applications for the first student (Yasmin) to showcase ALL 7 statuses
        $yasmin = $createdUniversityStudents[0];
        $ahmed = $createdUniversityStudents[1];
        $omar = $createdUniversityStudents[3];
        $nour = $createdUniversityStudents[4];
        $karim = $createdUniversityStudents[5];
        $lina = $createdUniversityStudents[10];

        // YASMIN'S APPLICATIONS (ALL 7 STATUSES) ===============

        // Application 1: PENDING - Just submitted, awaiting review
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[0]->id, // Mobile Dev Internship
            'student_id' => $yasmin->id,
            'cover_letter' => 'أنا مهتمة جداً بفرصة التدريب في تطوير تطبيقات الموبايل. لدي خبرة في React وأعمل على تطوير مشاريع شخصية باستخدام React Native. معرض أعمالي يتضمن مشروع تجارة إلكترونية وتطبيق دردشة ذكي باستخدام الذكاء الاصطناعي.',
            'status' => 'pending',
            'created_at' => now()->subDays(2),
            'updated_at' => now()->subDays(2),
        ]);

        // Application 2: REVIEWING - Company is actively reviewing
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[3]->id, // Junior Financial Analyst
            'student_id' => $yasmin->id,
            'cover_letter' => 'على الرغم من تخصصي في هندسة الحاسبات، أمتلك مهارات قوية في تحليل البيانات وأتقن Excel وPython. أرغب في تطبيق مهاراتي التقنية في مجال التحليل المالي.',
            'status' => 'reviewing',
            'viewed_at' => now()->subDays(3),
            'company_notes' => 'خلفية تقنية قوية، سنراجع مدى ملاءمتها للدور المالي.',
            'created_at' => now()->subDays(5),
            'updated_at' => now()->subDays(3),
        ]);

        // Application 3: SHORTLISTED - Made it to shortlist for further consideration
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[1]->id, // Full Stack Developer
            'student_id' => $yasmin->id,
            'cover_letter' => 'أنا طالبة هندسة حاسبات متحمسة للعمل كمطور Full Stack. أتقن React و Node.js ولدي خبرة عملية في بناء تطبيقات ويب متكاملة. عملت كفريلانسر لمدة 6 أشهر وطورت عدة مشاريع.',
            'status' => 'shortlisted',
            'viewed_at' => now()->subDays(8),
            'company_notes' => 'مرشحة قوية! خلفية ممتازة في React و Node.js. تم ترشيحها للمقابلة الفنية.',
            'is_favorite' => true,
            'created_at' => now()->subDays(10),
            'updated_at' => now()->subDays(7),
        ]);

        // Application 4: INTERVIEWED - Had interview, awaiting decision
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[5]->id, // Social Media Specialist
            'student_id' => $yasmin->id,
            'cover_letter' => 'أمتلك مهارات تواصل قوية وخبرة في إدارة المحتوى الرقمي. على الرغم من خلفيتي التقنية، أرغب في دمج مهاراتي البرمجية مع التسويق الرقمي.',
            'status' => 'interviewed',
            'viewed_at' => now()->subDays(12),
            'interview_date' => now()->subDays(3),
            'interview_location' => 'مكتب الشركة - القاهرة الجديدة',
            'interview_notes' => 'مقابلة جيدة. لديها رؤية مثيرة للاهتمام حول دمج التقنية مع التسويق. سنتخذ القرار خلال أسبوع.',
            'company_notes' => 'أجرت المقابلة مع مدير التسويق. انطباع إيجابي ولكن نحتاج لمراجعة المرشحين الآخرين.',
            'created_at' => now()->subDays(15),
            'updated_at' => now()->subDays(3),
        ]);

        // Application 5: ACCEPTED - Got the job!
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[4]->id, // Investment Analysis Summer Internship
            'student_id' => $yasmin->id,
            'cover_letter' => 'أتطلع للحصول على تدريب صيفي في التحليل الاستثماري. مهاراتي في البرمجة وتحليل البيانات ستساعدني في تحليل البيانات المالية بكفاءة. حاصلة على شهادة في Data Analysis.',
            'status' => 'accepted',
            'viewed_at' => now()->subDays(25),
            'interview_date' => now()->subDays(10),
            'interview_location' => 'مكتب الشركة - الجيزة',
            'interview_notes' => 'مقابلة ممتازة! مهارات تحليلية قوية جداً. نوصي بالقبول الفوري.',
            'company_notes' => 'مقبولة! مرشحة استثنائية. مهاراتها التقنية ستضيف قيمة كبيرة لفريقنا. بدء التدريب في الصيف القادم.',
            'created_at' => now()->subDays(30),
            'updated_at' => now()->subDays(8),
        ]);

        // Application 6: REJECTED - Didn't get this one
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[7]->id, // Graphic Design Intern
            'student_id' => $yasmin->id,
            'cover_letter' => 'على الرغم من أنني مهندسة حاسبات، لدي اهتمام كبير بالتصميم ودرست أساسيات Photoshop و Illustrator بنفسي. أحب الدمج بين التقنية والفن.',
            'status' => 'rejected',
            'viewed_at' => now()->subDays(20),
            'company_notes' => 'نقدر اهتمامها بالتصميم، لكن الوظيفة تتطلب خريج فنون تطبيقية مع معرض أعمال قوي. نحتاج لمزيد من الخبرة العملية في التصميم.',
            'created_at' => now()->subDays(22),
            'updated_at' => now()->subDays(18),
        ]);

        // Application 7: WITHDRAWN - She withdrew herself
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[13]->id, // Journalist Editor
            'student_id' => $yasmin->id,
            'cover_letter' => 'أمتلك مهارات كتابة جيدة وأحب الصحافة التقنية. أرغب في الكتابة عن التكنولوجيا والابتكار.',
            'status' => 'withdrawn',
            'viewed_at' => now()->subDays(18),
            'company_notes' => 'سحبت الطالبة طلبها. أخبرتنا أنها قبلت فرصة أخرى أكثر تماشياً مع تخصصها.',
            'created_at' => now()->subDays(20),
            'updated_at' => now()->subDays(16),
        ]);

        // AHMED'S APPLICATIONS (Business Student) ===============

        // Ahmed - Accepted for Financial Analyst
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[3]->id, // Junior Financial Analyst
            'student_id' => $ahmed->id,
            'cover_letter' => 'كطالب متميز في قسم إدارة الأعمال بالجامعة الأمريكية، أمتلك خلفية قوية في التحليل المالي والتسويق الرقمي. حاصل على شهادات من Google و HubSpot ولدي خبرة في استخدام PowerBI و Excel.',
            'status' => 'accepted',
            'viewed_at' => now()->subDays(15),
            'interview_date' => now()->subDays(7),
            'interview_location' => 'مكتب الشركة - الجيزة',
            'interview_notes' => 'مرشح ممتاز! معدل دراسي مرتفع وخبرة عملية قوية. يبدأ العمل الشهر القادم.',
            'company_notes' => 'مقبول! خلفية أكاديمية ومهنية ممتازة. سيكون إضافة قيمة للفريق.',
            'is_favorite' => true,
            'created_at' => now()->subDays(20),
            'updated_at' => now()->subDays(5),
        ]);

        // Ahmed - Shortlisted for Investment Summer Internship
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[4]->id, // Investment Analysis Summer Internship
            'student_id' => $ahmed->id,
            'cover_letter' => 'أطمح للحصول على تدريب صيفي في التحليل الاستثماري. رئيس نادي ريادة الأعمال بالجامعة ولدي شغف كبير بالأسواق المالية.',
            'status' => 'shortlisted',
            'viewed_at' => now()->subDays(10),
            'company_notes' => 'خلفية ممتازة. مرشح قوي للتدريب الصيفي.',
            'is_favorite' => true,
            'created_at' => now()->subDays(12),
            'updated_at' => now()->subDays(9),
        ]);

        // Ahmed - Reviewing for Social Media role
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[5]->id, // Social Media Specialist
            'student_id' => $ahmed->id,
            'cover_letter' => 'لدي خبرة قوية في التسويق الرقمي وإدارة السوشيال ميديا. حاصل على شهادة Google Digital Marketing وأدرت حملات إعلانية ناجحة.',
            'status' => 'reviewing',
            'viewed_at' => now()->subDays(4),
            'company_notes' => 'شهادات معتمدة وخبرة جيدة. سنراجع ونحدد موعد مقابلة.',
            'created_at' => now()->subDays(6),
            'updated_at' => now()->subDays(4),
        ]);

        // OMAR (Design Student) ===============

        // Omar - Rejected for Mobile Dev (wrong fit)
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[0]->id, // Mobile Dev Internship
            'student_id' => $omar->id,
            'cover_letter' => 'أنا مصمم UI/UX شغوف بتصميم تطبيقات الموبايل. لدي معرض أعمال على Behance يوضح مشاريعي في تصميم تطبيقات الموبايل. أعتقد أن مهاراتي في التصميم ستكون إضافة قيمة.',
            'status' => 'rejected',
            'viewed_at' => now()->subDays(10),
            'company_notes' => 'خلفية قوية في التصميم ولكن الوظيفة تتطلب خبرة برمجية أكثر. المهارات التقنية غير كافية للدور.',
            'created_at' => now()->subDays(12),
            'updated_at' => now()->subDays(9),
        ]);

        // Omar - Accepted for Graphic Design Internship
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[7]->id, // Graphic Design Intern
            'student_id' => $omar->id,
            'cover_letter' => 'أنا طالب تصميم جرافيكي متحمس بمهارات قوية في Photoshop و Illustrator و Figma. معرض أعمالي يتضمن مشاريع متنوعة في تصميم الهوية البصرية والسوشيال ميديا.',
            'status' => 'accepted',
            'viewed_at' => now()->subDays(15),
            'interview_date' => now()->subDays(8),
            'interview_location' => 'مكتب الشركة - القاهرة الجديدة',
            'interview_notes' => 'معرض أعمال رائع! أسلوب تصميم عصري ومبتكر.',
            'company_notes' => 'مقبول! موهبة واعدة في التصميم.',
            'is_favorite' => true,
            'created_at' => now()->subDays(18),
            'updated_at' => now()->subDays(7),
        ]);

        // NOUR (Journalism Student) ===============

        // Nour - Interviewed for Journalist Editor
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[13]->id, // Journalist Editor
            'student_id' => $nour->id,
            'cover_letter' => 'أنا طالبة صحافة شغوفة بالصحافة الاستقصائية. أكتب في عدة منصات رقمية وحاصلة على جائزة أفضل تقرير صحفي. مهاراتي في البحث والكتابة وصحافة البيانات ستكون إضافة قيمة لفريقكم.',
            'status' => 'interviewed',
            'viewed_at' => now()->subDays(12),
            'interview_date' => now()->subDays(4),
            'interview_location' => 'مقر الأهرام - القاهرة',
            'interview_notes' => 'مقابلة جيدة جداً. موهبة واضحة في الكتابة وشغف بالصحافة. سنراجع ونرد خلال أسبوع.',
            'company_notes' => 'مرشحة قوية. خلفية أكاديمية جيدة وجوائز مهمة.',
            'is_favorite' => true,
            'created_at' => now()->subDays(15),
            'updated_at' => now()->subDays(4),
        ]);

        // Nour - Pending for Content Writer
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[6]->id, // Content Writer
            'student_id' => $nour->id,
            'cover_letter' => 'لدي خبرة واسعة في كتابة المحتوى التسويقي والصحفي. أتقن اللغتين العربية والإنجليزية وأمتلك أسلوب كتابة جذاب ومؤثر.',
            'status' => 'pending',
            'created_at' => now()->subDays(3),
            'updated_at' => now()->subDays(3),
        ]);

        // KARIM (Law Student) ===============

        // Karim - Shortlisted for Legal Intern
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[16]->id, // Legal Intern - Corporate Law (last job posting)
            'student_id' => $karim->id,
            'cover_letter' => 'أنا طالب قانون متميز مع اهتمام خاص بقانون الشركات والملكية الفكرية. الفائز بمسابقة محاكاة المحاكم الوطنية وحاصل على شهادات متخصصة من WIPO.',
            'status' => 'shortlisted',
            'viewed_at' => now()->subDays(8),
            'company_notes' => 'مرشح ممتاز! خلفية أكاديمية قوية وجوائز مهمة في مجال القانون.',
            'is_favorite' => true,
            'created_at' => now()->subDays(10),
            'updated_at' => now()->subDays(7),
        ]);

        // LINA (AI Specialist) ===============

        // Lina - Interviewed for AI Engineer
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[2]->id, // AI Engineer - Remote
            'student_id' => $lina->id,
            'cover_letter' => 'أنا طالبة علوم حاسب متخصصة في الذكاء الاصطناعي والتعلم العميق. نشرت ورقة بحثية في مؤتمر IEEE الدولي وفزت بمسابقة Kaggle. أمتلك خبرة عملية قوية في TensorFlow و PyTorch.',
            'status' => 'interviewed',
            'viewed_at' => now()->subDays(10),
            'interview_date' => now()->subDays(3),
            'interview_location' => 'مقابلة عن بعد - Zoom',
            'interview_notes' => 'مقابلة فنية ممتازة! أظهرت فهماً عميقاً للخوارزميات وحلت المشاكل البرمجية بكفاءة عالية.',
            'company_notes' => 'مرشحة استثنائية! خلفية بحثية قوية ومنشورات دولية. نوصي بالقبول.',
            'is_favorite' => true,
            'created_at' => now()->subDays(15),
            'updated_at' => now()->subDays(3),
        ]);

        // Lina - Pending for Full Stack role
        JobApplication::create([
            'job_posting_id' => $createdJobPostings[1]->id, // Full Stack Developer
            'student_id' => $lina->id,
            'cover_letter' => 'بالإضافة لتخصصي في الذكاء الاصطناعي، أمتلك مهارات قوية في تطوير الويب Full Stack. أتقن React و Node.js وطورت عدة تطبيقات ويب.',
            'status' => 'pending',
            'created_at' => now()->subDays(1),
            'updated_at' => now()->subDays(1),
        ]);

        $this->command->info('');
        $this->command->info('💼 Job Applications created:');
        $this->command->info('   - Yasmin (ياسمين أحمد): 7 applications showcasing ALL statuses');
        $this->command->info('     ✓ Pending, Reviewing, Shortlisted, Interviewed, Accepted, Rejected, Withdrawn');
        $this->command->info('   - Ahmed (أحمد خالد): 3 applications (Accepted, Shortlisted, Reviewing)');
        $this->command->info('   - Omar (عمر سالم): 2 applications (Accepted, Rejected)');
        $this->command->info('   - Nour (نور محمود): 2 applications (Interviewed, Pending)');
        $this->command->info('   - Karim (كريم إبراهيم): 1 application (Shortlisted)');
        $this->command->info('   - Lina (لينا سعيد): 2 applications (Interviewed, Pending)');
        $this->command->info('');

        // Create parents (8 total) and link to students
        $parents = [
            [
                'name' => 'عبد الله محمد',
                'email' => 'parent1@test.com',
                'children_count' => 2,
                'verified' => true,
                'student_indices' => [0, 1], // زياد محمود, ملك أحمد
            ],
            [
                'name' => 'منى حسن',
                'email' => 'parent2@test.com',
                'children_count' => 1,
                'verified' => true,
                'student_indices' => [2], // آدم حسن
            ],
            [
                'name' => 'محمود عبد الله',
                'email' => 'parent3@test.com',
                'children_count' => 2,
                'verified' => false,
                'student_indices' => [3, 6], // جنى عبد الله, محمد علي
            ],
            [
                'name' => 'سارة سعيد',
                'email' => 'parent4@test.com',
                'children_count' => 3,
                'verified' => true,
                'student_indices' => [4, 7, 11], // عمر سعيد, سارة أحمد, عمر حسن
            ],
            [
                'name' => 'أحمد طارق',
                'email' => 'parent5@test.com',
                'children_count' => 1,
                'verified' => true,
                'student_indices' => [5], // ريم طارق
            ],
            [
                'name' => 'فاطمة يوسف',
                'email' => 'parent6@test.com',
                'children_count' => 2,
                'verified' => false,
                'student_indices' => [8, 10], // كريم يوسف, حسن إبراهيم
            ],
            [
                'name' => 'خالد علي',
                'email' => 'parent7@test.com',
                'children_count' => 2,
                'verified' => true,
                'student_indices' => [12, 13], // فاطمة علي, أحمد خالد
            ],
            [
                'name' => 'هدى صلاح',
                'email' => 'parent8@test.com',
                'children_count' => 1,
                'verified' => true,
                'student_indices' => [14], // ياسمين صلاح
            ],
        ];

        foreach ($parents as $parentData) {
            $names = explode(' ', $parentData['name']);
            $parent = User::create([
                'first_name' => $names[0],
                'last_name' => $names[1] ?? '',
                'email' => $parentData['email'],
                'phone' => '+20109' . rand(1000000, 9999999),
                'password' => Hash::make('password123'),
                'user_type' => 'parent',
                'status' => 'active',
                'is_approved' => 1,
                'email_verified_at' => now(),
            ]);

            ParentProfile::create([
                'user_id' => $parent->id,
                'children_count' => (string)$parentData['children_count'],
                'didit_data' => json_encode([
                    'verified' => $parentData['verified'],
                    'verification_date' => $parentData['verified'] ? now()->subDays(rand(10, 60))->toDateString() : null
                ])
            ]);

            // Link parent to their children
            foreach ($parentData['student_indices'] as $studentIndex) {
                if (isset($createdStudents[$studentIndex])) {
                    $studentUser = $createdStudents[$studentIndex]['user'];
                    // Create approved parent-student relationship
                    ParentStudentFollowRequest::create([
                        'parent_id' => $parent->id,
                        'student_id' => $studentUser->id,
                        'status' => 'approved',
                        'approved_at' => now(),
                    ]);
                }
            }
        }

        $this->command->info('');
        $this->command->info('👨‍👩‍👧‍👦 Parents created (8 total):');
        $this->command->info('   - Total children: 14 students linked');
        $this->command->info('   - Verified: 6 parents | Not verified: 2 parents');
        $this->command->info('   - Each parent linked to 1-3 children');
        $this->command->info('');

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
