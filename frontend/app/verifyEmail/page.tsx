"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./verifyEmail.module.css";
import { useLanguage } from "@/hooks/useLanguage";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const { t } = useLanguage();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [message, setMessage] = useState("");

  const email = (searchParams.email as string) || "";
  const institutionName = (searchParams.institution as string) || "";
  const userType = (searchParams.userType as string) || "";
  const formData = (searchParams.formData as string) || "";

  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pasteData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError(t("auth.requiredField"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otpString,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("emailVerified", "true");
        sessionStorage.setItem("verifiedEmail", email);
        sessionStorage.setItem("institutionName", institutionName);

        const params = new URLSearchParams({
          step: "2",
          verified: "true",
          email: email,
          institution: institutionName,
          userType: userType,
        });

        if (formData) {
          params.append("formData", formData);
        }

        router.push(`/signup?${params.toString()}`);
      } else {
        setError(data.message || t("auth.invalidCode"));
      }
    } catch {
      setError(t("errors.tryAgain"));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            institution_name: institutionName,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage(t("auth.emailVerified"));
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
      } else {
        setError(data.message || t("errors.tryAgain"));
      }
    } catch {
      setError(t("errors.tryAgain"));
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
            Edvance
          </Link>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <div className={styles.verifyCard}>
          <div className={styles.iconWrapper}>
            <span className={styles.emailIcon}>✉️</span>
          </div>

          <h1 className={styles.title}>{t("auth.verifyEmailTitle")}</h1>
          <p className={styles.subtitle}>{t("auth.verifyEmailDescription")}</p>
          <p className={styles.email}>{email}</p>
          {institutionName && (
            <p className={styles.institution}>{institutionName}</p>
          )}

          <div className={styles.otpSection}>
            <label className={styles.otpLabel}>
              {t("auth.verificationCode")}
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
            disabled={loading || otp.some((d) => !d)}
            className={styles.verifyButton}
          >
            {loading ? (
              <span className={styles.loadingSpinner}></span>
            ) : (
              t("auth.verifyButton")
            )}
          </button>

          <div className={styles.resendSection}>
            <p className={styles.resendText}>
              {t("auth.resendCode")}?{" "}
              {resendTimer > 0 ? (
                <span className={styles.timer}>
                  {resendTimer}s
                </span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className={styles.resendButton}
                >
                  {t("auth.resendCode")}
                </button>
              )}
            </p>
          </div>

          <Link href="/signup" className={styles.backLink}>
            {t("common.back")}
          </Link>
        </div>
      </div>
    </div>
  );
}
