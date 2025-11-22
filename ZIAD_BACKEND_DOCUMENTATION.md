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

---

## Technical Deep Dive

### 1. Laravel Request Lifecycle

**How a request flows through the backend:**

```
Client Request (JSON)
    ↓
public/index.php (Entry point)
    ↓
Bootstrap Laravel Application
    ↓
HTTP Kernel (Middleware stack)
    ├─ TrustProxies
    ├─ HandleCors
    └─ Sanctum (auth:sanctum)
    ↓
Router (routes/api.php)
    ↓
Middleware (UserTypeMiddleware)
    ↓
Controller Method
    ├─ Validate Request
    ├─ Business Logic
    ├─ Query Database (Eloquent)
    └─ Return JSON Response
    ↓
Response sent to client
```

**Key Points:**
- Every API request goes through middleware stack
- Sanctum middleware verifies Bearer token
- UserTypeMiddleware checks user permissions
- Validation happens before business logic
- Eloquent ORM handles database queries

---

### 2. Eloquent ORM Deep Dive

**What is Eloquent?**
- Laravel's ActiveRecord ORM implementation
- Each database table has a corresponding Model
- Provides query builder and relationships

**Model Definition:**
```php
class User extends Model
{
    protected $fillable = ['first_name', 'last_name', 'email'];
    protected $hidden = ['password'];
    protected $casts = ['is_approved' => 'boolean'];
    
    // Relationships
    public function studentProfile() {
        return $this->hasOne(StudentProfile::class);
    }
    
    public function teachingCourses() {
        return $this->hasMany(Course::class, 'teacher_id');
    }
}
```

**Relationship Types:**
- **hasOne**: User hasOne StudentProfile
- **hasMany**: User hasMany Courses (as teacher)
- **belongsTo**: Course belongsTo User (teacher)
- **belongsToMany**: User belongsToMany Courses through enrollments

**Query Examples:**
```php
// Find user with profile
$user = User::with('studentProfile')->find($id);

// Filter and sort
$users = User::where('user_type', 'student')
             ->where('is_approved', true)
             ->orderBy('created_at', 'desc')
             ->get();

// Count
$count = User::where('status', 'active')->count();

// Update
User::where('id', $id)->update(['status' => 'suspended']);
```

**N+1 Query Problem:**
```php
// ❌ Bad - N+1 queries
$users = User::all();
foreach ($users as $user) {
    echo $user->studentProfile->grade; // New query for each user!
}

// ✅ Good - Eager loading
$users = User::with('studentProfile')->get();
foreach ($users as $user) {
    echo $user->studentProfile->grade; // Already loaded!
}
```

---

### 3. Database Migrations

**What are migrations?**
- Version control for database schema
- Each migration is a file with `up()` and `down()` methods
- Allows team collaboration without SQL dumps

**Migration Structure:**
```php
public function up()
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('first_name');
        $table->string('email')->unique();
        $table->enum('user_type', ['student', 'teacher', ...]);
        $table->boolean('is_approved')->default(false);
        $table->timestamps(); // created_at, updated_at
    });
}

public function down()
{
    Schema::dropIfExists('users');
}
```

**Foreign Keys:**
```php
$table->foreignId('user_id')
      ->constrained()
      ->onDelete('cascade'); // Delete profile when user deleted
```

**Running Migrations:**
```bash
php artisan migrate              # Run pending migrations
php artisan migrate:rollback     # Undo last batch
php artisan migrate:fresh        # Drop all tables and re-migrate
php artisan migrate:refresh      # Rollback and re-run all
```

---

### 4. Laravel Sanctum Authentication

**How Sanctum Works:**

1. **User logs in** → POST /api/auth/login
2. **Verify credentials** → Check email/password
3. **Create token** → `$user->createToken('auth-token')`
4. **Return token** → Send to client as string
5. **Client stores** → localStorage or cookie
6. **Subsequent requests** → Include `Authorization: Bearer {token}`
7. **Sanctum verifies** → `auth:sanctum` middleware checks token
8. **Request proceeds** → If valid, user available via `Auth::user()`

**Token Table Structure:**
```sql
personal_access_tokens
├─ id
├─ tokenable_id (user_id)
├─ name ('auth-token')
├─ token (hashed)
├─ abilities (JSON)
├─ expires_at
└─ last_used_at
```

**Creating Tokens:**
```php
// Simple token (never expires)
$token = $user->createToken('auth-token')->plainTextToken;

// Token with expiration
$token = $user->createToken('auth-token', ['*'], now()->addHours(24))
              ->plainTextToken;

// Token with specific abilities
$token = $user->createToken('limited', ['read-only'])->plainTextToken;
```

**Verifying Tokens:**
```php
// In routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user(); // Authenticated user
    });
});
```

---

### 5. Validation

**Request Validation:**
```php
public function register(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:8|confirmed',
        'password' => [
            'required',
            'string',
            'min:8',
            'regex:/^(?=.*[A-Z])(?=.*[0-9])/',
            'confirmed'
        ],
        'phone' => 'required|regex:/^\+20[0-9]{10}$/',
        'grade' => 'required_if:userType,student',
    ]);
}
```

**Common Validation Rules:**
- `required`: Field must be present
- `email`: Valid email format
- `unique:table,column`: No duplicate in database
- `min:8`: Minimum length/value
- `max:255`: Maximum length/value
- `confirmed`: Must have matching `_confirmation` field
- `regex:/pattern/`: Custom pattern matching
- `required_if:field,value`: Conditional requirement
- `in:foo,bar`: Must be one of specified values
- `exists:table,column`: Must exist in database

**Custom Validation:**
```php
Validator::extend('egyptian_university', function ($attribute, $value) {
    $domains = ['cu.edu.eg', 'aus.edu.eg', 'alexu.edu.eg'];
    foreach ($domains as $domain) {
        if (str_ends_with($value, '@' . $domain)) {
            return true;
        }
    }
    return false;
});
```

---

### 6. Middleware

**What is Middleware?**
- Code that runs before/after request reaches controller
- Used for authentication, logging, CORS, rate limiting

**Middleware Stack:**
```php
// Global middleware (runs on ALL requests)
protected $middleware = [
    \App\Http\Middleware\TrustProxies::class,
    \App\Http\Middleware\HandleCors::class,
];

// Route middleware (apply selectively)
protected $routeMiddleware = [
    'auth' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'userType' => \App\Http\Middleware\UserTypeMiddleware::class,
];
```

**UserTypeMiddleware Example:**
```php
public function handle(Request $request, Closure $next, $allowedType)
{
    if ($request->user()->user_type !== $allowedType) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }
    
    return $next($request);
}

// Usage in routes
Route::middleware(['auth:sanctum', 'userType:teacher'])->group(function () {
    Route::post('/teacher/courses', [TeacherController::class, 'createCourse']);
});
```

**Rate Limiting Middleware:**
```php
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('login', function (Request $request) {
    return Limit::perMinutes(15, 5)->by($request->ip());
});
```

---

### 7. API Design Patterns

**RESTful Principles:**
```
GET    /api/courses           # List all courses
GET    /api/courses/{id}      # Get single course
POST   /api/courses           # Create new course
PUT    /api/courses/{id}      # Update course
DELETE /api/courses/{id}      # Delete course
```

**Response Structure:**
```php
// Success response
return response()->json([
    'success' => true,
    'message' => 'Course created successfully',
    'data' => $course
], 201);

// Error response
return response()->json([
    'success' => false,
    'message' => 'Validation failed',
    'errors' => $validator->errors()
], 422);
```

**HTTP Status Codes:**
- 200 OK: Successful GET, PUT
- 201 Created: Successful POST
- 204 No Content: Successful DELETE
- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing/invalid token
- 403 Forbidden: Authenticated but not allowed
- 404 Not Found: Resource doesn't exist
- 422 Unprocessable Entity: Validation failed
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server-side error

**Pagination:**
```php
$courses = Course::paginate(15);

// Returns:
{
    "data": [...],
    "current_page": 1,
    "per_page": 15,
    "total": 150,
    "last_page": 10
}
```

---

### 8. File Storage

**Storing Uploaded Files:**
```php
// Store CV
$path = $request->file('cv')->store('cvs', 'public');

// With custom name
$fileName = 'cv_' . $user->id . '.' . $request->file('cv')->extension();
$path = $request->file('cv')->storeAs('cvs', $fileName, 'public');

// Returns: "cvs/cv_123.pdf"
```

**Storage Disks:**
```php
// config/filesystems.php
'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app'),
    ],
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
    ],
    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        // ... S3 config
    ],
]
```

**Downloading Files:**
```php
return response()->download(storage_path('app/' . $cvPath));

// Or stream for videos
return response()->file(storage_path('app/' . $videoPath));
```

---

### 9. Database Query Optimization

**Select Only Needed Columns:**
```php
// ❌ Bad - selects all columns
User::all();

// ✅ Good - select specific columns
User::select(['id', 'first_name', 'email'])->get();
```

**Use Indexes:**
```php
// In migration
$table->string('email')->unique(); // Creates index
$table->index('user_type'); // Explicit index
$table->index(['status', 'created_at']); // Composite index
```

**Avoid N+1 Queries:**
```php
// Use eager loading
$courses = Course::with(['teacher', 'lessons'])->get();
```

**Use whereHas for Relationship Filters:**
```php
// Get courses with at least 10 students
$courses = Course::whereHas('enrollments', function ($query) {
    $query->havingRaw('COUNT(*) >= 10');
})->get();
```

**Chunk Large Datasets:**
```php
// Instead of loading 100k records
User::where('status', 'active')->chunk(1000, function ($users) {
    foreach ($users as $user) {
        // Process each user
    }
});
```

---

### 10. Security Best Practices

**SQL Injection Prevention:**
```php
// ✅ Good - Eloquent/Query Builder (parameterized)
User::where('email', $email)->first();

// ❌ Bad - Raw SQL with interpolation
DB::select("SELECT * FROM users WHERE email = '$email'");

// ✅ Good - Raw SQL with bindings
DB::select("SELECT * FROM users WHERE email = ?", [$email]);
```

**Mass Assignment Protection:**
```php
class User extends Model
{
    // Allow these fields to be mass assigned
    protected $fillable = ['first_name', 'email'];
    
    // Prevent these fields from mass assignment
    protected $guarded = ['is_admin', 'password'];
}
```

**XSS Prevention:**
- Laravel escapes output by default in Blade
- API returns JSON (auto-escaped by browser)

**CSRF Protection:**
- Not needed for API (stateless)
- Use Sanctum for token-based auth

**Rate Limiting:**
```php
// Prevent brute force attacks
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinutes(15, 5)->by($request->ip());
});
```

**Password Hashing:**
```php
use Illuminate\Support\Facades\Hash;

// Hash password
$hashed = Hash::make($password);

// Verify password
if (Hash::check($plainPassword, $hashedPassword)) {
    // Correct
}
```

---

## Technical Interview Questions (60+ Questions)

### Laravel Fundamentals (20 questions)

**1. What is Laravel and why use it?**
- PHP web framework
- MVC architecture
- Built-in ORM (Eloquent)
- Routing, middleware, authentication
- Large ecosystem

**2. Explain the MVC pattern in Laravel.**
- Model: Database/business logic (Eloquent models)
- View: Presentation (we use JSON API, no views)
- Controller: Request handling, glue between M and V

**3. What is the service container?**
- Dependency injection container
- Resolves class dependencies automatically
- Manages object lifecycle
- Supports binding interfaces to implementations

**4. How does dependency injection work in Laravel?**
```php
public function __construct(UserRepository $repo) {
    // Laravel auto-injects $repo
}
```

**5. What are service providers?**
- Bootstrap application services
- Register bindings in service container
- Run boot() logic on app start
- Example: AuthServiceProvider, RouteServiceProvider

**6. Explain the Laravel request lifecycle.**
1. Entry point (public/index.php)
2. Load service providers
3. Run middleware
4. Route to controller
5. Execute controller logic
6. Return response

**7. What is the difference between routes/web.php and routes/api.php?**
- web.php: Web routes, session-based auth, CSRF
- api.php: API routes, stateless, token auth, no CSRF

**8. What is middleware and how is it used?**
- Code that runs before/after request
- Used for auth, logging, CORS
- Can be global or route-specific

**9. How do you create a middleware?**
```bash
php artisan make:middleware CheckAge
```
Then implement handle() method

**10. What is route model binding?**
```php
Route::get('/users/{user}', function (User $user) {
    return $user; // Laravel auto-loads User by ID
});
```

**11. Explain eager loading vs lazy loading.**
- Lazy: Load relationships when accessed (N+1 problem)
- Eager: Load relationships upfront with `with()`

**12. What is the N+1 query problem?**
- Loading models without eager loading relationships
- Results in 1 query + N queries for each relationship
- Solution: Use `with()` for eager loading

**13. What are Laravel collections?**
- Wrapper around arrays
- Provides helper methods: map, filter, reduce
- Chainable methods
```php
$users->filter()->map()->take(5);
```

**14. What is the difference between get() and first()?**
- get(): Returns collection of all matching records
- first(): Returns single model (first match) or null

**15. How do you handle transactions?**
```php
DB::transaction(function () {
    User::create([...]);
    Profile::create([...]);
    // Auto-rollback if exception
});
```

**16. What is the purpose of php artisan?**
- Laravel's command-line tool
- Runs migrations, creates files, clear cache
- Custom commands can be created

**17. Common artisan commands?**
```bash
php artisan migrate          # Run migrations
php artisan make:model User  # Create model
php artisan make:controller  # Create controller
php artisan cache:clear      # Clear cache
php artisan tinker          # REPL
```

**18. What is Laravel Tinker?**
- Interactive REPL for Laravel
- Test code without creating routes
- Query database, test functions

**19. What are accessors and mutators?**
```php
// Accessor: Modify attribute when retrieved
public function getFirstNameAttribute($value) {
    return ucfirst($value);
}

// Mutator: Modify attribute when set
public function setPasswordAttribute($value) {
    $this->attributes['password'] = bcrypt($value);
}
```

**20. What is the difference between create() and save()?**
```php
// create() - mass assignment, returns model
$user = User::create(['name' => 'John']);

// save() - instance method, saves existing model
$user = new User;
$user->name = 'John';
$user->save();
```

---

### Database & Eloquent (15 questions)

**21. What are migrations?**
- Version control for database schema
- Each migration has up() and down()
- Team collaboration without SQL dumps

**22. How do you create a migration?**
```bash
php artisan make:migration create_users_table
```

**23. What are seeders?**
- Populate database with test data
- Run with `php artisan db:seed`

**24. Explain Eloquent relationships.**
- hasOne: One-to-one
- hasMany: One-to-many
- belongsTo: Inverse of hasMany
- belongsToMany: Many-to-many
- hasManyThrough: Access distant relations

**25. How do you define a one-to-many relationship?**
```php
// User model
public function courses() {
    return $this->hasMany(Course::class);
}

// Course model
public function user() {
    return $this->belongsTo(User::class);
}
```

**26. How do you define a many-to-many relationship?**
```php
// User model
public function courses() {
    return $this->belongsToMany(Course::class, 'course_enrollments');
}
```

**27. What is a pivot table?**
- Join table for many-to-many relationships
- Example: course_enrollments (student_id, course_id)

**28. How do you add extra fields to a pivot table?**
```php
return $this->belongsToMany(Course::class)
            ->withPivot('enrolled_at', 'price_paid')
            ->withTimestamps();
```

**29. What are query scopes?**
```php
// Local scope
public function scopeActive($query) {
    return $query->where('status', 'active');
}

// Usage
User::active()->get();
```

**30. What is the difference between find() and where()?**
- find($id): Find by primary key, returns model
- where('col', 'val'): Returns query builder, needs get()

**31. How do you use raw SQL in Laravel?**
```php
DB::select('SELECT * FROM users WHERE id = ?', [$id]);
DB::insert('INSERT INTO users (name) VALUES (?)', [$name]);
DB::update('UPDATE users SET name = ? WHERE id = ?', [$name, $id]);
```

**32. What is the query builder?**
- Build SQL queries programmatically
- More flexible than Eloquent
- Still prevents SQL injection

**33. How do you debug SQL queries?**
```php
DB::enableQueryLog();
// Run queries
$queries = DB::getQueryLog();
dd($queries);
```

**34. What are database indexes and why use them?**
- Speed up SELECT queries
- Slow down INSERT/UPDATE
- Use on columns in WHERE, JOIN, ORDER BY

**35. How do you create an index in Laravel?**
```php
$table->index('email');
$table->unique('email');
$table->index(['status', 'created_at']); // Composite
```

---

### API & Authentication (15 questions)

**36. What is Laravel Sanctum?**
- Simple token-based API authentication
- Issues API tokens
- Stores in personal_access_tokens table

**37. How does Sanctum differ from Passport?**
- Sanctum: Simple, token-based, no OAuth
- Passport: Full OAuth2 server, more complex

**38. How do you create an API token?**
```php
$token = $user->createToken('auth-token')->plainTextToken;
```

**39. How do you protect routes with Sanctum?**
```php
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
```

**40. How do you logout with Sanctum?**
```php
$request->user()->currentAccessToken()->delete();
```

**41. What HTTP methods are used in REST?**
- GET: Retrieve resource
- POST: Create resource
- PUT/PATCH: Update resource
- DELETE: Delete resource

**42. What is the difference between PUT and PATCH?**
- PUT: Full replacement of resource
- PATCH: Partial update of resource

**43. What are HTTP status codes?**
- 2xx: Success (200, 201, 204)
- 4xx: Client error (400, 401, 403, 404, 422)
- 5xx: Server error (500, 503)

**44. How do you return JSON responses?**
```php
return response()->json(['data' => $user], 200);
```

**45. What is CORS and how do you handle it?**
- Cross-Origin Resource Sharing
- Allow browser to make requests from different domain
- Configure in config/cors.php

**46. How do you handle file uploads?**
```php
$path = $request->file('cv')->store('cvs', 'public');
```

**47. How do you validate file uploads?**
```php
$request->validate([
    'cv' => 'required|file|mimes:pdf,doc|max:5120'
]);
```

**48. What is rate limiting?**
- Limit number of requests per time period
- Prevent abuse and DoS attacks
- Configure in RouteServiceProvider

**49. How do you implement pagination?**
```php
$users = User::paginate(15);
```

**50. What is resource transformation?**
- Transform model data before returning
- Hide sensitive fields
- Format data consistently
```php
class UserResource extends JsonResource {
    public function toArray($request) {
        return [
            'id' => $this->id,
            'name' => $this->first_name . ' ' . $this->last_name,
        ];
    }
}
```

---

### Validation & Security (10 questions)

**51. How do you validate requests?**
```php
$request->validate([
    'email' => 'required|email|unique:users',
    'password' => 'required|min:8|confirmed'
]);
```

**52. What validation rules are available?**
- required, email, unique, min, max
- regex, confirmed, in, exists
- file, image, mimes, max (size)

**53. How do you create custom validation rules?**
```php
Validator::extend('uppercase', function($attribute, $value) {
    return strtoupper($value) === $value;
});
```

**54. How does Laravel prevent SQL injection?**
- Prepared statements (parameterized queries)
- Eloquent and Query Builder use bindings
- Never concatenate user input into SQL

**55. How do you hash passwords?**
```php
use Hash;
$hashed = Hash::make($password);
Hash::check($plain, $hashed); // Verify
```

**56. What is mass assignment and how to protect against it?**
- Assigning all request data to model at once
- Protect with $fillable or $guarded
```php
protected $fillable = ['name', 'email'];
protected $guarded = ['is_admin'];
```

**57. How do you handle CSRF in APIs?**
- APIs are stateless, don't use CSRF
- Use token-based auth (Sanctum)

**58. What is XSS and how does Laravel prevent it?**
- Cross-Site Scripting: Injecting malicious scripts
- Laravel escapes output by default
- JSON responses are safe

**59. How do you implement role-based access control?**
- Middleware to check user_type
- Laravel Gates and Policies
- Custom middleware (UserTypeMiddleware)

**60. What are Laravel Gates and Policies?**
- Gates: Simple closures for authorization
- Policies: Class-based authorization for models
- Used to check if user can perform action

---

## Quick Reference

### Common Eloquent Patterns
```php
// Create
$user = User::create(['name' => 'John']);

// Read
$user = User::find($id);
$users = User::where('status', 'active')->get();

// Update
$user->update(['name' => 'Jane']);
User::where('id', $id)->update(['status' => 'active']);

// Delete
$user->delete();
User::destroy([$id1, $id2]);

// Relationships
$user->courses; // hasMany
$course->teacher; // belongsTo
```

### Validation Rules Cheat Sheet
```php
'email' => 'required|email|unique:users,email',
'password' => 'required|string|min:8|confirmed',
'age' => 'required|integer|min:18|max:100',
'avatar' => 'nullable|image|mimes:jpg,png|max:2048',
'phone' => 'required|regex:/^\+20[0-9]{10}$/',
'role' => 'required|in:admin,user,guest',
```

### Common Artisan Commands
```bash
php artisan make:model User -m          # Model + migration
php artisan make:controller UserController --api
php artisan make:middleware CheckAge
php artisan migrate                     # Run migrations
php artisan db:seed                     # Seed database
php artisan route:list                  # List all routes
php artisan cache:clear                 # Clear cache
php artisan config:cache                # Cache config
```

