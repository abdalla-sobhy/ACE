"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./CompanyRegister.module.css";
import { FaBuilding, FaEnvelope, FaLock, FaPhone, FaUser, FaGlobe, FaIndustry, FaUsers, FaMapMarkerAlt } from "react-icons/fa";

import { useLanguage } from "@/hooks/useLanguage";
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  website: string;
  registrationNumber: string;
  description: string;
}

export default function CompanyRegister() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+20",
    password: "",
    confirmPassword: "",
    companyName: "",
    industry: "",
    companySize: "",
    location: "",
    website: "",
    registrationNumber: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const industries = [
    "تكنولوجيا المعلومات",
    "التصنيع",
    "الخدمات المالية",
    "الرعاية الصحية",
    "التعليم",
    "البيع بالتجزئة",
    "العقارات",
    "السياحة والضيافة",
    "الاستشارات",
    "أخرى",
  ];

  const companySizes = [
    { value: "1-10", label: "1-10 موظفين" },
    { value: "11-50", label: "11-50 موظف" },
    { value: "51-200", label: "51-200 موظف" },
    { value: "201-500", label: "201-500 موظف" },
    { value: "500+", label: "أكثر من 500 موظف" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            company_name: formData.companyName,
            industry: formData.industry,
            company_size: formData.companySize,
            location: formData.location,
            website: formData.website,
            registration_number: formData.registrationNumber,
            description: formData.description,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        router.push("/company/register-success");
      } else {
        setError(data.message || "حدث خطأ في التسجيل");
      }
    } catch {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <FaBuilding className={styles.headerIcon} />
          <h1>تسجيل شركة جديدة</h1>
          <p>انضم إلى منصتنا للوصول إلى أفضل المواهب الجامعية</p>
        </div>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2>معلومات المسؤول</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>الاسم الأول</label>
                <div className={styles.inputWrapper}>
                  <FaUser className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>                       setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>الاسم الأخير</label>
                <div className={styles.inputWrapper}>
                  <FaUser className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t("common.email")}</label>
                <div className={styles.inputWrapper}>
                  <FaEnvelope className={styles.inputIcon} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t("common.phone")}</label>
                <div className={styles.inputWrapper}>
                  <FaPhone className={styles.inputIcon} />
                  <input
                    type="tel"
                    required
                    pattern="^\+20[0-9]{10}$"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>كلمة المرور</label>
                <div className={styles.inputWrapper}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>تأكيد كلمة المرور</label>
                <div className={styles.inputWrapper}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>معلومات الشركة</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>اسم الشركة</label>
                <div className={styles.inputWrapper}>
                  <FaBuilding className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>المجال</label>
                <div className={styles.inputWrapper}>
                  <FaIndustry className={styles.inputIcon} />
                  <select
                    required
                    value={formData.industry}
                    onChange={(e) =>
                      setFormData({ ...formData, industry: e.target.value })
                    }
                  >
                    <option value="">اختر المجال</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>حجم الشركة</label>
                <div className={styles.inputWrapper}>
                  <FaUsers className={styles.inputIcon} />
                  <select
                    required
                    value={formData.companySize}
                    onChange={(e) =>
                      setFormData({ ...formData, companySize: e.target.value })
                    }
                  >
                    <option value="">اختر حجم الشركة</option>
                    {companySizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>الموقع</label>
                <div className={styles.inputWrapper}>
                  <FaMapMarkerAlt className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    placeholder="القاهرة، مصر"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>الموقع الإلكتروني</label>
                <div className={styles.inputWrapper}>
                  <FaGlobe className={styles.inputIcon} />
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>رقم السجل التجاري (اختياري)</label>
                <div className={styles.inputWrapper}>
                  <FaBuilding className={styles.inputIcon} />
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, registrationNumber: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>نبذة عن الشركة</label>
              <textarea
                rows={4}
                placeholder="اكتب نبذة مختصرة عن الشركة..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "جاري التسجيل..." : "إنشاء حساب الشركة"}
          </button>

          <div className={styles.loginPrompt}>
            <p>
              لديك حساب بالفعل؟{" "}
              <Link href="/login">تسجيل الدخول</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}