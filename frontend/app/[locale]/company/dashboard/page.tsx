"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CompanyNav from "@/components/CompanyNav/CompanyNav";
import styles from "./CompanyDashboard.module.css";
import {
  FaBriefcase,
  FaUsers,
  FaUserCheck,
  FaCalendarAlt,
  FaPlus,
  FaEye,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

interface DashboardStats {
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
  new_applications: number;
  shortlisted_candidates: number;
  interviews_scheduled: number;
}

interface RecentApplication {
  id: number;
  student_name: string;
  job_title: string;
  status: string;
  created_at: string;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('companyDashboard');
  const [stats, setStats] = useState<DashboardStats>({
    total_jobs: 0,
    active_jobs: 0,
    total_applications: 0,
    new_applications: 0,
    shortlisted_candidates: 0,
    interviews_scheduled: 0,
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
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
    if (parsedUser.type !== "company") {
      router.push("/");
      return;
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentApplications(data.recent_applications);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "#ffc107",
      reviewing: "#17a2b8",
      shortlisted: "#58a6ff",
      interviewed: "#6f42c1",
      accepted: "#3fb950",
      rejected: "#f85149",
    };
    return colors[status] || "#6e7681";
  };

  const getStatusLabel = (status: string) => {
    const key = `applicationStatus.${status}`;
    // @ts-expect-error - Dynamic translation key
    return t(key) || status;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <CompanyNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CompanyNav />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>{t('title')}</h1>
          <Link href={`/${locale}/company/jobs/new`} className={styles.newJobButton}>
            <FaPlus /> {t('newJob')}
          </Link>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaBriefcase />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.total_jobs}</h3>
              <p>{t('stats.totalJobs')}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#2ea043" }}>
              <FaChartLine />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.active_jobs}</h3>
              <p>{t('stats.activeJobs')}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#1f6feb" }}>
              <FaUsers />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.total_applications}</h3>
              <p>{t('stats.totalApplications')}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#fb8500" }}>
              <FaClock />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.new_applications}</h3>
              <p>{t('stats.newApplications')}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#8b5cf6" }}>
              <FaUserCheck />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.shortlisted_candidates}</h3>
              <p>{t('stats.shortlisted')}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#06ffa5" }}>
              <FaCalendarAlt />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.interviews_scheduled}</h3>
              <p>{t('stats.interviews')}</p>
            </div>
          </div>
        </div>

        <div className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <h2>{t('recentApplications.title')}</h2>
            <Link href={`/${locale}/company/applications`} className={styles.viewAllLink}>
              {t('recentApplications.viewAll')}
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className={styles.applicationsTable}>
              <table>
                <thead>
                  <tr>
                    <th>{t('recentApplications.applicantName')}</th>
                    <th>{t('recentApplications.job')}</th>
                    <th>{t('recentApplications.status')}</th>
                    <th>{t('recentApplications.date')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((application) => (
                    <tr key={application.id}>
                      <td>{application.student_name}</td>
                      <td>{application.job_title}</td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{
                            color: getStatusColor(application.status),
                            backgroundColor: `${getStatusColor(application.status)}20`
                          }}
                        >
                          {getStatusLabel(application.status)}
                        </span>
                      </td>
                      <td>
                        {new Date(application.created_at).toLocaleDateString(locale === 'ar' ? "ar-EG" : "en-US")}
                      </td>
                      <td>
                        <Link
                          href={`/${locale}/company/applications/${application.id}`}
                          className={styles.viewButton}
                        >
                          <FaEye /> {t('recentApplications.view')}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>{t('recentApplications.noApplications')}</p>
            </div>
          )}
        </div>
        </main>
    </div>
  );
}