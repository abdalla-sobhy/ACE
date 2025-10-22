"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CompanyNav from "@/components/CompanyNav/CompanyNav";
import styles from "./Jobs.module.css";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Link from "next/link";

interface Job {
  id: number;
  title: string;
  description: string;
  job_type: string;
  work_location: string;
  location: string | null;
  salary_range: string | null;
  experience_level: string;
  skills: string[];
  is_active: boolean;
  applications_count: number;
  created_at: string;
  updated_at: string;
}

export default function CompanyJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    checkAuth();
    fetchJobs();
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

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/jobs`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      } else {
        setError("فشل في تحميل الوظائف");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الوظيفة؟")) {
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        fetchJobs();
      } else {
        alert("فشل في حذف الوظيفة");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("حدث خطأ أثناء حذف الوظيفة");
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

  const getWorkLocationLabel = (location: string) => {
    const labels: { [key: string]: string } = {
      onsite: "حضوري",
      remote: "عن بعد",
      hybrid: "مختلط",
    };
    return labels[location] || location;
  };

  const getExperienceLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      entry: "مبتدئ",
      junior: "متوسط",
      mid: "متقدم",
      senior: "خبير",
    };
    return labels[level] || level;
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || job.job_type === filterType;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && job.is_active) ||
      (filterStatus === "inactive" && !job.is_active);

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.is_active).length,
    inactive: jobs.filter((j) => !j.is_active).length,
    totalApplications: jobs.reduce((sum, j) => sum + j.applications_count, 0),
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <CompanyNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CompanyNav />

      <main className={styles.main}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <FaBriefcase /> الوظائف المعلن عنها
            </h1>
            <p className={styles.subtitle}>
              إدارة جميع الوظائف والفرص المتاحة في شركتك
            </p>
          </div>
          <Link href="/company/jobs/new" className={styles.createButton}>
            <FaPlus /> إضافة وظيفة جديدة
          </Link>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaBriefcase />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.total}</div>
              <div className={styles.statLabel}>إجمالي الوظائف</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#3fb950" }}>
              <FaCheckCircle />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.active}</div>
              <div className={styles.statLabel}>وظائف نشطة</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#f85149" }}>
              <FaTimesCircle />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.inactive}</div>
              <div className={styles.statLabel}>وظائف غير نشطة</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#a371f7" }}>
              <FaUsers />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.totalApplications}</div>
              <div className={styles.statLabel}>إجمالي المتقدمين</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <FaSearch />
            <input
              type="text"
              placeholder="ابحث عن وظيفة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filters}>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">كل الأنواع</option>
              <option value="full_time">دوام كامل</option>
              <option value="part_time">دوام جزئي</option>
              <option value="internship">تدريب</option>
              <option value="contract">عقد</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        {error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : filteredJobs.length === 0 ? (
          <div className={styles.emptyState}>
            <FaBriefcase />
            <h3>لا توجد وظائف متاحة</h3>
            <p>ابدأ بإضافة وظيفة جديدة للعثور على أفضل المواهب</p>
            <Link href="/company/jobs/new" className={styles.createButtonAlt}>
              <FaPlus /> إضافة وظيفة جديدة
            </Link>
          </div>
        ) : (
          <div className={styles.jobsGrid}>
            {filteredJobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobHeader}>
                  <h3 className={styles.jobTitle}>{job.title}</h3>
                  <span
                    className={`${styles.statusBadge} ${
                      job.is_active ? styles.active : styles.inactive
                    }`}
                  >
                    {job.is_active ? "نشط" : "غير نشط"}
                  </span>
                </div>

                <p className={styles.jobDescription}>
                  {job.description.length > 150
                    ? `${job.description.substring(0, 150)}...`
                    : job.description}
                </p>

                <div className={styles.jobMetadata}>
                  <div className={styles.metadataItem}>
                    <FaBriefcase />
                    <span>{getJobTypeLabel(job.job_type)}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <FaMapMarkerAlt />
                    <span>{getWorkLocationLabel(job.work_location)}</span>
                  </div>
                  {job.location && (
                    <div className={styles.metadataItem}>
                      <FaMapMarkerAlt />
                      <span>{job.location}</span>
                    </div>
                  )}
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className={styles.skillsSection}>
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className={styles.skillBadge}>
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className={styles.skillBadge}>
                        +{job.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className={styles.jobFooter}>
                  <div className={styles.applicationsCount}>
                    <FaUsers />
                    <span>{job.applications_count} متقدم</span>
                  </div>

                  <div className={styles.jobActions}>
                    <Link
                      href={`/company/jobs/${job.id}`}
                      className={styles.actionButton}
                      title="عرض"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/company/jobs/${job.id}/edit`}
                      className={styles.actionButton}
                      title="تعديل"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      title="حذف"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className={styles.jobDate}>
                  <FaClock />
                  <span>
                    تم النشر{" "}
                    {new Date(job.created_at).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
