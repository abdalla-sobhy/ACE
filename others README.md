# Edvance

## Quick Links

- **[Video Presentation](https://drive.google.com/file/d/1Apl8kTBPtioX6ZlsQwwTnkxxUkKaaR7T/view?usp=sharing)** - 24-minute presentation with idea demonstration (first 4 minutes) and full platform walkthrough
- **[Live Platform](https://edvance-ace.vercel.app)** - Fully functional deployed application
- **[Documentation](https://drive.google.com/file/d/1Kmc7LNSFSHOz7bu8w7IkSFMTN0NUxXRO/view?usp=sharing)** — Complete project documentation with ERD, screenshots, and technical details
- **[Presentation PDF](https://drive.google.com/file/d/1U7QieFolTmTjrc1kD8M2k2tvdo5oSasq/view?usp=sharing)** — Project presentation slides

---

PayFlow is a lightweight yet powerful Customer Relationship Management (CRM) and Billing Platform crafted to help startups, freelancers, and small businesses eliminate operational chaos.
With integrated AI insights and seamless payment handling — PayFlow makes business management smarter and simpler.

---

## Group Details:

```bash
- Group name: ALX3_SWD2_S1
- Instructor name: Basmaa Abd Elhaleem
```

---

---

## Presented By:

```bash
- Abdalla Sobhy
- Ziad Mahmoud
- Mohammed Mahmoud
- Malak Magdy
- Salsabeel Shehata
```

---

## Features

### Authentication & Security
- **User Registration** — Role-based registration for Students, Teachers, Parents, University Students, and Companies
- **Secure Login** — Email/password authentication with token-based sessions
- **Email Verification** — OTP-based email verification system
- **Password Recovery** — Secure password reset via email tokens
- **Rate Limiting** — Login attempt protection (5 attempts max, 15-minute lockout)
- **Session Tracking** — Track last login time, IP address, and user agent
- **Identity Verification** — Didit integration for document verification, face matching, liveness detection, and AML checks
- **Academic Email Validation** — University domain verification for academic accounts
- **Account Status Management** — Active, suspended, and pending account states
- **Remember Me** — Extended session tokens (90-day expiration)

### Student Features
- **Student Dashboard** — Personalized dashboard with enrolled courses and progress tracking
- **Course Browsing** — Browse courses filtered by grade level
- **Course Search** — Search courses by teacher name or course title
- **Course Filtering** — Filter courses by type (live/recorded)
- **Course Enrollment** — Enroll in free and paid courses
- **Preview Lessons** — Access preview lessons before enrollment
- **Video Learning** — Watch video content with progress tracking
- **Lesson Progress** — Track watched time, percentage, and completion status
- **Auto-Completion** — Lessons marked complete at 90% watched
- **Resume Playback** — Continue from last watched position
- **Course Completion Rate** — Track overall course progress
- **Live Class Access** — Join live sessions with real-time video
- **Student Profile** — Manage profile, grade, birth date, and preferences
- **Profile Picture** — Upload and manage profile pictures

### University Student Features
- **University Dashboard** — Specialized dashboard for higher education
- **Career Goal Setting** — Set and track career objectives
- **Smart Course Recommendations** — AI-powered course suggestions based on career goals
- **Public Profile Builder** — Create professional profiles visible to recruiters
- **CV Management** — Upload, update, and download CV documents
- **Portfolio Links** — Add LinkedIn, GitHub, and portfolio URLs
- **Skills & Languages** — Showcase technical skills and language proficiency
- **Experience & Projects** — Display work experience and project portfolio
- **Certifications & Achievements** — Highlight certifications and accomplishments
- **Job Board Access** — Browse job postings from verified companies
- **External Job Listings** — Access external jobs via JSearch API integration
- **Job Filtering** — Filter by location, job type, and experience level
- **Job Applications** — Apply with cover letters and track status
- **Application Tracking** — Monitor application status (pending, reviewing, shortlisted, interviewed, accepted, rejected)
- **Application Withdrawal** — Withdraw submitted applications
- **Opportunity Toggle** — Mark profile as "Looking for opportunities"
- **Profile Statistics** — Track profile views and application counts

### Teacher Features
- **Teacher Dashboard** — Overview of courses, students, and revenue
- **Course Creation** — Create recorded or live courses with full details
- **Course Management** — Edit, activate/deactivate, and delete courses
- **Thumbnail Upload** — Upload course and lesson thumbnails
- **Pricing Configuration** — Set course prices and original prices
- **Lesson Management** — Create, edit, delete, and reorder lessons
- **Video Upload** — Upload video files or link external videos (YouTube, Vimeo)
- **Preview Lesson Toggle** — Mark lessons as preview (free access)
- **Live Course Setup** — Configure maximum seats, start/end dates
- **Session Scheduling** — Set sessions per week, days, and times
- **Auto Session Generation** — Automatically generate sessions from schedule
- **Live Class Hosting** — Start and end live sessions
- **Attendance Monitoring** — Track student attendance in real-time
- **Session Chat** — Send messages during live sessions
- **Revenue Tracking** — View total and per-course revenue
- **Student Analytics** — Track enrollment counts and completion rates
- **Course Ratings** — View average ratings and feedback
- **Teaching Statistics** — Total courses, students, revenue, and upcoming sessions
- **CV Upload** — Upload teaching CV for verification
- **Teacher Approval Workflow** — Submit application and await admin approval

### Parent Features
- **Parent Dashboard** — Monitor all linked students from one place
- **Student Search** — Find students by email to follow
- **Follow Requests** — Send and manage follow requests
- **Request Management** — Accept or reject incoming requests
- **Student Linking** — Link/unlink student accounts
- **Student Monitoring** — View linked students' details and progress
- **Enrollment Tracking** — See all courses each student is enrolled in
- **Progress Monitoring** — Track per-student and per-course progress
- **Completion Tracking** — View completed courses and lessons
- **Overall Statistics** — See combined progress across all students
- **Children Count** — Manage number of children in profile
- **Identity Verification** — Didit verification for parent accounts

### Company/Recruiter Features
- **Company Registration** — Register with company details and verification
- **Company Profile** — Manage company name, industry, size, location, and description
- **Company Logo** — Upload company logo and profile picture
- **Company Benefits** — List company benefits for job seekers
- **Social Links** — Add LinkedIn and website URLs
- **Job Posting Creation** — Create detailed job postings with requirements
- **Job Configuration** — Set job type, work location, salary range, experience level
- **Skills Requirements** — Specify required and preferred skills
- **Faculty Preferences** — Target specific academic faculties
- **Application Deadline** — Set deadlines for job applications
- **Position Count** — Specify number of available positions
- **Job Management** — Edit, delete, activate/deactivate postings
- **Application Dashboard** — View all applications across jobs
- **Application Filtering** — Filter by status and favorite
- **Application Sorting** — Sort by various fields
- **Candidate Profiles** — View full student profiles and CVs
- **CV Download** — Download candidate CVs
- **Favorite Candidates** — Mark applications as favorite
- **Status Updates** — Update application status with notes
- **Interview Scheduling** — Schedule interviews with date and location
- **Company Notes** — Add private notes to applications
- **Application Notifications** — Get alerts for new applications
- **Dashboard Statistics** — Track postings, applications, shortlists, and interviews

### Admin Features
- **Admin Dashboard** — Comprehensive platform statistics and analytics
- **User Management** — View, filter, and search all users
- **User Actions** — Suspend, activate, and delete user accounts
- **Teacher Approval** — Review and approve/reject teacher applications
- **Rejection Reasons** — Provide feedback for rejected applications
- **CV Review** — Download and review teacher CVs
- **Verification Review** — Check Didit verification data
- **Course Oversight** — Monitor and manage all courses
- **Company Verification** — Verify and unverify company accounts
- **Analytics Dashboard** — View trends for 7, 30, and 90-day periods
- **User Growth Analytics** — Track user registration trends
- **Enrollment Analytics** — Monitor enrollment patterns
- **Revenue Analytics** — Track platform revenue
- **Activity Monitoring** — View recent platform activity
- **Admin Creation** — Create new admin accounts

### AI Career Mentor
- **AI Chat Interface** — Interactive chat with AI career mentor
- **Career Conversations** — General career guidance and advice
- **CV Analysis** — AI-powered CV review and feedback
- **Learning Path Generation** — Personalized learning recommendations
- **Job Recommendations** — AI-suggested job opportunities
- **Skills Gap Analysis** — Identify skills to develop
- **Conversation History** — Access last 50 messages
- **Conversation Types** — Select conversation focus
- **Profile Context** — AI uses profile data for personalized responses
- **Clear History** — Reset conversation history

### Live Streaming & Video
- **Agora Integration** — Real-time video streaming for live classes
- **Jitsi Fallback** — Alternative video conferencing support
- **Live Sessions** — Schedule and host live class sessions
- **Session Status** — Track scheduled, live, completed, and cancelled sessions
- **Real-time Attendance** — Track student attendance during sessions
- **Live Chat** — In-session messaging for teachers and students
- **Role-based Access** — Teachers as hosts, students as participants

### Payment System
- **Stripe Integration** — Secure card payment processing
- **PayPal Integration** — Alternative payment method
- **Payment Intent** — Create and confirm payment intents
- **Currency Conversion** — EGP to USD conversion for PayPal
- **Payment History** — Track all transactions
- **Transaction IDs** — Unique identifiers for payments
- **Webhook Handling** — Automated payment confirmation

### Notifications System
- **Database Notifications** — Persistent notification storage
- **Email Notifications** — Email alerts for important events
- **Welcome Notifications** — Onboarding notifications for new users
- **Follow Request Alerts** — Notifications for parent-student linking
- **Job Posting Alerts** — Notify relevant students about new jobs
- **Application Updates** — Status change notifications
- **Teacher Notifications** — Approval and rejection alerts
- **Notification Management** — View, mark read, and delete notifications
- **Unread Count** — Track unread notification count
- **Bulk Actions** — Mark all as read, delete all read

### Profile & Media Management
- **Profile Pictures** — Upload for all user types (JPEG, PNG, JPG, GIF)
- **CV Documents** — Upload PDF, DOC, DOCX files (5MB max)
- **Video Content** — Upload videos or link external URLs
- **Thumbnails** — Course and lesson thumbnail images
- **Company Logos** — Company branding images
- **File Validation** — Type and size validation
- **Auto Cleanup** — Delete old files on update

### Multi-language Support
- **Arabic Support** — Full Arabic language interface
- **English Support** — Complete English localization
- **Localized Notifications** — Language-specific notification text
- **RTL Support** — Right-to-left layout for Arabic

---

# Technologies Used:

```bash
## Backend:
- Node.js
- Express.js
- JWT (Authentication)
- Bcrypt (Password Encryption)
## Frontend:
- React.js
- Vite
- Tailwind CSS

## Database:
- MongoDB

## Payments:
- Stripe

## Deployment:
- Vercel
```

---

# Architecture Overview

- RESTful API design
- Token-based authentication (JWT)
- Modular and scalable folder structure
- Integrated AI-based automation layer

# ERD Diagram:

![ERD](./frontend/src/assets/ERD.png)

## Screenshots:

| Page                   | Preview                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| **Unregistered Panel** | ![Unregistered](./frontend/src/assets/unregistered_github.png)       |
| **Login**              | ![Login](./frontend/src/assets/login_github.png)                     |
| **Dashboard**          | ![Dashboard](./frontend/src/assets/dashboard_github.png)             |
| **Invoices**           | ![Invoices](./frontend/src/assets/invoice_github.png)                |
| **Products**           | ![Products](./frontend/src/assets/product_github.png)                |
| **Customers**          | ![Customers](./frontend/src/assets/customer_github.png)              |
| **Pricing & Billing**  | ![Pricing_Billing](./frontend/src/assets/pricing_billing_github.png) |
| **Reports**            | ![Reports](./frontend/src/assets/report_github.png)                  |
| **AI Assistant**       | ![AI Assistant](./frontend/src/assets/ai_assistance_github.png)      |
| **Settings**           | ![Settings](./frontend/src/assets/settings_github.png)               |
| **Admin Panel**        | ![Admin Panel](./frontend/src/assets/admin_github.png)               |

---
