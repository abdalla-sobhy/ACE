"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UniversityStudentNav from "@/components/UniversityStudentNav/UniversityStudentNav";
import styles from "./MyApplications.module.css";
import {
  FaBriefcase,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

import { useLanguage } from "@/hooks/useLanguage";
interface Application {
  id: number;
  job: {
    id: number;
    title: string;
    company_name: string;
    company_logo: string | null;
    job_type: string;
    work_location: string;
    location: string | null;
  };
  status: string;
  status_label: string;
  status_color: string;
  cover_letter: string;
  viewed_at: string | null;
  interview_date: string | null;
  interview_location: string | null;
  created_at: string;
  updated_at: string;
  status_history: Array<{
    status: string;
    changed_at: string;
    note?: string;
  }> | string | null;
}

interface ApplicationStats {
  total: number;
  pending: number;
  shortlisted: number;
  interviewed: number;
  accepted: number;
}

export default function MyApplications() {
  const { t } = useLanguage();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    shortlisted: 0,
    interviewed: 0,
    accepted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    checkAuth();
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, currentPage]);

  const checkAuth = () => {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("authData");

    if (!userData || !authData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.type !== "university_student") {
      router.push("/");
      return;
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const params = new URLSearchParams({
        page: currentPage.toString(),
        status: statusFilter,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/applications?${params}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications.data);
        setTotalPages(data.applications.last_page);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: number) => {
    if (!confirm(t("universityStudent.confirmWithdraw"))) {
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/applications/${applicationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error("Error withdrawing application:", error);
      alert(t("universityStudent.withdrawError"));
    }
  };

  const getJobTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      full_time: "دوام كامل",
      part_time: "دوام جزئي",
      internship: "تدريب",
      contract: "عقد",
    };
    return labels[type] || type;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FaClock />;
      case "reviewing":
        return <FaEye />;
      case "shortlisted":
        return <FaCheckCircle />;
      case "interviewed":
        return <FaCalendarAlt />;
      case "accepted":
        return <FaCheckCircle />;
      case "rejected":
        return <FaTimesCircle />;
      default:
        return <FaClock />;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <UniversityStudentNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>{t("universityStudent.loadingApplications")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <UniversityStudentNav />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>{t("universityStudent.myJobApplications")}</h1>
          <Link href="/university_student/jobs" className={styles.browseButton}>
            <FaBriefcase /> {t("student.browseJobs")}
          </Link>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div
            className={`${styles.statCard} ${
              statusFilter === "all" ? styles.active : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            <h3>{stats.total}</h3>
            <p>{t("universityStudent.totalApplications")}</p>
          </div>
          <div
            className={`${styles.statCard} ${
              statusFilter === "pending" ? styles.active : ""
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            <h3>{stats.pending}</h3>
            <p>{t("universityStudent.pending")}</p>
          </div>
          <div
            className={`${styles.statCard} ${
              statusFilter === "shortlisted" ? styles.active : ""
            }`}
            onClick={() => setStatusFilter("shortlisted")}
          >
            <h3>{stats.shortlisted}</h3>
            <p>{t("universityStudent.shortlisted")}</p>
          </div>
          <div
            className={`${styles.statCard} ${
              statusFilter === "interviewed" ? styles.active : ""
            }`}
            onClick={() => setStatusFilter("interviewed")}
          >
            <h3>{stats.interviewed}</h3>
            <p>{t("universityStudent.interviewed")}</p>
          </div>
          <div
            className={`${styles.statCard} ${
              statusFilter === "accepted" ? styles.active : ""
            }`}
            onClick={() => setStatusFilter("accepted")}
          >
            <h3>{stats.accepted}</h3>
            <p>{t("universityStudent.accepted")}</p>
          </div>
        </div>

        {/* Applications List */}
        <div className={styles.applicationsList}>
          {applications.length === 0 ? (
            <div className={styles.emptyState}>
              <FaBriefcase className={styles.emptyIcon} />
              <h3>{t("company.noApplications")}</h3>
              <p>{t("universityStudent.noApplicationsYet")}</p>
              <Link href="/university_student/jobs" className={styles.browseLink}>
                {t("universityStudent.browseAvailableJobs")}
              </Link>
            </div>
          ) : (
            applications.map((application) => (
              <div key={application.id} className={styles.applicationCard}>
                <div className={styles.applicationHeader}>
                  <div className={styles.jobInfo}>
                    {application.job.company_logo ? (
                      <Image
                        src={application.job.company_logo}
                        alt={application.job.company_name}
                        width={50}
                        height={50}
                        className={styles.companyLogo}
                      />
                    ) : (
                      <div className={styles.logoPlaceholder}>
                        <FaBuilding />
                      </div>
                    )}
                    <div>
                      <h3>
                        <Link href={`/university_student/jobs/${application.job.id}`}>
                          {application.job.title}
                        </Link>
                      </h3>
                      <p>{application.job.company_name}</p>
                    </div>
                  </div>
                  <div
                    className={styles.statusBadge}
                    style={{ backgroundColor: application.status_color + "20", color: application.status_color }}
                  >
                    {getStatusIcon(application.status)}
                    <span>{t(`universityStudent.status.${application.status}`)}</span>
                  </div>
                </div>

                <div className={styles.applicationDetails}>
                  <div className={styles.detailItem}>
                    <FaBriefcase />
                    <span>{getJobTypeLabel(application.job.job_type)}</span>
                  </div>
                  {application.job.location && (
                    <div className={styles.detailItem}>
                      <FaMapMarkerAlt />
                      <span>{application.job.location}</span>
                    </div>
                  )}
                  <div className={styles.detailItem}>
                    <FaClock />
                    <span>
                      تقدمت في {new Date(application.created_at).toLocaleDateString("en-EG")}
                    </span>
                  </div>
                  {application.viewed_at && (
                    <div className={styles.detailItem}>
                      <FaEye />
                      <span>{t("universityStudent.viewed")}</span>
                    </div>
                  )}
                </div>

                {application.interview_date && (
                  <div className={styles.interviewInfo}>
                    <FaCalendarAlt />
                    <span>
                      موعد المقابلة: {new Date(application.interview_date).toLocaleString("en-EG")}
                    </span>
                    {application.interview_location && (
                      <span> - {application.interview_location}</span>
                    )}
                  </div>
                )}

                <div className={styles.applicationActions}>
                  <button
                    className={styles.detailsButton}
                    onClick={() => setSelectedApplication(application)}
                  >
                    {t("universityStudent.showDetails")}
                  </button>
                  {["pending", "reviewing"].includes(application.status) && (
                    <button
                      className={styles.withdrawButton}
                      onClick={() => handleWithdraw(application.id)}
                    >
                      {t("universityStudent.withdrawApplication")}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              السابق
            </button>
            <span className={styles.pageInfo}>
              صفحة {currentPage} من {totalPages}
            </span>
            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              التالي
            </button>
          </div>
        )}

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>{t("companyApplications.applicationDetails")}</h2>
                <button
                  className={styles.closeButton}
                  onClick={() => setSelectedApplication(null)}
                >
                  ×
                </button>
              </div>

              <div className={styles.modalBody}>
                <h3>{t("company.coverLetter")}</h3>
                <p className={styles.coverLetter}>{selectedApplication.cover_letter}</p>

                <h3>{t("universityStudent.statusHistory")}</h3>
                <div className={styles.statusHistory}>
                  {(() => {
                    // Parse status_history if it's a string, or use as-is if array, or empty array if null
                    let statusHistory: Array<{status: string; changed_at: string; note?: string}> = [];
                    if (selectedApplication.status_history) {
                      statusHistory = typeof selectedApplication.status_history === 'string'
                        ? JSON.parse(selectedApplication.status_history)
                        : selectedApplication.status_history;
                    }
                    return statusHistory.map((history, index) => (
                      <div key={index} className={styles.historyItem}>
                        <div className={styles.historyDate}>
                          {new Date(history.changed_at).toLocaleString("en-EG")}
                        </div>
                        <div className={styles.historyStatus}>
                          {history.status}
                        </div>
                        {history.note && (
                          <div className={styles.historyNotes}>{history.note}</div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
