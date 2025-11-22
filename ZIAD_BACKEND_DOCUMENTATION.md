# زياد - Backend Documentation

## Overview
You worked on the **entire backend infrastructure** of the ACE platform using **Laravel (PHP)**. Your work is the engine that powers everything - authentication, database, APIs, business logic, and data management.

---

## Technology Stack

### Core Framework
- **Laravel** (latest version)
- **PHP** 8.x
- **PostgreSQL** database
- **Laravel Sanctum** for API authentication

### Key Laravel Features Used
- **Eloquent ORM** - Database interactions
- **Migrations** - Database schema versioning
- **Controllers** - Request handling
- **Middleware** - Authentication & authorization
- **Validation** - Input validation
- **File Storage** - CV, video, image uploads
- **Queue Jobs** - Background processing
- **Notifications** - User notifications
- **Events & Listeners** - Event-driven architecture

---

## Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/                    # API Controllers
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── TeacherController.php
│   │   │   │   ├── StudentCourseController.php
│   │   │   │   ├── UniversityStudentController.php
│   │   │   │   ├── UniversityJobController.php
│   │   │   │   ├── CompanyJobController.php
│   │   │   │   ├── ParentStudentController.php
│   │   │   │   ├── PaymentController.php
│   │   │   │   ├── NotificationController.php
│   │   │   │   ├── VideoStreamController.php
│   │   │   │   ├── LiveStreamController.php
│   │   │   │   └── DiditController.php
│   │   │   └── Admin/                  # Admin Controllers
│   │   │       ├── AdminDashboardController.php
│   │   │       ├── AdminUserController.php
│   │   │       ├── AdminCourseController.php
│   │   │       ├── AdminCompanyController.php
│   │   │       └── TeacherManagementController.php
│   │   ├── Middleware/
│   │   │   ├── UserTypeMiddleware.php  # Role-based access control
│   │   │   └── RateLimitMiddleware.php # API rate limiting
│   │   └── Requests/                   # Form validation requests
│   ├── Models/
│   │   ├── User.php
│   │   ├── StudentProfile.php
│   │   ├── TeacherProfile.php
│   │   ├── ParentProfile.php
│   │   ├── UniversityStudentProfile.php
│   │   ├── Company.php
│   │   ├── Course.php
│   │   ├── CourseLesson.php
│   │   ├── CourseEnrollment.php
│   │   ├── LessonProgress.php
│   │   ├── JobPosting.php
│   │   ├── JobApplication.php
│   │   ├── Payment.php
│   │   ├── Notification.php
│   │   └── DiditVerification.php
│   └── Services/                       # Business logic
├── database/
│   ├── migrations/                     # Database schema
│   └── seeders/                        # Test data
├── routes/
│   ├── api.php                         # API routes
│   └── web.php                         # Web routes
├── storage/
│   ├── cvs/                           # CV uploads
│   ├── videos/                        # Course videos
│   └── logos/                         # Company logos
└── config/
    ├── database.php
    ├── sanctum.php
    └── filesystems.php
```

---

## Database Schema

### Core Tables

#### **users** table
The central user table for all user types:
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'teacher', 'parent', 'university_student', 'company', 'admin'),
    status VARCHAR(50) DEFAULT 'active',  -- active, suspended
    is_approved BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(45),
    last_login_user_agent TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **student_profiles** table
```sql
CREATE TABLE student_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    grade VARCHAR(50),  -- Grade 1-12, Secondary, etc.
    birth_date DATE,
    preferred_subjects TEXT,
    goal TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **teacher_profiles** table
```sql
CREATE TABLE teacher_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(255),
    years_of_experience INTEGER,
    cv_path VARCHAR(500),
    didit_data JSONB,  -- Verification data from Didit
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **university_student_profiles** table
```sql
CREATE TABLE university_student_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    faculty VARCHAR(255),
    goal TEXT,
    cv_path VARCHAR(500),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **parent_profiles** table
```sql
CREATE TABLE parent_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    children_count INTEGER,
    didit_data JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **companies** table
```sql
CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    company_size VARCHAR(50),  -- 1-10, 11-50, 51-200, etc.
    location VARCHAR(255),
    website VARCHAR(500),
    registration_number VARCHAR(100),
    logo_path VARCHAR(500),
    description TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **courses** table
```sql
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    duration INTEGER,  -- in minutes
    lessons_count INTEGER DEFAULT 0,
    students_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    category VARCHAR(100),
    grade VARCHAR(50),  -- Target grade level
    course_type ENUM('recorded', 'live'),
    max_seats INTEGER,  -- For live courses
    enrolled_seats INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    sessions_per_week INTEGER,
    is_active BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'draft',  -- draft, published, archived
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **course_lessons** table
```sql
CREATE TABLE course_lessons (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    video_type VARCHAR(50),  -- youtube, vimeo, local
    video_file_path VARCHAR(500),
    duration INTEGER,  -- in seconds
    thumbnail VARCHAR(500),
    order_index INTEGER,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **course_enrollments** table
```sql
CREATE TABLE course_enrollments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES users(id),
    course_id BIGINT REFERENCES courses(id),
    price_paid DECIMAL(10,2),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,  -- 0-100%
    completed_at TIMESTAMP,
    UNIQUE(student_id, course_id)
);
```

#### **lesson_progress** table
```sql
CREATE TABLE lesson_progress (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT REFERENCES course_lessons(id),
    student_id BIGINT REFERENCES users(id),
    watched_duration INTEGER DEFAULT 0,  -- seconds watched
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(lesson_id, student_id)
);
```

#### **job_postings** table
```sql
CREATE TABLE job_postings (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    job_type VARCHAR(50),  -- full-time, part-time, internship
    work_location VARCHAR(50),  -- remote, onsite, hybrid
    location VARCHAR(255),
    salary_range VARCHAR(100),
    experience_level VARCHAR(50),
    positions_available INTEGER DEFAULT 1,
    application_deadline DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **job_applications** table
```sql
CREATE TABLE job_applications (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES users(id),
    job_posting_id BIGINT REFERENCES job_postings(id),
    status VARCHAR(50) DEFAULT 'applied',  -- applied, interview, rejected, accepted
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_favorited BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(student_id, job_posting_id)
);
```

#### **payments** table
```sql
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    course_id BIGINT REFERENCES courses(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),  -- stripe, paypal
    status VARCHAR(50),  -- pending, completed, failed, refunded
    transaction_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **notifications** table
```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    type VARCHAR(100),
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **didit_verifications** table
```sql
CREATE TABLE didit_verifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    session_id VARCHAR(255),
    session_number VARCHAR(255),
    status VARCHAR(50),
    vendor_data JSONB,
    personal_info JSONB,
    metadata JSONB,
    checks JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## Authentication System

### Registration Flow

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+20123456789",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "userType": "student",

  // Student-specific
  "grade": "Grade 10",
  "birthDate": "2008-01-15",

  // Teacher-specific
  "specialization": "Mathematics",
  "yearsOfExperience": 5,
  "cv": "<file>",
  "diditSessionId": "xxx",
  "diditSessionNumber": "xxx",
  "diditStatus": "Approved",

  // University Student-specific
  "faculty": "Engineering",

  // Parent-specific
  "childrenCount": 2,

  // Company-specific
  "companyName": "Tech Corp",
  "industry": "Technology",
  "companySize": "51-200"
}
```

**Backend Logic (AuthController.php):**
```php
public function register(Request $request)
{
    // 1. Validate input based on user type
    $validated = $request->validate([
        'firstName' => 'required|string|max:255',
        'lastName' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'phone' => 'required|string|regex:/^\+20[0-9]{10}$/',
        'password' => 'required|string|min:8|confirmed|regex:/^(?=.*[A-Z])(?=.*[0-9])/',
        'userType' => 'required|in:student,teacher,parent,university_student,company',
    ]);

    // 2. Additional validation for specific user types
    if ($request->userType === 'student') {
        $request->validate([
            'grade' => 'required|string',
            'birthDate' => 'required|date|before:-6 years|after:-25 years',
        ]);
    }

    if ($request->userType === 'teacher') {
        $request->validate([
            'specialization' => 'required|string',
            'yearsOfExperience' => 'required|integer|min:0',
            'cv' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'diditSessionId' => 'required|string',
            'diditStatus' => 'required|in:Approved',
        ]);
    }

    if ($request->userType === 'university_student') {
        $request->validate([
            'email' => 'regex:/@(cu|aus|alexu|helwan|mans|tanta|asu|aswu|psu|su|mu|bsu|du|fu|kfs|nvu)\.edu\.eg$/',
            'faculty' => 'required|string',
        ]);
    }

    // 3. Create user
    $user = User::create([
        'first_name' => $validated['firstName'],
        'last_name' => $validated['lastName'],
        'email' => $validated['email'],
        'phone' => $validated['phone'],
        'password' => Hash::make($validated['password']),
        'user_type' => $validated['userType'],
        'is_approved' => $this->shouldAutoApprove($validated['userType']),
    ]);

    // 4. Create type-specific profile
    $this->createUserProfile($user, $request);

    // 5. Send notification
    $user->notify(new WelcomeNotification());

    // 6. Generate auth token
    $token = $user->createToken('auth-token')->plainTextToken;

    return response()->json([
        'success' => true,
        'message' => 'تم التسجيل بنجاح',
        'user' => $user->load($this->getProfileRelation($user->user_type)),
        'token' => $token,
    ], 201);
}

private function shouldAutoApprove($userType)
{
    // Teachers and parents need manual approval
    return !in_array($userType, ['teacher', 'parent']);
}

private function createUserProfile($user, $request)
{
    switch ($user->user_type) {
        case 'student':
            StudentProfile::create([
                'user_id' => $user->id,
                'grade' => $request->grade,
                'birth_date' => $request->birthDate,
            ]);
            break;

        case 'teacher':
            // Store CV
            $cvPath = $request->file('cv')->store('cvs', 'public');

            TeacherProfile::create([
                'user_id' => $user->id,
                'specialization' => $request->specialization,
                'years_of_experience' => $request->yearsOfExperience,
                'cv_path' => $cvPath,
                'didit_data' => $request->only(['diditSessionId', 'diditSessionNumber']),
            ]);

            // Store verification record
            DiditVerification::create([
                'user_id' => $user->id,
                'session_id' => $request->diditSessionId,
                'session_number' => $request->diditSessionNumber,
                'status' => $request->diditStatus,
            ]);
            break;

        case 'university_student':
            UniversityStudentProfile::create([
                'user_id' => $user->id,
                'faculty' => $request->faculty,
                'goal' => $request->goal,
            ]);
            break;

        case 'parent':
            ParentProfile::create([
                'user_id' => $user->id,
                'children_count' => $request->childrenCount,
                'didit_data' => $request->only(['diditSessionId', 'diditSessionNumber']),
            ]);
            break;

        case 'company':
            Company::create([
                'user_id' => $user->id,
                'company_name' => $request->companyName,
                'industry' => $request->industry,
                'company_size' => $request->companySize,
                'location' => $request->location,
            ]);
            break;
    }
}
```

### Login Flow

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "remember_me": true
}
```

**Backend Logic:**
```php
public function login(Request $request)
{
    // 1. Rate limiting check (5 attempts per 15 minutes)
    $key = 'login_attempts_' . $request->ip();
    $attempts = Cache::get($key, 0);

    if ($attempts >= 5) {
        return response()->json([
            'success' => false,
            'message' => 'Too many login attempts. Try again in 15 minutes.',
        ], 429);
    }

    // 2. Validate credentials
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
        'remember_me' => 'boolean',
    ]);

    // 3. Check credentials
    if (!Auth::attempt($credentials)) {
        // Increment attempts
        Cache::put($key, $attempts + 1, now()->addMinutes(15));

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials',
        ], 401);
    }

    $user = Auth::user();

    // 4. Check if user is approved
    if (!$user->is_approved && $user->user_type === 'teacher') {
        return response()->json([
            'success' => false,
            'message' => 'Your account is pending approval',
        ], 403);
    }

    // 5. Check if suspended
    if ($user->status === 'suspended') {
        return response()->json([
            'success' => false,
            'message' => 'Your account has been suspended',
        ], 403);
    }

    // 6. Track login
    $user->update([
        'last_login_at' => now(),
        'last_login_ip' => $request->ip(),
        'last_login_user_agent' => $request->userAgent(),
    ]);

    // 7. Generate token
    $expiresAt = $request->remember_me
        ? now()->addDays(90)
        : now()->addHours(24);

    $token = $user->createToken('auth-token', ['*'], $expiresAt)->plainTextToken;

    // 8. Clear login attempts
    Cache::forget($key);

    return response()->json([
        'success' => true,
        'message' => 'تم تسجيل الدخول بنجاح',
        'user' => $user->load($this->getProfileRelation($user->user_type)),
        'token' => $token,
        'expires_at' => $expiresAt,
        'remember_me' => $request->remember_me ?? false,
    ]);
}
```

### Logout

**Endpoint:** `POST /api/auth/logout` (Protected)

```php
public function logout(Request $request)
{
    // Delete current access token
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'success' => true,
        'message' => 'تم تسجيل الخروج بنجاح',
    ]);
}
```

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get authenticated user

### Student Routes
- `GET /api/student/profile` - Get profile
- `PUT /api/student/profile` - Update profile
- `GET /api/student/courses/{id}/view` - View course
- `POST /api/student/courses/{id}/enroll` - Enroll in course
- `GET /api/student/my-courses` - My enrolled courses
- `POST /api/student/lessons/{id}/progress` - Update progress

### Teacher Routes
- `GET /api/teacher/profile` - Get profile
- `PUT /api/teacher/profile` - Update profile
- `GET /api/teacher/courses` - Get my courses
- `POST /api/teacher/courses` - Create course
- `PUT /api/teacher/courses/{id}` - Update course
- `DELETE /api/teacher/courses/{id}` - Delete course
- `POST /api/teacher/courses/{id}/lessons` - Create lesson
- `PUT /api/teacher/lessons/{id}` - Update lesson

### University Student Routes
- `GET /api/university/profile` - Get profile
- `PUT /api/university/profile` - Update profile
- `POST /api/university/upload-cv` - Upload CV
- `GET /api/university/jobs` - Browse jobs
- `POST /api/university/jobs/{id}/apply` - Apply for job
- `GET /api/university/applications` - My applications

### Company Routes
- `GET /api/company/profile` - Get profile
- `POST /api/company/jobs` - Create job posting
- `GET /api/company/jobs` - Get my job postings
- `GET /api/company/applications` - View applications
- `PUT /api/company/applications/{id}/status` - Update status

### Parent Routes
- `GET /api/parent/profile` - Get profile
- `POST /api/parent/search-student` - Search for student
- `POST /api/parent/follow-request` - Send follow request
- `GET /api/parent/followed-students` - Get followed students

### Admin Routes
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `POST /api/admin/teachers/{id}/approve` - Approve teacher
- `PUT /api/admin/users/{id}/status` - Update user status
- `GET /api/admin/courses` - Manage courses
- `GET /api/admin/companies` - Manage companies

### Payment Routes
- `POST /api/payment/stripe/create-intent/{courseId}` - Create Stripe payment
- `POST /api/payment/paypal/create-order/{courseId}` - Create PayPal order
- `GET /api/payment/history` - Payment history

### Notification Routes
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `POST /api/notifications/mark-all-read` - Mark all as read

---

## Middleware & Security

### UserTypeMiddleware
Enforces role-based access control:
```php
public function handle($request, Closure $next, $allowedType)
{
    if ($request->user()->user_type !== $allowedType) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized access',
        ], 403);
    }

    return $next($request);
}
```

### Rate Limiting
- Login: 5 attempts per 15 minutes (IP-based)
- API calls: 60 requests per minute (user-based)
- OTP: 3 verification attempts per OTP

---

## Key Concepts to Know

### 1. **Eloquent Relationships**
How models connect:
```php
// User.php
public function studentProfile() {
    return $this->hasOne(StudentProfile::class);
}

public function teachingCourses() {
    return $this->hasMany(Course::class, 'teacher_id');
}

public function enrolledCourses() {
    return $this->belongsToMany(Course::class, 'course_enrollments', 'student_id', 'course_id');
}
```

### 2. **Migrations**
Database version control:
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('first_name');
    $table->string('email')->unique();
    $table->timestamps();
});
```

### 3. **Sanctum Authentication**
Token-based API auth:
- Tokens stored in `personal_access_tokens` table
- Each login creates new token
- Tokens expire based on settings
- Logout deletes token

### 4. **File Storage**
Handling uploads:
```php
$path = $request->file('cv')->store('cvs', 'public');
```

### 5. **Validation**
Input validation:
```php
$request->validate([
    'email' => 'required|email|unique:users',
    'password' => 'required|min:8|confirmed',
]);
```

---

## Testing Questions

**1. What framework did you use?**
- Laravel (PHP)

**2. What database is used?**
- PostgreSQL

**3. How does authentication work?**
- Laravel Sanctum with Bearer tokens

**4. What user types exist?**
- Student, Teacher, Parent, University Student, Company, Admin

**5. Do all users get approved immediately?**
- No, teachers and parents need approval

**6. How long do auth tokens last?**
- 24 hours normal, 90 days if "remember me"

**7. What payment methods are supported?**
- Stripe and PayPal

**8. How are roles enforced?**
- UserTypeMiddleware checks user_type

**9. Where are files stored?**
- Laravel storage (cvs/, videos/, logos/)

**10. What happens when teacher registers?**
- Account created with is_approved=false
- Admin must approve via `/admin/teachers/{id}/approve`

---

## Your Impact

✅ Built entire API layer
✅ Designed database schema
✅ Implemented authentication & authorization
✅ Created all business logic
✅ Handled file uploads
✅ Integrated payment systems
✅ Built admin management panel

You are the backbone of ACE platform! 🚀
