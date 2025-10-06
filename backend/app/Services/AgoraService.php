<?php

namespace App\Services;

class AgoraService
{
    private $appId;
    private $appCertificate;

    public function __construct()
    {
        $this->appId = config('services.agora.app_id');
        $this->appCertificate = config('services.agora.app_certificate');
    }

    public function generateToken($channelName, $uid, $role = 'audience')
    {
        // For testing without certificate
        if (!$this->appCertificate) {
            return '';
        }

        // Simple token for development
        // In production, use Agora's official SDK
        $token = base64_encode(json_encode([
            'channel' => $channelName,
            'uid' => $uid,
            'role' => $role,
            'expire' => time() + 3600
        ]));

        return $token;
    }
}
