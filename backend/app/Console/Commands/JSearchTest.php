<?php

namespace App\Console\Commands;

use App\Services\JSearchService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class JSearchTest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jsearch:test
                            {--clear-cache : Clear JSearch cache before testing}
                            {--search= : Search term to test with}
                            {--location= : Location to search in}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test JSearch API integration and optionally clear cache';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== JSearch API Integration Test ===');
        $this->newLine();

        // Check configuration
        $apiKey = config('services.jsearch.api_key');
        if (empty($apiKey)) {
            $this->error('❌ JSearch API key is not configured!');
            $this->info('Please set JSEARCH_API_KEY in your .env file');
            return 1;
        }

        $this->info('✓ API Key configured: ' . substr($apiKey, 0, 10) . '...');
        $this->info('✓ Default Location: ' . config('services.jsearch.default_location', 'Not set'));
        $this->info('✓ Default Country: ' . config('services.jsearch.default_country', 'Not set'));
        $this->info('✓ Default Search: ' . config('services.jsearch.default_search', 'Not set'));
        $this->newLine();

        // Clear cache if requested
        if ($this->option('clear-cache')) {
            $this->info('Clearing JSearch cache...');
            $cleared = 0;

            // Clear all cache keys starting with 'jsearch_'
            foreach (Cache::getStore()->getRedis()->keys('*jsearch_*') as $key) {
                Cache::forget(str_replace(config('cache.prefix') . ':', '', $key));
                $cleared++;
            }

            $this->info("✓ Cleared {$cleared} cached JSearch entries");
            $this->newLine();
        }

        // Test API call
        $this->info('Testing JSearch API...');

        $searchTerm = $this->option('search') ?? 'developer';
        $location = $this->option('location') ?? config('services.jsearch.default_location', 'chicago');

        $params = [
            'search' => $searchTerm,
            'location' => $location,
            'country' => config('services.jsearch.default_country', 'us'),
            'page' => 1,
        ];

        $this->info('Search parameters:');
        $this->table(['Parameter', 'Value'], [
            ['Search', $params['search']],
            ['Location', $params['location']],
            ['Country', $params['country']],
            ['Page', $params['page']],
        ]);

        try {
            $service = new JSearchService();
            $result = $service->searchJobs($params);

            $this->newLine();
            $this->info('✓ API request successful!');
            $this->info("Found {$result['total']} jobs");

            if (!empty($result['jobs'])) {
                $this->newLine();
                $this->info('Sample jobs:');

                $jobsToShow = array_slice($result['jobs'], 0, 3);
                $tableData = [];

                foreach ($jobsToShow as $job) {
                    $tableData[] = [
                        $job['title'],
                        $job['company']['name'],
                        $job['location'] ?? 'N/A',
                        $job['job_type'] ?? 'N/A',
                    ];
                }

                $this->table(['Title', 'Company', 'Location', 'Type'], $tableData);
            } else {
                $this->warn('⚠ No jobs found with these search parameters');
                $this->info('Try different search terms or location');
            }

            return 0;

        } catch (\Exception $e) {
            $this->error('❌ API request failed!');
            $this->error('Error: ' . $e->getMessage());
            $this->newLine();

            if ($this->output->isVerbose()) {
                $this->error('Trace:');
                $this->line($e->getTraceAsString());
            }

            return 1;
        }
    }
}
