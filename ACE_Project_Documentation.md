# ACE Project Documentation

---

## Digital Egypt Pioneers Initiative
### React Front-End Development

---

# ACE – Access to Careers & Education

**ACE** (Access to Careers & Education) is the **world's first platform** of its kind that seamlessly integrates education and career development into one unified digital system.

The name **ACE** introduces an **innovative** and **pioneering** concept that **appears for the first time in this field**.

Our vision is to redefine the connection between learning and employment, transforming them into a single, continuous experience where university students are closer to their future careers, companies are closer to the qualified talents they seek, and instructors are closer to their accomplishments.

---

## Edvance

### Supervised by:
**Eng. Basma Abdel Halim**

### Team members:
- Eng. Abdalla Sobhy
- Eng. Salsabeel Shehata
- Eng. Malak Magdy
- Eng. Mohammed Mahmoud
- Eng. Ziad Mahmoud

**Digital Egypt Pioneers Initiative**
*Integrated Education & Career Platform*

---

# Acknowledgement

We extend our heartfelt appreciation to Eng. Basma Abdel Halim for her invaluable guidance and unwavering support throughout our journey in the Digital Egypt Pioneers Initiative. Her mentorship has been instrumental in shaping our experience, providing us with the knowledge, insights, and encouragement needed to excel.

Her technical expertise, constructive feedback, and commitment to fostering innovation have played a crucial role in the development and success of this initiative. She has consistently provided thoughtful advice and practical solutions, helping us overcome challenges and refine our approach.

We are truly grateful for the opportunities to learn, grow, and collaborate under her insightful leadership. Her dedication and passion have left a lasting impact on our journey, and we sincerely appreciate her efforts in guiding and inspiring us every step of the way.

---

# Abstract

ACE (Access to Careers & Education) is a groundbreaking platform designed to revolutionize the connection between education and employment. It uniquely integrates a Learning Management System (LMS) with a job platform, creating a unified digital ecosystem that empowers learners, facilitates career development, and enables companies to discover pre-qualified talent efficiently.

The platform addresses the disconnect between academic learning and real-world job opportunities by providing personalized career paths, fostering collaboration between educational institutions and companies, and offering an interactive learning environment powered by AI and analytics.

ACE serves university students, K-12 learners, teachers, parents, and companies, streamlining processes from course enrollment and skill development to job application and recruitment, thereby establishing a new global model for educational and employment efficiency.

---

# Table of Contents

1. **Project Planning & Management**
   - 1.1. Project Proposal
   - 1.2. Project Plan
   - 1.3. Task Assignment & Roles
   - 1.4. Risk Assessment & Mitigation Plan
   - 1.5. KPIs (Key Performance Indicators)

2. **Technology Stack & Architecture**
   - 2.1. Frontend Technologies
   - 2.2. Backend Technologies
   - 2.3. Third-Party Integrations
   - 2.4. System Architecture

3. **Requirements Gathering**
   - 3.1. Stakeholder Analysis
   - 3.2. User Stories & Use Cases
   - 3.3. Functional Requirements
   - 3.4. Non-functional Requirements

4. **System Analysis & Design**
   - 4.1. Problem Statement & Objectives
   - 4.2. Database Design & Data Modeling
   - 4.3. Data Flow & System Behavior
   - 4.4. UI/UX Design & Prototyping

5. **Implementation (Features by User Type)**
   - 5.1. Student Features (K-12)
   - 5.2. University Student Features
   - 5.3. Teacher Features
   - 5.4. Company/Recruiter Features
   - 5.5. Parent Features
   - 5.6. Admin Features

6. **Core Platform Features**
   - 6.1. Authentication & Authorization
   - 6.2. AI Career Mentor (Gemini Integration)
   - 6.3. Live Classes (Agora Integration)
   - 6.4. Payment Processing (Stripe & PayPal)
   - 6.5. Identity Verification (Didit)
   - 6.6. Job Board (JSearch API)
   - 6.7. Notification System
   - 6.8. Internationalization (Arabic & English)

7. **Testing & Quality Assurance**
   - 7.1. Test Cases & Test Plan
   - 7.2. Security Measures
   - 7.3. Performance Optimizations

8. **Deployment & Documentation**
   - 8.1. Deployment Architecture
   - 8.2. Source Code Repository
   - 8.3. User Manual
   - 8.4. Technical Documentation

---

# 1. Project Planning & Management

## 1.1. Project Proposal

### Overview
ACE (Access to Careers & Education) is the first platform of its kind in the world that combines a Learning Management System (LMS) with Job Platforms into one smart and efficient system. It serves as the missing bridge between "education" and "employment", transforming the academic journey into a complete professional experience.

### Objectives
- Integrate education and the labor market into one connected experience
- Personalize the career path for each user based on their skills and educational level
- Enable universities and companies to collaborate in practically training students
- Provide an interactive learning environment built on AI and analytics
- Establish a new global model that unites education and employment in a single digital ecosystem

### Scope
The system caters to various user types, providing distinct interfaces and functionalities:
- **University Student Portal**: Access courses, build professional profiles, apply for jobs/internships
- **Company Portal**: Post job opportunities, search for talent, manage recruitment pipelines
- **Learner Portal (K-12)**: Access courses, track progress, join live sessions
- **Teacher Dashboard**: Create and manage courses, conduct live classes, track student performance
- **Parent Dashboard**: Monitor child's academic and career progress
- **Admin Dashboard**: Oversee platform operations, manage users, and analyze platform data

## 1.2. Project Plan

### Development Phases
- **Phase 1**: Analysis & Planning - Market research and user needs analysis
- **Phase 2**: Core Development - Building the backend system and main interfaces
- **Phase 3**: System Integration - Integrating the LMS with the job system
- **Phase 4**: Feature Enhancement - AI integration, live classes, payment processing
- **Phase 5**: Testing & Launch - Comprehensive testing and deployment

### Deliverables
- A fully functional ACE platform integrating LMS and job board features
- Personalized dashboards for all user types (Student, University Student, Teacher, Company, Parent, Admin)
- AI-powered career mentor using Google Gemini
- Live class streaming via Agora RTC
- Payment processing via Stripe and PayPal
- Identity verification via Didit
- Multi-language support (Arabic & English)
- Comprehensive documentation

## 1.3. Task Assignment & Roles

Responsibilities for team members are defined across development, design, and management roles, ensuring efficient project execution. Specific assignments leverage individual expertise in frontend, backend, UI/UX, and project leadership.

## 1.4. Risk Assessment & Mitigation Plan

Potential risks include integration challenges between LMS and job modules, user adoption rates, data security, and scalability. Mitigation strategies involve:
- Thorough testing and phased rollouts
- Robust security protocols (JWT authentication, role-based access)
- Flexible, scalable architecture (Next.js + Laravel)
- Real-time monitoring and error handling

## 1.5. KPIs (Key Performance Indicators)

| KPI | Description | Target |
|-----|-------------|--------|
| User Engagement Rate | Percentage of active users across all roles | High engagement across segments |
| Job/Internship Placement Rate | Students securing positions through platform | Significant year-on-year increase |
| Course Completion Rate | Students successfully completing courses | Above industry average |
| System Uptime | Platform availability | 99.9% uptime |
| User Satisfaction Score | Based on feedback and reviews | Consistently high (4.5+/5) |
| AI Mentor Utilization | Users engaging with AI career mentor | Growing adoption |

---

# 2. Technology Stack & Architecture

## 2.1. Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.5.7 | React framework with SSR |
| React | 19 | UI component library |
| TypeScript | Latest | Type-safe development |
| Tailwind CSS | 4 | Utility-first styling |
| Three.js | Latest | 3D graphics for hero section |
| React Three Fiber | Latest | React wrapper for Three.js |
| Recharts | Latest | Data visualization & analytics |
| Lucide React | Latest | Modern icon library |
| React Hook Form | Latest | Form handling |
| Zod | Latest | Schema validation |

## 2.2. Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Laravel | 12.0 | PHP backend framework |
| PHP | 8.2+ | Server-side language |
| MySQL/PostgreSQL | Latest | Database |
| Laravel Sanctum | Latest | API authentication |
| Eloquent ORM | Latest | Database abstraction |

## 2.3. Third-Party Integrations

| Service | Purpose | Status |
|---------|---------|--------|
| **Google Gemini AI** | AI Career Mentor | Implemented |
| **Agora RTC SDK** | Live video classes | Implemented |
| **Stripe** | Credit card payments (EGP) | Implemented |
| **PayPal** | PayPal wallet payments | Implemented |
| **Didit API** | Identity verification (KYC) | Implemented |
| **JSearch API** | External job listings | Implemented |
| **Mailgun** | Email delivery | Implemented |
| **Socket.io** | Real-time communication | Implemented |

## 2.4. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 15 (React 19)  │  TypeScript  │  Tailwind CSS 4        │
│  Three.js (3D)          │  Recharts    │  i18n (AR/EN)          │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS/WebSocket
┌─────────────────────────▼───────────────────────────────────────┐
│                         API LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  Laravel 12 (PHP 8.2+)  │  Sanctum Auth  │  RESTful APIs         │
│  Middleware (RBAC)      │  Rate Limiting │  CORS                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                       SERVICE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  GeminiService    │  AgoraService     │  DiditService            │
│  JSearchService   │  PaymentService   │  NotificationService     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                       DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  MySQL/PostgreSQL       │  Redis Cache    │  File Storage         │
│  31 Database Migrations │  Queue System   │  Cloud Storage        │
└─────────────────────────────────────────────────────────────────┘
```

---

# 3. Requirements Gathering

## 3.1. Stakeholder Analysis

| Stakeholder | Needs |
|-------------|-------|
| **University Students** | Build professional profiles, gain practical skills, find job/internship opportunities, AI career guidance |
| **Companies/Employers** | Qualified young talent, efficient recruitment tools, application management |
| **Learners (K-12)** | Engaging educational content, live classes, progress tracking |
| **Teachers/Trainers** | Course creation tools, live teaching capabilities, student analytics, revenue management |
| **Parents** | Monitor children's academic and career development |
| **Admins** | System operations, user management, content moderation, platform analytics |

## 3.2. User Stories & Use Cases

### Student (K-12)
- As a student, I want to browse and enroll in courses so I can learn new skills
- As a student, I want to join live classes so I can interact with teachers in real-time
- As a student, I want an AI mentor to help guide my learning path
- As a student, I want my parents to track my progress so they stay informed

### University Student
- As a university student, I want to find relevant internships based on my skills and major
- As a university student, I want to build a comprehensive profile with my CV, skills, and projects
- As a university student, I want to apply for jobs and track my applications
- As a university student, I want AI-powered career advice to help me make informed decisions

### Teacher
- As a teacher, I want to create and publish online courses
- As a teacher, I want to conduct live classes with video streaming
- As a teacher, I want to track student progress and attendance
- As a teacher, I want to manage course enrollment and payments

### Company
- As a company, I want to post job openings and filter candidates by specific skills
- As a company, I want to view candidate profiles and download their CVs
- As a company, I want to manage applications through different stages
- As a company, I want AI assistance for recruitment insights

### Parent
- As a parent, I want to monitor my child's course progress
- As a parent, I want to view my child's session attendance
- As a parent, I want to receive notifications about my child's achievements

### Admin
- As an admin, I want to approve teacher registrations
- As an admin, I want to verify company accounts
- As an admin, I want to moderate course content
- As an admin, I want comprehensive platform analytics

## 3.3. Functional Requirements

### Authentication & Authorization
- User registration with email verification (OTP)
- Role-based login (Student, University Student, Teacher, Company, Parent, Admin)
- JWT token-based authentication via Laravel Sanctum
- Password recovery and reset functionality
- Session management and token expiration handling

### Course Management
- Course creation with multiple lessons
- Support for recorded and live courses
- Course enrollment and payment processing
- Progress tracking per lesson
- Certificate generation (ready for implementation)

### Job Board
- Job posting creation and management
- Application submission with cover letter
- Application status tracking (pending → reviewing → shortlisted → interviewed → accepted/rejected)
- CV management and downloads
- External job integration via JSearch API

### Live Classes
- Session scheduling and management
- Real-time video streaming via Agora RTC
- Chat functionality during sessions
- Attendance tracking
- Session recording capabilities

### AI Features
- AI Career Mentor powered by Google Gemini
- CV analysis and recommendations
- Learning path suggestions
- Job role matching
- Skills gap analysis

### Notifications
- Real-time notification delivery
- Application status updates
- Course enrollment notifications
- Session reminders
- Parent-student follow requests

## 3.4. Non-functional Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Performance** | Next.js with Turbopack, code splitting, lazy loading, image optimization |
| **Security** | JWT authentication, role-based access control, password hashing (bcrypt), CORS configuration |
| **Scalability** | Modular architecture, API-first design, queue system for background jobs |
| **Usability** | Responsive design, RTL support for Arabic, dark/light themes |
| **Reliability** | Error handling, input validation, comprehensive logging |
| **Accessibility** | High contrast themes, responsive layouts, ARIA support |

---

# 4. System Analysis & Design

## 4.1. Problem Statement & Objectives

### Problem Statement
The significant disconnect between traditional education systems and the demands of the job market leads to graduates lacking essential practical skills and companies struggling to find qualified talent. This results in a gap between academic learning and professional readiness, hindering career progression and economic growth.

### Objectives
ACE aims to bridge this gap by providing an integrated platform that:
- Connects learning pathways directly to career opportunities
- Empowers students with relevant skills and market insights
- Enables efficient talent discovery for employers
- Facilitates collaboration between educational bodies and industries
- Provides AI-powered career guidance and mentoring

## 4.2. Database Design & Data Modeling

The database is designed using a normalized approach (3NF) with MySQL/PostgreSQL as the RDBMS, optimized for scalability and performance.

### Core Entities

#### User Management
| Model | Description |
|-------|-------------|
| `User` | Base user model with authentication |
| `StudentProfile` | K-12 student information |
| `UniversityStudentProfile` | Comprehensive profile with skills, CV, experience |
| `TeacherProfile` | Teacher specialization and verification |
| `ParentProfile` | Parent information |
| `Company` | Company details and verification |

#### Course System
| Model | Description |
|-------|-------------|
| `Course` | Course definition with pricing |
| `CourseLesson` | Individual lessons within courses |
| `CourseEnrollment` | Student enrollment tracking |
| `LessonProgress` | Progress per lesson |
| `LiveSession` | Live class sessions |
| `SessionAttendance` | Attendance records |
| `ChatMessage` | Session chat messages |

#### Job System
| Model | Description |
|-------|-------------|
| `JobPosting` | Job listings with requirements |
| `JobApplication` | Applications with status tracking |

#### Other Entities
| Model | Description |
|-------|-------------|
| `Payment` | Transaction records |
| `Notification` | System notifications |
| `AiConversation` | AI mentor chat history |
| `ParentStudentFollowRequest` | Parent-child linking |
| `DiditVerification` | Identity verification records |

### Database Statistics
- **Total Migrations**: 31
- **Key Relationships**: Foreign key constraints with CASCADE rules
- **Indexes**: Strategic indexing for query optimization
- **Soft Deletes**: Implemented for data recovery

## 4.3. Data Flow & System Behavior

### Authentication Flow
```
User → Login Request → Laravel Sanctum → Token Generation → Cookie Storage → Protected Routes
```

### Course Enrollment Flow
```
Browse Courses → Select Course → Payment (Stripe/PayPal) → Enrollment Created → Access Content
```

### Job Application Flow
```
Browse Jobs → View Details → Submit Application → Company Review → Status Updates → Notifications
```

### Live Class Flow
```
Teacher Schedules → Students Join → Agora Token Generated → Video Stream → Chat & Attendance → Session Ends
```

## 4.4. UI/UX Design & Prototyping

### Design Principles
- **Professional Aesthetic**: Inspired by GitHub and VS Code
- **Simplicity & Clarity**: Clean interfaces with intuitive navigation
- **Goal Focus**: Highlighting progress and opportunities
- **Bilingual Support**: Full Arabic and English support with RTL

### Visual Identity
- **Color Scheme**: Professional with light and dark themes
- **Typography**: Cairo font for Arabic/Latin support
- **Icons**: Lucide React for modern, minimal icons
- **Charts**: Recharts for analytics visualization

### Responsive Design
- Mobile-first approach
- Tailwind CSS responsive utilities
- Dynamic layouts for all screen sizes
- Touch-friendly interfaces

---

# 5. Implementation (Features by User Type)

## 5.1. Student Features (K-12)

### Dashboard (`/student/dashboard`)
- Course overview and statistics
- Recent activity feed
- Quick actions for navigation

### Course Management
- **Browse Courses** (`/student/courses`): Filter and search courses
- **Course Details** (`/student/courses/[id]`): View content, enroll
- **My Courses** (`/student/my-courses`): Track enrolled courses
- **Payment** (`/student/payment/[courseId]`): Stripe/PayPal integration

### Live Learning
- **My Sessions** (`/student/my-sessions`): Upcoming live classes
- **Live Class** (`/student/live-class/[sessionId]`): Join with Agora RTC

### AI & Profile
- **AI Mentor** (`/student/ai-mentor`): Gemini-powered career guidance
- **Profile** (`/student/profile`): Personal information management
- **Follow Requests** (`/student/follow-requests`): Parent linking

## 5.2. University Student Features

### Dashboard (`/university_student/dashboard`)
- Profile completeness indicator
- Application statistics
- Job recommendations

### Course Access
- **Course Details** (`/university_student/courses/[id]`)
- **Payment Processing** (`/university_student/payment/[courseId]`)

### Job Board
- **Browse Jobs** (`/university_student/jobs`): JSearch integration
- **Job Details** (`/university_student/jobs/[id]`): Apply with cover letter
- **My Applications** (`/university_student/applications`): Track status

### Profile & AI
- **Profile** (`/university_student/profile`):
  - Personal information
  - CV upload and management
  - Skills and certifications
  - Work experience
  - Projects portfolio
  - Languages
  - Public profile settings
  - Profile views tracking
- **AI Mentor** (`/university_student/ai-mentor`): Career-focused guidance

## 5.3. Teacher Features

### Dashboard (`/teacher/dashboard`)
- Class overview and statistics
- Revenue tracking
- Student engagement metrics

### Course Management
- **My Courses** (`/teacher/courses`): List all courses
- **Create Course** (`/teacher/courses/create`): Full course creation wizard
- **Edit Course** (`/teacher/courses/[id]/edit`): Update content
- **Course Details** (`/teacher/courses/[id]`): View enrollments

### Live Teaching
- **Teach Live Class** (`/teacher/live-class/[sessionId]`):
  - Host video stream via Agora
  - Manage participants
  - Chat moderation
  - Attendance tracking

### Analytics
- **Class Analytics** (`/teacher/analytics`):
  - Student progress charts
  - Attendance reports
  - Engagement metrics

### Profile
- **Profile** (`/teacher/profile`): Verification and credentials

## 5.4. Company/Recruiter Features

### Registration (`/company/register`)
- Public company registration
- Company verification process

### Dashboard (`/company/dashboard`)
- Job posting statistics
- Application overview
- Recent activity

### Job Management
- **My Jobs** (`/company/jobs`): List all postings
- **Create Job** (`/company/jobs/new`): Job posting creation
- **Job Details** (`/company/jobs/[id]`): View applications
- **Edit Job** (`/company/jobs/[id]/edit`): Update posting

### Application Management
- **All Applications** (`/company/applications`): Filter and sort
- **Application Details** (`/company/applications/[id]`):
  - View candidate profile
  - Download CV
  - Update status
  - Add notes
  - Schedule interviews
  - Mark favorites

### AI & Profile
- **AI Mentor** (`/company/ai-mentor`): Recruitment assistance
- **Company Profile** (`/company/profile`): Branding and info

## 5.5. Parent Features

### Dashboard (`/parent/dashboard`)
- Children monitoring overview
- Activity feed

### Student Monitoring
- **My Students** (`/parent/students`): List followed children
- **Student Details** (`/parent/students/[id]`):
  - Course enrollments
  - Progress tracking
  - Session attendance
  - Achievement history

### Profile
- **Profile** (`/parent/profile`): Personal information

## 5.6. Admin Features

### Dashboard (`/admin/dashboard`)
- Platform-wide statistics
- User growth charts
- Revenue analytics
- System health

### User Management
- **All Users** (`/admin/users`):
  - View all users
  - Suspend/activate accounts
  - Role management

### Teacher Management
- **Teachers** (`/admin/teachers`):
  - Approval workflow
  - Verification status
  - Performance metrics

### Course Moderation
- **Courses** (`/admin/courses`):
  - Content review
  - Approval/rejection
  - Quality assurance

### Company Verification
- **Companies** (`/admin/companies`):
  - Verification workflow
  - Company analytics
  - Job posting oversight

---

# 6. Core Platform Features

## 6.1. Authentication & Authorization

### Implementation
- **Backend**: Laravel Sanctum (token-based API authentication)
- **Frontend**: JWT tokens stored in HTTP-only cookies
- **Middleware**: Role-based access control via `UserTypeMiddleware`

### Authentication Flow
1. User registers via `/signup` or `/company/register`
2. Email verification via OTP
3. Login credentials validated against bcrypt-hashed passwords
4. Sanctum token issued and stored in `authToken` cookie
5. User type stored in `userType` cookie
6. Middleware enforces role-based route protection

### Security Features
- Password hashing with bcrypt
- Token expiration and refresh
- CSRF protection
- Rate limiting on authentication endpoints
- Session invalidation on logout

## 6.2. AI Career Mentor (Gemini Integration)

### Features
| Feature | Description |
|---------|-------------|
| **General Career Advice** | Personalized career guidance |
| **CV Analysis** | AI-powered resume feedback |
| **Learning Path** | Customized course recommendations |
| **Job Recommendations** | Matching jobs to skills |
| **Skills Gap Analysis** | Identifying improvement areas |

### Implementation
- **Service**: `GeminiService.php`
- **Model**: Google Gemini 2.0 Flash
- **Context**: User profile, courses, applications, job data
- **Safety**: Content filtering enabled
- **Storage**: Conversation history in `AiConversation` model

### Availability
- Students (K-12)
- University Students
- Companies (recruitment focus)

## 6.3. Live Classes (Agora Integration)

### Features
- Real-time video/audio streaming
- Multiple participant support
- Screen sharing capabilities
- In-class chat functionality
- Automatic attendance tracking
- Recording capabilities (server-side)

### Implementation
- **Service**: `AgoraService.php`
- **Token Generation**: Secure RTC tokens
- **Roles**: Host (teacher) and Audience (student)
- **Channel**: Unique per session

### User Experience
```
Teacher                          Student
   │                                │
   ├── Creates Session ────────────┤
   │                                │
   ├── Starts Live Class           │
   │       │                        │
   │       ▼                        │
   │   [Agora RTC]  ──────────────► Joins Session
   │       │                        │
   │       ▼                        │
   │   Video Stream ◄────────────► View Stream
   │       │                        │
   │   Chat Messages ◄────────────► Participate
   │       │                        │
   └── End Session ────────────────┤ Attendance Recorded
```

## 6.4. Payment Processing (Stripe & PayPal)

### Supported Methods
| Provider | Currency | Features |
|----------|----------|----------|
| **Stripe** | EGP | Credit/debit cards, secure checkout |
| **PayPal** | EGP | PayPal wallet, buyer protection |

### Implementation
- **Stripe**: Payment Intent API with webhooks
- **PayPal**: Client-side SDK integration
- **Security**: PCI-compliant, no card data stored
- **Flow**: Create intent → Confirm payment → Webhook verification

### Payment Flow
```
Select Course → Choose Payment Method → Process Payment → Webhook Confirmation → Enrollment Created
```

## 6.5. Identity Verification (Didit)

### Verification Checks
- Document verification
- Face match
- Liveness detection
- Age verification
- AML screening

### Implementation
- **Service**: `DiditService.php`
- **Flow**: Session-based verification
- **Webhook**: Status updates on completion
- **Storage**: `DiditVerification` model

### Use Cases
- Teacher identity verification
- Parent verification for child monitoring
- Company representative verification

## 6.6. Job Board (JSearch API)

### Features
- External job listings integration
- Search by query, location, employment type
- Remote job filtering
- Pagination support
- Results caching

### Implementation
- **Service**: `JSearchService.php`
- **Provider**: RapidAPI JSearch
- **Caching**: Performance optimization
- **Integration**: Combined with platform job postings

## 6.7. Notification System

### Notification Types
- Application status updates
- Course enrollment confirmations
- Live session reminders
- Parent follow request notifications
- Job posting alerts
- System announcements

### Features
- Real-time delivery via Socket.io
- Unread count tracking
- Mark as read functionality
- Notification preferences
- Email notifications (Mailgun)

## 6.8. Internationalization (Arabic & English)

### Implementation
- JSON-based translation files
- React Context for language state
- Custom `useLanguage()` hook
- RTL support for Arabic

### Coverage
| Language | File Size | Coverage |
|----------|-----------|----------|
| Arabic | 131KB | Full platform |
| English | 96KB | Full platform |

### Features
- Dynamic language switching
- Bidirectional text support
- Cairo font for Arabic typography
- Persistent language preference

---

# 7. Testing & Quality Assurance

## 7.1. Test Cases & Test Plan

### Test Categories
| Category | Coverage |
|----------|----------|
| Authentication | Login, registration, password reset, token management |
| User Flows | Student, university student, teacher, company, parent journeys |
| Course Management | Creation, enrollment, progress tracking |
| Job Board | Posting, application, status management |
| Live Classes | Session creation, joining, chat, attendance |
| Payments | Stripe and PayPal flows |
| AI Features | Mentor conversations, recommendations |

### Testing Approach
- Manual testing of core functionalities
- API endpoint testing
- Cross-browser compatibility
- Mobile responsiveness
- Arabic RTL layout verification

## 7.2. Security Measures

### Implemented Security
| Measure | Implementation |
|---------|----------------|
| **Authentication** | JWT via Sanctum, bcrypt password hashing |
| **Authorization** | Role-based middleware |
| **SQL Injection** | Eloquent ORM parameterized queries |
| **XSS Protection** | React automatic escaping |
| **CORS** | Configured for API access |
| **Rate Limiting** | API endpoint protection |
| **Input Validation** | Zod schema validation |
| **Token Security** | HTTP-only cookies |

## 7.3. Performance Optimizations

### Frontend
- **Turbopack**: Next.js build optimization
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Dynamic imports for large components
- **Font Loading**: Modern WOFF2 format

### Backend
- **API Caching**: Job search results
- **Eager Loading**: Eloquent relationship optimization
- **Queue System**: Background job processing
- **Database Indexing**: Strategic index placement
- **Pagination**: Large dataset handling

---

# 8. Deployment & Documentation

## 8.1. Deployment Architecture

### Production Stack
```
┌─────────────────────────────────────────┐
│              Load Balancer               │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐    ┌───▼───┐    ┌───▼───┐
│Next.js│    │Next.js│    │Next.js│
│  App  │    │  App  │    │  App  │
└───┬───┘    └───┬───┘    └───┬───┘
    │             │             │
    └─────────────┼─────────────┘
                  │
         ┌───────▼───────┐
         │  Laravel API   │
         └───────┬───────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐    ┌───▼───┐    ┌───▼───┐
│  DB   │    │ Redis │    │Storage│
└───────┘    └───────┘    └───────┘
```

### Environment Configuration
- `.env` files for frontend and backend
- Separate development and production configs
- Secure credential management

## 8.2. Source Code Repository

**Repository**: GitHub (Private)

### Folder Structure
```
/ACE
├── frontend/               # Next.js 15 application
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── context/           # Context providers
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   ├── locales/           # i18n translations
│   └── public/            # Static assets
├── backend/               # Laravel 12 API
│   ├── app/               # Application logic
│   ├── database/          # Migrations & seeders
│   ├── routes/            # API routes
│   └── resources/         # Configuration
├── three/                 # 3D assets
└── docs/                  # Documentation
```

## 8.3. User Manual

### Getting Started
1. **Access the Platform**: Navigate to the ACE website
2. **Create an Account**: Register as Student, University Student, Teacher, Company, or Parent
3. **Verify Email**: Complete OTP verification
4. **Complete Profile**: Fill in required information
5. **Explore Features**: Access role-specific features

### Student Guide
- Browse courses in the catalog
- Enroll using Stripe or PayPal
- Track progress in My Courses
- Join live sessions at scheduled times
- Use AI Mentor for career guidance
- Allow parents to monitor progress

### University Student Guide
- Build comprehensive profile with CV
- Add skills, experience, and certifications
- Browse and apply for jobs
- Track application status
- Use AI Mentor for career planning
- Make profile public for recruiters

### Teacher Guide
- Create courses with lessons
- Schedule live sessions
- Conduct classes via video streaming
- Track student progress and attendance
- View analytics and reports

### Company Guide
- Register and verify company
- Post job openings
- Review applications
- Download candidate CVs
- Update application statuses
- Use AI for recruitment insights

### Parent Guide
- Send follow requests to children
- Monitor course progress
- View session attendance
- Track academic achievements

## 8.4. Technical Documentation

### API Endpoints

#### Authentication
```
POST /api/register         - User registration
POST /api/login            - User login
POST /api/logout           - User logout
POST /api/forgot-password  - Password reset request
POST /api/reset-password   - Password reset
POST /api/verify-email     - Email verification
```

#### Courses
```
GET    /api/courses              - List courses
GET    /api/courses/{id}         - Course details
POST   /api/courses              - Create course (Teacher)
PUT    /api/courses/{id}         - Update course (Teacher)
DELETE /api/courses/{id}         - Delete course (Teacher)
POST   /api/courses/{id}/enroll  - Enroll in course
```

#### Jobs
```
GET    /api/jobs                 - List jobs
GET    /api/jobs/{id}            - Job details
POST   /api/jobs                 - Create job (Company)
PUT    /api/jobs/{id}            - Update job (Company)
DELETE /api/jobs/{id}            - Delete job (Company)
```

#### Applications
```
GET    /api/applications           - List applications
POST   /api/applications           - Submit application
GET    /api/applications/{id}      - Application details
PUT    /api/applications/{id}      - Update status (Company)
```

#### Live Sessions
```
GET    /api/sessions               - List sessions
POST   /api/sessions               - Create session (Teacher)
GET    /api/sessions/{id}/token    - Get Agora token
POST   /api/sessions/{id}/join     - Join session
```

#### AI Mentor
```
POST   /api/ai/chat                - Send message
GET    /api/ai/conversations       - Get conversation history
```

---

# Conclusion

ACE (Access to Careers & Education) represents a comprehensive solution to bridge the gap between education and employment. The platform successfully integrates:

- **Learning Management System** with course creation, enrollment, and progress tracking
- **Job Platform** with posting, application, and recruitment management
- **Live Classes** via Agora RTC for real-time education
- **AI Career Mentor** powered by Google Gemini for personalized guidance
- **Payment Processing** through Stripe and PayPal
- **Identity Verification** via Didit for secure onboarding
- **Multi-language Support** with full Arabic and English localization

### Key Achievements
- 6 distinct user types with tailored experiences
- 31 database migrations supporting robust data architecture
- Real-time features including video streaming and notifications
- AI-powered career guidance and job matching
- Secure, scalable, and maintainable codebase

### Technology Excellence
- Modern stack: Next.js 15 + React 19 + Laravel 12
- TypeScript for type safety
- Tailwind CSS for responsive design
- Comprehensive third-party integrations

ACE establishes a new paradigm for educational technology platforms, demonstrating that learning and career development can be seamlessly unified into a single, powerful ecosystem.

---

**Document Version**: 2.0
**Last Updated**: December 2024
**Platform Version**: 1.0.0
**Developed by**: Team Edvance - Digital Egypt Pioneers Initiative
