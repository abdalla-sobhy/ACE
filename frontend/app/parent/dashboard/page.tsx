"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ParentNav from "@/components/ParentNav/ParentNav";
import styles from "./ParentDashboard.module.css";
import { useLanguage } from "@/hooks/useLanguage";
import {
  FaUsers,
  FaBook,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartLine,
  FaTrophy,
  FaClock,
  FaGraduationCap
} from "react-icons/fa";
import Link from "next/link";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  type: string;
}

interface Student {
  id: number;
  name: string;
  grade: string;
  courses: number;
  progress: number;
  lastActivity: string;
}

interface Activity {
  id: number;
  studentName: string;
  action: string;
  course: string;
  time: string;
  type: 'lesson' | 'course' | 'certificate';
}

export default function ParentDashboard() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("authData");

    if (!userData || !authData) {
      router.push("/login");
      return;
    }

    try {
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
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  };

  // Mock data for demonstration
  const statsCards = [
    {
      title: t("parent.totalChildren"),
      value: "3",
      icon: <FaUsers />,
      color: "blue",
      change: "+1"
    },
    {
      title: t("parent.activeEnrollments"),
      value: "12",
      icon: <FaBook />,
      color: "green",
      change: "+3"
    },
    {
      title: t("parent.totalSpent"),
      value: "8,450 " + (language === "ar" ? "جنيه" : "EGP"),
      icon: <FaMoneyBillWave />,
      color: "purple",
      change: "+1,200"
    },
    {
      title: t("parent.upcomingPayments"),
      value: "2,100 " + (language === "ar" ? "جنيه" : "EGP"),
      icon: <FaCalendarAlt />,
      color: "orange",
      change: language === "ar" ? "هذا الشهر" : "This month"
    }
  ];

  // Mock students data
  const students: Student[] = [
    {
      id: 1,
      name: language === "ar" ? "أحمد محمد" : "Ahmed Mohamed",
      grade: language === "ar" ? "الصف الأول الثانوي" : "Grade 10",
      courses: 4,
      progress: 85,
      lastActivity: "2 " + t("parent.hours") + " " + t("parent.ago")
    },
    {
      id: 2,
      name: language === "ar" ? "فاطمة علي" : "Fatima Ali",
      grade: language === "ar" ? "الصف الثاني الإعدادي" : "Grade 8",
      courses: 5,
      progress: 92,
      lastActivity: "4 " + t("parent.hours") + " " + t("parent.ago")
    },
    {
      id: 3,
      name: language === "ar" ? "عمر حسن" : "Omar Hassan",
      grade: language === "ar" ? "الصف الخامس الابتدائي" : "Grade 5",
      courses: 3,
      progress: 78,
      lastActivity: "1 " + (language === "ar" ? "يوم" : "day") + " " + t("parent.ago")
    }
  ];

  // Mock recent activities
  const recentActivities: Activity[] = [
    {
      id: 1,
      studentName: language === "ar" ? "أحمد محمد" : "Ahmed Mohamed",
      action: t("parent.completedLesson"),
      course: language === "ar" ? "الرياضيات المتقدمة" : "Advanced Mathematics",
      time: "2 " + t("parent.hours") + " " + t("parent.ago"),
      type: 'lesson'
    },
    {
      id: 2,
      studentName: language === "ar" ? "فاطمة علي" : "Fatima Ali",
      action: t("parent.joinedCourse"),
      course: language === "ar" ? "اللغة الإنجليزية" : "English Language",
      time: "5 " + t("parent.hours") + " " + t("parent.ago"),
      type: 'course'
    },
    {
      id: 3,
      studentName: language === "ar" ? "عمر حسن" : "Omar Hassan",
      action: t("parent.completedLesson"),
      course: language === "ar" ? "العلوم" : "Science",
      time: "1 " + (language === "ar" ? "يوم" : "day") + " " + t("parent.ago"),
      type: 'lesson'
    },
    {
      id: 4,
      studentName: language === "ar" ? "فاطمة علي" : "Fatima Ali",
      action: t("parent.achievedCertificate"),
      course: language === "ar" ? "البرمجة للمبتدئين" : "Programming for Beginners",
      time: "2 " + (language === "ar" ? "أيام" : "days") + " " + t("parent.ago"),
      type: 'certificate'
    }
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'lesson':
        return <FaBook />;
      case 'course':
        return <FaGraduationCap />;
      case 'certificate':
        return <FaTrophy />;
      default:
        return <FaChartLine />;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <ParentNav />
        <main className={styles.main}>
          <div className={styles.loading}>{t("common.loading")}</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ParentNav />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {t("parent.welcomeBack")}, {user?.first_name || ""}!
            </h1>
            <p className={styles.subtitle}>{t("parent.overview")}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          {statsCards.map((stat, index) => (
            <div key={index} className={`${styles.statCard} ${styles[stat.color]}`}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{stat.value}</h3>
                <p className={styles.statTitle}>{stat.title}</p>
                <span className={styles.statChange}>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.contentGrid}>
          {/* Students Overview */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t("parent.myStudents")}</h2>
              <Link href="/parent/students" className={styles.viewAllLink}>
                {t("teacher.viewAll")}
              </Link>
            </div>
            <div className={styles.studentsGrid}>
              {students.map((student) => (
                <div key={student.id} className={styles.studentCard}>
                  <div className={styles.studentAvatar}>
                    <FaUsers />
                  </div>
                  <div className={styles.studentInfo}>
                    <h3 className={styles.studentName}>{student.name}</h3>
                    <p className={styles.studentGrade}>{student.grade}</p>
                    <div className={styles.studentStats}>
                      <div className={styles.studentStat}>
                        <FaBook />
                        <span>{student.courses} {t("parent.coursesEnrolled")}</span>
                      </div>
                      <div className={styles.studentStat}>
                        <FaClock />
                        <span>{student.lastActivity}</span>
                      </div>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressLabel}>
                        <span>{t("parent.overallProgress")}</span>
                        <span>{student.progress}%</span>
                      </div>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/parent/students?id=${student.id}`}
                    className={styles.viewDetailsBtn}
                  >
                    {t("parent.viewDetails")}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("parent.recentActivity")}</h2>
            <div className={styles.activityList}>
              {recentActivities.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={`${styles.activityIcon} ${styles[activity.type]}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>
                      <strong>{activity.studentName}</strong> {activity.action}
                    </p>
                    <p className={styles.activityCourse}>{activity.course}</p>
                    <p className={styles.activityTime}>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
