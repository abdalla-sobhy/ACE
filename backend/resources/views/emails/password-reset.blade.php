<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إعادة تعيين كلمة المرور</title>
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
        .reset-button {
            display: inline-block;
            padding: 15px 30px;
            margin: 20px 0;
            background-color: #007bff;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
        }
        .reset-button:hover {
            background-color: #0056b3;
        }
        .token-box {
            font-size: 14px;
            color: #666;
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
            word-break: break-all;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
        }
        .warning {
            color: #d9534f;
            font-size: 14px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Edvance</h1>
            <h2>إعادة تعيين كلمة المرور</h2>
        </div>
        <div class="content">
            <p>مرحباً {{ $name }}!</p>
            <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك.</p>
            <p>لإعادة تعيين كلمة المرور، انقر على الزر أدناه:</p>
            <a href="{{ config('app.frontend_url') }}/reset-password?token={{ $token }}&email={{ $email }}" class="reset-button">
                إعادة تعيين كلمة المرور
            </a>
            <p>أو يمكنك نسخ الرابط التالي ولصقه في المتصفح:</p>
            <div class="token-box">
                {{ config('app.frontend_url') }}/reset-password?token={{ $token }}&email={{ $email }}
            </div>
            <p class="warning">هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
            <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة. حسابك آمن.</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 Edvance. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>
