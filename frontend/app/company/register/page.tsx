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
    { value: "it", label: t("companyRegister.industries.it") },
    { value: "manufacturing", label: t("companyRegister.industries.manufacturing") },
    { value: "finance", label: t("companyRegister.industries.finance") },
    { value: "healthcare", label: t("companyRegister.industries.healthcare") },
    { value: "education", label: t("companyRegister.industries.education") },
    { value: "retail", label: t("companyRegister.industries.retail") },
    { value: "realestate", label: t("companyRegister.industries.realestate") },
    { value: "tourism", label: t("companyRegister.industries.tourism") },
    { value: "consulting", label: t("companyRegister.industries.consulting") },
    { value: "other", label: t("companyRegister.industries.other") },
  ];

  const companySizes = [
    { value: "1-10", label: t("companyRegister.sizes.1-10") },
    { value: "11-50", label: t("companyRegister.sizes.11-50") },
    { value: "51-200", label: t("companyRegister.sizes.51-200") },
    { value: "201-500", label: t("companyRegister.sizes.201-500") },
    { value: "500+", label: t("companyRegister.sizes.500+") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("validation.passwordMismatch"));
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
        setError(data.message || t("validation.registrationError"));
      }
    } catch {
      setError(t("validation.connectionError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <FaBuilding className={styles.headerIcon} />
          <h1>{t("companyRegister.title")}</h1>
          <p>{t("companyRegister.subtitle")}</p>
        </div>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2>{t("companyRegister.adminInfo")}</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>{t("companyRegister.firstName")}</label>
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
                <label>{t("companyRegister.lastName")}</label>
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
                <label>{t("companyRegister.password")}</label>
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
                <label>{t("companyRegister.confirmPassword")}</label>
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
            <h2>{t("companyRegister.companyInfo")}</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>{t("companyRegister.companyName")}</label>
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
                <label>{t("companyRegister.industry")}</label>
                <div className={styles.inputWrapper}>
                  <FaIndustry className={styles.inputIcon} />
                  <select
                    required
                    value={formData.industry}
                    onChange={(e) =>
                      setFormData({ ...formData, industry: e.target.value })
                    }
                  >
                    <option value="">{t("companyRegister.selectIndustry")}</option>
                    {industries.map((industry) => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t("companyRegister.companySize")}</label>
                <div className={styles.inputWrapper}>
                  <FaUsers className={styles.inputIcon} />
                  <select
                    required
                    value={formData.companySize}
                    onChange={(e) =>
                      setFormData({ ...formData, companySize: e.target.value })
                    }
                  >
                    <option value="">{t("companyRegister.selectCompanySize")}</option>
                    {companySizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t("companyRegister.location")}</label>
                <div className={styles.inputWrapper}>
                  <FaMapMarkerAlt className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    placeholder={t("companyRegister.locationPlaceholder")}
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t("companyRegister.website")}</label>
                <div className={styles.inputWrapper}>
                  <FaGlobe className={styles.inputIcon} />
                  <input
                    type="url"
                    placeholder={t("companyRegister.websitePlaceholder")}
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t("companyRegister.registrationNumber")}</label>
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
              <label>{t("companyRegister.aboutCompany")}</label>
              <textarea
                rows={4}
                placeholder={t("companyRegister.aboutPlaceholder")}
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
            {loading ? t("companyRegister.creating") : t("companyRegister.createAccount")}
          </button>

          <div className={styles.loginPrompt}>
            <p>
              {t("companyRegister.haveAccount")}{" "}
              <Link href="/login">{t("auth.signIn")}</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}