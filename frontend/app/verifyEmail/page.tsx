'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './verifyEmail.module.css';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [message, setMessage] = useState('');
  
  const email = searchParams?.get('email') || '';
  const institutionName = searchParams?.get('institution') || '';
  const userType = searchParams?.get('userType') || '';
  
  const formData = searchParams?.get('formData') || '';
  
  useEffect(() => {
    if (!email || !searchParams) {
      router.push('/signup');
    }
  }, [email, router, searchParams]);
  
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);
  
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return; // Only digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pasteData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
  };
  
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('يجب إدخال رمز التحقق كاملاً');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpString,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        sessionStorage.setItem('emailVerified', 'true');
        sessionStorage.setItem('verifiedEmail', email);
        sessionStorage.setItem('institutionName', institutionName);
        
        // Redirect back to signup with verified flag
        const params = new URLSearchParams({
          step: '2',
          verified: 'true',
          email: email,
          institution: institutionName,
          userType: userType
        });
        
        if (formData) {
          params.append('formData', formData);
        }
        
        router.push(`/signup?${params.toString()}`);
      } else {
        setError(data.message || 'رمز التحقق غير صحيح');
      }
    } catch {
      setError('حدث خطأ في التحقق. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          institution_name: institutionName,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني');
        setResendTimer(60);
        setOtp(['', '', '', '', '', '']);
      } else {
        setError(data.message || 'حدث خطأ في إرسال رمز التحقق');
      }
    } catch {
      setError('حدث خطأ في إرسال رمز التحقق');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            EduEgypt
          </Link>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <div className={styles.verifyCard}>
          <div className={styles.iconWrapper}>
            <span className={styles.emailIcon}>✉️</span>
          </div>
          
          <h1 className={styles.title}>التحقق من البريد الإلكتروني</h1>
          <p className={styles.subtitle}>
            تم إرسال رمز التحقق إلى
          </p>
          <p className={styles.email}>{email}</p>
          {institutionName && (
            <p className={styles.institution}>{institutionName}</p>
          )}
          
          <div className={styles.otpSection}>
            <label className={styles.otpLabel}>
              أدخل رمز التحقق المكون من 6 أرقام
            </label>
            
            <div className={styles.otpInputs} dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={styles.otpInput}
                  disabled={loading}
                />
              ))}
            </div>
          </div>
          
          {error && (
            <div className={styles.errorMessage}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}
          
          {message && (
            <div className={styles.successMessage}>
              <span className={styles.successIcon}>✓</span>
              {message}
            </div>
          )}
          
          <button
            onClick={handleVerifyOtp}
            disabled={loading || otp.some(d => !d)}
            className={styles.verifyButton}
          >
            {loading ? (
              <span className={styles.loadingSpinner}></span>
            ) : (
              'تحقق من الرمز'
            )}
          </button>
          
          <div className={styles.resendSection}>
            <p className={styles.resendText}>
              لم تستلم الرمز؟{' '}
              {resendTimer > 0 ? (
                <span className={styles.timer}>
                  يمكنك إعادة الإرسال بعد {resendTimer} ثانية
                </span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className={styles.resendButton}
                >
                  إعادة إرسال الرمز
                </button>
              )}
            </p>
          </div>
          
          <Link href="/signup" className={styles.backLink}>
            العودة للتسجيل
          </Link>
        </div>
      </div>
    </div>
  );
}