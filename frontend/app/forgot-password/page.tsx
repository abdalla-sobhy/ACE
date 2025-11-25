"use client";

import styles from "../login/Login.module.css";
import Link from "next/link";
import NavigationBar from "@/components/Nav/Nav";
import { useState, FormEvent } from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface ValidationErrors {
  email?: string;
}

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!email) {
      errors.email = t("auth.requiredField");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t("auth.invalidEmail");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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
        }/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 404:
            setError(t("auth.emailNotFound") || "البريد الإلكتروني غير موجود");
            break;
          case 422:
            setError(t("auth.invalidEmail"));
            break;
          case 500:
            setError(t("auth.emailSendFailed"));
            break;
          default:
            setError(data.message || t("errors.genericError"));
        }
        return;
      }

      if (data.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(t("errors.networkError"));
      } else {
        setError(t("errors.genericError"));
      }
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <NavigationBar />

      <div className={styles.animatedBackground}></div>

      {/* Forgot Password Form */}
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
                  d="M12 17C10.89 17 10 16.1 10 15C10 13.89 10.89 13 12 13C13.11 13 14 13.89 14 15C14 16.1 13.11 17 12 17ZM18 20V10H6V20H18ZM18 8C19.11 8 20 8.89 20 10V20C20 21.11 19.11 22 18 22H6C4.89 22 4 21.11 4 20V10C4 8.89 4.89 8 6 8H7V6C7 3.24 9.24 1 12 1C14.76 1 17 3.24 17 6V8H18ZM12 3C10.34 3 9 4.34 9 6V8H15V6C15 4.34 13.66 3 12 3Z"
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
            <h1>{t("auth.forgotPassword") || "نسيت كلمة المرور"}</h1>
            <p>
              {t("auth.forgotPasswordDescription") ||
                "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور"}
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
              {t("auth.resetEmailSent") ||
                "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"}
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
              <label htmlFor="email">{t("auth.emailPlaceholder")}</label>
              <div className={styles.inputWrapper}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                    fill="#8b949e"
                  />
                </svg>
                <input
                  type="email"
                  id="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  required
                  autoComplete="email"
                  className={`${styles.input} ${
                    fieldErrors.email ? styles.inputError : ""
                  }`}
                  disabled={isLoading || isSuccess}
                />
              </div>
              {fieldErrors.email && (
                <span className={styles.fieldError}>{fieldErrors.email}</span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || isSuccess}
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
              ) : (t("auth.sendResetLink"))}
            </button>
          </form>

          <div className={styles.signupPrompt}>
            <p>
              {t("auth.rememberPassword")}
              <Link href="/login" className={styles.signupLink}>
                {t("auth.loginButton")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
