"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ParentNav from "@/components/ParentNav/ParentNav";
import styles from "./ParentProfile.module.css";
import { useLanguage } from "@/hooks/useLanguage";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUsers,
} from "react-icons/fa";

interface ParentProfile {
  children_count: number;
  didit_data?: Record<string, unknown>;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export default function ParentProfile() {
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ParentProfile>({
    children_count: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

    if (parsedUser.type !== "parent") {
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/parent/profile`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/parent/profile`,
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

  if (loading) {
    return (
      <div className={styles.container}>
        <ParentNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ParentNav />

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
              <p className={styles.profileTitle}>ولي أمر • منصة Edvance</p>
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
            {profile.children_count > 0 && (
              <div className={styles.profileStats}>
                <div className={styles.statBox}>
                  <h3>{profile.children_count}</h3>
                  <p>عدد الأبناء</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Profile Content */}
        <div className={styles.profileContent}>
          {/* Children Count Section */}
          <div className={styles.section}>
            <h2>
              <FaUsers /> عدد الأبناء
            </h2>
            {isEditing ? (
              <input
                className={styles.input}
                type="number"
                placeholder="عدد الأبناء"
                min="0"
                value={profile.children_count || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    children_count: parseInt(e.target.value) || 0,
                  })
                }
              />
            ) : (
              <p>
                {profile.children_count > 0
                  ? `${profile.children_count} ${profile.children_count === 1 ? "ابن" : "أبناء"}`
                  : "لم يتم التحديد"}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
