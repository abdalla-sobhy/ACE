# ACE Backend - Laravel Application

ACE (Academic Career Excellence) is a comprehensive educational platform built with Laravel.

## Features

- **Student Management**: Support for both K-12 students and university students
- **Teacher Platform**: Course creation and management
- **Parent Portal**: Track student progress
- **Company Portal**: Job postings and recruitment
- **AI Career Mentor**: Powered by Google Gemini AI for personalized career guidance
- **Live Streaming**: Integrated with Agora for live classes
- **Payment Processing**: Stripe and PayPal integration

## Installation

### Prerequisites

- PHP 8.1 or higher
- Composer
- SQLite (default) or MySQL/PostgreSQL

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ACE/backend
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure database**

   The application uses SQLite by default. For production, update `.env` with your database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ace
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Run migrations**
   ```bash
   php artisan migrate
   ```

6. **Create storage link**
   ```bash
   php artisan storage:link
   ```

7. **Start the development server**
   ```bash
   php artisan serve
   ```

## AI Career Mentor Setup

The AI Career Mentor feature uses Google's Gemini AI to provide personalized career guidance, CV analysis, learning paths, and job recommendations.

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Configuration

Add the following to your `.env` file:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/models
```

**Note**: As of late 2024/early 2025, Google has upgraded to Gemini 2.0 and 2.5 models. The older Gemini 1.5 models are no longer available. Use `gemini-2.0-flash-exp` for the latest experimental version or check the [Gemini API documentation](https://ai.google.dev/gemini-api/docs/models) for the current stable models.

**Note**: Without configuring the Gemini API key, AI features including CV analysis will return an error. The API key is **required** for the AI Career Mentor to function.

### AI Features

Once configured, the following endpoints will be available:

- `POST /api/ai-career/chat` - General career guidance chat
- `POST /api/ai-career/analyze-cv` - Analyze uploaded CV/resume
- `POST /api/ai-career/learning-path` - Get personalized learning recommendations
- `POST /api/ai-career/job-recommendations` - Get job role recommendations
- `POST /api/ai-career/skills-gap` - Analyze skills gap for target roles

## Other Configuration

### Payment Gateways

**Stripe:**
```env
STRIPE_KEY=your_stripe_publishable_key
STRIPE_SECRET=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

**PayPal:**
```env
PAYPAL_MODE=sandbox
PAYPAL_SANDBOX_CLIENT_ID=your_client_id
PAYPAL_SANDBOX_SECRET=your_secret
```

### Live Streaming (Agora)

```env
AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_certificate
```

### Job Search API (JSearch)

```env
JSEARCH_API_KEY=your_rapidapi_key
JSEARCH_DEFAULT_LOCATION="United States"
JSEARCH_DEFAULT_SEARCH="developer OR engineer OR intern"
```

Get your JSearch API key from [RapidAPI](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch).

## Development

### Running Tests

```bash
php artisan test
```

### Code Style

This project follows PSR-12 coding standards.

## Troubleshooting

### SSL Certificate Issues

If you encounter SSL verification errors during development:

```env
HTTP_VERIFY_SSL=false
```

**Warning**: Never disable SSL verification in production!

### AI Service Not Configured Error

If you see "AI service is not configured" error:

1. Ensure `GEMINI_API_KEY` is set in your `.env` file
2. Get your API key from https://aistudio.google.com/app/apikey
3. Restart your Laravel server after updating `.env`

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
