"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CompanyNav from "@/components/CompanyNav/CompanyNav";
import styles from "./CompanyProfile.module.css";
import { useLanguage } from "@/hooks/useLanguage";
import {
  FaBuilding,
  FaEdit,
  FaSave,
  FaTimes,
  FaUpload,
  FaLinkedin,
  FaGlobe,
  FaPlus,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUsers,
  FaCalendar,
  FaIndustry,
} from "react-icons/fa";

interface CompanyProfile {
  company_name: string;
  industry?: string;
  company_size?: string;
  website?: string;
  description?: string;
  logo_path?: string;
  location?: string;
  founded_year?: number;
  benefits?: string[];
  linkedin_url?: string;
  registration_number?: string;
  is_verified?: boolean;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export default function CompanyProfile() {
  const { t } = useLanguage();
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CompanyProfile>({
    company_name: "",
    benefits: [],
    is_verified: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [newBenefit, setNewBenefit] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "details">(
    "overview"
  );

  useEffect(() => {
    checkAuth();
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("authData");

    if (!userData || !authData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    const parsedAuth = JSON.parse(authData);

    if (new Date(parsedAuth.expiresAt) < new Date()) {
      localStorage.removeItem("user");
      localStorage.removeItem("authData");
      router.push("/login");
      return;
    }

    if (parsedUser.type !== "company") {
      router.push("/");
      return;
    }

    setUser(parsedUser);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/profile`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        }
      );

      if (response.ok) {
        setIsEditing(false);
        alert("تم حفظ الملف الشخصي بنجاح");
      } else {
        alert("حدث خطأ في حفظ الملف الشخصي");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("حدث خطأ في حفظ الملف الشخصي");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)) {
      alert("يرجى رفع ملف صورة (JPEG, PNG, GIF)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("حجم الملف يجب أن يكون أقل من 2 ميجابايت");
      return;
    }

    try {
      setUploadingLogo(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const formData = new FormData();
      formData.append("logo", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/upload-logo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfile({
          ...profile,
          logo_path: data.logo_path,
        });
      } else {
        alert("حدث خطأ في رفع الشعار");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("حدث خطأ في رفع الشعار");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setProfile({
        ...profile,
        benefits: [...(profile.benefits || []), newBenefit.trim()],
      });
      setNewBenefit("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    const benefits = [...(profile.benefits || [])];
    benefits.splice(index, 1);
    setProfile({ ...profile, benefits });
  };

  const getProfileCompleteness = () => {
    let completed = 0;
    const checks = [
      profile.company_name,
      profile.industry,
      profile.company_size,
      profile.website,
      profile.description,
      profile.location,
      profile.founded_year,
      profile.benefits && profile.benefits.length > 0,
      profile.linkedin_url,
      profile.logo_path,
    ];

    checks.forEach((check) => {
      if (check) completed++;
    });

    return Math.round((completed / checks.length) * 100);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <CompanyNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CompanyNav />

      <main className={styles.main}>
        {/* Profile Header */}
        <section className={styles.profileHeader}>
          <div className={styles.headerBackground} />
          <div className={styles.headerContent}>
            <div className={styles.profilePicture}>
              {profile.logo_path ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${profile.logo_path}`}
                  alt={profile.company_name}
                />
              ) : (
                <FaBuilding />
              )}
            </div>
            <div className={styles.profileInfo}>
              <h1>
                {profile.company_name || "اسم الشركة"}
                {profile.is_verified && (
                  <span className={styles.verifiedBadge}>✓ موثق</span>
                )}
              </h1>
              <p className={styles.profileTitle}>
                {profile.industry || "الصناعة"} •{" "}
                {profile.company_size || "حجم الشركة"}
              </p>
              <div className={styles.profileMeta}>
                {profile.location && (
                  <span>
                    <FaMapMarkerAlt /> {profile.location}
                  </span>
                )}
                <span>
                  <FaEnvelope /> {user?.email}
                </span>
                {user?.phone && (
                  <span>
                    <FaPhone /> {user?.phone}
                  </span>
                )}
              </div>
              <div className={styles.profileActions}>
                {!isEditing ? (
                  <button
                    className={styles.editButton}
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit /> تعديل الملف الشخصي
                  </button>
                ) : (
                  <>
                    <button
                      className={styles.saveButton}
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      <FaSave /> {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={() => setIsEditing(false)}
                    >
                      <FaTimes /> إلغاء
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className={styles.profileStats}>
              <div className={styles.statBox}>
                <h3>{getProfileCompleteness()}%</h3>
                <p>اكتمال الملف</p>
              </div>
              {profile.founded_year && (
                <div className={styles.statBox}>
                  <h3>{profile.founded_year}</h3>
                  <p>سنة التأسيس</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Profile Tabs */}
        <div className={styles.profileTabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "overview" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            نظرة عامة
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "details" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("details")}
          >
            التفاصيل
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === "overview" && (
            <div className={styles.overviewTab}>
              {/* Company Info Section */}
              <div className={styles.section}>
                <h2>معلومات الشركة</h2>
                {isEditing ? (
                  <div className={styles.companyForm}>
                    <input
                      className={styles.input}
                      placeholder="اسم الشركة"
                      value={profile.company_name || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, company_name: e.target.value })
                      }
                    />
                    <input
                      className={styles.input}
                      placeholder="الصناعة"
                      value={profile.industry || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, industry: e.target.value })
                      }
                    />
                    <select
                      className={styles.input}
                      value={profile.company_size || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, company_size: e.target.value })
                      }
                    >
                      <option value="">اختر حجم الشركة</option>
                      <option value="1-10">1-10 موظفين</option>
                      <option value="11-50">11-50 موظف</option>
                      <option value="51-200">51-200 موظف</option>
                      <option value="201-500">201-500 موظف</option>
                      <option value="501-1000">501-1000 موظف</option>
                      <option value="1000+">أكثر من 1000 موظف</option>
                    </select>
                    <input
                      className={styles.input}
                      placeholder="الموقع"
                      value={profile.location || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                    />
                    <input
                      className={styles.input}
                      type="number"
                      placeholder="سنة التأسيس"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={profile.founded_year || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          founded_year: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                ) : (
                  <div className={styles.companyInfo}>
                    <p>
                      <FaIndustry /> الصناعة:{" "}
                      {profile.industry || "لم يتم التحديد"}
                    </p>
                    <p>
                      <FaUsers /> حجم الشركة:{" "}
                      {profile.company_size || "لم يتم التحديد"}
                    </p>
                    <p>
                      <FaMapMarkerAlt /> الموقع:{" "}
                      {profile.location || "لم يتم التحديد"}
                    </p>
                    <p>
                      <FaCalendar /> سنة التأسيس:{" "}
                      {profile.founded_year || "لم يتم التحديد"}
                    </p>
                  </div>
                )}
              </div>

              {/* Description Section */}
              <div className={styles.section}>
                <h2>نبذة عن الشركة</h2>
                {isEditing ? (
                  <textarea
                    className={styles.bioInput}
                    placeholder="اكتب نبذة عن شركتك..."
                    value={profile.description || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, description: e.target.value })
                    }
                    rows={5}
                  />
                ) : (
                  <p className={styles.bio}>
                    {profile.description || "لم يتم إضافة نبذة بعد"}
                  </p>
                )}
              </div>

              {/* Logo Upload Section */}
              <div className={styles.section}>
                <h2>شعار الشركة</h2>
                <div className={styles.logoSection}>
                  {profile.logo_path ? (
                    <div className={styles.logoUploaded}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${profile.logo_path}`}
                        alt="شعار الشركة"
                        className={styles.logoPreview}
                      />
                      <div className={styles.logoInfo}>
                        <p>شعار الشركة</p>
                        {isEditing && (
                          <button
                            className={styles.replaceButton}
                            onClick={() => logoInputRef.current?.click()}
                          >
                            <FaUpload /> استبدال
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.logoUpload}>
                      <FaUpload className={styles.uploadIcon} />
                      <p>لم يتم رفع شعار بعد</p>
                      {isEditing && (
                        <button
                          className={styles.uploadButton}
                          onClick={() => logoInputRef.current?.click()}
                          disabled={uploadingLogo}
                        >
                          {uploadingLogo ? "جاري الرفع..." : "رفع الشعار"}
                        </button>
                      )}
                    </div>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    onChange={handleLogoUpload}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className={styles.section}>
                <h2>روابط التواصل</h2>
                <div className={styles.socialLinks}>
                  {isEditing ? (
                    <>
                      <div className={styles.linkInput}>
                        <FaGlobe />
                        <input
                          type="url"
                          placeholder="رابط الموقع الإلكتروني"
                          value={profile.website || ""}
                          onChange={(e) =>
                            setProfile({ ...profile, website: e.target.value })
                          }
                        />
                      </div>
                      <div className={styles.linkInput}>
                        <FaLinkedin />
                        <input
                          type="url"
                          placeholder="رابط LinkedIn"
                          value={profile.linkedin_url || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              linkedin_url: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <div className={styles.socialButtons}>
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialButton}
                        >
                          <FaGlobe /> الموقع الإلكتروني
                        </a>
                      )}
                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialButton}
                        >
                          <FaLinkedin /> LinkedIn
                        </a>
                      )}
                      {!profile.website && !profile.linkedin_url && (
                        <p>لم يتم إضافة روابط بعد</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className={styles.detailsTab}>
              {/* Benefits Section */}
              <div className={styles.section}>
                <h2>المزايا والفوائد</h2>
                {isEditing && (
                  <div className={styles.addItem}>
                    <input
                      className={styles.input}
                      placeholder="أضف ميزة..."
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddBenefit()
                      }
                    />
                    <button
                      className={styles.addButton}
                      onClick={handleAddBenefit}
                    >
                      <FaPlus />
                    </button>
                  </div>
                )}
                {profile.benefits && profile.benefits.length > 0 ? (
                  <div className={styles.benefitsList}>
                    {profile.benefits.map((benefit, index) => (
                      <div key={index} className={styles.benefitItem}>
                        <span>{benefit}</span>
                        {isEditing && (
                          <button
                            className={styles.removeButton}
                            onClick={() => handleRemoveBenefit(index)}
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>لم يتم إضافة مزايا بعد</p>
                )}
              </div>

              {/* Registration Info */}
              <div className={styles.section}>
                <h2>معلومات التسجيل</h2>
                {isEditing ? (
                  <input
                    className={styles.input}
                    placeholder="رقم التسجيل"
                    value={profile.registration_number || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        registration_number: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p>
                    رقم التسجيل:{" "}
                    {profile.registration_number || "لم يتم التحديد"}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
