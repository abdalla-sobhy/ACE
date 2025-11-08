# JSearch API Configuration Guide

## Overview
This document explains how to configure and use the JSearch API integration for external job listings.

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```env
# JSearch API Configuration (Required)
JSEARCH_API_KEY=your_rapidapi_key_here

# Optional: Customize default search behavior
JSEARCH_DEFAULT_LOCATION="United States"
JSEARCH_DEFAULT_SEARCH="developer OR engineer OR intern"
```

### Getting Your API Key

1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to [JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
3. Copy your API key from the dashboard
4. Add it to your `.env` file as `JSEARCH_API_KEY`

## Usage

### API Endpoint

```
GET /api/university/jobs?job_source=external
```

### Parameters

- `job_source`: Set to `external` to fetch jobs from JSearch, `platform` for internal jobs, or `both` for combined results
- `search`: Search query (e.g., "software developer")
- `job_type`: Filter by job type (full_time, part_time, contract, internship, all)
- `work_location`: Filter by work location (remote, onsite, hybrid, all)
- `experience_level`: Filter by experience level
- `page`: Page number for pagination

### Example Request

```bash
curl "http://localhost:8000/api/university/jobs?job_source=external&search=developer&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### No Jobs Returned

If the API returns an empty jobs array, try these steps:

1. **Clear the cache:**
   ```bash
   php artisan jsearch:clear-cache
   ```

2. **Test the API integration:**
   ```bash
   php artisan jsearch:test
   ```

3. **Test with different parameters:**
   ```bash
   php artisan jsearch:test --search="software engineer" --location="Chicago"
   ```

4. **Check the logs:**
   ```bash
   tail -f storage/logs/laravel.log | grep JSearch
   ```

### Common Issues

#### API Key Not Configured
**Error:** "External job listings are currently unavailable"

**Solution:** Make sure `JSEARCH_API_KEY` is set in your `.env` file

#### Cached Empty Results
**Problem:** First request failed, subsequent requests still return empty

**Solution:** Clear the cache:
```bash
php artisan jsearch:clear-cache
# or
php artisan cache:clear
```

#### Location Has No Jobs
**Problem:** The default location (e.g., "Egypt") might not have many job listings

**Solution:** Update the default location in `.env`:
```env
JSEARCH_DEFAULT_LOCATION="United States"
```

Or specify location in the query:
```
GET /api/university/jobs?job_source=external&search=developer%20in%20Chicago
```

## Artisan Commands

### Test JSearch Integration

```bash
# Basic test
php artisan jsearch:test

# Test with custom parameters
php artisan jsearch:test --search="backend developer" --location="New York"

# Clear cache and test
php artisan jsearch:test --clear-cache
```

### Clear JSearch Cache

```bash
php artisan jsearch:clear-cache
```

## Configuration Details

### Caching

- JSearch API results are cached for **1 hour** to avoid hitting API rate limits
- Cache keys are based on search parameters
- Use `jsearch:clear-cache` command to clear cached results

### Default Behavior

When no search term is provided:
- Uses `JSEARCH_DEFAULT_SEARCH` (default: "developer OR engineer OR intern")

When no location is specified:
- Uses `JSEARCH_DEFAULT_LOCATION` (default: "United States")

### Logging

All JSearch API requests and responses are logged to help with debugging:
- Request parameters
- Response status and preview
- Number of jobs returned
- Any errors encountered

Check logs with:
```bash
tail -f storage/logs/laravel.log | grep JSearch
```

## API Response Format

External jobs are returned in the same format as platform jobs, with an additional `source` field:

```json
{
  "success": true,
  "jobs": {
    "data": [
      {
        "id": "ext_ABC123",
        "title": "Software Developer",
        "company": {
          "name": "Example Corp",
          "logo": "https://...",
          "location": "New York, NY"
        },
        "description": "...",
        "job_type": "full_time",
        "work_location": "remote",
        "location": "New York, NY, US",
        "external_url": "https://...",
        "source": "external",
        "publisher": "JSearch"
      }
    ],
    "current_page": 1,
    "last_page": 5,
    "per_page": 12,
    "total": 50
  }
}
```

## Rate Limits

JSearch API has rate limits depending on your subscription plan. The integration uses caching to minimize API calls. If you hit rate limits:

1. Results are cached for 1 hour
2. Consider upgrading your RapidAPI subscription
3. Implement longer cache duration if needed

## Support

If you continue to experience issues:

1. Check the Laravel logs: `storage/logs/laravel.log`
2. Run the test command with verbose output: `php artisan jsearch:test -v`
3. Verify your API key is valid on RapidAPI dashboard
4. Check your RapidAPI subscription status and rate limits
