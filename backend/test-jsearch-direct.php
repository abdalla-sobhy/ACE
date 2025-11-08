<?php
/**
 * Direct test of JSearch API using the exact working example format
 * Run: php test-jsearch-direct.php
 */

$apiKey = 'c788e4f9e1msh265aa0626114fdbp1f52d9jsn4fc08753a14f';
$apiHost = 'jsearch.p.rapidapi.com';

// Exact parameters from working example
$params = [
    'query' => 'developer jobs in chicago',
    'page' => 1,
    'num_pages' => 1,
    'country' => 'us',
    'date_posted' => 'all'
];

$url = 'https://jsearch.p.rapidapi.com/search?' . http_build_query($params);

echo "Testing JSearch API with exact working example format...\n";
echo "URL: $url\n\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-RapidAPI-Key: ' . $apiKey,
    'X-RapidAPI-Host: ' . $apiHost
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Status: $httpCode\n";

if ($error) {
    echo "cURL Error: $error\n";
    exit(1);
}

$data = json_decode($response, true);

if (!$data) {
    echo "Failed to parse JSON response\n";
    echo "Raw response: " . substr($response, 0, 500) . "\n";
    exit(1);
}

echo "Status: " . ($data['status'] ?? 'unknown') . "\n";
echo "Jobs found: " . (isset($data['data']) ? count($data['data']) : 0) . "\n\n";

if (isset($data['data']) && count($data['data']) > 0) {
    echo "✓ SUCCESS! Found jobs:\n\n";
    foreach (array_slice($data['data'], 0, 3) as $i => $job) {
        echo ($i + 1) . ". " . ($job['job_title'] ?? 'N/A') . "\n";
        echo "   Company: " . ($job['employer_name'] ?? 'N/A') . "\n";
        echo "   Location: " . ($job['job_city'] ?? 'N/A') . ", " . ($job['job_state'] ?? 'N/A') . "\n\n";
    }
} else {
    echo "⚠ No jobs found\n";

    if (isset($data['error'])) {
        echo "Error: " . $data['error'] . "\n";
    }

    if (isset($data['message'])) {
        echo "Message: " . $data['message'] . "\n";
    }

    echo "\nFull response:\n";
    echo json_encode($data, JSON_PRETTY_PRINT) . "\n";
}
