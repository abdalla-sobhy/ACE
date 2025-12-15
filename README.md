<h1>Edvance</h1>


## Quick Links

- **[Video Presentation](https://drive.google.com/file/d/1Apl8kTBPtioX6ZlsQwwTnkxxUkKaaR7T/view?usp=sharing)** - 24-minute presentation with idea demonstration (first 4 minutes) and full platform walkthrough
- **[Live Platform](https://edvance-ace.vercel.app)** - Fully functional deployed application

---

## About Edvance

Edvance is a comprehensive Learning Management System (LMS) designed to connect students, teachers, parents, universities, and companies in a unified educational ecosystem. The platform provides tools for course management, real-time communication, progress tracking, and seamless payment integration.

## Features

- **Multi-Role Support** - Dedicated dashboards for Students, Teachers, Parents, University Students, Admins, and Companies
- **Real-Time Communication** - Live video calls powered by Agora and real-time updates via WebSockets
- **Payment Integration** - Secure transactions through Stripe and PayPal
- **Identity Verification** - Built-in verification using Onfido and Persona
- **Interactive Experience** - Modern UI with 3D elements and data visualizations
- **Notifications System** - Stay updated with platform activities
- **FAQ & Support** - Comprehensive help center and contact options

## Tech Stack

### Frontend
- **Framework:** Next.js 15 with React 19
- **Styling:** Tailwind CSS
- **Real-Time:** Agora RTC, Socket.io
- **Payments:** Stripe, PayPal
- **Charts:** Recharts
- **3D Graphics:** Three.js with React Three Fiber

### Backend
- **Framework:** Laravel 12 (PHP 8.2+)
- **Authentication:** Laravel Sanctum
- **Real-Time:** Pusher
- **Payments:** Stripe, PayPal
- **Email:** Mailgun

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

## Project Structure

```
ACE/
├── frontend/          # Next.js application
│   ├── app/          # App router pages
│   ├── components/   # Reusable components
│   └── ...
├── backend/          # Laravel API
│   ├── app/          # Application logic
│   └── ...
└── README.md
```

## License

This project is proprietary software. All rights reserved.
