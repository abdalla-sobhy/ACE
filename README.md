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











# PayFlow

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
- Bassem Hazem
- Seraj Eldeen
- Amira Ahmed
- Alaa Nabil
- Marwa Hassan
```

---

## Features:

- **AI Assistant** — Smart assistant that helps automate your business decisions.
- **Smart Invoices** — Automatically generate and send invoices to clients.
- **Smart Products** — Auto-generate product details and pricing.
- **Smart Customers** —Manage and auto-create customer profiles.
- **Smart Billing** — Handle automated billing with Stripe integration.
- **Smart Payments** — Track and confirm payments in real time.
- **Smart Reports** — Auto-generate financial and activity reports.
- **Arabic Support** — Multi-language support for Arabic and English.
- **Admin Panel** — Manage users, see users activity, and permissions.
- **User Dashboard** — Personalized dashboard for quick insights.
- **Dark Mode** — A smooth and elegant dark interface option.
- **Stripe Integration** — Secure and seamless online payment processing.

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
│   ├── routes/       # API routes
│   └── ...
└── README.md
```

## License

This project is proprietary software. All rights reserved.
