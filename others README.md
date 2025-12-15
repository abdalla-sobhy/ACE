# Edvance

## Quick Links

- **[Video Presentation](https://drive.google.com/file/d/1Apl8kTBPtioX6ZlsQwwTnkxxUkKaaR7T/view?usp=sharing)** - 24-minute presentation with idea demonstration (first 4 minutes) and full platform walkthrough
- **[Live Platform](https://edvance-ace.vercel.app)** - Fully functional deployed application
- **[Documentation](https://drive.google.com/file/d/1Kmc7LNSFSHOz7bu8w7IkSFMTN0NUxXRO/view?usp=sharing)** — Complete project documentation with ERD, screenshots, and technical details
- **[Presentation PDF](https://drive.google.com/file/d/1U7QieFolTmTjrc1kD8M2k2tvdo5oSasq/view?usp=sharing)** — Project presentation slides

### Users' Accounts to Access the Platform

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@edvance.com | Admin@123 |
| University Student | yasmin.ahmed@university.com | password123 |
| Company | company1@test.com | password123 |
| Teacher | ahmed.mohamed@teacher.com | password123 |
| Student | student15@test.com | password123 |
| Parent | parent1@test.com | password123 |

---

## Group Details:

```bash
- Group name: ALX3_SWD2_S1
- Instructor name: Basmaa Abd Elhaleem
```

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

## Technologies Used

### Frontend
- **Next.js 15** — React framework with App Router and Turbopack
- **React 19** — UI component library
- **TypeScript** — Type-safe JavaScript
- **Tailwind CSS 4** — Utility-first CSS framework
- **React Hook Form** — Form state management
- **Zod** — Schema validation
- **Axios** — HTTP client
- **Socket.io Client** — Real-time WebSocket communication
- **Agora RTC SDK** — Live video streaming
- **Recharts** — Data visualization and charts
- **Three.js** — 3D graphics and animations
- **React Three Fiber** — React renderer for Three.js
- **React Three Drei** — Useful helpers for React Three Fiber
- **Lucide React** — Icon library
- **React Icons** — Additional icon sets
- **React Dropzone** — File upload with drag-and-drop
- **React Phone Number Input** — International phone input
- **Stripe.js** — Stripe payment integration
- **PayPal React SDK** — PayPal payment integration
- **Didit SDK** — Identity verification
- **Onfido SDK** — Document verification
- **Persona React** — Identity verification alternative

### Backend
- **Laravel 12** — PHP web application framework
- **PHP 8.2+** — Server-side programming language
- **Laravel Sanctum** — API token authentication
- **Laravel Pail** — Real-time log viewer
- **Pusher** — Real-time WebSocket server
- **Guzzle HTTP** — HTTP client for API calls
- **Firebase JWT** — JSON Web Token handling
- **Stripe PHP** — Stripe payment processing
- **PayPal REST SDK** — PayPal payment processing
- **Mailgun** — Transactional email service
- **Symfony HTTP Client** — HTTP requests
- **PHPUnit** — Unit testing framework
- **Laravel Pint** — Code style fixer
- **Faker** — Test data generation
- **Mockery** — Mock object framework

### Database
- **MySQL/PostgreSQL** — Relational database
- **Eloquent ORM** — Database object-relational mapping
- **Database Migrations** — Version-controlled schema changes
- **Database Seeders** — Test data seeding

### External Services
- **Agora** — Real-time video communication
- **Jitsi** — Open-source video conferencing
- **Stripe** — Payment processing
- **PayPal** — Alternative payments
- **Mailgun** — Email delivery
- **Pusher** — WebSocket infrastructure
- **Didit** — Identity verification
- **Onfido** — Document verification
- **Persona** — Identity verification
- **JSearch API** — External job listings
- **Google Gemini** — AI career mentor

### Deployment
- **Vercel** — Frontend hosting and deployment
- **Laravel Sail** — Docker development environment

---

## Architecture Overview

### System Architecture
Edvance follows a modern **decoupled architecture** with a clear separation between the frontend and backend systems, communicating exclusively through RESTful APIs.

### API Design
- **RESTful API** — Standard HTTP methods (GET, POST, PUT, DELETE) for resource operations
- **Resource-based URLs** — Logical URL structure following REST conventions
- **JSON Response Format** — Consistent JSON responses across all endpoints
- **HTTP Status Codes** — Proper status codes for success, errors, and validation
- **API Versioning** — Structured for future version support

### Authentication Architecture
- **Token-based Authentication** — Laravel Sanctum for stateless API authentication
- **JWT Integration** — JSON Web Tokens for secure session management
- **Role-based Access Control (RBAC)** — Middleware-enforced permissions per user type
- **Multi-guard System** — Separate authentication guards for different user types

### Real-time Architecture
- **WebSocket Layer** — Pusher for server-side real-time events
- **Client Socket** — Socket.io for frontend real-time communication
- **Event Broadcasting** — Laravel events broadcast to connected clients
- **Presence Channels** — Track online users in live sessions

### Payment Architecture
- **Payment Gateway Abstraction** — Unified interface for Stripe and PayPal
- **Webhook Handlers** — Async payment confirmation processing
- **Transaction Logging** — Complete audit trail for all payments
- **Currency Handling** — Multi-currency support with conversion

### File Storage Architecture
- **Public Disk Storage** — Laravel filesystem for media files
- **Organized Directories** — Separate folders for profiles, CVs, videos, thumbnails
- **URL Generation** — Dynamic URL generation for stored files
- **File Validation** — Server-side type and size validation

### Database Architecture
- **Relational Design** — Normalized database schema with proper relationships
- **Eloquent Relationships** — HasMany, BelongsTo, MorphMany for related data
- **Soft Deletes** — Preserve data integrity with soft deletion
- **Query Optimization** — Eager loading and indexed queries

### Security Architecture
- **Password Hashing** — Bcrypt encryption for passwords
- **CORS Configuration** — Cross-origin resource sharing rules
- **Rate Limiting** — Protection against brute force attacks
- **Input Validation** — Server-side validation for all inputs
- **SQL Injection Prevention** — Eloquent ORM parameterized queries
- **XSS Protection** — Output escaping and sanitization

### Modular Structure
```
ACE/
├── frontend/                    # Next.js Application
│   ├── app/                     # App Router pages
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── student/            # Student pages
│   │   ├── teacher/            # Teacher pages
│   │   ├── parent/             # Parent pages
│   │   ├── university_student/ # University student pages
│   │   ├── company/            # Company/recruiter pages
│   │   └── ...                 # Public pages
│   ├── components/             # Reusable UI components
│   ├── context/                # React context providers
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   └── public/                 # Static assets
│
├── backend/                     # Laravel Application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    # API controllers
│   │   │   ├── Middleware/     # Request middleware
│   │   │   └── Requests/       # Form request validation
│   │   ├── Models/             # Eloquent models
│   │   ├── Notifications/      # Notification classes
│   │   └── Services/           # Business logic services
│   ├── database/
│   │   ├── migrations/         # Database migrations
│   │   └── seeders/            # Data seeders
│   ├── routes/
│   │   ├── api.php            # API routes
│   │   └── web.php            # Web routes
│   └── config/                 # Configuration files
│
└── README.md
```

### Scalability Considerations
- **Stateless API** — Horizontal scaling support
- **Queue System** — Background job processing for heavy tasks
- **Caching Layer** — Response caching for performance
- **CDN Ready** — Static assets optimized for CDN delivery

---

## Getting Started

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Composer
- MySQL/PostgreSQL

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```
