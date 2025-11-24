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

import { useLanguage } from "@/hooks/useLanguage";
interface Company {
  id: number;
  name: string;
  logo: string | null;
  industry: string;
  location: string;
  is_verified: boolean;
}

interface Job {
  id: number | string;
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
  source?: string;
  external_url?: string;
  publisher?: string;
}

export default function UniversityJobs() {
  const { t } = useLanguage();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    job_type: "all",
    work_location: "all",
    experience_level: "all",
    match_skills: false,
    job_source: "both",
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
      job_source: filters.job_source,
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
          <p>{t("universityStudent.loadingJobs")}</p>
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
            <h1>{t("universityStudent.jobsAndTraining")}</h1>
            <p>{t("universityStudent.discoverOpportunities")}</p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder={t("universityStudent.searchForJob")}
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
              {t("universityStudent.search")}
            </button>
            <button
              type="button"
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> {t("universityStudent.filter")}
            </button>
          </form>

          {showFilters && (
            <div className={styles.filtersPanel}>
              <div className={styles.filterGroup}>
                <label>{t("universityStudent.jobSource")}</label>
                <select
                  value={filters.job_source}
                  onChange={(e) =>
                    setFilters({ ...filters, job_source: e.target.value })
                  }
                >
                  <option value="both">{t("universityStudent.allJobs")}</option>
                  <option value="platform">{t("universityStudent.platformJobs")}</option>
                  <option value="external">{t("universityStudent.externalJobs")}</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>{t("company.jobType")}</label>
                <select
                  value={filters.job_type}
                  onChange={(e) =>
                    setFilters({ ...filters, job_type: e.target.value })
                  }
                >
                  <option value="all">{t("common.all")}</option>
                  <option value="full_time">{t("universityStudent.fullTime")}</option>
                  <option value="part_time">{t("universityStudent.partTime")}</option>
                  <option value="internship">{t("universityStudent.internship")}</option>
                  <option value="contract">{t("universityStudent.contract")}</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>{t("universityStudent.workLocation")}</label>
                <select
                  value={filters.work_location}
                  onChange={(e) =>
                    setFilters({ ...filters, work_location: e.target.value })
                  }
                >
                  <option value="all">{t("common.all")}</option>
                  <option value="onsite">{t("universityStudent.onsite")}</option>
                  <option value="remote">{t("universityStudent.remote")}</option>
                  <option value="hybrid">{t("universityStudent.hybrid")}</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>{t("universityStudent.experienceLevel")}</label>
                <select
                  value={filters.experience_level}
                  onChange={(e) =>
                    setFilters({ ...filters, experience_level: e.target.value })
                  }
                >
                  <option value="all">{t("common.all")}</option>
                  <option value="entry">{t("universityStudent.entry")}</option>
                  <option value="junior">{t("universityStudent.junior")}</option>
                  <option value="mid">{t("universityStudent.mid")}</option>
                  <option value="senior">{t("universityStudent.senior")}</option>
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
                  {t("universityStudent.jobsMatchingSkills")}
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
              <h3>{t("universityStudent.noJobsAvailable")}</h3>
              <p>{t("universityStudent.tryChangingFilters")}</p>
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
                        <h3>
                          {job.title}
                          {job.source === 'external' && (
                            <span className={styles.externalBadge}>
                              {t("universityStudent.external")}
                            </span>
                          )}
                        </h3>
                        <div className={styles.companyDetails}>
                          <span className={styles.companyName}>
                            {job.company.name}
                            {job.company.is_verified && (
                              <FaCheckCircle className={styles.verifiedIcon} />
                            )}
                          </span>
                          {job.company.industry && (
                            <>
                              <span className={styles.separator}>•</span>
                              <span>{job.company.industry}</span>
                            </>
                          )}
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
                        {t("universityStudent.applied")}
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
                            +{job.skills_required.length - 5} {t("universityStudent.moreSkills")}
                          </span>
                        )}
                      </div>
                    )}

                    <div className={styles.jobFooter}>
                      <div className={styles.timeInfo}>
                        <FaClock />
                        <span>
                          {new Date(job.created_at).toLocaleDateString("en-EG")}
                        </span>
                        {job.application_deadline && (
                          <>
                            <span className={styles.separator}>•</span>
                            <span className={styles.deadline}>
                              {t("universityStudent.lastDate")}{" "}
                              {new Date(
                                job.application_deadline
                              ).toLocaleDateString("en-EG")}
                            </span>
                          </>
                        )}
                      </div>
                      {job.source === 'external' && job.external_url ? (
                        <a
                          href={job.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewButton}
                        >
                          {t("universityStudent.applyExternal")}
                        </a>
                      ) : (
                        <Link
                          href={`/university_student/jobs/${job.id}`}
                          className={`${styles.viewButton} ${
                            job.is_expired ? styles.expired : ""
                          }`}
                        >
                          {job.is_expired
                            ? t("universityStudent.expired")
                            : job.has_applied
                            ? t("universityStudent.viewApplication")
                            : t("universityStudent.viewDetails")}
                        </Link>
                      )}
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
                {t("universityStudent.previous")}
              </button>
              <span className={styles.pageInfo}>
                {t("universityStudent.pageOf")} {currentPage} {t("universityStudent.of")} {totalPages}
              </span>
                            <button
                className={styles.pageButton}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                {t("universityStudent.next")}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}