<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>رمز التحقق</title>
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
        .content {
            padding: 20px 0;
            text-align: center;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #333;
            letter-spacing: 10px;
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
            display: inline-block;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Edvance</h1>
            <h2>رمز التحقق من البريد الإلكتروني</h2>
        </div>
        <div class="content">
            <p>مرحباً!</p>
            <p>لقد تلقينا طلباً للتحقق من بريدك الإلكتروني الخاص بـ {{ $institution_name }}</p>
            <p>رمز التحقق الخاص بك هو:</p>
            <div class="otp-code">{{ $otp }}</div>
            <p>هذا الرمز صالح لمدة 10 دقائق فقط.</p>
            <p>إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Edvance. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>
