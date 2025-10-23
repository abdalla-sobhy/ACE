"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import TeacherNav from "@/components/TeacherNav/TeacherNav";
import styles from "./TeacherProfile.module.css";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaUpload,
  FaFilePdf,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaBriefcase,
} from "react-icons/fa";

interface TeacherProfile {
  specialization: string;
  years_of_experience?: number;
  cv_path?: string;
  didit_data?: Record<string, unknown>;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export default function TeacherProfile() {
  const router = useRouter();
  const cvInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<TeacherProfile>({
    specialization: "",
    years_of_experience: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);

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

    if (parsedUser.type !== "teacher") {
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/profile`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/profile`,
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

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      alert("يرجى رفع ملف PDF أو Word");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الملف يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    try {
      setUploadingCV(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const formData = new FormData();
      formData.append("cv", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/upload-cv`,
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
          cv_path: data.cv_path,
        });
      } else {
        alert("حدث خطأ في رفع السيرة الذاتية");
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("حدث خطأ في رفع السيرة الذاتية");
    } finally {
      setUploadingCV(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <TeacherNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TeacherNav />

      <main className={styles.main}>
        {/* Profile Header */}
        <section className={styles.profileHeader}>
          <div className={styles.headerBackground} />
          <div className={styles.headerContent}>
            <div className={styles.profilePicture}>
              <FaUser />
            </div>
            <div className={styles.profileInfo}>
              <h1>
                {user?.first_name} {user?.last_name}
              </h1>
              <p className={styles.profileTitle}>
                {profile.specialization || "مدرس"} •{" "}
                {profile.years_of_experience
                  ? `${profile.years_of_experience} سنوات خبرة`
                  : "مدرس"}
              </p>
              <div className={styles.profileMeta}>
                <span>
                  <FaMapMarkerAlt /> مصر
                </span>
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
            {profile.years_of_experience && profile.years_of_experience > 0 && (
              <div className={styles.profileStats}>
                <div className={styles.statBox}>
                  <h3>{profile.years_of_experience}</h3>
                  <p>سنوات الخبرة</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Profile Content */}
        <div className={styles.profileContent}>
          {/* Specialization Section */}
          <div className={styles.section}>
            <h2>
              <FaGraduationCap /> التخصص
            </h2>
            {isEditing ? (
              <input
                className={styles.input}
                placeholder="التخصص (مثال: رياضيات، علوم، لغة عربية...)"
                value={profile.specialization || ""}
                onChange={(e) =>
                  setProfile({ ...profile, specialization: e.target.value })
                }
              />
            ) : (
              <p>{profile.specialization || "لم يتم تحديد التخصص"}</p>
            )}
          </div>

          {/* Experience Section */}
          <div className={styles.section}>
            <h2>
              <FaBriefcase /> سنوات الخبرة
            </h2>
            {isEditing ? (
              <input
                className={styles.input}
                type="number"
                placeholder="عدد سنوات الخبرة"
                min="0"
                value={profile.years_of_experience || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    years_of_experience: parseInt(e.target.value) || 0,
                  })
                }
              />
            ) : (
              <p>
                {profile.years_of_experience
                  ? `${profile.years_of_experience} سنوات`
                  : "لم يتم التحديد"}
              </p>
            )}
          </div>

          {/* CV Upload Section */}
          <div className={styles.section}>
            <h2>السيرة الذاتية</h2>
            <div className={styles.cvSection}>
              {profile.cv_path ? (
                <div className={styles.cvUploaded}>
                  <FaFilePdf className={styles.cvIcon} />
                  <div className={styles.cvInfo}>
                    <p>السيرة الذاتية</p>
                    <div className={styles.cvActions}>
                      {isEditing && (
                        <button
                          className={styles.replaceButton}
                          onClick={() => cvInputRef.current?.click()}
                        >
                          <FaUpload /> استبدال
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.cvUpload}>
                  <FaUpload className={styles.uploadIcon} />
                  <p>لم يتم رفع سيرة ذاتية بعد</p>
                  {isEditing && (
                    <button
                      className={styles.uploadButton}
                      onClick={() => cvInputRef.current?.click()}
                      disabled={uploadingCV}
                    >
                      {uploadingCV ? "جاري الرفع..." : "رفع السيرة الذاتية"}
                    </button>
                  )}
                </div>
              )}
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCVUpload}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
