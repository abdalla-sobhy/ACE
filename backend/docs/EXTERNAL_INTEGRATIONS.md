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

1. **Check if API key is configured:**
   ```bash
   php artisan tinker
   >>> config('services.jsearch.api_key')
   ```

2. **Test the API directly:**

   Use the included test script:
   ```bash
   cd backend
   php test_jsearch.php YOUR_API_KEY_HERE
   ```

   This will show you exactly what's happening with the API call.

3. **Check Laravel logs for errors:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

4. **Check the API response in the frontend:**

   Look for a `warning` field in the API response which will indicate the specific issue.

#### Common Error Codes

**403 Forbidden - "Access denied"**

This means your API key is not valid or not properly subscribed to JSearch API.

**Solutions:**
1. Go to [RapidAPI Dashboard](https://rapidapi.com/developer/dashboard)
2. Click on "My Subscriptions"
3. Verify you're subscribed to [JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
4. If not subscribed, click "Subscribe to Test" or choose a plan
5. Copy your API key from the dashboard (look for "X-RapidAPI-Key" in the code examples)
6. Update your `.env` file with the new key
7. Clear the config cache: `php artisan config:clear`

**429 Too Many Requests**

You've exceeded your API rate limit.

**Solutions:**
1. Check your usage in the [RapidAPI Dashboard](https://rapidapi.com/developer/dashboard)
2. Wait for your quota to reset (usually monthly)
3. Upgrade to a higher tier plan if needed
4. The app caches results for 1 hour to minimize API calls

**Important Notes:**
- Free tier has limited requests per month (usually 100-500 depending on the plan)
- Make sure you're testing with the same API key that's in your `.env` file
- The JSearch API requires an active subscription, even for the free tier
- If you just signed up, you may need to activate the API from the RapidAPI dashboard

#### API errors

- Verify your API key is valid
- Check your RapidAPI subscription status
- Ensure you haven't exceeded rate limits
- Review error logs in `storage/logs/laravel.log`
- Use the test script to diagnose issues: `php backend/test_jsearch.php YOUR_KEY`

### Support

For issues with:
- **JSearch API**: Contact RapidAPI support
- **Integration code**: Check Laravel logs or contact development team
