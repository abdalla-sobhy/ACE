"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CompanyNav from "@/components/CompanyNav/CompanyNav";
import styles from "./ApplicationDetails.module.css";
import {
  FaArrowRight,
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaGraduationCap,
  FaUniversity,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaDownload,
  FaStar,
  FaRegStar,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import Link from "next/link";

import { useLanguage } from "@/hooks/useLanguage";
interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  faculty: string | null;
  university: string | null;
  year_of_study: number | null;
  gpa: number | null;
  bio: string | null;
  skills: string[];
  languages: Array<{ name: string; proficiency: string }>;
  experience: Array<{ title: string; company: string; duration: string; description: string }>;
  projects: Array<{ name: string; description: string; url?: string }>;
  certifications: Array<{ name: string; issuer: string; date: string }>;
  achievements: string[];
  cv_available: boolean;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
}

interface Job {
  id: number;
  title: string;
  description: string;
  job_type: string;
  work_location: string;
  location: string | null;
  salary_range: string | null;
  experience_level: string;
}

interface StatusHistoryItem {
  status: string;
  changed_at: string;
  notes: string | null;
}

interface Application {
  id: number;
  cover_letter: string;
  status: string;
  status_color: string;
  status_history: StatusHistoryItem[];
  company_notes: string | null;
  viewed_at: string | null;
  is_favorite: boolean;
  interview_date: string | null;
  interview_location: string | null;
  interview_notes: string | null;
  created_at: string;
  updated_at: string;
  student: Student;
  job: Job;
}

export default function ApplicationDetailsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  useEffect(() => {
    checkAuth();
    if (applicationId) {
      fetchApplicationDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

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

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/applications/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Parse JSON string fields to arrays
        const application = data.application;
        if (application && application.student) {
          const student = application.student;

          // Helper function to safely parse JSON strings
          const parseJsonField = (field: unknown, fallback: unknown[] = []) => {
            if (Array.isArray(field)) return field;
            if (typeof field === 'string') {
              try {
                return JSON.parse(field);
              } catch {
                return fallback;
              }
            }
            return fallback;
          };

          // Parse all JSON string fields
          student.skills = parseJsonField(student.skills, []);
          student.languages = parseJsonField(student.languages, []);
          student.experience = parseJsonField(student.experience, []);
          student.projects = parseJsonField(student.projects, []);
          student.certifications = parseJsonField(student.certifications, []);
          student.achievements = parseJsonField(student.achievements, []);
        }

        setApplication(data.application);
      } else {
        setError(t("companyApplications.loadError"));
      }
    } catch (error) {
      console.error("Error fetching application details:", error);
      setError(t("companyApplications.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;

    try {
      setUpdating(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const payload: {
        status: string;
        notes?: string;
        interview_date?: string;
        interview_location?: string;
        interview_notes?: string;
      } = {
        status: selectedStatus,
        notes: statusNotes || undefined,
      };

      if (selectedStatus === "interviewed") {
        if (!interviewDate || !interviewLocation) {
          alert(t("companyApplications.interviewDetailsRequired"));
          return;
        }
        payload.interview_date = interviewDate;
        payload.interview_location = interviewLocation;
        payload.interview_notes = interviewNotes || undefined;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setShowStatusModal(false);
        setSelectedStatus("");
        setStatusNotes("");
        setInterviewDate("");
        setInterviewLocation("");
        setInterviewNotes("");
        fetchApplicationDetails();
      } else {
        alert(t("companyApplications.statusUpdateError"));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert(t("companyApplications.statusUpdateError"));
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/applications/${applicationId}/favorite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        fetchApplicationDetails();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDownloadCV = async () => {
    if (!application?.student.cv_available) return;

    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/students/${application.student.id}/cv`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `CV_${application.student.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: t("companyApplications.pending"),
      reviewing: t("companyApplications.reviewing"),
      shortlisted: t("companyApplications.shortlisted"),
      interviewed: t("companyApplications.interviewed"),
      accepted: t("companyApplications.accepted"),
      rejected: t("companyApplications.rejected"),
    };
    return labels[status] || status;
  };

  const getJobTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      full_time: t("companyJobs.fullTime"),
      part_time: t("companyJobs.partTime"),
      internship: t("companyJobs.internship"),
      contract: t("companyJobs.contract"),
    };
    return labels[type] || type;
  };

  const getWorkLocationLabel = (location: string) => {
    const labels: { [key: string]: string } = {
      onsite: t("companyJobs.onsite"),
      remote: t("companyJobs.remote"),
      hybrid: t("companyJobs.hybrid"),
    };
    return labels[location] || location;
  };

  const getExperienceLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      entry: t("companyJobs.entry"),
      junior: t("companyJobs.junior"),
      mid: t("companyJobs.mid"),
      senior: t("companyJobs.senior"),
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <CompanyNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className={styles.container}>
        <CompanyNav />
        <div className={styles.errorContainer}>
          <p>{error || t("companyApplications.loadError")}</p>
          <Link href="/company/dashboard" className={styles.backButton}>
            {t("companyApplications.backToDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CompanyNav />

      <main className={styles.main}>
        <div className={styles.header}>
          <Link href="/company/dashboard" className={styles.backLink}>
            <FaArrowRight /> {t("common.back")}
          </Link>
          <div className={styles.headerActions}>
            <button
              onClick={handleToggleFavorite}
              className={`${styles.favoriteButton} ${
                application.is_favorite ? styles.favorited : ""
              }`}
            >
              {application.is_favorite ? <FaStar /> : <FaRegStar />}
              {application.is_favorite ? t("companyApplications.removeFromFavorites") : t("companyApplications.addToFavorites")}
            </button>
          </div>
        </div>

        <div className={styles.contentGrid}>
          {/* Left Column - Student Info & Application Details */}
          <div className={styles.leftColumn}>
            {/* Student Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>{t("companyApplications.applicantInfo")}</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.studentInfo}>
                  <h3>{application.student.name}</h3>

                  <div className={styles.infoGrid}>
                    {application.student.email && (
                      <div className={styles.infoItem}>
                        <FaEnvelope />
                        <span>{application.student.email}</span>
                      </div>
                    )}
                    {application.student.phone && (
                      <div className={styles.infoItem}>
                        <FaPhone />
                        <span>{application.student.phone}</span>
                      </div>
                    )}
                    {application.student.university && (
                      <div className={styles.infoItem}>
                        <FaUniversity />
                        <span>{application.student.university}</span>
                      </div>
                    )}
                    {application.student.faculty && (
                      <div className={styles.infoItem}>
                        <FaGraduationCap />
                        <span>{application.student.faculty}</span>
                      </div>
                    )}
                    {application.student.year_of_study && (
                      <div className={styles.infoItem}>
                        <FaClock />
                        <span>{t("companyApplications.year")} {application.student.year_of_study}</span>
                      </div>
                    )}
                    {application.student.gpa && (
                      <div className={styles.infoItem}>
                        <FaCheckCircle />
                        <span>{t("companyApplications.gpa")} {application.student.gpa}</span>
                      </div>
                    )}
                  </div>

                  {application.student.bio && (
                    <div className={styles.bioSection}>
                      <h4>{t("companyApplications.bio")}</h4>
                      <p>{application.student.bio}</p>
                    </div>
                  )}

                  <div className={styles.socialLinks}>
                    {application.student.linkedin_url && (
                      <a
                        href={application.student.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        <FaLinkedin /> LinkedIn
                      </a>
                    )}
                    {application.student.github_url && (
                      <a
                        href={application.student.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        <FaGithub /> GitHub
                      </a>
                    )}
                    {application.student.portfolio_url && (
                      <a
                        href={application.student.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        <FaGlobe /> Portfolio
                      </a>
                    )}
                  </div>

                  {application.student.cv_available && (
                    <button
                      onClick={handleDownloadCV}
                      className={styles.downloadButton}
                    >
                      <FaDownload /> {t("companyApplications.downloadCV")}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            {application.student.skills && application.student.skills.length > 0 && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{t("companyApplications.skills")}</h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.skillsGrid}>
                    {application.student.skills.map((skill, index) => (
                      <span key={index} className={styles.skillBadge}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Languages */}
            {application.student.languages && application.student.languages.length > 0 && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{t("companyApplications.languages")}</h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.languagesList}>
                    {application.student.languages.map((lang, index) => (
                      <div key={index} className={styles.languageItem}>
                        <span className={styles.languageName}>{lang.name}</span>
                        <span className={styles.languageProficiency}>
                          {lang.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Experience */}
            {application.student.experience && application.student.experience.length > 0 && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{t("companyApplications.experience")}</h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.experienceList}>
                    {application.student.experience.map((exp, index) => (
                      <div key={index} className={styles.experienceItem}>
                        <h4>{exp.title}</h4>
                        <p className={styles.company}>{exp.company}</p>
                        <p className={styles.duration}>{exp.duration}</p>
                        <p className={styles.description}>{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Projects */}
            {application.student.projects && application.student.projects.length > 0 && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{t("companyApplications.projects")}</h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.projectsList}>
                    {application.student.projects.map((project, index) => (
                      <div key={index} className={styles.projectItem}>
                        <h4>{project.name}</h4>
                        <p className="text-[#8b949e]">{project.description}</p>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.projectLink}
                          >
                            {t("companyApplications.viewProject")}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Certifications */}
            {application.student.certifications &&
              application.student.certifications.length > 0 && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>{t("companyApplications.certifications")}</h3>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.certificationsList}>
                      {application.student.certifications.map((cert, index) => (
                        <div key={index} className={styles.certificationItem}>
                          <h4>{cert.name}</h4>
                          <p className="text-[#8b949e]">{cert.issuer}</p>
                          <p className={styles.certDate}>{cert.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Right Column - Application Info & Status */}
          <div className={styles.rightColumn}>
            {/* Status Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{t("companyApplications.applicationStatus")}</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.statusInfo}>
                  <div
                    className={styles.currentStatus}
                    style={{ color: application.status_color }}
                  >
                    {getStatusLabel(application.status)}
                  </div>

                  <button
                    onClick={() => setShowStatusModal(true)}
                    className={styles.updateStatusButton}
                  >
                    {t("companyApplications.updateStatus")}
                  </button>

                  <div className={styles.statusMetadata}>
                    <div className={styles.metadataItem}>
                      <strong>{t("companyApplications.applicationDate")}</strong>
                      <span>
                        {new Date(application.created_at).toLocaleDateString(
                          "ar-EG",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    {application.viewed_at && (
                      <div className={styles.metadataItem}>
                        <strong>{t("companyApplications.viewedDate")}</strong>
                        <span>
                          {new Date(application.viewed_at).toLocaleDateString(
                            "ar-EG"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Details */}
            {application.interview_date && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{t("companyApplications.interviewDetails")}</h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.interviewDetails}>
                    <div className={styles.infoItem}>
                      <FaCalendarAlt />
                      <span>
                        {new Date(application.interview_date).toLocaleDateString(
                          "ar-EG",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                    {application.interview_location && (
                      <div className={styles.infoItem}>
                        <FaMapMarkerAlt />
                        <span>{application.interview_location}</span>
                      </div>
                    )}
                    {application.interview_notes && (
                      <div className={styles.notesSection}>
                        <strong>{t("companyApplications.notes")}</strong>
                        <p>{application.interview_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Job Info */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{t("company.jobDetails")}</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.jobInfo}>
                  <h4>{application.job.title}</h4>
                  <div className={styles.jobMetadata}>
                    <span className={styles.badge}>
                      {getJobTypeLabel(application.job.job_type)}
                    </span>
                    <span className={styles.badge}>
                      {getWorkLocationLabel(application.job.work_location)}
                    </span>
                    <span className={styles.badge}>
                      {getExperienceLevelLabel(application.job.experience_level)}
                    </span>
                  </div>
                  {application.job.location && (
                    <div className={styles.infoItem}>
                      <FaMapMarkerAlt />
                      <span>{application.job.location}</span>
                    </div>
                  )}
                  {application.job.salary_range && (
                    <div className={styles.infoItem}>
                      <FaBriefcase />
                      <span>{application.job.salary_range}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{t("companyApplications.coverLetter")}</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.coverLetter}>
                  <p>{application.cover_letter}</p>
                </div>
              </div>
            </div>

            {/* Status History */}
            {application.status_history && application.status_history.length > 0 && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{t("companyApplications.statusHistory")}</h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.statusHistory}>
                    {application.status_history.map((item, index) => (
                      <div key={index} className={styles.historyItem}>
                        <div className={styles.historyStatus}>
                          {getStatusLabel(item.status)}
                        </div>
                        <div className={styles.historyDate}>
                          {new Date(item.changed_at).toLocaleDateString("en-EG")}
                        </div>
                        {item.notes && (
                          <div className={styles.historyNotes}>{item.notes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Company Notes */}
            {application.company_notes && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{t("companyApplications.companyNotes")}</h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.companyNotes}>
                    <p>{application.company_notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{t("companyApplications.updateApplicationStatus")}</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className={styles.closeButton}
              >
                &times;
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label>{t("companyApplications.newStatus")}</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={styles.select}
                >
                  <option value="">{t("companyApplications.selectStatus")}</option>
                  <option value="reviewing">{t("companyApplications.reviewing")}</option>
                  <option value="shortlisted">{t("companyApplications.shortlisted")}</option>
                  <option value="interviewed">{t("companyApplications.interviewed")}</option>
                  <option value="accepted">{t("companyApplications.accepted")}</option>
                  <option value="rejected">{t("companyApplications.rejected")}</option>
                </select>
              </div>

              {selectedStatus === "interviewed" && (
                <>
                  <div className={styles.formGroup}>
                    <label>{t("companyApplications.interviewDateTime")}</label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>{t("companyApplications.interviewLocation")}</label>
                    <input
                      type="text"
                      value={interviewLocation}
                      onChange={(e) => setInterviewLocation(e.target.value)}
                      className={styles.input}
                      placeholder={t("companyApplications.interviewLocationPlaceholder")}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>{t("companyApplications.interviewNotes")}</label>
                    <textarea
                      value={interviewNotes}
                      onChange={(e) => setInterviewNotes(e.target.value)}
                      className={styles.textarea}
                      placeholder={t("companyApplications.interviewNotesPlaceholder")}
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className={styles.formGroup}>
                <label>{t("companyApplications.notesOptional")}</label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className={styles.textarea}
                  placeholder={t("companyApplications.addNotesPlaceholder")}
                  rows={4}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || !selectedStatus}
                  className={styles.submitButton}
                >
                  {updating ? t("common.updating") : t("common.update")}
                </button>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className={styles.cancelButton}
                >
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
