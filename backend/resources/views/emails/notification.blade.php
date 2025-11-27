<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }
        .header h1 {
            color: #4F46E5;
            margin: 0;
            font-size: 28px;
        }
        .header h2 {
            color: #333;
            margin: 10px 0 0 0;
            font-size: 20px;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            color: #333;
            line-height: 1.6;
            margin: 15px 0;
        }
        .greeting {
            font-size: 18px;
            font-weight: bold;
            color: #4F46E5;
        }
        .message-box {
            background-color: #f9f9f9;
            border-left: 4px solid #4F46E5;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4F46E5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #4338CA;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
        }
        .divider {
            border-top: 1px solid #eee;
            margin: 30px 0;
        }
        /* English section */
        .english-section {
            direction: ltr;
            text-align: left;
            margin-top: 30px;
        }
        .english-section .message-box {
            border-left: none;
            border-right: 4px solid #4F46E5;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Arabic Section -->
        <div class="header">
            <h1>Edvance</h1>
            <h2>{{ $title }}</h2>
        </div>
        <div class="content">
            <p class="greeting">{{ $greeting }}</p>
            <div class="message-box">
                <p style="margin: 0;">{{ $messageContent }}</p>
            </div>
            @if(isset($additionalInfo) && !empty($additionalInfo))
                @foreach($additionalInfo as $info)
                    <p>{{ $info }}</p>
                @endforeach
            @endif
            @if(isset($actionUrl) && isset($actionText))
                <div style="text-align: center;">
                    <a href="{{ $actionUrl }}" class="button">{{ $actionText }}</a>
                </div>
            @endif
            @if(isset($footer))
                <p>{{ $footer }}</p>
            @endif
        </div>

        <!-- English Section -->
        @if(isset($titleEn) && isset($greetingEn) && isset($messageEn))
        <div class="divider"></div>
        <div class="english-section">
            <div class="header">
                <h2>{{ $titleEn }}</h2>
            </div>
            <div class="content">
                <p class="greeting">{{ $greetingEn }}</p>
                <div class="message-box">
                    <p style="margin: 0;">{{ $messageContentEn }}</p>
                </div>
                @if(isset($additionalInfoEn) && !empty($additionalInfoEn))
                    @foreach($additionalInfoEn as $info)
                        <p>{{ $info }}</p>
                    @endforeach
                @endif
                @if(isset($actionUrl) && isset($actionTextEn))
                    <div style="text-align: center;">
                        <a href="{{ $actionUrl }}" class="button">{{ $actionTextEn }}</a>
                    </div>
                @endif
                @if(isset($footerEn))
                    <p>{{ $footerEn }}</p>
                @endif
            </div>
        </div>
        @endif

        <div class="footer">
            <p>&copy; 2025 Edvance. جميع الحقوق محفوظة | All rights reserved</p>
        </div>
    </div>
</body>
</html>
