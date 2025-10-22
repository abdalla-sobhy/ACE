# Applications System - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js + React)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  UNIVERSITY STUDENT                         COMPANY                          │
│  ─────────────────                          ───────                          │
│  /university_student/                       /company/                        │
│  ├── /jobs                 (Browse)         ├── /dashboard (Stats)           │
│  ├── /jobs/[id]            (Details)        ├── /jobs (MISSING)              │
│  ├── /applications         (My Apps)        ├── /jobs/new (MISSING)          │
│  ├── /profile              (Profile)        ├── /applications (MISSING)      │
│  └── /dashboard            (Dashboard)      ├── /applications/[id] (Details) │
│                                              └── /profile (Student profile)   │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Authentication & Local Storage:                                      │   │
│  │ - authData.token (JWT)                                              │   │
│  │ - user.type ('university_student' or 'company')                     │   │
│  │ - API calls via fetch with Bearer token                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ HTTP/REST
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND API (Laravel 10 + PHP)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ API ROUTES (routes/api.php)                                          │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ /api/company/* (Company Routes + Middleware)                         │  │
│  │   - /jobs, /jobs/{id}, /jobs/{jobId}/applications                   │  │
│  │   - /applications/{id}, /applications/{id}/status                   │  │
│  │   - /applications/{id}/favorite, /students/{id}/cv                  │  │
│  │   - /dashboard/stats                                                │  │
│  │                                                                      │  │
│  │ /api/university/* (Student Routes + Middleware)                     │  │
│  │   - /jobs, /jobs/{id}, /jobs/{id}/apply                            │  │
│  │   - /applications, /applications/{id}                              │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                       │                                       │
│                                       ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ CONTROLLERS                                                           │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ CompanyJobController                  UniversityJobController        │  │
│  │ ├─ getJobPostings()                    ├─ getJobPostings()          │  │
│  │ ├─ createJobPosting()                  ├─ getJobPosting()           │  │
│  │ ├─ updateJobPosting()                  ├─ applyForJob()             │  │
│  │ ├─ deleteJobPosting()                  ├─ getMyApplications()       │  │
│  │ ├─ getJobApplications()                ├─ withdrawApplication()     │  │
│  │ ├─ getApplicationDetails()             └─ (validate CV, profile)   │  │
│  │ ├─ updateApplicationStatus()                                        │  │
│  │ ├─ toggleApplicationFavorite()                                      │  │
│  │ ├─ downloadStudentCV()                                             │  │
│  │ ├─ getDashboardStats()                                             │  │
│  │ └─ notifyRelevantStudents()                                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                       │                                       │
│                                       ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ MODELS & BUSINESS LOGIC                                              │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │                                                                      │  │
│  │  JobApplication             JobPosting        Company               │  │
│  │  ├─ updateStatus()          ├─ scopeActive()  ├─ jobPostings()    │  │
│  │  ├─ markAsViewed()          ├─ increment      ├─ activeJobPostings()
│  │  ├─ scopeByStatus()         │   Views()       ├─ total_applications
│  │  ├─ scopeFavorites()        └─ scopeMatching  └─ active_jobs_count │  │
│  │  └─ getStatusColor()           Skills()                            │  │
│  │                                                                      │  │
│  │  User                        UniversityStudentProfile                │  │
│  │  ├─ jobApplications()       ├─ cv_path, cv_filename               │  │
│  │  ├─ company()               ├─ skills, languages, experience       │  │
│  │  ├─ universityStudentProfile├─ is_public, looking_for_opps        │  │
│  │  └─ (auth relationships)    └─ profile_views, cv_downloads        │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                       │                                       │
│                                       ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ NOTIFICATIONS                                                        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ ApplicationStatusUpdated  │  NewJobApplication  │  NewJobPosted      │  │
│  │ (to Student)             │  (to Company)       │  (to Students)     │  │
│  │ - Mail + Database        │  - Mail + Database  │  - Mail + Database │  │
│  │ - Interview details      │  - Student/Job info │  - Job details     │  │
│  │ - Action link            │  - Action link      │  - Skill matching  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                       │                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ (SQL)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE (MySQL/PostgreSQL)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────────┐  ┌──────────────────┐  ┌──────────────────────┐   │
│  │   job_postings     │  │ job_applications │  │ university_student_  │   │
│  ├────────────────────┤  ├──────────────────┤  │      profiles         │   │
│  │ id (PK)            │  │ id (PK)          │  ├──────────────────────┤   │
│  │ company_id (FK)    │  │ job_posting_id   │  │ id (PK)              │   │
│  │ title              │  │ (FK)             │  │ user_id (FK)         │   │
│  │ description        │  │ student_id (FK)  │  │ cv_path              │   │
│  │ requirements []    │  │ cover_letter     │  │ cv_filename          │   │
│  │ responsibilities[] │  │ status           │  │ skills []            │   │
│  │ skills_required[]  │  │ status_history[] │  │ experience []        │   │
│  │ skills_preferred[] │  │ company_notes    │  │ languages []         │   │
│  │ job_type           │  │ viewed_at        │  │ is_public            │   │
│  │ work_location      │  │ interview_date   │  │ looking_for_opportunities
│  │ experience_level   │  │ interview_loc    │  │ cv_downloads         │   │
│  │ is_active          │  │ interview_notes  │  │ linkedin_url         │   │
│  │ views_count        │  │ is_favorite      │  │ github_url           │   │
│  │ applications_count │  │ created_at       │  │ portfolio_url        │   │
│  │ created_at         │  │ updated_at       │  └──────────────────────┘   │
│  └────────────────────┘  └──────────────────┘                             │
│           │                       │                    │                  │
│           ├─────────────┬─────────┴────────────────────┘                  │
│                         │                                                 │
│  ┌──────────────────┐   │     ┌────────────────┐                         │
│  │   companies      │◄──┘     │     users      │                         │
│  ├──────────────────┤         ├────────────────┤                         │
│  │ id (PK)          │         │ id (PK)        │                         │
│  │ user_id (FK)     │◄────────│ first_name     │                         │
│  │ company_name     │         │ last_name      │                         │
│  │ industry         │         │ email          │                         │
│  │ logo_path        │         │ user_type      │                         │
│  │ is_verified      │         │ company_id (FK)│                         │
│  │ linkedin_url     │         └────────────────┘                         │
│  └──────────────────┘                                                    │
│                                                                            │
│  INDICES:                                                                 │
│  - job_applications: (student_id, status), (job_posting_id, status)      │
│  - job_applications: UNIQUE(job_posting_id, student_id)                  │
│  - job_postings: is_active, application_deadline                        │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Student Applies for Job
```
1. Student
   └─> GET /api/university/jobs/{id}
       └─> JobPosting fetched
           ├─ Check if already applied
           └─ Display form

2. Student submits form
   └─> POST /api/university/jobs/{id}/apply
       ├─ Validate: CV uploaded, profile complete, job active
       └─ Create JobApplication (status = "pending")
           ├─ Increment job's applications_count
           ├─ Trigger: NewJobApplication notification
           │   └─> Email + DB notification to company
           └─ Return: application details

3. Company receives notification
   └─> Email: "New application for [job title]"
       └─> Link to /company/applications/{id}
```

### Company Updates Application Status
```
1. Company views application
   └─> GET /api/company/applications/{id}
       ├─ Mark as viewed (set viewed_at)
       └─ Return: Full student profile + app details

2. Company updates status
   └─> PUT /api/company/applications/{id}/status
       ├─ Validate status and required fields
       ├─ Update JobApplication
       │   ├─ Set new status
       │   ├─ Append to status_history JSON
       │   ├─ If status="interviewed": save interview details
       │   └─ Save company_notes
       ├─ Trigger: ApplicationStatusUpdated notification
       │   └─> Email + DB notification to student
       │       ├─ Status label in Arabic
       │       ├─ Interview details if applicable
       │       └─ Link to applications page
       └─ Return: Updated application

3. Student receives notification
   └─> Email: "تم تحديث حالة طلبك"
       └─> Link to /university_student/applications
```

---

## Request/Response Example

### Student Apply for Job
**Request:**
```http
POST /api/university/jobs/42/apply
Authorization: Bearer {token}
Content-Type: application/json

{
  "cover_letter": "I am interested in this position because..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم إرسال طلبك بنجاح",
  "application": {
    "id": 123,
    "status": "pending",
    "created_at": "2025-10-22T10:30:00Z"
  }
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "message": "يجب كتابة خطاب تقديم لا يقل عن 50 حرف",
  "errors": {
    "cover_letter": ["The cover letter must be at least 50 characters."]
  }
}
```

### Company Update Application Status
**Request:**
```http
PUT /api/company/applications/123/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "interviewed",
  "notes": "Good candidate, technical skills strong",
  "interview_date": "2025-10-25T14:00:00",
  "interview_location": "Office Floor 2 - Conference Room A",
  "interview_notes": "Prepare case study questions"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تحديث حالة الطلب بنجاح",
  "application": {
    "id": 123,
    "status": "interviewed",
    "interview_date": "2025-10-25T14:00:00Z",
    "interview_location": "Office Floor 2 - Conference Room A",
    "status_history": [
      {
        "status": "pending",
        "changed_at": "2025-10-22T10:30:00",
        "notes": null
      },
      {
        "status": "reviewed",
        "changed_at": "2025-10-23T09:00:00",
        "notes": null
      },
      {
        "status": "interviewed",
        "changed_at": "2025-10-23T15:45:00",
        "notes": "Good candidate, technical skills strong"
      }
    ]
  }
}
```

---

## Authentication & Authorization

### User Type Middleware
```php
// Routes are protected by user_type middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('company')
        ->middleware('UserTypeMiddleware:company')
        ->group(function () {
            // Only company users
        });
    
    Route::prefix('university')
        ->middleware('UserTypeMiddleware:university_student')
        ->group(function () {
            // Only university students
        });
});
```

### Permission Checks
- Company can only access their own jobs and applications
- Student can only access their own applications
- CV download: verify student applied to company's job

---

## File Storage

### CV Files
- Location: `storage/app/public/{user_id}/cv/{filename}`
- Route: `/storage/{path}` (public access)
- Max size: (check .env)
- Formats: PDF, DOC, DOCX

### Company Logos
- Location: `storage/app/public/{company_id}/logo/{filename}`
- URL: Retrieved via `Company::getLogoUrlAttribute()`

---

## Caching Opportunities (Not Currently Implemented)
- Job listings (with tag-based invalidation)
- Dashboard stats (5 min cache)
- Company profile (30 min cache)
- Application count by status

---

## Security Considerations

1. **Input Validation:**
   - All form inputs validated server-side
   - Cover letter min/max length
   - Date format validation for interviews

2. **Authorization:**
   - User type middleware enforces role separation
   - Company can only modify their own applications
   - Student can only withdraw own applications

3. **Data Privacy:**
   - CV download requires application verification
   - Student profile exposed only to companies with applications
   - Company verification status public

4. **SQL Injection Prevention:**
   - Eloquent ORM with parameterized queries
   - JSON queries use contains operators safely

---

## Performance Considerations

1. **Indexes:**
   - (student_id, status) on job_applications
   - (job_posting_id, status) on job_applications
   - Unique constraint prevents duplicate applications

2. **Eager Loading:**
   - Applications loaded with student profiles
   - Jobs loaded with company data
   - Prevents N+1 queries

3. **Pagination:**
   - 12 jobs per page
   - 10 applications per page
   - Reduces memory/bandwidth

4. **JSON Queries:**
   - Status history is single JSON field (no extra queries)
   - Skills as arrays (JSON contains for matching)
