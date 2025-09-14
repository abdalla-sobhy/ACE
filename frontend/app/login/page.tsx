'use client';

import styles from './Login.module.css';
import Link from 'next/link';
import NavigationBar from '@/components/Nav/Nav';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from '@/lib/cookies';

// Types
interface StudentProfile {
  grade: string;
  birth_date: string;
}

interface TeacherProfile {
  specialization: string;
  years_of_experience: string;
  cv_path?: string;
}

interface ParentProfile {
  children_count: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  type: 'student' | 'teacher' | 'parent' | 'admin';
  profile?: StudentProfile | TeacherProfile | ParentProfile;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
  expires_at?: string;
  remember_me?: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Check for saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Validation function
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    // Email validation
    if (!email) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'البريد الإلكتروني غير صالح';
    }
    
    // Password validation
    if (!password) {
      errors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Clear field error when user types
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors(prev => ({ ...prev, email: undefined }));
    }
    if (error) setError('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: undefined }));
    }
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setFieldErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // Call your Laravel backend directly
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        // Handle different error status codes
        switch (response.status) {
          case 400:
            setError('البيانات المدخلة غير صحيحة');
            break;
          case 401:
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            break;
          case 403:
            setError('تم حظر حسابك. يرجى التواصل مع الدعم');
            break;
          case 404:
            setError('لا يوجد حساب بهذا البريد الإلكتروني');
            break;
          case 429:
            setError('محاولات تسجيل دخول كثيرة. حاول مرة أخرى بعد قليل');
            break;
          case 500:
            setError('خطأ في الخادم. يرجى المحاولة مرة أخرى');
            break;
          default:
            setError(data.message || 'حدث خطأ غير متوقع');
        }
        return;
      }

      // Success handling
      if (data.success && data.token) {
  setIsSuccess(true);
  
  localStorage.setItem('user', JSON.stringify(data.user));
  
  // Store auth data
  const authData = {
    token: data.token,
    expiresAt: data.expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    rememberMe: data.remember_me || false
  };
  localStorage.setItem('authData', JSON.stringify(authData));
  
  const maxAge = rememberMe ? 60 * 60 * 24 * 90 : 60 * 60 * 24;
  document.cookie = `authToken=${data.token}; path=/; max-age=${maxAge}; SameSite=Strict`;


  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  
  // Save email preference
  if (rememberMe) {
    localStorage.setItem('rememberedEmail', email);
  } else {
    localStorage.removeItem('rememberedEmail');
  }
  
  // Show success message briefly
  setTimeout(() => {
    // Redirect based on user type
    if (data.user?.type === 'admin') {
      router.push('/admin/dashboard');
    } else if (data.user?.type === 'teacher') {
      router.push('/teacher/dashboard');
    } else {
      router.push('/student/dashboard');
    }
  }, 1000);
}
    } catch (err) {
      // Network errors
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('خطأ في الاتصال. تحقق من اتصالك بالإنترنت');
      } else {
        setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى');
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <NavigationBar />

      {/* Animated Background */}
      <div className={styles.animatedBackground}></div>

      {/* Login Form */}
      <div className={styles.loginWrapper}>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <div className={styles.iconWrapper}>
              <svg className={styles.lockIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C9.23858 2 7 4.23858 7 7V10H6C4.89543 10 4 10.8954 4 12V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V12C20 10.8954 19.1046 10 18 10H17V7C17 4.23858 14.7614 2 12 2ZM9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7V10H9V7ZM12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16Z" fill="url(#lockGradient)"/>
                <defs>
                  <linearGradient id="lockGradient" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#58a6ff"/>
                    <stop offset="1" stopColor="#79c0ff"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1>مرحباً بعودتك</h1>
            <p>سجل دخولك للوصول إلى منصتك التعليمية</p>
          </div>

          {/* Success message */}
          {isSuccess && (
            <div className={styles.successMessage}>
              <svg className={styles.successIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#3fb950"/>
              </svg>
              تم تسجيل الدخول بنجاح! جاري التحويل...
            </div>
          )}

          <form className={styles.loginForm} onSubmit={handleSubmit}>
            {/* Global error message */}
            {error && (
              <div className={styles.errorMessage}>
                <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#f85149"/>
                </svg>
                {error}
              </div>
            )}

            {/* Email field */}
            <div className={styles.formGroup}>
              <label htmlFor="email">البريد الإلكتروني</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#8b949e"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  required
                  autoComplete="email"
                  className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.email && (
                <span className={styles.fieldError}>{fieldErrors.email}</span>
              )}
            </div>

            {/* Password field */}
            <div className={styles.formGroup}>
              <label htmlFor="password">كلمة المرور</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#8b949e"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  disabled={isLoading}
                >
                                    {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 23 12C21.27 7.61 17 4.5 12 4.5C10.6 4.5 9.26 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.81 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="#8b949e"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#8b949e"/>
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <span className={styles.fieldError}>{fieldErrors.password}</span>
              )}
            </div>

            <div className={styles.formOptions}>
              <label className={styles.rememberMe}>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>تذكرني</span>
              </label>
              <Link href="/forgot-password" className={styles.forgotPassword}>
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.415, 31.415" transform="rotate(-90 12 12)"/>
                </svg>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          <div className={styles.signupPrompt}>
            <p>
              ليس لديك حساب؟
              <Link href="/signup" className={styles.signupLink}>
                سجل الآن مجاناً
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}