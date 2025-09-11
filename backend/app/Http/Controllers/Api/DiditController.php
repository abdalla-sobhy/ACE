<?php
// app/Http/Controllers/Api/DiditController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;

class DiditController extends Controller
{
    private $apiUrl;
    private $apiKey;
    private $apiSecret;
    private $callbackUrl;

    public function __construct()
    {
        $this->apiUrl = config('services.didit.api_url', 'https://api.didit.me');
        $this->apiKey = config('services.didit.api_key');
        $this->apiSecret = config('services.didit.api_secret');
        $this->callbackUrl = config('services.didit.callback_url');
    }

    public function createSession(Request $request)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->getAuthToken(),
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '/v1/sessions', [
                'callback_url' => $this->callbackUrl,
                'vendor_data' => $request->input('vendorData'),
                'metadata' => $request->input('metadata'),
                'checks' => [
                    'document_verification' => true,
                    'face_match' => true,
                    'liveness' => true,
                    'age_verification' => true,
                    'aml' => true,
                ],
                'locale' => 'ar',
            ]);

            if ($response->successful()) {
                $data = $response->json();

                return response()->json([
                    'success' => true,
                    'sessionId' => $data['session_id'],
                    'sessionNumber' => $data['session_number'],
                    'verificationUrl' => $data['verification_url'],
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => 'Failed to create verification session',
                'details' => $response->json()
            ], 400);

        } catch (\Exception $e) {
            Log::error('Didit session creation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'خطأ في إنشاء جلسة التحقق'
            ], 500);
        }
    }

    public function getSessionStatus($sessionId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->getAuthToken(),
            ])->get($this->apiUrl . '/v1/sessions/' . $sessionId);

            if ($response->successful()) {
                $data = $response->json();

                return response()->json([
                    'success' => true,
                    'sessionId' => $sessionId,
                    'status' => $data['status'],
                    'decision' => $data['decision'] ?? null,
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => 'Session not found'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Didit status check error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'خطأ في التحقق من الحالة'
            ], 500);
        }
    }

    private function getAuthToken()
    {
        // Implement token generation based on Didit's authentication requirements
        return base64_encode($this->apiKey . ':' . $this->apiSecret);
    }

    public function webhook(Request $request)
    {
        // Verify webhook signature
        if (!$this->verifyWebhookSignature($request)) {
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        $data = $request->all();

        // Process webhook data
        if ($data['event'] === 'session.completed') {
            // Update user verification status
            // You can implement the logic here
        }

        return response()->json(['success' => true]);
    }

    private function verifyWebhookSignature(Request $request)
    {
        // Implement webhook signature verification
        // This depends on how Didit sends the signature
        return true; // Placeholder
    }
}
