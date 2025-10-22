# Applications System - Quick Reference

## File Locations

### Backend
- **Models:** 
  - `/home/user/ACE/backend/app/Models/JobApplication.php`
  - `/home/user/ACE/backend/app/Models/JobPosting.php`
  - `/home/user/ACE/backend/app/Models/Company.php`
  - `/home/user/ACE/backend/app/Models/UniversityStudentProfile.php`
  - `/home/user/ACE/backend/app/Models/User.php`

- **Controllers:**
  - `/home/user/ACE/backend/app/Http/Controllers/Api/CompanyJobController.php`
  - `/home/user/ACE/backend/app/Http/Controllers/Api/UniversityJobController.php`

- **Routes:** `/home/user/ACE/backend/routes/api.php`

- **Notifications:**
  - `/home/user/ACE/backend/app/Notifications/ApplicationStatusUpdated.php`
  - `/home/user/ACE/backend/app/Notifications/NewJobApplication.php`
  - `/home/user/ACE/backend/app/Notifications/NewJobPosted.php`

- **Migrations:**
  - `/home/user/ACE/backend/database/migrations/2025_10_07_072030_create_job_postings_table.php`
  - `/home/user/ACE/backend/database/migrations/2025_10_07_072052_create_job_applications_table.php`

### Frontend
- **University Student Pages:**
  - `/home/user/ACE/frontend/app/university_student/jobs/page.tsx` - Browse jobs
  - `/home/user/ACE/frontend/app/university_student/jobs/[id]/page.tsx` - Job details & apply
  - `/home/user/ACE/frontend/app/university_student/applications/page.tsx` - View applications

- **Company Pages:**
  - `/home/user/ACE/frontend/app/company/dashboard/page.tsx` - Dashboard (PARTIAL)
  - `/home/user/ACE/frontend/app/company/applications/[id]/page.tsx` - Application detail

- **Styles:**
  - `/home/user/ACE/frontend/app/university_student/applications/MyApplications.module.css`
  - `/home/user/ACE/frontend/app/company/applications/[id]/ApplicationDetails.module.css`

---

## API Endpoints Summary

| Method | Endpoint | User Type | Purpose |
|--------|----------|-----------|---------|
| GET | `/api/company/jobs` | Company | List company jobs |
| POST | `/api/company/jobs` | Company | Create job |
| PUT | `/api/company/jobs/{id}` | Company | Update job |
| DELETE | `/api/company/jobs/{id}` | Company | Delete job |
| GET | `/api/company/dashboard/stats` | Company | Dashboard stats |
| GET | `/api/company/jobs/{jobId}/applications` | Company | Applications for a job |
| GET | `/api/company/applications/{id}` | Company | Application details |
| PUT | `/api/company/applications/{id}/status` | Company | Update app status |
| POST | `/api/company/applications/{id}/favorite` | Company | Toggle favorite |
| GET | `/api/company/students/{studentId}/cv` | Company | Download CV |
| GET | `/api/university/jobs` | Student | Browse jobs |
| GET | `/api/university/jobs/{id}` | Student | Job details |
| POST | `/api/university/jobs/{id}/apply` | Student | Submit application |
| GET | `/api/university/applications` | Student | My applications |
| DELETE | `/api/university/applications/{id}` | Student | Withdraw application |

---

## Status Flow Diagram

```
Application Lifecycle:
┌─────────┐     ┌──────────┐     ┌─────────────┐     ┌────────────┐
│ Pending │ --> │ Reviewing│ --> │ Shortlisted │ --> │ Interviewed│
└─────────┘     └──────────┘     └─────────────┘     └────────────┘
     │                                   │                   │
     │                                   └─────> Accepted    │
     │                                                ▲       │
     └──────────> Rejected <─────────────────────────┘       │
                    ▲                                        │
                    └────────────────────────────────────────┘

Student can withdraw from: Pending, Reviewing
Company sets interview details when status = Interviewed
```

---

## Key Data Structures

### JobApplication Status Values
- `pending` - Just submitted
- `reviewing` - Company reviewing
- `shortlisted` - Initial selection
- `interviewed` - Interview scheduled/done
- `accepted` - Offer made
- `rejected` - Rejected
- `withdrawn` - Student withdrew

### Status Colors
- pending: #ffc107 (yellow)
- reviewing: #17a2b8 (blue)
- shortlisted: #58a6ff (light blue)
- interviewed: #6f42c1 (purple)
- accepted: #3fb950 (green)
- rejected: #f85149 (red)

### Job Types
- `full_time`
- `part_time`
- `internship`
- `contract`

### Work Locations
- `onsite` (حضوري)
- `remote` (عن بعد)
- `hybrid` (مختلط)

### Experience Levels
- `entry` (مبتدئ)
- `junior` (متوسط)
- `mid` (متقدم)
- `senior` (خبير)

---

## Missing Implementation - Priority List

### P1 - Critical for MVP
1. [ ] `/company/jobs/page.tsx` - Company jobs list
2. [ ] `/company/jobs/new/page.tsx` - Create job form
3. [ ] `/company/applications/page.tsx` - Applications list for company

### P2 - Important Features
1. [ ] Bulk status updates
2. [ ] Advanced filtering (company side)
3. [ ] Application export (CSV/PDF)
4. [ ] Interview reminders/calendar integration
5. [ ] Company profile visibility to students

### P3 - Nice to Have
1. [ ] Real-time notifications (WebSocket)
2. [ ] Application scoring/rating
3. [ ] Video interview integration
4. [ ] Candidate matching algorithm
5. [ ] Analytics dashboard

---

## Testing Checklist

### Student Flow
- [ ] Browse jobs with filters
- [ ] Search jobs by keyword
- [ ] Apply for job with cover letter
- [ ] View applications list
- [ ] See application status changes
- [ ] View interview scheduling
- [ ] Withdraw pending application
- [ ] Receive email notifications

### Company Flow
- [ ] View dashboard stats
- [ ] Create new job posting
- [ ] Edit existing job
- [ ] Delete job
- [ ] View applications for job
- [ ] View application details
- [ ] Update application status
- [ ] Schedule interview
- [ ] Download student CV
- [ ] Mark application as favorite
- [ ] Receive notifications

---

## Common Queries

### Get all pending applications for a company
```php
$applications = JobApplication::whereHas('jobPosting', function ($query) use ($companyId) {
    $query->where('company_id', $companyId);
})->where('status', 'pending')->get();
```

### Get jobs by skill match
```php
$jobs = JobPosting::matchingSkills(['PHP', 'Laravel'])->active()->get();
```

### Get student's application stats
```php
$stats = [
    'total' => $student->jobApplications()->count(),
    'pending' => $student->jobApplications()->where('status', 'pending')->count(),
    'shortlisted' => $student->jobApplications()->where('status', 'shortlisted')->count(),
];
```

---

## Environment Setup

### Required Env Variables
```
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=
```

### File Storage
- CV files: `storage/app/public/{user_id}/cv/`
- Company logos: `storage/app/public/{company_id}/logo/`

---

## Dependencies

### Backend
- Laravel 10+
- PHP 8.1+
- Database: MySQL/PostgreSQL

### Frontend
- Node.js 16+
- Next.js 13+
- React 18+

---

## Database Unique Constraints
- `job_applications`: `UNIQUE(job_posting_id, student_id)`
  - Ensures one application per student per job
