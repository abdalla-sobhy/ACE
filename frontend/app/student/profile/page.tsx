"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import StudentNav from "@/components/StudentNav/StudentNav";
import styles from "./StudentProfile.module.css";
import { useLanguage } from "@/hooks/useLanguage";
import Image from "next/image";
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
  profile_picture?: string;
}

export default function StudentProfile() {
  const { t } = useLanguage();
  const router = useRouter();
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile>({
    grade: "",
    preferred_subjects: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);
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
        alert(t("profilePage.profileSaveSuccess"));
      } else {
        alert(t("profilePage.profileSaveError"));
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(t("profilePage.profileSaveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, JPG, or GIF)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    try {
      setUploadingProfilePicture(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const formData = new FormData();
      formData.append("profile_picture", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/upload-profile-picture`,
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
        setUser({
          ...user!,
          profile_picture: data.profile_picture_url,
        });
      } else {
        alert("Error uploading profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error uploading profile picture");
    } finally {
      setUploadingProfilePicture(false);
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
          <p>{t("profilePage.loadingProfile")}</p>
        </div>
      </div>
    );
  }

  const getGradeLabel = (grade: string) => {
    const gradeLabels: { [key: string]: string } = {
      primary_1: t("grades.primary_1"),
      primary_2: t("grades.primary_2"),
      primary_3: t("grades.primary_3"),
      primary_4: t("grades.primary_4"),
      primary_5: t("grades.primary_5"),
      primary_6: t("grades.primary_6"),
      prep_1: t("grades.prep_1"),
      prep_2: t("grades.prep_2"),
      prep_3: t("grades.prep_3"),
      secondary_1: t("grades.secondary_1"),
      secondary_2: t("grades.secondary_2"),
      secondary_3: t("grades.secondary_3"),
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
            <div
              className={styles.profilePicture}
              onClick={() => profilePictureInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
              title="Click to upload profile picture"
            >
              {uploadingProfilePicture ? (
                <div>Uploading...</div>
              ) : user?.profile_picture ? (
                <Image
                  height={150}
                  width={150}
                  src={user.profile_picture}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <FaUser />
              )}
            </div>
            <input
              ref={profilePictureInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              style={{ display: 'none' }}
            />
            <div className={styles.profileInfo}>
              <h1>
                {user?.first_name} {user?.last_name}
              </h1>
              <p className={styles.profileTitle}>
                {getGradeLabel(profile.grade)} • {t("profilePage.platform")} {t("common.edvance")}
              </p>
              <div className={styles.profileMeta}>
                <span>
                  <FaMapMarkerAlt /> {t("profilePage.egypt")}
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
                    <FaEdit /> {t("profilePage.editProfile")}
                  </button>
                ) : (
                  <>
                    <button
                      className={styles.saveButton}
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      <FaSave /> {saving ? t("profilePage.saving") : t("profilePage.saveChanges")}
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={() => setIsEditing(false)}
                    >
                      <FaTimes /> {t("profilePage.cancel")}
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
              <FaGraduationCap /> {t("profilePage.gradeLevel")}
            </h2>
            {isEditing ? (
              <select
                className={styles.input}
                value={profile.grade}
                onChange={(e) =>
                  setProfile({ ...profile, grade: e.target.value })
                }
              >
                <option value="">{t("grades.selectGrade")}</option>
                <option value="primary_1">{t("grades.primary_1")}</option>
                <option value="primary_2">{t("grades.primary_2")}</option>
                <option value="primary_3">{t("grades.primary_3")}</option>
                <option value="primary_4">{t("grades.primary_4")}</option>
                <option value="primary_5">{t("grades.primary_5")}</option>
                <option value="primary_6">{t("grades.primary_6")}</option>
                <option value="prep_1">{t("grades.prep_1")}</option>
                <option value="prep_2">{t("grades.prep_2")}</option>
                <option value="prep_3">{t("grades.prep_3")}</option>
                <option value="secondary_1">{t("grades.secondary_1")}</option>
                <option value="secondary_2">{t("grades.secondary_2")}</option>
                <option value="secondary_3">{t("grades.secondary_3")}</option>
              </select>
            ) : (
              <p>{getGradeLabel(profile.grade) || t("profilePage.gradeNotSet")}</p>
            )}
          </div>

          {/* Birth Date Section */}
          <div className={styles.section}>
            <h2>
              <FaCalendar /> {t("profilePage.birthDateLabel")}
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
                  : t("profilePage.notSet")}
              </p>
            )}
          </div>

          {/* Preferred Subjects Section */}
          <div className={styles.section}>
            <h2>
              <FaBook /> {t("profilePage.preferredSubjects")}
            </h2>
            {isEditing && (
              <div className={styles.addItem}>
                <input
                  className={styles.input}
                  placeholder={t("profilePage.addSubject")}
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
              <p>{t("profilePage.noSubjectsAdded")}</p>
            )}
          </div>

          {/* Goal Section */}
          <div className={styles.section}>
            <h2>
              <FaBullseye /> {t("profilePage.learningGoal")}
            </h2>
            {isEditing ? (
              <textarea
                className={styles.input}
                placeholder={t("profilePage.goalPlaceholder")}
                value={profile.goal || ""}
                onChange={(e) =>
                  setProfile({ ...profile, goal: e.target.value })
                }
                rows={3}
              />
            ) : (
              <p>{profile.goal || t("profilePage.noGoalSet")}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}