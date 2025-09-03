<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>تأكيد البريد الإلكتروني</title>
</head>
<body style="font-family: Arial, sans-serif; direction: rtl;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">مرحباً {{ $userName }}!</h1>
        <p>شكراً لتسجيلك في منصة EduEgypt التعليمية.</p>
        <p>لتفعيل حسابك، يرجى النقر على الرابط أدناه:</p>
        <a href="{{ $verificationUrl }}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">تأكيد البريد الإلكتروني</a>
        <p>إذا لم تقم بإنشاء حساب، يرجى تجاهل هذا البريد.</p>
        <p>مع تحيات فريق EduEgypt</p>
    </div>
</body>
</html>
