# External Integrations

This document describes how to configure external integrations for the ACE platform.

## JSearch API Integration

The JSearch API provides access to external job listings from various sources. This integration allows students to view jobs from external platforms alongside platform-specific jobs.

### Features

- Search external job listings from multiple sources
- Filter by job type, location, and experience level
- View detailed job information
- Seamless integration with platform jobs

### Setup

1. **Sign up for RapidAPI**
   - Visit [RapidAPI](https://rapidapi.com)
   - Create an account or sign in

2. **Subscribe to JSearch API**
   - Go to [JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
   - Subscribe to a plan (free tier available)
   - Copy your API key from the dashboard

3. **Configure Environment Variable**
   - Copy your `.env.example` to `.env` if not already done:
     ```bash
     cp .env.example .env
     ```
   - Add your API key to the `.env` file:
     ```
     JSEARCH_API_KEY=your_rapidapi_key_here
     ```

4. **Clear Cache** (if applicable)
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

### Testing

Test the integration using the test endpoint:

```bash
curl http://localhost:8000/api/university/test-jsearch
```

Or with custom parameters:

```bash
curl "http://localhost:8000/api/university/test-jsearch?search=developer&location=Egypt"
```

### Usage

The external jobs are automatically integrated into the university jobs endpoint:

- **All jobs** (platform + external): `job_source=both` (default)
- **Platform jobs only**: `job_source=platform`
- **External jobs only**: `job_source=external`

Example request:

```bash
GET /api/university/jobs?page=1&job_source=external&search=developer
```

### API Response

When external job source is requested but API key is not configured, the API will:

1. Return an empty jobs array
2. Log a warning in Laravel logs
3. Include a warning message in the response:
   ```json
   {
     "success": true,
     "jobs": {
       "data": [],
       "current_page": 1,
       "last_page": 1,
       "per_page": 12,
       "total": 0
     },
     "warning": "External job listings are currently unavailable. Please configure JSEARCH_API_KEY."
   }
   ```

### Caching

External job search results are cached for 1 hour to avoid hitting API rate limits. To clear the cache:

```bash
php artisan cache:clear
```

### Rate Limits

JSearch API has different rate limits based on your subscription plan:

- **Free tier**: Limited requests per month
- **Basic tier**: More requests per month
- **Pro tier**: Higher limits

Check your [RapidAPI dashboard](https://rapidapi.com/developer/dashboard) for current usage.

### Troubleshooting

#### No external jobs returned

1. Check if API key is configured:
   ```bash
   php artisan tinker
   >>> config('services.jsearch.api_key')
   ```

2. Check Laravel logs for warnings:
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. Test the API directly:
   ```bash
   php artisan route:list | grep jsearch
   ```

#### API errors

- Verify your API key is valid
- Check your RapidAPI subscription status
- Ensure you haven't exceeded rate limits
- Review error logs in `storage/logs/laravel.log`

### Support

For issues with:
- **JSearch API**: Contact RapidAPI support
- **Integration code**: Check Laravel logs or contact development team
