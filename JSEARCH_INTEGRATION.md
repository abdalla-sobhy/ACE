# JSearch API Integration - External Job Listings

This document explains how the JSearch API integration works and how to set it up.

## Overview

The ACE platform now supports fetching job listings from external sources in addition to jobs posted directly on the platform. This is achieved through integration with the **JSearch API** from RapidAPI, which aggregates job postings from major job sites like LinkedIn, Indeed, Glassdoor, ZipRecruiter, and others via Google for Jobs.

## Features

- **Multiple Job Sources**: Students can now view jobs from:
  - **Platform Jobs**: Jobs posted directly by companies on ACE
  - **External Jobs**: Jobs from external sources via JSearch API
  - **Both**: Combined view of platform and external jobs

- **Filtering Options**: New filter added to the jobs page allowing students to choose their preferred job source

- **Seamless Integration**: External jobs are displayed with the same UI as platform jobs, with clear indicators showing their source

- **Smart Caching**: API responses are cached for 1 hour to improve performance and reduce API calls

## Setup Instructions

### 1. Get RapidAPI Key

1. Visit [RapidAPI Hub](https://rapidapi.com/hub)
2. Sign up or log in to your account
3. Navigate to the [JSearch API page](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
4. Subscribe to a plan:
   - **BASIC Plan**: Free with 200 requests/month (good for testing)
   - **PRO Plan**: $25/month with more requests
   - **ULTRA Plan**: $75/month
   - **MEGA Plan**: $150/month
5. After subscribing, copy your **X-RapidAPI-Key** from the API endpoint page

### 2. Configure Backend

1. Open your backend `.env` file
2. Add the following line with your RapidAPI key:

```env
JSEARCH_API_KEY=your_rapidapi_key_here
```

3. Save the file

### 3. Verify Setup

The integration should now be working! Students visiting the jobs page will see:
- A new "Job Source" filter in the filter panel
- Options to view: All Jobs, Platform Jobs Only, or External Jobs Only
- External jobs will have an "External" badge
- External jobs will have an "Apply on Website" button that opens the job application in a new tab

## Technical Details

### Backend Implementation

1. **JSearchService** (`backend/app/Services/JSearchService.php`):
   - Handles communication with JSearch API
   - Transforms external job data to match our internal format
   - Implements caching to reduce API calls
   - Maps job types, work locations, and experience levels

2. **UniversityJobController** (`backend/app/Http/Controllers/Api/UniversityJobController.php`):
   - Modified to support `job_source` parameter
   - Fetches from platform, external, or both sources based on filter
   - Handles external job IDs (prefixed with `ext_`)

### Frontend Implementation

1. **Jobs Page** (`frontend/app/university_student/jobs/page.tsx`):
   - New `job_source` filter added to filters state
   - UI updated to show job source badge for external jobs
   - External jobs link to their original application URL

2. **Styling** (`frontend/app/university_student/jobs/UniversityJobs.module.css`):
   - Added `.externalBadge` style for visual distinction

3. **Translations** (`frontend/locales/en.json` and `frontend/locales/ar.json`):
   - New translation keys added for job source options

## API Usage & Limits

- **Free Plan**: 200 requests/month, rate limited to 1000 requests/hour
- **Caching**: Responses cached for 1 hour to minimize API calls
- **Default Location**: Jobs are searched with "Egypt" as the default location (configurable in `JSearchService.php`)

## How It Works

### Job Fetching Process

1. User visits the jobs page
2. Frontend sends request with `job_source` parameter (`both`, `platform`, or `external`)
3. Backend controller:
   - If `platform` or `both`: Fetches jobs from database
   - If `external` or `both`: Calls JSearch API via JSearchService
   - Combines results and returns to frontend
4. Frontend displays jobs with appropriate badges and action buttons

### External Job ID Format

External jobs use IDs prefixed with `ext_` to distinguish them from platform jobs:
- Platform job: `123`
- External job: `ext_abc123xyz`

This allows the system to route requests correctly when viewing job details.

## Customization

### Changing Default Location

To change the default search location from Egypt to another location:

1. Open `backend/app/Services/JSearchService.php`
2. Find line 192: `'location' => 'Egypt',`
3. Change to your desired location, e.g., `'location' => 'United States',`

### Adjusting Cache Duration

To change how long API responses are cached:

1. Open `backend/app/Services/JSearchService.php`
2. Find line 37: `return Cache::remember($cacheKey, 3600, function () ...`
3. Change `3600` (seconds) to your desired duration

## Troubleshooting

### No External Jobs Showing

1. Verify your API key is set correctly in `.env`
2. Check backend logs for API errors: `backend/storage/logs/laravel.log`
3. Ensure you haven't exceeded your API quota
4. Verify RapidAPI subscription is active

### API Rate Limit Errors

- Free plans are limited to 1000 requests/hour
- Consider upgrading your plan or implementing longer cache duration
- Check your current usage on RapidAPI dashboard

### Jobs Not Matching Filters

- JSearch API has limited filter support compared to platform jobs
- Some filters (like experience level) are approximated from job requirements
- Work location filter only supports "remote" detection reliably

## Future Enhancements

Potential improvements for the integration:

1. **Advanced Filtering**: Add more specific filters for external jobs
2. **Job Saving**: Allow students to save external jobs to their favorites
3. **Multiple Locations**: Support searching multiple locations simultaneously
4. **Salary Conversion**: Convert salaries to local currency
5. **Job Alerts**: Notify students of new external job matches

## Support

For issues related to:
- **JSearch API**: Contact support@openwebninja.com or visit their [Discord](https://discord.gg/wxJxGsZgha)
- **ACE Platform Integration**: Create an issue in the project repository

## References

- [JSearch API Documentation](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
- [RapidAPI Documentation](https://docs.rapidapi.com/)
- [Google for Jobs](https://developers.google.com/search/docs/appearance/structured-data/job-posting)
