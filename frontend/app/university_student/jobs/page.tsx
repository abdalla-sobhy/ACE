"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UniversityStudentNav from "@/components/UniversityStudentNav/UniversityStudentNav";
import styles from "./UniversityJobs.module.css";
import {
  FaSearch,
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaGraduationCap,
  FaBuilding,
  FaCheckCircle,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface Company {
  id: number;
  name: string;
  logo: string | null;
  industry: string;
  location: string;
  is_verified: boolean;
}

interface Job {
  id: number;
  title: string;
  company: Company;
  description: string;
  requirements: string[];
  skills_required: string[];
  job_type: string;
  work_location: string;
  location: string | null;
  salary_range: string | null;
  experience_level: string;
  application_deadline: string | null;
  created_at: string;
  has_applied: boolean;
  application_status: string | null;
  is_expired: boolean;
}

export default function UniversityJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    job_type: "all",
    work_location: "all",
    experience_level: "all",
    match_skills: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    checkAuth();
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

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

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const params = new URLSearchParams({
      page: currentPage.toString(),
      search: searchQuery,
      job_type: filters.job_type,
      work_location: filters.work_location,
      experience_level: filters.experience_level,
      match_skills: filters.match_skills.toString(),
    });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/jobs?${params}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs.data);
        setTotalPages(data.jobs.last_page);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
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
      onsite: "حضور مكتبي",
      remote: "عن بُعد",
      hybrid: "هجين",
    };
    return labels[location] || location;
  };

  const getExperienceLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      entry: "مبتدئ",
      junior: "خبرة قليلة",
      mid: "متوسط",
      senior: "خبير",
    };
    return labels[level] || level;
  };

  const getApplicationStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <div className={styles.container}>
        <UniversityStudentNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>جاري تحميل الوظائف...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <UniversityStudentNav />

      <main className={styles.main}>
        {/* Header Section */}
        <section className={styles.headerSection}>
          <div className={styles.headerContent}>
            <h1>فرص العمل والتدريب</h1>
            <p>اكتشف الفرص المناسبة لمهاراتك وطموحاتك المهنية</p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="ابحث عن وظيفة، شركة، أو مهارة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={() => {
                    setSearchQuery("");
                    fetchJobs();
                  }}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button type="submit" className={styles.searchButton}>
              بحث
            </button>
            <button
              type="button"
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> فلترة
            </button>
          </form>

          {showFilters && (
            <div className={styles.filtersPanel}>
              <div className={styles.filterGroup}>
                <label>نوع الوظيفة</label>
                <select
                  value={filters.job_type}
                  onChange={(e) =>
                    setFilters({ ...filters, job_type: e.target.value })
                  }
                >
                  <option value="all">الكل</option>
                  <option value="full_time">دوام كامل</option>
                  <option value="part_time">دوام جزئي</option>
                  <option value="internship">تدريب</option>
                  <option value="contract">عقد</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>مكان العمل</label>
                <select
                  value={filters.work_location}
                  onChange={(e) =>
                    setFilters({ ...filters, work_location: e.target.value })
                  }
                >
                  <option value="all">الكل</option>
                  <option value="onsite">حضور مكتبي</option>
                  <option value="remote">عن بُعد</option>
                  <option value="hybrid">هجين</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>مستوى الخبرة</label>
                <select
                  value={filters.experience_level}
                  onChange={(e) =>
                    setFilters({ ...filters, experience_level: e.target.value })
                  }
                >
                  <option value="all">الكل</option>
                  <option value="entry">مبتدئ</option>
                  <option value="junior">خبرة قليلة</option>
                  <option value="mid">متوسط</option>
                  <option value="senior">خبير</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.match_skills}
                    onChange={(e) =>
                      setFilters({ ...filters, match_skills: e.target.checked })
                    }
                  />
                  وظائف تناسب مهاراتي
                </label>
              </div>
            </div>
          )}
        </section>

        {/* Jobs List */}
        <section className={styles.jobsSection}>
          {jobs.length === 0 ? (
            <div className={styles.emptyState}>
              <FaBriefcase className={styles.emptyIcon} />
              <h3>لا توجد وظائف متاحة</h3>
              <p>جرب تغيير معايير البحث أو الفلترة</p>
            </div>
          ) : (
            <div className={styles.jobsList}>
              {jobs.map((job) => (
                <div key={job.id} className={styles.jobCard}>
                  <div className={styles.jobHeader}>
                    <div className={styles.companyInfo}>
                      {job.company.logo ? (
                        <Image
                          src={job.company.logo}
                          alt={job.company.name}
                          width={60}
                          height={60}
                          className={styles.companyLogo}
                        />
                      ) : (
                        <div className={styles.logoPlaceholder}>
                          <FaBuilding />
                        </div>
                      )}
                      <div>
                        <h3>{job.title}</h3>
                        <div className={styles.companyDetails}>
                          <span className={styles.companyName}>
                            {job.company.name}
                            {job.company.is_verified && (
                              <FaCheckCircle className={styles.verifiedIcon} />
                            )}
                          </span>
                          <span className={styles.separator}>•</span>
                          <span>{job.company.industry}</span>
                        </div>
                      </div>
                    </div>
                    {job.has_applied && (
                      <div
                        className={styles.applicationStatus}
                        style={{
                          color: getApplicationStatusColor(
                            job.application_status || ""
                          ),
                        }}
                      >
                        تم التقديم
                      </div>
                    )}
                  </div>

                  <div className={styles.jobDetails}>
                    <div className={styles.jobMeta}>
                      <span className={styles.metaItem}>
                        <FaBriefcase />
                        {getJobTypeLabel(job.job_type)}
                      </span>
                      <span className={styles.metaItem}>
                        <FaMapMarkerAlt />
                        {getWorkLocationLabel(job.work_location)}
                        {job.location && ` - ${job.location}`}
                      </span>
                      <span className={styles.metaItem}>
                        <FaGraduationCap />
                        {getExperienceLevelLabel(job.experience_level)}
                      </span>
                      {job.salary_range && (
                        <span className={styles.metaItem}>
                          💰 {job.salary_range}
                        </span>
                      )}
                    </div>

                    <p className={styles.jobDescription}>{job.description}</p>

                    {job.skills_required.length > 0 && (
                      <div className={styles.skillsList}>
                        {job.skills_required.slice(0, 5).map((skill, index) => (
                          <span key={index} className={styles.skillTag}>
                            {skill}
                          </span>
                        ))}
                        {job.skills_required.length > 5 && (
                          <span className={styles.moreSkills}>
                            +{job.skills_required.length - 5} أخرى
                          </span>
                        )}
                      </div>
                    )}

                    <div className={styles.jobFooter}>
                      <div className={styles.timeInfo}>
                        <FaClock />
                        <span>
                          {new Date(job.created_at).toLocaleDateString("ar-EG")}
                        </span>
                        {job.application_deadline && (
                          <>
                            <span className={styles.separator}>•</span>
                            <span className={styles.deadline}>
                              آخر موعد:{" "}
                              {new Date(
                                job.application_deadline
                              ).toLocaleDateString("ar-EG")}
                            </span>
                          </>
                        )}
                      </div>
                      <Link
                        href={`/university_student/jobs/${job.id}`}
                        className={`${styles.viewButton} ${
                          job.is_expired ? styles.expired : ""
                        }`}
                      >
                        {job.is_expired
                          ? "منتهية"
                          : job.has_applied
                          ? "عرض الطلب"
                          : "عرض التفاصيل"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
        </section>
      </main>
    </div>
  );
}