<?php
/**
 * Debug script to see exactly what JSearch parameters are being built
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\JSearchService;
use Illuminate\Support\Facades\Log;

echo "=== JSearch Debug Test ===\n\n";

// Enable all logging
config(['logging.default' => 'stack']);

$service = new JSearchService();

$params = [
    'search' => 'developer',
    'location' => 'chicago',
    'page' => 1,
];

echo "Input parameters:\n";
print_r($params);
echo "\n";

echo "Config values:\n";
echo "- API Key: " . substr(config('services.jsearch.api_key'), 0, 10) . "...\n";
echo "- Default Country: " . config('services.jsearch.default_country') . "\n";
echo "- Default Location: " . config('services.jsearch.default_location') . "\n";
echo "- Default Search: " . config('services.jsearch.default_search') . "\n";
echo "\n";

// Use reflection to call private buildQuery method
$reflection = new ReflectionClass($service);
$method = $reflection->getMethod('buildQuery');
$method->setAccessible(true);
$query = $method->invoke($service, $params);

echo "Built query string: '$query'\n\n";

echo "Expected API URL parameters:\n";
$queryParams = [
    'query' => $query,
    'page' => $params['page'] ?? 1,
    'num_pages' => 1,
    'date_posted' => $params['date_posted'] ?? 'all',
    'country' => $params['country'] ?? config('services.jsearch.default_country', 'us'),
];
print_r($queryParams);
echo "\n";

echo "Full URL would be:\n";
echo "https://jsearch.p.rapidapi.com/search?" . http_build_query($queryParams) . "\n\n";

echo "Now calling actual API...\n";
$result = $service->searchJobs($params);

echo "\nResult:\n";
echo "- Jobs found: " . count($result['jobs']) . "\n";
echo "- Total: " . $result['total'] . "\n";

if (!empty($result['jobs'])) {
    echo "\nFirst job:\n";
    print_r($result['jobs'][0]);
}

echo "\nCheck storage/logs/laravel.log for detailed API request/response logs\n";
