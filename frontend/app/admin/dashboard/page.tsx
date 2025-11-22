"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav/AdminNav";
import styles from "./AdminDashboard.module.css";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaBook,
  FaBuilding,
  FaUserGraduate,
  FaUserCheck,
  FaClock,
  FaBan,
} from "react-icons/fa";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

interface DashboardStats {
  users: {
    total: number;
    students: number;
    university_students: number;
    teachers: number;
    parents: number;
    companies: number;
    admins: number;
    pending_approval: number;
    suspended: number;
  };
  teachers: {
    total: number;
    approved: number;
    pending: number;
  };
  courses: {
    total: number;
    published: number;
    draft: number;
  };
  enrollments: {
    total: number;
    active: number;
    completed: number;
  };
  companies: {
    total: number;
    verified: number;
    unverified: number;
  };
  jobs: {
    total: number;
    active: number;
    applications: number;
  };
  recent_activity: {
    new_users_today: number;
    new_courses_this_week: number;
    new_enrollments_this_week: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("authData");

    if (!userData || !authData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.type !== "admin") {
      router.push("/");
      return;
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        console.error("Failed to fetch dashboard stats");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <AdminNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>{t("admin.dashboard.loadingDashboard")}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.container}>
        <AdminNav />
        <div className={styles.errorContainer}>
          <p>{t("admin.dashboard.failedToLoad")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminNav />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>{t("admin.dashboard.title")}</h1>
          <p>{t("admin.dashboard.subtitle")}</p>
        </div>

        {/* Main Stats Grid */}
        <div className={styles.section}>
          <h2>{t("admin.dashboard.platformOverview")}</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaUsers />
              </div>
              <div className={styles.statContent}>
                <h3>{stats.users.total}</h3>
                <p>{t("admin.dashboard.totalUsers")}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaUserGraduate />
              </div>
              <div className={styles.statContent}>
                <h3>{stats.users.students + stats.users.university_students}</h3>
                <p>{t("admin.dashboard.totalStudents")}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaChalkboardTeacher />
              </div>
              <div className={styles.statContent}>
                <h3>{stats.teachers.total}</h3>
                <p>{t("admin.dashboard.totalTeachers")}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaBook />
              </div>
              <div className={styles.statContent}>
                <h3>{stats.courses.total}</h3>
                <p>{t("admin.dashboard.totalCourses")}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaBuilding />
              </div>
              <div className={styles.statContent}>
                <h3>{stats.companies.total}</h3>
                <p>{t("admin.dashboard.companies")}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaClock />
              </div>
              <div className={styles.statContent}>
                <h3>{stats.users.pending_approval}</h3>
                <p>{t("admin.dashboard.pendingApprovals")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>{t("admin.dashboard.teacherManagement")}</h2>
            <Link href="/admin/teachers" className={styles.viewAllLink}>
              {t("admin.dashboard.viewAll")}
            </Link>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaUserCheck />
              </div>
              <div className={styles.statContent}>
                <h3>{stats.teachers.approved}</h3>
                <p>{t("admin.dashboard.approvedTeachers")}</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaClock />
              </div>
              <div className={styles.statContent}>
                <h3>{stats.teachers.pending}</h3>
                <p>{t("admin.dashboard.pendingApproval")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.section}>
          <h2>{t("admin.dashboard.recentActivity")}</h2>
          <div className={styles.activityGrid}>
            <div className={styles.activityCard}>
              <div className={styles.activityIcon}>
                <FaUsers />
              </div>
              <div className={styles.activityContent}>
                <h4>{stats.recent_activity.new_users_today}</h4>
                <p>{t("admin.dashboard.newUsersToday")}</p>
              </div>
            </div>

            <div className={styles.activityCard}>
              <div className={styles.activityIcon}>
                <FaBook />
              </div>
              <div className={styles.activityContent}>
                <h4>{stats.recent_activity.new_courses_this_week}</h4>
                <p>{t("admin.dashboard.newCoursesThisWeek")}</p>
              </div>
            </div>

            <div className={styles.activityCard}>
              <div className={styles.activityIcon}>
                <FaUserGraduate />
              </div>
              <div className={styles.activityContent}>
                <h4>{stats.recent_activity.new_enrollments_this_week}</h4>
                <p>{t("admin.dashboard.newEnrollmentsThisWeek")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.section}>
          <h2>{t("admin.dashboard.quickActions")}</h2>
          <div className={styles.quickLinks}>
            <Link href="/admin/users" className={styles.quickLink}>
              <FaUsers />
              <span>{t("admin.dashboard.manageUsers")}</span>
            </Link>
            <Link href="/admin/teachers" className={styles.quickLink}>
              <FaChalkboardTeacher />
              <span>{t("admin.dashboard.approveTeachers")}</span>
            </Link>
            <Link href="/admin/courses" className={styles.quickLink}>
              <FaBook />
              <span>{t("admin.dashboard.manageCourses")}</span>
            </Link>
            <Link href="/admin/companies" className={styles.quickLink}>
              <FaBuilding />
              <span>{t("admin.dashboard.verifyCompanies")}</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
