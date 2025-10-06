"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentNav from "@/components/StudentNav/StudentNav";
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
  profile_completeness?: number;
  is_public?: boolean;
  looking_for_opportunities?: boolean;
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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
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

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, selectedCategory, courses]);

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

    const profile = parsedUser.universityStudentProfile;
    if (!profile?.cv_path || (profile?.profile_completeness || 0) < 70) {
      setShowProfileAlert(true);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const coursesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/courses`,
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

  const filterCourses = () => {
    let filtered = [...courses];

    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.teacher_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (course) => course.category === selectedCategory
      );
    }

    setFilteredCourses(filtered);
  };

  const getProfileCompleteness = () => {
    const profile = user?.universityStudentProfile;
    if (!profile) return 0;

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
    { value: "all", label: "جميع التخصصات", icon: "📚" },
    { value: "programming", label: "البرمجة", icon: "💻" },
    { value: "business", label: "إدارة الأعمال", icon: "💼" },
    { value: "design", label: "التصميم", icon: "🎨" },
    { value: "marketing", label: "التسويق", icon: "📈" },
    { value: "data", label: "تحليل البيانات", icon: "📊" },
    { value: "languages", label: "اللغات", icon: "🌍" },
    { value: "soft_skills", label: "المهارات الشخصية", icon: "🤝" },
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <StudentNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <StudentNav />

      <main className={styles.main}>
        {/* Profile Alert */}
        {showProfileAlert && (
          <div className={styles.profileAlert}>
            <div className={styles.alertContent}>
              <FaFileAlt className={styles.alertIcon} />
              <div className={styles.alertText}>
                <h3>أكمل ملفك الشخصي لتحصل على فرص أفضل!</h3>
                <p>
                  الشركات تبحث عن طلاب بملفات شخصية مكتملة. أضف سيرتك الذاتية
                  ومهاراتك.
                </p>
              </div>
              <button
                className={styles.alertButton}
                onClick={() => router.push("/university_student/profile")}
              >
                <FaEdit /> تحديث الملف الشخصي
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
              <h1>مرحباً {user?.first_name} 👋</h1>
              <p className={styles.welcomeSubtitle}>
                {user?.universityStudentProfile?.faculty || "طالب جامعي"} •
                {user?.universityStudentProfile?.university || "الجامعة"}
              </p>
              <div className={styles.profileProgress}>
                <div className={styles.progressHeader}>
                  <span>اكتمال الملف الشخصي</span>
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
                  <FaUserTie /> عرض الملف الشخصي
                </button>
                <button
                  className={styles.secondaryButton}
                  onClick={() =>
                    router.push("/university_student/opportunities")
                  }
                >
                  <FaBriefcase /> فرص العمل
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
                  <p>مشاهدة للملف</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaFileAlt />
                </div>
                <div className={styles.statContent}>
                  <h3>{profileStats.cv_downloads}</h3>
                  <p>تحميل للسيرة</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaGraduationCap />
                </div>
                <div className={styles.statContent}>
                  <h3>{profileStats.courses_completed}</h3>
                  <p>كورس مكتمل</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaTrophy />
                </div>
                <div className={styles.statContent}>
                  <h3>{profileStats.certificates_earned}</h3>
                  <p>شهادة</p>
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
                <h3>هدفي المهني</h3>
                <p>{user.universityStudentProfile.goal}</p>
              </div>
              {user?.universityStudentProfile?.looking_for_opportunities && (
                <div className={styles.lookingBadge}>
                  <FaCheckCircle /> أبحث عن فرص
                </div>
              )}
            </div>
          </section>
        )}

        {/* Search and Filter Section */}
        <section className={styles.searchSection}>
          <div className={styles.searchHeader}>
            <h2>تطوير المهارات</h2>
            <p>اكتسب المهارات المطلوبة في سوق العمل</p>
          </div>

          <div className={styles.searchControls}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="ابحث عن كورسات، مهارات، أو مدربين..."
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
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Courses Grid */}
        <section className={styles.coursesSection}>
          <div className={styles.coursesHeader}>
            <h2>الكورسات المتاحة</h2>
            <p>{filteredCourses.length} كورس</p>
          </div>

          {filteredCourses.length === 0 ? (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>🔍</span>
              <h3>لا توجد نتائج</h3>
              <p>جرب البحث بكلمات مختلفة أو تغيير التصنيف</p>
            </div>
          ) : (
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
                      <div className={styles.enrolledBadge}>مسجل</div>
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
                        <FaBook /> {course.lessons_count} درس
                      </span>
                      <span>
                        <FaUsers /> {course.students_count} طالب
                      </span>
                      <span>
                        <FaStar /> {course.rating}
                      </span>
                    </div>

                    <div className={styles.courseFooter}>
                      <div className={styles.coursePrice}>
                        {course.original_price && (
                          <span className={styles.originalPrice}>
                            {course.original_price} جنيه
                          </span>
                        )}
                        <span className={styles.currentPrice}>
                          {course.price === 0
                            ? "مجاني"
                            : `${course.price} جنيه`}
                        </span>
                      </div>
                      <button
                        className={`${styles.enrollButton} ${
                          course.is_enrolled ? styles.enrolled : ""
                        }`}
                      >
                        {course.is_enrolled ? (
                          <>
                            <FaBook /> متابعة
                          </>
                        ) : (
                          <>
                            <FaShoppingCart /> تسجيل
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
