"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import UniversityStudentNav from "@/components/UniversityStudentNav/UniversityStudentNav";
import styles from "./JobDetails.module.css";
import {
  FaBuilding,
  FaBriefcase,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCheckCircle,
  FaArrowRight,
  FaGlobe,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "@/hooks/useLanguage";
interface JobDetails {
  id: number;
  title: string;
  company: {
    id: number;
    name: string;
    logo: string | null;
    industry: string;
    location: string;
    website: string | null;
    description: string | null;
    company_size: string;
    is_verified: boolean;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills_required: string[];
  skills_preferred: string[];
  job_type: string;
  work_location: string;
  location: string | null;
  salary_range: string | null;
  experience_level: string;
  education_requirement: string | null;
  faculties_preferred: string[] | null;
  positions_available: number;
  application_deadline: string | null;
  created_at: string;
  views_count: number;
  applications_count: number;
  has_applied: boolean;
  application: {
    id: number;
    status: string;
    created_at: string;
  } | null;
  is_expired: boolean;
}

export default function JobDetailsPage() {
  const { t } = useLanguage();
  const params = useParams();
  const jobId = params? params.id as string:null;
  
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setJob(data.job);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!coverLetter.trim() || coverLetter.length < 50) {
      alert(t("universityStudent.coverLetterMinLength"));
      return;
    }

    setApplying(true);

    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/jobs/${jobId}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cover_letter: coverLetter }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(t("universityStudent.applicationSent"));
        fetchJobDetails();
        setShowApplicationForm(false);
      } else {
        alert(data.message || t("universityStudent.applicationError"));
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert(t("universityStudent.applicationError"));
    } finally {
      setApplying(false);
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

  const getCompanySizeLabel = (size: string) => {
    const labels: { [key: string]: string } = {
      "1-10": "1-10 موظفين",
      "11-50": "11-50 موظف",
      "51-200": "51-200 موظف",
      "201-500": "201-500 موظف",
      "500+": "أكثر من 500 موظف",
    };
    return labels[size] || size;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <UniversityStudentNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>t("universityStudent.loadingJobDetails")</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className={styles.container}>
        <UniversityStudentNav />
        <div className={styles.notFound}>
          <h2>t("universityStudent.jobNotFound")</h2>
          <Link href="/university_student/jobs" className={styles.backButton}>
            t("universityStudent.backToJobs")
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <UniversityStudentNav />

      <main className={styles.main}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/university_student/jobs">
            <FaArrowRight /> الوظائف
          </Link>
          <span>/</span>
          <span>{job.title}</span>
        </div>

        <div className={styles.content}>
          <div className={styles.mainContent}>
            {/* Job Header */}
            <div className={styles.jobHeader}>
              <h1>{job.title}</h1>
              <div className={styles.companyInfo}>
                {job.company.logo ? (
                  <Image
                    src={job.company.logo}
                    alt={job.company.name}
                    width={80}
                    height={80}
                    className={styles.companyLogo}
                  />
                ) : (
                  <div className={styles.logoPlaceholder}>
                    <FaBuilding />
                  </div>
                )}
                <div>
                  <h2>
                    {job.company.name}
                    {job.company.is_verified && (
                      <FaCheckCircle className={styles.verifiedIcon} />
                    )}
                  </h2>
                  <p>{job.company.industry} • {job.company.location}</p>
                </div>
              </div>

              <div className={styles.jobMeta}>
                <div className={styles.metaItem}>
                  <FaBriefcase />
                  <span>{getJobTypeLabel(job.job_type)}</span>
                </div>
                <div className={styles.metaItem}>
                  <FaMapMarkerAlt />
                  <span>
                    {getWorkLocationLabel(job.work_location)}
                    {job.location && ` - ${job.location}`}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <FaGraduationCap />
                  <span>{getExperienceLevelLabel(job.experience_level)}</span>
                </div>
                {job.salary_range && (
                  <div className={styles.metaItem}>
                    <span>{job.salary_range}</span>
                  </div>
                )}
              </div>

              <div className={styles.stats}>
                <span>{job.views_count} مشاهدة</span>
                <span>{job.applications_count} متقدم</span>
                <span>{job.positions_available} وظيفة متاحة</span>
              </div>

              {job.application_deadline && (
                <div className={styles.deadline}>
                  <FaCalendarAlt />
                  آخر موعد للتقديم:{" "}
                  {new Date(job.application_deadline).toLocaleDateString("ar-EG")}
                </div>
              )}

              {/* Action Buttons */}
              <div className={styles.actions}>
                {job.has_applied ? (
                  <div className={styles.appliedStatus}>
                    <FaCheckCircle />
                    <span>t("universityStudent.appliedSuccessfully")</span>
                  </div>
                ) : job.is_expired ? (
                  <div className={styles.expiredStatus}>
                    t("universityStudent.applicationPeriodEnded")
                  </div>
                ) : (
                  <button
                    className={styles.applyButton}
                    onClick={() => setShowApplicationForm(true)}
                  >
                    t("universityStudent.submitApplication")
                  </button>
                )}
              </div>
            </div>

            {/* Job Description */}
            <section className={styles.section}>
              <h3>t("universityStudent.jobDescription")</h3>
              <p>{job.description}</p>
            </section>

            {/* Responsibilities */}
            <section className={styles.section}>
              <h3>t("universityStudent.responsibilities")</h3>
              <ul>
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Requirements */}
            <section className={styles.section}>
              <h3>t("universityStudent.requirements")</h3>
              <ul>
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Skills */}
            <section className={styles.section}>
              <h3>t("universityStudent.requiredSkills")</h3>
              <div className={styles.skillsList}>
                {job.skills_required.map((skill, index) => (
                  <span key={index} className={styles.skill}>
                    {skill}
                  </span>
                ))}
              </div>

              {job.skills_preferred && job.skills_preferred.length > 0 && (
                <>
                  <h4>t("universityStudent.preferredSkills")</h4>
                  <div className={styles.skillsList}>
                    {job.skills_preferred.map((skill, index) => (
                      <span key={index} className={styles.skillPreferred}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* Education */}
            {(job.education_requirement || job.faculties_preferred) && (
              <section className={styles.section}>
                <h3>t("universityStudent.education")</h3>
                {job.education_requirement && <p>{job.education_requirement}</p>}
                {job.faculties_preferred && job.faculties_preferred.length > 0 && (
                  <div>
                    <h4>الكليات المفضلة:</h4>
                    <ul>
                      {job.faculties_preferred.map((faculty, index) => (
                        <li key={index}>{faculty}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.companyCard}>
              <h3>t("universityStudent.aboutCompany")</h3>
              {job.company.description && (
                <p>{job.company.description}</p>
              )}
              <div className={styles.companyDetails}>
                <div className={styles.detail}>
                  <FaBuilding />
                  <span>{job.company.industry}</span>
                </div>
                <div className={styles.detail}>
                  <FaUsers />
                  <span>{getCompanySizeLabel(job.company.company_size)}</span>
                </div>
                <div className={styles.detail}>
                  <FaMapMarkerAlt />
                  <span>{job.company.location}</span>
                </div>
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.companyWebsite}
                  >
                    <FaGlobe />
                    t("universityStudent.visitWebsite")
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Application Modal */}
        {showApplicationForm && !job.has_applied && !job.is_expired && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>t("universityStudent.applicationFormTitle")</h2>
              <p>t("universityStudent.applicationFormDesc")</p>
              <textarea
                className={styles.coverLetterInput}
                placeholder="t("universityStudent.coverLetterPlaceholder")"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={10}
                required
                minLength={50}
              />
              <p className={styles.charCount}>
                {coverLetter.length} حرف (الحد الأدنى 50 حرف)
              </p>
              <div className={styles.modalActions}>
                <button
                  className={styles.submitButton}
                  onClick={handleApply}
                  disabled={applying || coverLetter.length < 50}
                >
                  {applying ? "t("universityStudent.sending")" : "t("universityStudent.sendApplication")"}
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowApplicationForm(false);
                    setCoverLetter("");
                  }}
                  disabled={applying}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}