<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class JSearchService
{
    private $apiKey;
    private $apiHost;
    private $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.jsearch.api_key');
        $this->apiHost = 'jsearch.p.rapidapi.com';
        $this->baseUrl = 'https://jsearch.p.rapidapi.com';
    }

    /**
     * Search for jobs using JSearch API
     *
     * @param array $params
     * @return array
     */
    public function searchJobs(array $params = [])
    {
        try {
            // Check if API key is configured
            if (empty($this->apiKey)) {
                Log::warning('JSearch API key not configured');
                return [
                    'jobs' => [],
                    'total' => 0,
                ];
            }

            // Build query from parameters
            $query = $this->buildQuery($params);

            // Create cache key
            $cacheKey = 'jsearch_' . md5(json_encode($params));

            // Cache for 1 hour to avoid hitting API limits
            return Cache::remember($cacheKey, 3600, function () use ($query, $params) {
                Log::info('JSearch API request', [
                    'query' => $query,
                    'params' => $params,
                    'api_key_set' => !empty($this->apiKey),
                ]);

                $response = Http::withHeaders([
                    'X-RapidAPI-Key' => $this->apiKey,
                    'X-RapidAPI-Host' => $this->apiHost,
                ])->get($this->baseUrl . '/search', [
                    'query' => $query,
                    'page' => $params['page'] ?? 1,
                    'num_pages' => 1,
                    'date_posted' => $params['date_posted'] ?? 'all',
                    'remote_jobs_only' => $params['remote_only'] ?? false,
                    'employment_types' => $params['employment_types'] ?? null,
                ]);

                Log::info('JSearch API response', [
                    'status' => $response->status(),
                    'body_preview' => substr($response->body(), 0, 500),
                ]);

                if ($response->successful()) {
                    $data = $response->json();

                    if ($data['status'] === 'OK' && isset($data['data'])) {
                        Log::info('JSearch API returned jobs', [
                            'count' => count($data['data']),
                        ]);
                        return $this->transformJobs($data['data']);
                    }
                }

                // Log detailed error information
                $statusCode = $response->status();
                $errorMessage = $response->body();

                if ($statusCode === 403) {
                    Log::error('JSearch API authentication failed (403 Forbidden)', [
                        'message' => 'API key may be invalid, expired, or not subscribed to JSearch API',
                        'status' => $statusCode,
                        'body' => $errorMessage,
                    ]);
                } elseif ($statusCode === 429) {
                    Log::warning('JSearch API rate limit exceeded (429)', [
                        'status' => $statusCode,
                        'body' => $errorMessage,
                    ]);
                } else {
                    Log::warning('JSearch API request failed', [
                        'status' => $statusCode,
                        'body' => $errorMessage,
                    ]);
                }

                return [
                    'jobs' => [],
                    'total' => 0,
                    'error' => "JSearch API error (HTTP $statusCode)",
                    'error_details' => $statusCode === 403
                        ? 'API key authentication failed. Please verify your RapidAPI subscription.'
                        : ($statusCode === 429
                            ? 'API rate limit exceeded. Please try again later.'
                            : 'External API request failed.'),
                ];
            });

        } catch (\Exception $e) {
            Log::error('JSearch API error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'params' => $params,
            ]);

            return [
                'jobs' => [],
                'total' => 0,
            ];
        }
    }

    /**
     * Build search query from parameters
     *
     * @param array $params
     * @return string
     */
    private function buildQuery(array $params)
    {
        $parts = [];

        // Add search term if provided
        if (!empty($params['search'])) {
            $parts[] = $params['search'];
        } else {
            $parts[] = 'jobs';
        }

        // Add location (default to Egypt if not specified)
        if (!empty($params['location'])) {
            $parts[] = 'in ' . $params['location'];
        } else {
            $parts[] = 'in Egypt';
        }

        return implode(' ', $parts);
    }

    /**
     * Transform JSearch jobs to our application format
     *
     * @param array $jobs
     * @return array
     */
    private function transformJobs(array $jobs)
    {
        $transformed = [];

        foreach ($jobs as $job) {
            $transformed[] = [
                'id' => 'ext_' . ($job['job_id'] ?? md5($job['job_title'] . $job['employer_name'])),
                'title' => $job['job_title'] ?? 'Unknown Title',
                'company' => [
                    'id' => null,
                    'name' => $job['employer_name'] ?? 'Unknown Company',
                    'logo' => $job['employer_logo'] ?? null,
                    'industry' => null,
                    'location' => $job['job_city'] ?? $job['job_country'] ?? null,
                    'is_verified' => false,
                ],
                'description' => $job['job_description'] ?? '',
                'requirements' => $this->extractRequirements($job['job_description'] ?? ''),
                'responsibilities' => [],
                'skills_required' => $job['job_required_skills'] ?? [],
                'skills_preferred' => [],
                'job_type' => $this->mapJobType($job['job_employment_type'] ?? 'FULLTIME'),
                'work_location' => $this->mapWorkLocation($job),
                'location' => $this->formatLocation($job),
                'salary_range' => $this->formatSalary($job),
                'experience_level' => $this->mapExperienceLevel($job['job_required_experience'] ?? []),
                'education_requirement' => $job['job_required_education'] ?? null,
                'positions_available' => 1,
                'application_deadline' => null,
                'created_at' => $job['job_posted_at_datetime_utc'] ?? now(),
                'has_applied' => false,
                'application_status' => null,
                'is_expired' => $job['job_is_remote'] ?? false ? false : ($job['job_offer_expiration_datetime_utc'] ? strtotime($job['job_offer_expiration_datetime_utc']) < time() : false),
                'external_url' => $job['job_apply_link'] ?? $job['job_google_link'] ?? null,
                'source' => 'external',
                'publisher' => $job['job_publisher'] ?? 'JSearch',
            ];
        }

        return [
            'jobs' => $transformed,
            'total' => count($transformed),
        ];
    }

    /**
     * Extract requirements from job description
     *
     * @param string $description
     * @return array
     */
    private function extractRequirements($description)
    {
        // Simple extraction - look for bullet points or numbered lists
        $requirements = [];

        if (preg_match_all('/[•\-\*]\s*(.+?)(?:\n|$)/m', $description, $matches)) {
            $requirements = array_slice($matches[1], 0, 5); // Take first 5
        }

        return $requirements;
    }

    /**
     * Map JSearch job type to our format
     *
     * @param string $type
     * @return string
     */
    private function mapJobType($type)
    {
        $mapping = [
            'FULLTIME' => 'full_time',
            'PARTTIME' => 'part_time',
            'CONTRACTOR' => 'contract',
            'INTERN' => 'internship',
        ];

        return $mapping[$type] ?? 'full_time';
    }

    /**
     * Map work location from JSearch data
     *
     * @param array $job
     * @return string
     */
    private function mapWorkLocation($job)
    {
        if ($job['job_is_remote'] ?? false) {
            return 'remote';
        }

        return 'onsite';
    }

    /**
     * Format location from job data
     *
     * @param array $job
     * @return string|null
     */
    private function formatLocation($job)
    {
        $parts = array_filter([
            $job['job_city'] ?? null,
            $job['job_state'] ?? null,
            $job['job_country'] ?? null,
        ]);

        return !empty($parts) ? implode(', ', $parts) : null;
    }

    /**
     * Format salary information
     *
     * @param array $job
     * @return string|null
     */
    private function formatSalary($job)
    {
        if (isset($job['job_min_salary']) && isset($job['job_max_salary'])) {
            $currency = $job['job_salary_currency'] ?? 'USD';
            $period = $job['job_salary_period'] ?? 'YEAR';

            return sprintf(
                '%s %s - %s %s',
                $currency,
                number_format($job['job_min_salary']),
                $currency,
                number_format($job['job_max_salary'])
            );
        }

        return null;
    }

    /**
     * Map experience level
     *
     * @param array $experience
     * @return string
     */
    private function mapExperienceLevel($experience)
    {
        if (empty($experience)) {
            return 'entry';
        }

        $yearsRequired = $experience['required_experience_in_months'] ?? 0;
        $yearsRequired = $yearsRequired / 12;

        if ($yearsRequired <= 1) {
            return 'entry';
        } elseif ($yearsRequired <= 3) {
            return 'junior';
        } elseif ($yearsRequired <= 7) {
            return 'mid';
        } else {
            return 'senior';
        }
    }

    /**
     * Get job details by ID
     *
     * @param string $jobId
     * @return array|null
     */
    public function getJobDetails($jobId)
    {
        try {
            $cacheKey = 'jsearch_job_' . $jobId;

            return Cache::remember($cacheKey, 3600, function () use ($jobId) {
                $response = Http::withHeaders([
                    'X-RapidAPI-Key' => $this->apiKey,
                    'X-RapidAPI-Host' => $this->apiHost,
                ])->get($this->baseUrl . '/job-details', [
                    'job_id' => $jobId,
                ]);

                if ($response->successful()) {
                    $data = $response->json();

                    if ($data['status'] === 'OK' && isset($data['data'][0])) {
                        $transformed = $this->transformJobs([$data['data'][0]]);
                        return $transformed['jobs'][0] ?? null;
                    }
                }

                return null;
            });

        } catch (\Exception $e) {
            Log::error('JSearch job details error', [
                'error' => $e->getMessage(),
                'job_id' => $jobId,
            ]);

            return null;
        }
    }
}
