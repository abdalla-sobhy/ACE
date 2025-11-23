<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'didit' => [
    'api_url' => env('DIDIT_API_URL', 'https://api.didit.me'),
    'api_key' => env('DIDIT_API_KEY'),
    'api_secret' => env('DIDIT_API_SECRET'),
    'callback_url' => env('DIDIT_CALLBACK_URL', env('APP_URL') . '/signup?verification=complete'),
    ],

'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook' => [
            'secret' => env('STRIPE_WEBHOOK_SECRET'),
            'tolerance' => env('STRIPE_WEBHOOK_TOLERANCE', 300),
        ],
    ],

    'paypal' => [
        'mode' => env('PAYPAL_MODE', 'sandbox'),
        'sandbox' => [
            'client_id' => env('PAYPAL_SANDBOX_CLIENT_ID'),
            'secret' => env('PAYPAL_SANDBOX_SECRET'),
        ],
        'live' => [
            'client_id' => env('PAYPAL_LIVE_CLIENT_ID'),
            'secret' => env('PAYPAL_LIVE_SECRET'),
        ],
    ],

    'agora' => [
        'app_id' => env('AGORA_APP_ID'),
        'app_certificate' => env('AGORA_APP_CERTIFICATE'),
    ],

    'jsearch' => [
        'api_key' => env('JSEARCH_API_KEY'),
        'default_location' => env('JSEARCH_DEFAULT_LOCATION', 'chicago'),
        'default_country' => env('JSEARCH_DEFAULT_COUNTRY', 'us'),
        'default_search' => env('JSEARCH_DEFAULT_SEARCH', 'developer'),
    ],

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-1.5-flash-latest'),
        'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta/models'),
    ],

];
