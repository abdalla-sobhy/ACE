"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentNav from "@/components/StudentNav/StudentNav";
import styles from "./MyCourses.module.css";
import { FaSearch, FaBook, FaClock, FaUsers, FaStar, FaCalendarAlt, FaChalkboardTeacher, FaTimes } from "react-icons/fa";
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
      primary_1: "الصف الأول الابتدائي",
      primary_2: "الصف الثاني الابتدائي",
      primary_3: "الصف الثالث الابتدائي",
      primary_4: "الصف الرابع الابتدائي",
      primary_5: "الصف الخامس الابتدائي",
      primary_6: "الصف السادس الابتدائي",
      prep_1: "الصف الأول الإعدادي",
      prep_2: "الصف الثاني الإعدادي",
      prep_3: "الصف الثالث الإعدادي",
      secondary_1: "الصف الأول الثانوي",
      secondary_2: "الصف الثاني الثانوي",
      secondary_3: "الصف الثالث الثانوي",
    };
    return gradeLabels[grade] || grade;
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels: { [key: string]: { label: string; icon: string } } = {
      arabic: { label: "اللغة العربية", icon: "📝" },
      english: { label: "اللغة الإنجليزية", icon: "🌍" },
      math: { label: "الرياضيات", icon: "🔢" },
      science: { label: "العلوم", icon: "🔬" },
      social: { label: "الدراسات الاجتماعية", icon: "🗺️" },
      religion: { label: "التربية الدينية", icon: "🕌" },
      french: { label: "اللغة الفرنسية", icon: "🇫🇷" },
      german: { label: "اللغة الألمانية", icon: "🇩🇪" },
    };
    return categoryLabels[category || ''] || { label: category || "عام", icon: "📚" };
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <StudentNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>جاري تحميل الكورسات...</p>
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
            <h1>كورساتي</h1>
            <p>الكورسات المسجلة لـ{getGradeLabel(user?.profile?.grade || "")}</p>
          </div>
          <div className={styles.statsCards}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📚</div>
              <div className={styles.statInfo}>
                <h3>{courses.length}</h3>
                <p>كورس مسجل</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👨‍🏫</div>
              <div className={styles.statInfo}>
                <h3>{new Set(courses.map(c => c.teacher.id)).size}</h3>
                <p>مدرس مختلف</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎯</div>
              <div className={styles.statInfo}>
                <h3>
                  {courses.filter(course => course.course_type === 'live').length}
                </h3>
                <p>كورس مباشر</p>
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
                placeholder="ابحث في كورساتك..."
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
            <h2>الكورسات المسجلة</h2>
            <p>{filteredCourses.length} كورس</p>
          </div>

          {filteredCourses.length === 0 ? (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>📚</span>
              <h3>لا توجد كورسات مسجلة</h3>
              <p>
                {searchQuery 
                  ? "لم نعثر على كورسات تطابق بحثك"
                  : "لم تقم بالتسجيل في أي كورس حتى الآن"
                }
              </p>
              {!searchQuery && (
                <button 
                  className={styles.exploreButton}
                  onClick={() => router.push("/student/dashboard")}
                >
                  استكشف الكورسات المتاحة
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
                            <span>🔴</span> بث مباشر
                          </div>
                          {course.is_full && (
                            <div className={styles.seatsInfo}>
                              <span className={styles.fullBadge}>مكتمل العدد</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      <div className={styles.enrolledBadge}>مسجل</div>
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
                            <span>جدول المحاضرات</span>
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
                              تبدأ في: {new Date(course.start_date).toLocaleDateString('ar-EG')}
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
                            <span>{course.lessons_count} درس</span>
                          </div>
                        )}
                        {course.students_count !== undefined && (
                          <div className={styles.courseStat}>
                            <FaUsers />
                            <span>{course.students_count} طالب</span>
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
                              {course.original_price} جنيه
                            </span>
                          )}
                          <span className={styles.currentPrice}>
                            {course.price === 0 ? "مجاني" : `${course.price} جنيه`}
                          </span>
                        </div>
                        <button
                          className={styles.enrollButton}
                          onClick={() => router.push(`/student/courses/${course.id}`)}
                        >
                          <FaBook />
                          <span>متابعة الدراسة</span>
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