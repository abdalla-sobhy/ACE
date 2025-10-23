"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import UniversityStudentNav from "@/components/UniversityStudentNav/UniversityStudentNav";
import styles from "./UniversityProfile.module.css";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaUpload,
  FaFilePdf,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaPlus,
  FaTrash,
  FaGraduationCap,
  FaBriefcase,
  FaTrophy,
  FaLanguage,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

interface UniversityProfile {
  faculty: string;
  goal: string;
  university?: string;
  year_of_study?: number;
  gpa?: number;
  skills?: string[];
  cv_path?: string;
  cv_filename?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  bio?: string;
  achievements?: string[];
  languages?: Array<{
    name: string;
    level: string;
  }>;
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  is_public?: boolean;
  looking_for_opportunities?: boolean;
  preferred_job_types?: string[];
  available_from?: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_picture?: string;
}

export default function UniversityStudentProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UniversityProfile>({
    faculty: "",
    goal: "",
    skills: [],
    achievements: [],
    languages: [],
    experience: [],
    projects: [],
    certifications: [],
    is_public: false,
    looking_for_opportunities: false,
    preferred_job_types: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "experience" | "education" | "skills"
  >("overview");

  useEffect(() => {
    checkAuth();
    fetchProfile();
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
    const parsedAuth = JSON.parse(authData);

    if (new Date(parsedAuth.expiresAt) < new Date()) {
      localStorage.removeItem("user");
      localStorage.removeItem("authData");
      router.push("/login");
      return;
    }

    if (parsedUser.type !== "university_student") {
      router.push("/");
      return;
    }

    setUser(parsedUser);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/profile`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        }
      );

      if (response.ok) {
        setIsEditing(false);
        alert("تم حفظ الملف الشخصي بنجاح");
      } else {
        alert("حدث خطأ في حفظ الملف الشخصي");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("حدث خطأ في حفظ الملف الشخصي");
    } finally {
      setSaving(false);
    }
  };

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      alert("يرجى رفع ملف PDF أو Word");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الملف يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    try {
      setUploadingCV(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const formData = new FormData();
      formData.append("cv", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/upload-cv`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfile({
          ...profile,
          cv_path: data.cv_path,
          cv_filename: file.name,
        });
      } else {
        alert("حدث خطأ في رفع السيرة الذاتية");
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("حدث خطأ في رفع السيرة الذاتية");
    } finally {
      setUploadingCV(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    const skills = [...(profile.skills || [])];
    skills.splice(index, 1);
    setProfile({ ...profile, skills });
  };

  const handleAddLanguage = () => {
  setProfile({
    ...profile,
    languages: [
      ...(profile.languages || []),
      { name: "", level: "" },
    ],
  });
};

const handleUpdateLanguage = (index: number, field: string, value: string) => {
  const languages = [...(profile.languages || [])];
  languages[index] = { ...languages[index], [field]: value };
  setProfile({ ...profile, languages });
};

const handleRemoveLanguage = (index: number) => {
  const languages = [...(profile.languages || [])];
  languages.splice(index, 1);
  setProfile({ ...profile, languages });
};

const handleAddCertification = () => {
  setProfile({
    ...profile,
    certifications: [
      ...(profile.certifications || []),
      { name: "", issuer: "", date: "" },
    ],
  });
};

const handleUpdateCertification = (index: number, field: string, value: string) => {
  const certifications = [...(profile.certifications || [])];
  certifications[index] = { ...certifications[index], [field]: value };
  setProfile({ ...profile, certifications });
};

const handleRemoveCertification = (index: number) => {
  const certifications = [...(profile.certifications || [])];
  certifications.splice(index, 1);
  setProfile({ ...profile, certifications });
};

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setProfile({
        ...profile,
        achievements: [...(profile.achievements || []), newAchievement.trim()],
      });
      setNewAchievement("");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    const achievements = [...(profile.achievements || [])];
    achievements.splice(index, 1);
    setProfile({ ...profile, achievements });
  };

  const handleAddExperience = () => {
    setProfile({
      ...profile,
      experience: [
        ...(profile.experience || []),
        { title: "", company: "", duration: "", description: "" },
      ],
    });
  };

  const handleUpdateExperience = (
    index: number,
    field: string,
    value: string
  ) => {
    const experience = [...(profile.experience || [])];
    experience[index] = { ...experience[index], [field]: value };
    setProfile({ ...profile, experience });
  };

  const handleRemoveExperience = (index: number) => {
    const experience = [...(profile.experience || [])];
    experience.splice(index, 1);
    setProfile({ ...profile, experience });
  };

  const handleAddProject = () => {
    setProfile({
      ...profile,
      projects: [
        ...(profile.projects || []),
        { name: "", description: "", link: "" },
      ],
    });
  };

  const handleUpdateProject = (index: number, field: string, value: string) => {
    const projects = [...(profile.projects || [])];
    projects[index] = { ...projects[index], [field]: value };
    setProfile({ ...profile, projects });
  };

  const handleRemoveProject = (index: number) => {
    const projects = [...(profile.projects || [])];
    projects.splice(index, 1);
    setProfile({ ...profile, projects });
  };

  const getProfileCompleteness = () => {
    let completed = 0;
    const checks = [
      profile.faculty,
      profile.goal,
      profile.university,
      profile.year_of_study,
      profile.gpa,
      profile.skills && profile.skills.length > 0,
      profile.cv_path,
      profile.bio,
      profile.linkedin_url || profile.github_url || profile.portfolio_url,
      profile.languages && profile.languages.length > 0,
    ];

    checks.forEach((check) => {
      if (check) completed++;
    });

    return Math.round((completed / checks.length) * 100);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <UniversityStudentNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <UniversityStudentNav />

      <main className={styles.main}>
        {/* Profile Header */}
        <section className={styles.profileHeader}>
          <div className={styles.headerBackground} />
          <div className={styles.headerContent}>
            <div className={styles.profilePicture}>
              <FaUser />
            </div>
            <div className={styles.profileInfo}>
              <h1>
                {user?.first_name} {user?.last_name}
              </h1>
              <p className={styles.profileTitle}>
                {profile.faculty || "طالب جامعي"} •{" "}
                {profile.university || "الجامعة"}
              </p>
              <div className={styles.profileMeta}>
                <span>
                  <FaMapMarkerAlt /> مصر
                </span>
                <span>
                  <FaEnvelope /> {user?.email}
                </span>
                {user?.phone && (
                  <span>
                    <FaPhone /> {user?.phone}
                  </span>
                )}
              </div>
              <div className={styles.profileActions}>
                {!isEditing ? (
                  <button
                    className={styles.editButton}
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit /> تعديل الملف الشخصي
                  </button>
                ) : (
                  <>
                    <button
                      className={styles.saveButton}
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      <FaSave /> {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={() => setIsEditing(false)}
                    >
                      <FaTimes /> إلغاء
                    </button>
                  </>
                )}
                <button
                  className={`${styles.visibilityButton} ${
                    profile.is_public ? styles.public : ""
                  }`}
                  onClick={() =>
                    setProfile({ ...profile, is_public: !profile.is_public })
                  }
                >
                  {profile.is_public ? <FaEye /> : <FaEyeSlash />}
                  {profile.is_public ? "ملف عام" : "ملف خاص"}
                </button>
              </div>
            </div>
            <div className={styles.profileStats}>
              <div className={styles.statBox}>
                <h3>{getProfileCompleteness()}%</h3>
                <p>اكتمال الملف</p>
              </div>
              <div className={styles.statBox}>
                <h3>{profile.year_of_study || "-"}</h3>
                <p>السنة الدراسية</p>
              </div>
              <div className={styles.statBox}>
                <h3>{profile.gpa || "-"}</h3>
                <p>المعدل التراكمي</p>
              </div>
            </div>
          </div>
        </section>

        {/* Status Banner */}
        {profile.looking_for_opportunities && (
          <div className={styles.statusBanner}>
            <FaBriefcase />
            <span>أبحث عن فرص عمل أو تدريب</span>
            {profile.available_from && (
              <span className={styles.availability}>
                متاح من: {profile.available_from}
              </span>
            )}
          </div>
        )}

        {/* Profile Tabs */}
        <div className={styles.profileTabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "overview" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            نظرة عامة
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "experience" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("experience")}
          >
            الخبرات
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "education" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("education")}
          >
            التعليم والشهادات
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "skills" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("skills")}
          >
            المهارات
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === "overview" && (
            <div className={styles.overviewTab}>
              {/* Bio Section */}
              <div className={styles.section}>
                <h2>نبذة عني</h2>
                {isEditing ? (
                  <textarea
                    className={styles.bioInput}
                    placeholder="اكتب نبذة عن نفسك..."
                    value={profile.bio || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={5}
                  />
                ) : (
                  <p className={styles.bio}>
                    {profile.bio || "لم يتم إضافة نبذة بعد"}
                  </p>
                )}
              </div>

              {/* Career Goal Section */}
              <div className={styles.section}>
                <h2>الهدف المهني</h2>
                {isEditing ? (
                  <textarea
                    className={styles.input}
                    placeholder="ما هو هدفك المهني؟"
                    value={profile.goal || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, goal: e.target.value })
                    }
                    rows={3}
                  />
                ) : (
                  <p>{profile.goal === "career_preparation"
                    ? "الاستعداد المهني والتوظيف"
                    : profile.goal === "skill_development"
                    ? "تطوير المهارات المهنية"
                    : profile.goal === "academic_excellence"
                    ? "التفوق الأكاديمي"
                    : profile.goal === "research"
                    ? "البحث العلمي"
                    : profile.goal === "entrepreneurship"
                    ? "ريادة الأعمال"
                    : profile.goal === "graduate_studies"
                    ? "التحضير للدراسات العليا"
                    : profile.goal || "لم يتم تحديد هدف مهني بعد"}</p>
                )}
              </div>

              {/* CV Upload Section */}
              <div className={styles.section}>
                <h2>السيرة الذاتية</h2>
                <div className={styles.cvSection}>
                  {profile.cv_path ? (
                    <div className={styles.cvUploaded}>
                      <FaFilePdf className={styles.cvIcon} />
                      <div className={styles.cvInfo}>
                        <p>{profile.cv_filename || "السيرة الذاتية"}</p>
                        <div className={styles.cvActions}>
                          
                          {isEditing && (
                            <button
                              className={styles.replaceButton}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <FaUpload /> استبدال
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.cvUpload}>
                      <FaUpload className={styles.uploadIcon} />
                      <p>لم يتم رفع سيرة ذاتية بعد</p>
                      {isEditing && (
                        <button
                          className={styles.uploadButton}
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingCV}
                        >
                          {uploadingCV ? "جاري الرفع..." : "رفع السيرة الذاتية"}
                        </button>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCVUpload}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className={styles.section}>
                <h2>روابط التواصل</h2>
                <div className={styles.socialLinks}>
                  {isEditing ? (
                    <>
                      <div className={styles.linkInput}>
                        <FaLinkedin />
                        <input
                          type="url"
                          placeholder="رابط LinkedIn"
                          value={profile.linkedin_url || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              linkedin_url: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className={styles.linkInput}>
                        <FaGithub />
                        <input
                          type="url"
                          placeholder="رابط GitHub"
                          value={profile.github_url || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              github_url: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className={styles.linkInput}>
                        <FaGlobe />
                        <input
                          type="url"
                          placeholder="رابط الموقع الشخصي"
                          value={profile.portfolio_url || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              portfolio_url: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <div className={styles.socialButtons}>
                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialButton}
                        >
                          <FaLinkedin /> LinkedIn
                        </a>
                      )}
                      {profile.github_url && (
                        <a
                          href={profile.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialButton}
                        >
                          <FaGithub /> GitHub
                        </a>
                      )}
                      {profile.portfolio_url && (
                        <a
                          href={profile.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialButton}
                        >
                          <FaGlobe /> Portfolio
                        </a>
                      )}
                      {!profile.linkedin_url &&
                        !profile.github_url &&
                        !profile.portfolio_url && <p>لم يتم إضافة روابط بعد</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div className={styles.experienceTab}>
              {/* Experience Section */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>الخبرات العملية</h2>
                  {isEditing && (
                    <button
                      className={styles.addButton}
                      onClick={handleAddExperience}
                    >
                      <FaPlus /> إضافة خبرة
                    </button>
                  )}
                </div>
                {profile.experience && profile.experience.length > 0 ? (
                  <div className={styles.experienceList}>
                    {profile.experience.map((exp, index) => (
                      <div key={index} className={styles.experienceItem}>
                        {isEditing ? (
                          <>
                          <button
                              className={styles.deleteButton}
                              onClick={() => handleRemoveExperience(index)}
                            >
                              <FaTrash /> حذف
                            </button>
                            <input
                              className={styles.input}
                              placeholder="المسمى الوظيفي"
                              value={exp.title}
                              onChange={(e) =>
                                handleUpdateExperience(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              className={styles.input}
                              placeholder="اسم الشركة"
                              value={exp.company}
                              onChange={(e) =>
                                handleUpdateExperience(
                                  index,
                                  "company",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              className={styles.input}
                              placeholder="المدة (مثال: 2022 - 2023)"
                              value={exp.duration}
                              onChange={(e) =>
                                handleUpdateExperience(
                                  index,
                                  "duration",
                                  e.target.value
                                )
                              }
                            />
                            <textarea
                              className={styles.input}
                              placeholder="وصف الدور والمسؤوليات"
                              value={exp.description}
                              onChange={(e) =>
                                handleUpdateExperience(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={3}
                            />
                            
                          </>
                        ) : (
                          <>
                            <h3>{exp.title}</h3>
                            <p className={styles.company}>
                              {exp.company} • {exp.duration}
                            </p>
                            <p className={styles.description}>
                              {exp.description}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>لم يتم إضافة خبرات عملية بعد</p>
                )}
              </div>

              {/* Projects Section */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>المشاريع</h2>
                  {isEditing && (
                    <button
                      className={styles.addButton}
                      onClick={handleAddProject}
                    >
                      <FaPlus /> إضافة مشروع
                    </button>
                  )}
                </div>
                {profile.projects && profile.projects.length > 0 ? (
                  <div className={styles.projectsList}>
                    {profile.projects.map((project, index) => (
                      <div key={index} className={styles.projectItem}>
                        {isEditing ? (
                          <>
                          <button
                              className={styles.deleteButton}
                              onClick={() => handleRemoveProject(index)}
                            >
                              <FaTrash /> حذف
                            </button>
                            <input
                              className={styles.input}
                              placeholder="اسم المشروع"
                              value={project.name}
                              onChange={(e) =>
                                handleUpdateProject(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                            <textarea
                              className={styles.input}
                              placeholder="وصف المشروع"
                              value={project.description}
                              onChange={(e) =>
                                handleUpdateProject(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={2}
                            />
                            <input
                              className={styles.input}
                              placeholder="رابط المشروع (اختياري)"
                              value={project.link || ""}
                              onChange={(e) =>
                                handleUpdateProject(
                                  index,
                                  "link",
                                  e.target.value
                                )
                              }
                            />
                            
                          </>
                        ) : (
                          <>
                            <h3>{project.name}</h3>
                            <p>{project.description}</p>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.projectLink}
                              >
                                <FaGlobe /> عرض المشروع
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>لم يتم إضافة مشاريع بعد</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className={styles.educationTab}>
              {/* Education Info */}
              <div className={styles.section}>
                <h2>المعلومات الأكاديمية</h2>
                {isEditing ? (
                  <div className={styles.educationForm}>
                    <input
                      className={styles.input}
                      placeholder="الجامعة"
                      value={profile.university || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, university: e.target.value })
                      }
                    />
                    <input
                      className={styles.input}
                      placeholder="الكلية"
                      value={profile.faculty || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, faculty: e.target.value })
                      }
                    />
                    <input
                      className={styles.input}
                      type="number"
                      placeholder="السنة الدراسية"
                      min="1"
                      max="7"
                      value={profile.year_of_study || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          year_of_study: parseInt(e.target.value),
                        })
                      }
                    />
                    <input
                      className={styles.input}
                      type="number"
                      placeholder="المعدل التراكمي"
                      min="0"
                      max="4"
                      step="0.01"
                      value={profile.gpa || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          gpa: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                ) : (
                  <div className={styles.educationInfo}>
                    <p>
                      <FaBuilding />{" "}
                      {profile.university || "لم يتم تحديد الجامعة"}
                    </p>
                    <p>
                      <FaGraduationCap />{" "}
                      {profile.faculty || "لم يتم تحديد الكلية"}
                    </p>
                    <p>السنة الدراسية: {profile.year_of_study || "-"}</p>
                    <p>المعدل التراكمي: {profile.gpa || "-"}/4.0</p>
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div className={styles.section}>
                <h2>الإنجازات</h2>
                {isEditing && (
                  <div className={styles.addItem}>
                    <input
                      className={styles.input}
                      placeholder="أضف إنجاز..."
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddAchievement()
                      }
                    />
                    <button
                      className={styles.addButton}
                      onClick={handleAddAchievement}
                    >
                      <FaPlus />
                    </button>
                  </div>
                )}
                {profile.achievements && profile.achievements.length > 0 ? (
                  <div className={styles.achievementsList}>
                    {profile.achievements.map((achievement, index) => (
                      <div key={index} className={styles.achievementItem}>
                        <FaTrophy className={styles.achievementIcon} />
                        <span>{achievement}</span>
                        {isEditing && (
                          <button
                            className={styles.removeButton}
                            onClick={() => handleRemoveAchievement(index)}
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>لم يتم إضافة إنجازات بعد</p>
                )}
              </div>



              {/* Certifications */}
<div className={styles.section}>
  <div className={styles.sectionHeader}>
    <h2>الشهادات</h2>
    {isEditing && (
      <button className={styles.addButton} onClick={handleAddCertification}>
        <FaPlus /> إضافة شهادة
      </button>
    )}
  </div>

  {profile.certifications && profile.certifications.length > 0 ? (
    <div className={styles.certificationsList}>
      {profile.certifications.map((cert, index) => (
        <div key={index} className={styles.certificationItem}>
          {isEditing ? (
            <>
              <input
                className={styles.input}
                placeholder="اسم الشهادة"
                value={cert.name}
                onChange={(e) =>
                  handleUpdateCertification(index, "name", e.target.value)
                }
              />
              <input
                className={styles.input}
                placeholder="الجهة المانحة"
                value={cert.issuer}
                onChange={(e) =>
                  handleUpdateCertification(index, "issuer", e.target.value)
                }
              />
              <input
                className={styles.input}
                type="date"
                value={cert.date}
                onChange={(e) =>
                  handleUpdateCertification(index, "date", e.target.value)
                }
              />
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveCertification(index)}
              >
                <FaTrash />
              </button>
            </>
          ) : (
            <>
              <span>{cert.name}</span>
              <span className={styles.level}>{cert.issuer}</span>
              <span>{cert.date}</span>
            </>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p>لم يتم إضافة شهادات بعد</p>
  )}
</div>

            </div>
          )}

          {activeTab === "skills" && (
            <div className={styles.skillsTab}>
              {/* Technical Skills */}
              <div className={styles.section}>
                <h2>المهارات التقنية</h2>
                {isEditing && (
                  <div className={styles.addItem}>
                    <input
                      className={styles.input}
                      placeholder="أضف مهارة..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    />
                    <button
                      className={styles.addButton}
                      onClick={handleAddSkill}
                    >
                      <FaPlus />
                    </button>
                  </div>
                )}
                {profile.skills && profile.skills.length > 0 ? (
                  <div className={styles.skillsList}>
                    {profile.skills.map((skill, index) => (
                      <div key={index} className={styles.skillChip}>
                        {skill}
                        {isEditing && (
                          <button onClick={() => handleRemoveSkill(index)}>
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>لم يتم إضافة مهارات بعد</p>
                )}
              </div>

              {/* Languages */}
<div className={styles.section}>
  <div className={styles.sectionHeader}>
    <h2>اللغات</h2>
    {isEditing && (
      <button className={styles.addButton} onClick={handleAddLanguage}>
        <FaPlus /> إضافة لغة
      </button>
    )}
  </div>

  {profile.languages && profile.languages.length > 0 ? (
    <div className={styles.languagesList}>
      {profile.languages.map((lang, index) => (
        <div key={index} className={styles.languageItem}>
          {isEditing ? (
            <>
              <input
                className={styles.input}
                placeholder="اسم اللغة"
                value={lang.name}
                onChange={(e) =>
                  handleUpdateLanguage(index, "name", e.target.value)
                }
              />
              <select
                className={styles.input}
                value={lang.level}
                onChange={(e) =>
                  handleUpdateLanguage(index, "level", e.target.value)
                }
              >
                <option value="">اختر المستوى</option>
                <option value="أساسي">أساسي</option>
                <option value="متوسط">متوسط</option>
                <option value="متقدم">متقدم</option>
                <option value="بطلاقة">بطلاقة</option>
              </select>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveLanguage(index)}
              >
                <FaTrash />
              </button>
            </>
          ) : (
            <>
              <span>{lang.name}</span>
              <span className={styles.level}>{lang.level}</span>
            </>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p>لم يتم إضافة لغات بعد</p>
  )}
</div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
