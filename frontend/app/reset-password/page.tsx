"use client";

import styles from "../login/Login.module.css";
import Link from "next/link";
import NavigationBar from "@/components/Nav/Nav";
import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

interface ValidationErrors {
  password?: string;
  passwordConfirmation?: string;
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) {
      setError(
        t("auth.invalidResetLink") || "رابط إعادة التعيين غير صحيح أو منتهي الصلاحية"
      );
      return;
    }

    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (!tokenParam || !emailParam) {
      setError(
        t("auth.invalidResetLink") || "رابط إعادة التعيين غير صحيح أو منتهي الصلاحية"
      );
    } else {
      setToken(tokenParam);
      setEmail(emailParam);
    }
  }, [searchParams, t]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!password) {
      errors.password = t("auth.requiredField");
    } else if (password.length < 8) {
      errors.password = t("auth.passwordTooShort");
    } else if (!/[A-Z]/.test(password)) {
      errors.password =
        t("auth.passwordNeedsUppercase") || "يجب أن تحتوي كلمة المرور على حرف كبير";
    } else if (!/[0-9]/.test(password)) {
      errors.password =
        t("auth.passwordNeedsNumber") || "يجب أن تحتوي كلمة المرور على رقم";
    }

    if (!passwordConfirmation) {
      errors.passwordConfirmation = t("auth.requiredField");
    } else if (password !== passwordConfirmation) {
      errors.passwordConfirmation =
        t("auth.passwordsDoNotMatch") || "كلمات المرور غير متطابقة";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
    if (error) setError("");
  };

  const handlePasswordConfirmationChange = (value: string) => {
    setPasswordConfirmation(value);
    if (fieldErrors.passwordConfirmation) {
      setFieldErrors((prev) => ({ ...prev, passwordConfirmation: undefined }));
    }
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      setError(
        t("auth.invalidResetLink") || "رابط إعادة التعيين غير صحيح أو منتهي الصلاحية"
      );
      return;
    }

    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
        }/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            token,
            password,
            password_confirmation: passwordConfirmation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            setError(
              t("auth.resetLinkExpired") ||
                "رابط إعادة التعيين منتهي الصلاحية. يرجى طلب رابط جديد."
            );
            break;
          case 404:
            setError(t("auth.emailNotFound") || "المستخدم غير موجود");
            break;
          case 422:
            setError(t("auth.invalidInput") || "البيانات غير صحيحة");
            break;
          default:
            setError(data.message || t("errors.genericError"));
        }
        return;
      }

      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(t("errors.networkError"));
      } else {
        setError(t("errors.genericError"));
      }
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <NavigationBar />

      <div className={styles.animatedBackground}></div>

      {/* Reset Password Form */}
      <div className={styles.loginWrapper}>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <div className={styles.iconWrapper}>
              <svg
                className={styles.lockIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6H9C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17Z"
                  fill="url(#lockGradient)"
                />
                <defs>
                  <linearGradient
                    id="lockGradient"
                    x1="4"
                    y1="1"
                    x2="20"
                    y2="22"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#58a6ff" />
                    <stop offset="1" stopColor="#79c0ff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1>{t("auth.resetPassword") || "إعادة تعيين كلمة المرور"}</h1>
            <p>
              {t("auth.resetPasswordDescription") ||
                "أدخل كلمة المرور الجديدة الخاصة بك"}
            </p>
          </div>

          {isSuccess && (
            <div className={styles.successMessage}>
              <svg
                className={styles.successIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                  fill="#3fb950"
                />
              </svg>
              {t("auth.passwordResetSuccess") ||
                "تم إعادة تعيين كلمة المرور بنجاح! جاري التوجيه إلى صفحة تسجيل الدخول..."}
            </div>
          )}

          <form className={styles.loginForm} onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorMessage}>
                <svg
                  className={styles.errorIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                    fill="#f85149"
                  />
                </svg>
                {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="password">
                {t("auth.newPassword") || "كلمة المرور الجديدة"}
              </label>
              <div className={styles.inputWrapper}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"
                    fill="#8b949e"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder={t("auth.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={`${styles.input} ${
                    fieldErrors.password ? styles.inputError : ""
                  }`}
                  disabled={isLoading || isSuccess || !token || !email}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading || isSuccess}
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 23 12C21.27 7.61 17 4.5 12 4.5C10.6 4.5 9.26 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.81 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z"
                        fill="#8b949e"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                        fill="#8b949e"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <span className={styles.fieldError}>{fieldErrors.password}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="passwordConfirmation">
                {t("auth.confirmPassword") || "تأكيد كلمة المرور"}
              </label>
              <div className={styles.inputWrapper}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"
                    fill="#8b949e"
                  />
                </svg>
                <input
                  type={showPasswordConfirmation ? "text" : "password"}
                  id="passwordConfirmation"
                  placeholder={t("auth.confirmPassword")}
                  value={passwordConfirmation}
                  onChange={(e) =>
                    handlePasswordConfirmationChange(e.target.value)
                  }
                  required
                  autoComplete="new-password"
                  className={`${styles.input} ${
                    fieldErrors.passwordConfirmation ? styles.inputError : ""
                  }`}
                  disabled={isLoading || isSuccess || !token || !email}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() =>
                    setShowPasswordConfirmation(!showPasswordConfirmation)
                  }
                  aria-label={
                    showPasswordConfirmation ? "Hide password" : "Show password"
                  }
                  disabled={isLoading || isSuccess}
                >
                  {showPasswordConfirmation ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 23 12C21.27 7.61 17 4.5 12 4.5C10.6 4.5 9.26 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.81 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z"
                        fill="#8b949e"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                        fill="#8b949e"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.passwordConfirmation && (
                <span className={styles.fieldError}>
                  {fieldErrors.passwordConfirmation}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || isSuccess || !token || !email}
            >
              {isLoading ? (
                <svg
                  className={styles.spinner}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="31.415, 31.415"
                    transform="rotate(-90 12 12)"
                  />
                </svg>
              ) : (
                t("auth.resetPassword") || "إعادة تعيين كلمة المرور"
              )}
            </button>
          </form>

          <div className={styles.signupPrompt}>
            <p>
              {t("auth.rememberPassword") || "تذكرت كلمة المرور؟"}
              <Link href="/login" className={styles.signupLink}>
                {t("auth.loginButton") || "تسجيل الدخول"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
