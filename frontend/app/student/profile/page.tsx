"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentNav from "@/components/StudentNav/StudentNav";
import styles from "./StudentProfile.module.css";
import { useLanguage } from "@/hooks/useLanguage";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaBook,
  FaBullseye,
  FaCalendar,
} from "react-icons/fa";

interface StudentProfile {
  grade: string;
  birth_date?: string;
  preferred_subjects?: string[];
  goal?: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export default function StudentProfile() {
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile>({
    grade: "",
    preferred_subjects: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSubject, setNewSubject] = useState("");

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

    if (parsedUser.type !== "student") {
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/profile`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/profile`,
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

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      setProfile({
        ...profile,
        preferred_subjects: [...(profile.preferred_subjects || []), newSubject.trim()],
      });
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (index: number) => {
    const subjects = [...(profile.preferred_subjects || [])];
    subjects.splice(index, 1);
    setProfile({ ...profile, preferred_subjects: subjects });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <StudentNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  const getGradeLabel = (grade: string) => {
    const gradeLabels: { [key: string]: string } = {
      primary_1: "الصف الأول الابتدائي",
      primary_2: "الصف الثاني الابتدائي",
      primary_3: "الصف الثالث الابتدائي",
      primary_4: "الصف الرابع الابتدائي",
      primary_5: "الصف الخامس الابتدائي",
      primary_6: "الصف السادس الابتدائي",
      prep_1: "الصف الأول الإعدادي",
      prep_2: "الصف الثاني الإعدادي",
      prep_3: "الصف الثالث الإعدادي",
      secondary_1: "الصف الأول الثانوي",
      secondary_2: "الصف الثاني الثانوي",
      secondary_3: "الصف الثالث الثانوي",
    };
    return gradeLabels[grade] || grade;
  };

  return (
    <div className={styles.container}>
      <StudentNav />

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
                {getGradeLabel(profile.grade)} • منصة Edvance
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
          </div>
        </section>

        {/* Profile Content */}
        <div className={styles.profileContent}>
          {/* Grade Section */}
          <div className={styles.section}>
            <h2>
              <FaGraduationCap /> المرحلة الدراسية
            </h2>
            {isEditing ? (
              <select
                className={styles.input}
                value={getGradeLabel(profile.grade)}
                onChange={(e) =>
                  setProfile({ ...profile, grade: e.target.value })
                }
              >
                <option value="">اختر المرحلة الدراسية</option>
                <option value="primary_1">الصف الأول الابتدائي</option>
                <option value="primary_2">الصف الثاني الابتدائي</option>
                <option value="primary_3">الصف الثالث الابتدائي</option>
                <option value="primary_4">الصف الرابع الابتدائي</option>
                <option value="primary_5">الصف الخامس الابتدائي</option>
                <option value="primary_6">الصف السادس الابتدائي</option>
                <option value="preparatory_1">الصف الأول الإعدادي</option>
                <option value="preparatory_2">الصف الثاني الإعدادي</option>
                <option value="preparatory_3">الصف الثالث الإعدادي</option>
                <option value="secondary_1">الصف الأول الثانوي</option>
                <option value="secondary_2">الصف الثاني الثانوي</option>
                <option value="secondary_3">الصف الثالث الثانوي</option>
              </select>
            ) : (
              <p>{getGradeLabel(profile.grade) || "لم يتم تحديد المرحلة الدراسية"}</p>
            )}
          </div>

          {/* Birth Date Section */}
          <div className={styles.section}>
            <h2>
              <FaCalendar /> تاريخ الميلاد
            </h2>
            {isEditing ? (
              <input
                className={styles.input}
                type="date"
                value={profile.birth_date || ""}
                onChange={(e) =>
                  setProfile({ ...profile, birth_date: e.target.value })
                }
              />
            ) : (
              <p>
                {profile.birth_date
                  ? new Date(profile.birth_date).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "لم يتم التحديد"}
              </p>
            )}
          </div>

          {/* Preferred Subjects Section */}
          <div className={styles.section}>
            <h2>
              <FaBook /> المواد المفضلة
            </h2>
            {isEditing && (
              <div className={styles.addItem}>
                <input
                  className={styles.input}
                  placeholder="أضف مادة..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddSubject()
                  }
                />
                <button
                  className={styles.addButton}
                  onClick={handleAddSubject}
                >
                  <FaPlus />
                </button>
              </div>
            )}
            {profile.preferred_subjects && profile.preferred_subjects.length > 0 ? (
              <div className={styles.subjectsList}>
                {profile.preferred_subjects.map((subject, index) => (
                  <div key={index} className={styles.subjectChip}>
                    {subject}
                    {isEditing && (
                      <button onClick={() => handleRemoveSubject(index)}>
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>لم يتم إضافة مواد مفضلة بعد</p>
            )}
          </div>

          {/* Goal Section */}
          <div className={styles.section}>
            <h2>
              <FaBullseye /> الهدف التعليمي
            </h2>
            {isEditing ? (
              <textarea
                className={styles.input}
                placeholder="ما هو هدفك من التعليم؟"
                value={profile.goal || ""}
                onChange={(e) =>
                  setProfile({ ...profile, goal: e.target.value })
                }
                rows={3}
              />
            ) : (
              <p>{profile.goal || "لم يتم تحديد هدف بعد"}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
