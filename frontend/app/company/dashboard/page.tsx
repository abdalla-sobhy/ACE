"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
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
  const { t } = useLanguage();
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
    const labels: { [key: string]: string } = {
      pending: t("company.applicationStatus.pending"),
      reviewing: t("company.applicationStatus.reviewing"),
      shortlisted: t("company.applicationStatus.shortlisted"),
      interviewed: t("company.applicationStatus.interviewed"),
      accepted: t("company.applicationStatus.accepted"),
      rejected: t("company.applicationStatus.rejected"),
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <CompanyNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>{t("common.loadingData")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CompanyNav />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>{t("company.dashboard")}</h1>
          <Link href="/company/jobs/new" className={styles.newJobButton}>
            <FaPlus /> {t("company.postNewJob")}
          </Link>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaBriefcase />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.total_jobs}</h3>
              <p>{t("company.totalJobs")}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#2ea043" }}>
              <FaChartLine />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.active_jobs}</h3>
              <p>{t("company.activeJobs")}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#1f6feb" }}>
              <FaUsers />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.total_applications}</h3>
              <p>{t("company.totalApplications")}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#fb8500" }}>
              <FaClock />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.new_applications}</h3>
              <p>{t("company.newApplications")}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#8b5cf6" }}>
              <FaUserCheck />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.shortlisted_candidates}</h3>
              <p>{t("company.shortlistedCandidates")}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#06ffa5" }}>
              <FaCalendarAlt />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.interviews_scheduled}</h3>
              <p className="whitespace-nowrap">{t("company.interviewsScheduled")}</p>
            </div>
          </div>
        </div>

        <div className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <h2>{t("company.recentApplications")}</h2>
            <Link href="/company/applications" className={styles.viewAllLink}>
              {t("common.viewAll")}
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className={styles.applicationsTable}>
              <table>
                <thead>
                  <tr>
                    <th>{t("company.applicantName")}</th>
                    <th>{t("company.job")}</th>
                    <th>{t("common.status")}</th>
                    <th>{t("common.date")}</th>
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
                        {new Date(application.created_at).toLocaleDateString("en-EG")}
                      </td>
                      <td>
                        <Link
                          href={`/company/applications/${application.id}`}
                          className={styles.viewButton}
                        >
                          <FaEye /> {t("common.view")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>{t("company.noNewApplications")}</p>
            </div>
          )}
        </div>
        </main>
    </div>
  );
}