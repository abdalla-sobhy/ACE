<?php

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\Http;

// Load environment variables if .env exists
if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    $apiKey = $_ENV['JSEARCH_API_KEY'] ?? null;
} else {
    // Read from command line argument
    $apiKey = $argv[1] ?? null;
}

echo "Testing JSearch API Integration\n";
echo "================================\n\n";

if (empty($apiKey)) {
    echo "❌ ERROR: JSEARCH_API_KEY not provided\n";
    echo "Usage: php test_jsearch.php YOUR_API_KEY\n";
    exit(1);
}

echo "✓ API Key found: " . substr($apiKey, 0, 10) . "...\n\n";

echo "Making API request...\n";

try {
    $client = new \GuzzleHttp\Client();
    $response = $client->get('https://jsearch.p.rapidapi.com/search', [
        'headers' => [
            'X-RapidAPI-Key' => $apiKey,
            'X-RapidAPI-Host' => 'jsearch.p.rapidapi.com',
        ],
        'query' => [
            'query' => 'developer in Egypt',
            'page' => 1,
            'num_pages' => 1,
        ]
    ]);

    echo "Response Status: " . $response->getStatusCode() . "\n";

    $body = $response->getBody()->getContents();
    $data = json_decode($body, true);

    echo "\nResponse Data:\n";
    echo "  Status: " . ($data['status'] ?? 'N/A') . "\n";
    echo "  Jobs Count: " . (isset($data['data']) ? count($data['data']) : 0) . "\n";

    if (isset($data['data']) && count($data['data']) > 0) {
        echo "\n✓ SUCCESS: Found " . count($data['data']) . " jobs\n";
        echo "\nSample Job:\n";
        $job = $data['data'][0];
        echo "  Title: " . ($job['job_title'] ?? 'N/A') . "\n";
        echo "  Company: " . ($job['employer_name'] ?? 'N/A') . "\n";
        echo "  Location: " . ($job['job_city'] ?? 'N/A') . "\n";
    } else {
        echo "\n⚠ WARNING: API returned no jobs\n";
        echo "Full response: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";
    }

} catch (\Exception $e) {
    echo "\n❌ EXCEPTION: " . $e->getMessage() . "\n";
}
