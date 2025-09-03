<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class DiditService
{
    private $client;
    private $apiKey;
    private $baseUrl;

    public function __construct()
    {
        $this->client = new Client();
        $this->apiKey = config('services.didit.api_key');
        $this->baseUrl = config('services.didit.base_url', 'https://api.didit.id');
    }

    public function verifySession($sessionId)
{
    try {
        $response = $this->client->get("{$this->baseUrl}/sessions/{$sessionId}", [
            'headers' => [
                'Authorization' => "Bearer {$this->apiKey}",
            ]
        ]);

        $data = json_decode($response->getBody(), true);

        return [
            'success' => $data['status'] === 'completed' && $data['result'] === 'verified',
            'data' => $data
        ];
    } catch (GuzzleException $e) {
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}
}
