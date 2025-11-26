"use client";

import { useState, useEffect } from "react";
import ParentNav from "@/components/ParentNav/ParentNav";
import styles from "./StudentDetails.module.css";
import { FaBook, FaChartLine, FaClock, FaArrowLeft } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import Image from "next/image";

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  enrolled_at: string;
  thumbnail?: string;
  lessons_count: number;
  completed_lessons: number;
}

interface StudentDetails {
  id: number;
  name: string;
  email: string;
  profile?: {
    grade: string;
    profile_picture?: string;
    birth_date?: string;
  };
  courses: Course[];
  overall_progress: number;
  enrolled_courses_count: number;
  completed_courses_count: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  type: string;
}

export default function StudentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth();
    fetchStudentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

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

  const fetchStudentDetails = async () => {
    try {
      const authData = localStorage.getItem("authData");
      if (!authData) return;

      const { token } = JSON.parse(authData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parent/student/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStudent(data.student);
      } else {
        setError(t("parent.noStudentsFound"));
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      setError(t("parent.noStudentsFound"));
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

  if (error || !student) {
    return (
      <div className={styles.container} dir={language === "ar" ? "rtl" : "ltr"}>
        <ParentNav />
        <main className={styles.main}>
          <div className={styles.errorContainer}>
            <h2>{error}</h2>
            <button onClick={() => router.push("/parent/dashboard")}>
              {t("common.backToDashboard")}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container} dir={language === "ar" ? "rtl" : "ltr"}>
      <ParentNav />
      <main className={styles.main}>
        {/* Header Section */}
        <section className={styles.headerSection}>
          <div className={styles.headerContent}>
            <button
              className={styles.backButton}
              onClick={() => router.push("/parent/dashboard")}
            >
              <FaArrowLeft /> {t("common.back")}
            </button>

            <div className={styles.studentHeader}>
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

              <div className={styles.studentHeaderInfo}>
                <h1>{student.name}</h1>
                <p className={styles.studentEmail}>{student.email}</p>
                {student.profile?.grade && (
                  <p className={styles.studentGrade}>
                    {t("parent.currentGrade")}: {student.profile.grade}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.statsCards}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaBook />
                </div>
                <div className={styles.statInfo}>
                  <h3>{student.enrolled_courses_count}</h3>
                  <p>{t("parent.enrolledCourses")}</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaChartLine />
                </div>
                <div className={styles.statInfo}>
                  <h3>{student.overall_progress}%</h3>
                  <p>{t("parent.overallProgress")}</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaClock />
                </div>
                <div className={styles.statInfo}>
                  <h3>{student.completed_courses_count}</h3>
                  <p>{t("parent.completedLessons")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className={styles.coursesSection}>
          <div className={styles.coursesContent}>
            <h2>{t("parent.enrolledCourses")}</h2>

            {student.courses.length === 0 ? (
              <div className={styles.emptyState}>
                <FaBook className={styles.emptyIcon} />
                <p>{t("parent.noCoursesEnrolled")}</p>
              </div>
            ) : (
              <div className={styles.coursesGrid}>
                {student.courses.map((course) => (
                  <div key={course.id} className={styles.courseCard}>
                    {course.thumbnail && (
                      <div className={styles.courseThumbnail}>
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          width={400}
                          height={200}
                        />
                      </div>
                    )}

                    <div className={styles.courseContent}>
                      <h3>{course.title}</h3>
                      <p className={styles.courseDescription}>
                        {course.description}
                      </p>

                      <div className={styles.courseStats}>
                        <div className={styles.stat}>
                          <FaBook />
                          <span>
                            {course.completed_lessons} / {course.lessons_count}{" "}
                            {t("parent.completedLessons")}
                          </span>
                        </div>
                      </div>

                      <div className={styles.progressSection}>
                        <div className={styles.progressHeader}>
                          <span>{t("parent.progress")}</span>
                          <span className={styles.progressValue}>
                            {course.progress}%
                          </span>
                        </div>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
