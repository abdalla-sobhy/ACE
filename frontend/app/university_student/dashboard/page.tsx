"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UniversityStudentNav from "@/components/UniversityStudentNav/UniversityStudentNav";
import styles from "./UniversityDashboard.module.css";
import {
  FaSearch,
  FaBook,
  FaUsers,
  FaStar,
  FaShoppingCart,
  FaTimes,
  FaGraduationCap,
  FaBriefcase,
  FaFileAlt,
  FaEdit,
  FaCheckCircle,
  FaUserTie,
  FaBuilding,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";
import Image from "next/image";

import { useLanguage } from "@/hooks/useLanguage";
interface Course {
  id: number;
  title: string;
  description: string;
  teacher_id: number;
  teacher_name: string;
  price: number;
  original_price?: number;
  duration: string;
  lessons_count: number;
  students_count: number;
  rating: number;
  thumbnail: string | null;
  category: string;
  course_type: "recorded" | "live";
  is_enrolled: boolean;
}

interface PaginationInfo {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
  from: number | null;
  to: number | null;
}

interface UniversityProfile {
  id: number;
  faculty: string;
  goal: string;
  university?: string;
  year_of_study?: number;
  gpa?: number;
  skills?: string[];
  cv_path?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  bio?: string;
  achievements?: string[];
  languages?: string[];
  certifications?: unknown[];
  experience?: unknown[];
  projects?: unknown[];
  profile_completeness?: number;
  is_public?: boolean;
  looking_for_opportunities?: boolean;
  profile_views?: number;
  cv_downloads?: number;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type: string;
  universityStudentProfile?: UniversityProfile;
}

interface ProfileStats {
  profile_views: number;
  cv_downloads: number;
  courses_completed: number;
  certificates_earned: number;
}

export default function UniversityStudentDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    profile_views: 0,
    cv_downloads: 0,
    courses_completed: 0,
    certificates_earned: 0,
  });
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    current_page: 1,
    last_page: 1,
    per_page: 12,
    from: null,
    to: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const initDashboard = async () => {
      await checkAuth();
      await fetchDashboardData();
    };
    initDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory]);

  const checkAuth = async () => {
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

    // Fetch fresh profile data from backend
    try {
      const profileResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/profile`,
        {
          headers: {
            Authorization: `Bearer ${parsedAuth.token}`,
            Accept: "application/json",
          },
        }
      );

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        // Update user data with fresh profile information
        const updatedUser = {
          ...parsedUser,
          universityStudentProfile: profileData.profile,
        };
        setUser(updatedUser);

        // Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify(updatedUser));

        const profile = profileData.profile;
        if (!profile?.cv_path || (profile?.profile_completeness || 0) < 70) {
          setShowProfileAlert(true);
        }
      } else {
        // Fallback to cached user data if API fails
        setUser(parsedUser);
        const profile = parsedUser.universityStudentProfile;
        if (!profile?.cv_path || (profile?.profile_completeness || 0) < 70) {
          setShowProfileAlert(true);
        }
      }
    } catch (error) {
      console.error("Error fetching fresh profile:", error);
      // Fallback to cached user data
      setUser(parsedUser);
      const profile = parsedUser.universityStudentProfile;
      if (!profile?.cv_path || (profile?.profile_completeness || 0) < 70) {
        setShowProfileAlert(true);
      }
    }
  };

  const fetchDashboardData = async (page: number = currentPage) => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "12",
      });

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const coursesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/courses?${params}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setCourses(coursesData.courses || []);
        setFilteredCourses(coursesData.courses || []);
        setPagination({
          total: coursesData.total || 0,
          current_page: coursesData.current_page || 1,
          last_page: coursesData.last_page || 1,
          per_page: coursesData.per_page || 12,
          from: coursesData.from || null,
          to: coursesData.to || null,
        });
      }

      const statsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/profile-stats`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setProfileStats(statsData.stats || profileStats);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchDashboardData(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getProfileCompleteness = () => {
    const profile = user?.universityStudentProfile;
    if (!profile) return 0;

    // Use backend-calculated profile_completeness if available
    if (profile.profile_completeness !== undefined) {
      return profile.profile_completeness;
    }

    // Fallback to local calculation if backend value is not available
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
    ];

    checks.forEach((check) => {
      if (check) completed++;
    });

    return Math.round((completed / checks.length) * 100);
  };

  const handleCourseClick = (courseId: number) => {
    router.push(`/university_student/courses/${courseId}`);
  };

  const categories = [
    { value: "all", label: t("universityStudent.allSpecializations")},
    { value: "programming", label: t("universityStudent.programming")},
    { value: "business", label: t("universityStudent.business")},
    { value: "design", label: t("universityStudent.design")},
    { value: "marketing", label: t("universityStudent.marketing")},
    { value: "data", label: t("universityStudent.dataAnalysis")},
    { value: "languages", label: t("universityStudent.languages")},
    { value: "soft_skills", label: t("universityStudent.softSkills")},
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <UniversityStudentNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>{t("universityStudent.loadingData")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <UniversityStudentNav />

      <main className={styles.main}>
        {/* Profile Alert */}
        {showProfileAlert && (
          <div className={styles.profileAlert}>
            <div className={styles.alertContent}>
              <FaFileAlt className={styles.alertIcon} />
              <div className={styles.alertText}>
                <h3>{t("universityStudent.completeProfile")}</h3>
                <p>
                  {t("universityStudent.companiesLooking")}
                </p>
              </div>
              <button
                className={styles.alertButton}
                onClick={() => router.push("/university_student/profile")}
              >
                <FaEdit /> {t("universityStudent.updateProfile")}
              </button>
              <button
                className={styles.alertClose}
                onClick={() => setShowProfileAlert(false)}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeGrid}>
            <div className={styles.welcomeContent}>
              <h1>{t("universityStudent.hello")} {user?.first_name}</h1>
              <p className={styles.welcomeSubtitle}>
                {user?.universityStudentProfile?.faculty || t("universityStudent.student")} •
                {user?.universityStudentProfile?.university || t("universityStudent.university")}
              </p>
              <div className={styles.profileProgress}>
                <div className={styles.progressHeader}>
                  <span>{t("universityStudent.profileCompleteness")}</span>
                  <span>{getProfileCompleteness()}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${getProfileCompleteness()}%` }}
                  />
                </div>
              </div>
              <div className={styles.quickActions}>
                <button
                  className={styles.primaryButton}
                  onClick={() => router.push("/university_student/profile")}
                >
                  <FaUserTie /> {t("universityStudent.viewProfile")}
                </button>
                <button
                  className={styles.secondaryButton}
                  onClick={() =>
                    router.push("/university_student/jobs")
                  }
                >
                  <FaBriefcase /> {t("universityStudent.jobOpportunities")}
                </button>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaChartLine />
                </div>
                <div className={styles.statContent}>
                  <h3>{profileStats.profile_views}</h3>
                  <p>{t("universityStudent.profileViews")}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaFileAlt />
                </div>
                <div className={styles.statContent}>
                  <h3>{profileStats.cv_downloads}</h3>
                  <p>{t("universityStudent.cvDownloads")}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaGraduationCap />
                </div>
                <div className={styles.statContent}>
                  <h3>{profileStats.courses_completed}</h3>
                  <p>{t("universityStudent.coursesCompleted")}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaTrophy />
                </div>
                <div className={styles.statContent}>
                  <h3>{profileStats.certificates_earned}</h3>
                  <p>{t("universityStudent.certificates")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career Goals Section */}
        {user?.universityStudentProfile?.goal && (
          <section className={styles.careerGoalSection}>
            <div className={styles.goalCard}>
              <FaBuilding className={styles.goalIcon} />
              <div className={styles.goalContent}>
                <h3>{t("universityStudent.myCareerGoal")}</h3>
                <p>{user.universityStudentProfile.goal === "career_preparation"
                    ? t("universityDashboard.goals.career_preparation")
                    : user.universityStudentProfile.goal === "skill_development"
                    ? t("universityDashboard.goals.skill_development")
                    : user.universityStudentProfile.goal === "academic_excellence"
                    ? t("universityDashboard.goals.academic_excellence")
                    : user.universityStudentProfile.goal === "research"
                    ? t("universityDashboard.goals.research")
                    : user.universityStudentProfile.goal === "entrepreneurship"
                    ? t("universityDashboard.goals.entrepreneurship")
                    : user.universityStudentProfile.goal === "graduate_studies"
                    ? t("universityDashboard.goals.graduate_studies")
                    : user.universityStudentProfile.goal}</p>
              </div>
              {user?.universityStudentProfile?.looking_for_opportunities && (
                <div className={styles.lookingBadge}>
                  <FaCheckCircle /> {t("universityStudent.lookingForOpportunities")}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Search and Filter Section */}
        <section className={styles.searchSection}>
          <div className={styles.searchHeader}>
            <h2>{t("universityStudent.skillDevelopment")}</h2>
            <p>{t("universityStudent.acquireSkills")}</p>
          </div>

          <div className={styles.searchControls}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder={t("universityStudent.searchPlaceholder")}
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className={styles.clearButton}
                  onClick={() => setSearchQuery("")}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          <div className={styles.categoryFilter}>
            {categories.map((category) => (
              <button
                key={category.value}
                className={`${styles.categoryButton} ${
                  selectedCategory === category.value ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(category.value)}
              >
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Courses Grid */}
        <section className={styles.coursesSection}>
          <div className={styles.coursesHeader}>
            <h2>{t("universityStudent.availableCourses")}</h2>
            <p>{pagination.total} {t("universityStudent.courses")}</p>
          </div>

          {user?.universityStudentProfile?.goal && (
            <div className={styles.goalBasedInfo}>
              <p>
                {t("universityStudent.sortedByGoal")}{" "}
                <strong>
                  {user.universityStudentProfile.goal === "career_preparation"
                    ? t("universityDashboard.goals.career_preparation")
                    : user.universityStudentProfile.goal === "skill_development"
                    ? t("universityDashboard.goals.skill_development")
                    : user.universityStudentProfile.goal === "academic_excellence"
                    ? t("universityDashboard.goals.academic_excellence")
                    : user.universityStudentProfile.goal === "research"
                    ? t("universityDashboard.goals.research")
                    : user.universityStudentProfile.goal === "entrepreneurship"
                    ? t("universityDashboard.goals.entrepreneurship")
                    : user.universityStudentProfile.goal === "graduate_studies"
                    ? t("universityDashboard.goals.graduate_studies")
                    : user.universityStudentProfile.goal}
                </strong>
              </p>
            </div>
          )}

          {filteredCourses.length === 0 ? (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>🔍</span>
              <h3>{t("universityStudent.noResults")}</h3>
              <p>{t("universityStudent.tryDifferentSearch")}</p>
            </div>
          ) : (
            <>
              <div className={styles.coursesGrid}>
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className={styles.courseCard}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className={styles.courseThumbnail}>
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          width={320}
                          height={180}
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <FaBook />
                        </div>
                      )}
                      {course.is_enrolled && (
                        <div className={styles.enrolledBadge}>{t("universityStudent.enrolled")}</div>
                      )}
                    </div>

                    <div className={styles.courseContent}>
                      <h3>{course.title}</h3>
                      <p className={styles.courseInstructor}>
                        {course.teacher_name}
                      </p>
                      <p className={styles.courseDescription}>
                        {course.description}
                      </p>

                      <div className={styles.courseStats}>
                        <span>
                          <FaBook /> {course.lessons_count} {t("universityStudent.lesson")}
                        </span>
                        <span>
                          <FaUsers /> {course.students_count} {t("student.student")}
                        </span>
                        <span>
                          <FaStar /> {course.rating}
                        </span>
                      </div>

                      <div className={styles.courseFooter}>
                        <div className={styles.coursePrice}>
                          {course.original_price && (
                            <span className={styles.originalPrice}>
                              {course.original_price} {t("universityStudent.currency")}
                            </span>
                          )}
                          <span className={styles.currentPrice}>
                            {course.price === 0
                              ? t("universityStudent.free")
                              : `${course.price} ${t("universityStudent.currency")}`}
                          </span>
                        </div>
                        <button
                          className={`${styles.enrollButton} ${
                            course.is_enrolled ? styles.enrolled : ""
                          }`}
                        >
                          {course.is_enrolled ? (
                            <>
                              <FaBook /> {t("universityStudent.continue")}
                            </>
                          ) : (
                            <>
                              <FaShoppingCart /> {t("universityStudent.register")}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    {t("universityStudent.previous")}
                  </button>

                  <div className={styles.paginationPages}>
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first, last, current, and adjacent pages
                        return (
                          page === 1 ||
                          page === pagination.last_page ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        // Add ellipsis if there's a gap
                        const showEllipsis = index > 0 && page - array[index - 1] > 1;
                        return (
                          <div key={page} style={{ display: "flex", gap: "8px" }}>
                            {showEllipsis && (
                              <span className={styles.paginationEllipsis}>...</span>
                            )}
                            <button
                              className={`${styles.paginationNumber} ${
                                currentPage === page ? styles.active : ""
                              }`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  <button
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.last_page}
                  >
                    {t("universityStudent.next")}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
