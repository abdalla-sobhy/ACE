"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentNav from "@/components/StudentNav/StudentNav";
import styles from "./MyCourses.module.css";
import { FaSearch, FaBook, FaClock, FaUsers, FaStar, FaCalendarAlt, FaChalkboardTeacher, FaTimes } from "react-icons/fa";
import { useLanguage } from "@/hooks/useLanguage";
interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  teacher: Teacher;
  duration?: string;
  lessons_count?: number;
  students_count?: number;
  rating?: number;
  thumbnail?: string | null;
  category?: string;
  course_type?: 'recorded' | 'live';
  original_price?: number;
  max_seats?: number;
  enrolled_seats?: number;
  seats_left?: number;
  is_full?: boolean;
  start_date?: string;
  end_date?: string;
  schedule?: Array<{
    day: string;
    day_arabic: string;
    start_time: string;
    end_time: string;
    duration: string;
  }>;
}

interface User {
  id: number;
  name: string;
  email: string;
  type: string;
  profile?: {
    grade: string;
    birth_date: string;
  };
}

export default function MyCourses() {
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkAuth();
    fetchMyCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, courses]);

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

    if (parsedUser.type !== "student") {
      router.push("/");
      return;
    }

    setUser(parsedUser);
  };

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/student/my-courses`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
        setFilteredCourses(data.courses || []);
      } else {
        console.error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching my courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    if (!searchQuery) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${course.teacher.first_name} ${course.teacher.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const getGradeLabel = (grade: string) => {
    const gradeLabels: { [key: string]: string } = {
      primary_1: t("grades.primary_1"),
      primary_2: t("grades.primary_2"),
      primary_3: t("grades.primary_3"),
      primary_4: t("grades.primary_4"),
      primary_5: t("grades.primary_5"),
      primary_6: t("grades.primary_6"),
      prep_1: t("grades.prep_1"),
      prep_2: t("grades.prep_2"),
      prep_3: t("grades.prep_3"),
      secondary_1: t("grades.secondary_1"),
      secondary_2: t("grades.secondary_2"),
      secondary_3: t("grades.secondary_3"),
    };
    return gradeLabels[grade] || grade;
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels: { [key: string]: { label: string; icon: string } } = {
      arabic: { label: t("subjects.arabic"), icon: "" },
      english: { label: t("subjects.english"), icon: "" },
      math: { label: t("subjects.math"), icon: "" },
      science: { label: t("subjects.science"), icon: "" },
      social: { label: t("subjects.social"), icon: "" },
      religion: { label: t("subjects.religion"), icon: "" },
      french: { label: t("subjects.french"), icon: "" },
      german: { label: t("subjects.german"), icon: "" },
    };
    return categoryLabels[category || ''] || { label: category || t("subjects.general")};
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <StudentNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>{t("student.loadingCourses")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <StudentNav />
      
      <main className={styles.main}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h1>{t("student.myCourses")}</h1>
            <p>{t("student.coursesEnrolled")} {getGradeLabel(user?.profile?.grade || "")}</p>
          </div>
          <div className={styles.statsCards}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📚</div>
              <div className={styles.statInfo}>
                <h3>{courses.length}</h3>
                <p>{t("student.coursesEnrolled")}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👨‍🏫</div>
              <div className={styles.statInfo}>
                <h3>{new Set(courses.map(c => c.teacher.id)).size}</h3>
                <p>{t("student.teachersAvailable")}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎯</div>
              <div className={styles.statInfo}>
                <h3>
                  {courses.filter(course => course.course_type === 'live').length}
                </h3>
                <p>{t("student.liveStream")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className={styles.searchSection}>
          <div className={styles.searchContainer}>
            {/* Course Search */}
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder={t("student.searchCourseOrTopic")}
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
        </section>

        {/* Courses Grid */}
        <section className={styles.coursesSection}>
          <div className={styles.coursesHeader}>
            <h2>{t("student.enrolledCourses")}</h2>
            <p>{filteredCourses.length} {t("student.courses")}</p>
          </div>

          {filteredCourses.length === 0 ? (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>📚</span>
              <h3>{t("student.noCourses")}</h3>
              <p>
                {searchQuery
                  ? t("student.noCoursesFound")
                  : t("student.noCourses")}
              </p>
              {!searchQuery && (
                <button
                  className={styles.exploreButton}
                  onClick={() => router.push("/student/dashboard")}
                >
                  {t("student.exploreCourses")}
                </button>
              )}
            </div>
          ) : (
            <div className={styles.coursesGrid}>
              {filteredCourses.map((course) => {
                const category = getCategoryLabel(course.category || '');
                const teacherName = `${course.teacher.first_name} ${course.teacher.last_name}`;
                
                return (
                  <div key={course.id} className={styles.courseCard}>
                    <div 
                      onClick={() => router.push(`/student/courses/${course.id}`)} 
                      className={`${styles.courseThumbnail} ${styles.cursorPointer}`}
                    >
                      <img src={course.thumbnail || "/api/placeholder/320/180"}/>
                      <div className={styles.courseCategory}>
                        {category.icon} {category.label}
                      </div>
                      
                      {/* Live course badges */}
                      {course.course_type === 'live' && (
                        <>
                          <div className={styles.liveBadge}>
                            <span>🔴</span> {t("student.liveStream")}
                          </div>
                          {course.is_full && (
                            <div className={styles.seatsInfo}>
                              <span className={styles.fullBadge}>{t("student.courseFull")}</span>
                            </div>
                          )}
                        </>
                      )}

                      <div className={styles.enrolledBadge}>{t("student.enrolled")}</div>
                    </div>
                    
                    <div className={styles.courseContent}>
                      <h3>{course.title}</h3>
                      <p className={styles.courseInstructor}>
                        <FaChalkboardTeacher /> {teacherName}
                      </p>
                      <p className={styles.courseDescription}>{course.description}</p>
                      
                      {/* Schedule for live courses */}
                      {course.course_type === 'live' && course.schedule && (
                        <div className={styles.scheduleInfo}>
                          <div className={styles.scheduleHeader}>
                            <FaCalendarAlt />
                            <span>{t("student.lectureSchedule")}</span>
                          </div>
                          <div className={styles.sessionsList}>
                            {course.schedule.map((session, index) => (
                              <div key={index} className={styles.sessionTime}>
                                <span className={styles.dayName}>{session.day_arabic}</span>
                                <span className={styles.timeRange}>{session.start_time} - {session.end_time}</span>
                              </div>
                            ))}
                          </div>
                          {course.start_date && (
                            <p className={styles.startDate}>
                              {t("student.startsOn")} {new Date(course.start_date).toLocaleDateString('en-EG')}
                            </p>
                          )}
                        </div>
                      )}
                      
                      <div className={styles.courseStats}>
                        {course.duration && (
                          <div className={styles.courseStat}>
                            <FaClock />
                            <span>{course.duration}</span>
                          </div>
                        )}
                        {course.lessons_count !== undefined && (
                          <div className={styles.courseStat}>
                            <FaBook />
                            <span>{course.lessons_count} {t("student.lesson")}</span>
                          </div>
                        )}
                        {course.students_count !== undefined && (
                          <div className={styles.courseStat}>
                            <FaUsers />
                            <span>{course.students_count} {t("student.student")}</span>
                          </div>
                        )}
                        {course.rating !== undefined && (
                          <div className={styles.courseStat}>
                            <FaStar />
                            <span>{course.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.courseFooter}>
                        <div className={styles.coursePrice}>
                          {course.original_price && course.original_price > course.price && (
                            <span className={styles.originalPrice}>
                              {course.original_price} {t("student.currency")}
                            </span>
                          )}
                          <span className={styles.currentPrice}>
                            {course.price === 0 ? t("student.free") : `${course.price} ${t("student.currency")}`}
                          </span>
                        </div>
                        <button
                          className={styles.enrollButton}
                          onClick={() => router.push(`/student/courses/${course.id}`)}
                        >
                          <FaBook />
                          <span>{t("student.continueStudy")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}