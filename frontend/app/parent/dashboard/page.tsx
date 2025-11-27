"use client";

import { useState, useEffect } from "react";
import ParentNav from "@/components/ParentNav/ParentNav";
import styles from "./ParentDashboard.module.css";
import { FaUsers, FaBook, FaChartLine, FaUserPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

interface Student {
  id: number;
  name: string;
  email: string;
  profile?: {
    grade: string;
    profile_picture?: string;
  };
  enrolled_courses_count?: number;
  overall_progress?: number;
  last_activity?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  type: string;
}

export default function ParentDashboard() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const gradeLabels: Record<string, string> = {
    'primary_1': t('grades.primary_1'),
    'primary_2': t('grades.primary_2'),
    'primary_3': t('grades.primary_3'),
    'primary_4': t('grades.primary_4'),
    'primary_5': t('grades.primary_5'),
    'primary_6': t('grades.primary_6'),
    'prep_1': t('grades.prep_1'),
    'prep_2': t('grades.prep_2'),
    'prep_3': t('grades.prep_3'),
    'secondary_1': t('grades.secondary_1'),
    'secondary_2': t('grades.secondary_2'),
    'secondary_3': t('grades.secondary_3'),
  };

  useEffect(() => {
    checkAuth();
    fetchLinkedStudents();
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

  const fetchLinkedStudents = async () => {
    try {
      const authData = localStorage.getItem("authData");
      if (!authData) return;

      const { token } = JSON.parse(authData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parent/followed-students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error("Error fetching linked students:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container} dir={language === "ar" ? "rtl" : "ltr"}>
        <ParentNav />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>{t("common.loading")}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container} dir={language === "ar" ? "rtl" : "ltr"}>
      <ParentNav />
      <main className={styles.main}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h1>{t("parent.welcomeBack")}, {user?.name}!</h1>
            <p>{t("parent.overview")}</p>
          </div>

          <div className={styles.statsCards}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaUsers />
              </div>
              <div className={styles.statInfo}>
                <h3>{students.length}</h3>
                <p>{t("parent.myLinkedStudents")}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaBook />
              </div>
              <div className={styles.statInfo}>
                <h3>
                  {students.reduce(
                    (sum, s) => sum + (s.enrolled_courses_count || 0),
                    0
                  )}
                </h3>
                <p>{t("parent.enrolledCourses")}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaChartLine />
              </div>
              <div className={styles.statInfo}>
                <h3>
                  {students.length > 0
                    ? Math.round(
                        students.reduce(
                          (sum, s) => sum + (s.overall_progress || 0),
                          0
                        ) / students.length
                      )
                    : 0}
                  %
                </h3>
                <p>{t("parent.overallProgress")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Students Section */}
        <section className={styles.studentsSection}>
          <div className={styles.studentsHeader}>
            <div>
              <h2>{t("parent.myStudents")}</h2>
              <p>{t("parent.studentsOverview")}</p>
            </div>
            <button
              className={styles.addButton}
              onClick={() => router.push("/parent/students")}
            >
              <FaUserPlus />
              <span>{t("parent.linkStudent")}</span>
            </button>
          </div>

          {students.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FaUsers />
              </div>
              <h3>{t("parent.noStudentsFound")}</h3>
              <p>{t("parent.searchStudent")}</p>
              <button
                className={styles.linkButton}
                onClick={() => router.push("/parent/students")}
              >
                <FaUserPlus />
                <span>{t("parent.linkStudent")}</span>
              </button>
            </div>
          ) : (
            <div className={styles.studentsGrid}>
              {students.map((student) => (
                <div key={student.id} className={styles.studentCard}>
                  <div className={styles.studentAvatar}>
                    {student.profile?.profile_picture ? (
                      <img
                        src={student.profile.profile_picture}
                        alt={student.name}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className={styles.studentInfo}>
                    <h3>{student.name}</h3>
                    <p className={styles.studentEmail}>{student.email}</p>
                    {student.profile?.grade && (
                      <p className={styles.studentGrade}>
                        {t("parent.currentGrade")}: {gradeLabels[student.profile.grade] || student.profile.grade}
                      </p>
                    )}
                  </div>

                  <div className={styles.studentStats}>
                    <div className={styles.stat}>
                      <FaBook />
                      <span>
                        {student.enrolled_courses_count || 0}{" "}
                        {t("parent.coursesEnrolled")}
                      </span>
                    </div>
                    <div className={styles.stat}>
                      <FaChartLine />
                      <span>
                        {student.overall_progress || 0}% {t("parent.progress")}
                      </span>
                    </div>
                  </div>

                  <button
                    className={styles.viewButton}
                    onClick={() => router.push(`/parent/students/${student.id}`)}
                  >
                    {t("parent.viewDetails")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
