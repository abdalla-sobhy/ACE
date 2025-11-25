"use client";

import { useState, useEffect } from "react";
import TeacherNav from "@/components/TeacherNav/TeacherNav";
import styles from "./TeacherDashboard.module.css";
import { 
  FaBook, 
  FaUsers, 
  FaMoneyBillWave, 
  FaStar, 
  FaPlus, 
  FaVideo, 
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaEye,
  FaClock,
  FaChartLine,
  FaBroadcastTower
} from "react-icons/fa";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/hooks/useLanguage";
interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  duration: string;
  lessons_count: number;
  students_count: number;
  rating: number;
  thumbnail: string | null;
  category: string;
  grade: string;
  course_type: 'recorded' | 'live';
  is_active: boolean;
  max_seats?: number;
  enrolled_seats?: number;
  seats_left?: number;
  is_full?: boolean;
  start_date?: string;
  end_date?: string;
  sessions_per_week?: number;
  schedule?: Array<{
    day: string;
    day_arabic: string;
    start_time: string;
    end_time: string;
  }>;
  total_revenue?: number;
  completion_rate?: number;
}

interface TeacherStats {
  total_courses: number;
  total_students: number;
  total_revenue: number;
  average_rating: number;
  active_courses: number;
  live_courses: number;
  recorded_courses: number;
  upcoming_sessions: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  type: string;
  profile?: {
    specialization?: string;
    years_of_experience?: string;
  };
}

export default function TeacherDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'recorded'>('all');

  useEffect(() => {
    checkAuth();
    fetchTeacherData();
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

    if (parsedUser.type !== "teacher") {
      router.push("/");
      return;
    }

    setUser(parsedUser);
  };

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      
      const coursesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/teacher/courses`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      const statsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/teacher/stats`,
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

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats || null);
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLiveSession = async (course: Course) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      
      // Check if there's a next session for this course
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/live/course/${course.id}/next-session`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authData.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        alert("لا توجد جلسات مجدولة حالياً");
        return;
      }

      const data = await response.json();
      
      if (data.success && data.session) {
        // Teachers can join anytime (no 15-minute restriction)
        router.push(`/teacher/live-class/${data.session.id}`);
      } else {
        alert("لا توجد جلسات مباشرة قادمة لهذا الكورس");
      }
    } catch (error) {
      console.error("Error joining live session:", error);
      alert("حدث خطأ أثناء الانضمام للجلسة");
    }
  };

  const handleCreateCourse = () => {
    router.push("/teacher/courses/create");
  };

  const handleEditCourse = (courseId: number) => {
    router.push(`/teacher/courses/${courseId}/edit`);
  };

  const handleViewCourse = (courseId: number) => {
    router.push(`/teacher/courses/${courseId}`);
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكورس؟")) {
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/teacher/courses/${courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        fetchTeacherData();
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const getFilteredCourses = () => {
    if (activeTab === 'all') return courses;
    return courses.filter(course => course.course_type === activeTab);
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      arabic: "اللغة العربية",
      english: "اللغة الإنجليزية",
      math: "الرياضيات",
      science: "العلوم",
      social: "الدراسات الاجتماعية",
      religion: "التربية الدينية",
      french: "اللغة الفرنسية",
      german: "اللغة الألمانية",
    };
    return categoryLabels[category] || category;
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

  if (loading) {
    return (
      <div className={styles.container}>
        <TeacherNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TeacherNav />
      
      <main className={styles.main}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h1>{t("teacher.welcome")} {user?.name?.split(' ')[0]}</h1>
            <p>إليك نظرة عامة على أداء كورساتك</p>
          </div>
          
          {/* Stats Cards */}
          <div className={styles.statsCards}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(88, 166, 255, 0.1)' }}>
                <FaBook style={{ color: '#58a6ff' }} />
              </div>
              <div className={styles.statInfo}>
                <h3>{stats?.total_courses || 0}</h3>
                <p>كورس</p>
              </div>
              <div className={styles.statTrend}>
                <FaChartLine />
                <span>+12%</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(63, 185, 80, 0.1)' }}>
                <FaUsers style={{ color: '#3fb950' }} />
              </div>
              <div className={styles.statInfo}>
                <h3>{stats?.total_students || 0}</h3>
                <p>طالب</p>
              </div>
              <div className={styles.statTrend}>
                <FaChartLine />
                <span>+25%</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(248, 81, 73, 0.1)' }}>
                <FaMoneyBillWave style={{ color: '#f85149' }} />
              </div>
              <div className={styles.statInfo}>
                <h3>{stats?.total_revenue || 0} جنيه</h3>
                <p>إجمالي الأرباح</p>
              </div>
              <div className={styles.statTrend}>
                <FaChartLine />
                <span>+18%</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
                <FaStar style={{ color: '#ffd700' }} />
              </div>
              <div className={styles.statInfo}>
                <h3>{stats?.average_rating || 0}</h3>
                <p>متوسط التقييم</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <button className={styles.createButton} onClick={handleCreateCourse}>
            <FaPlus />
            <span>{t("teacher.createCourse")}</span>
          </button>
          <button className={styles.scheduleButton}>
            <FaCalendarAlt />
            <span>جدول المحاضرات</span>
          </button>
          <button className={styles.studentsButton}>
            <FaUsers />
            <span>إدارة الطلاب</span>
          </button>
        </section>

        {/* Courses Section */}
        <section className={styles.coursesSection}>
          <div className={styles.coursesHeader}>
            <h2>{t("student.myCourses")}</h2>
            <div className={styles.tabButtons}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'all' ? styles.active : ''}`}
                onClick={() => setActiveTab('all')}
              >
                الكل ({courses.length})
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'live' ? styles.active : ''}`}
                onClick={() => setActiveTab('live')}
              >
                <FaVideo /> بث مباشر ({courses.filter(c => c.course_type === 'live').length})
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'recorded' ? styles.active : ''}`}
                onClick={() => setActiveTab('recorded')}
              >
                <FaBook /> مسجلة ({courses.filter(c => c.course_type === 'recorded').length})
              </button>
            </div>
          </div>

          {getFilteredCourses().length === 0 ? (
            <div className={styles.noCourses}>
              <FaBook className={styles.noCoursesIcon} />
              <h3>لا توجد كورسات حتى الآن</h3>
              <p>ابدأ بإنشاء أول كورس لك</p>
              <button className={styles.createFirstButton} onClick={handleCreateCourse}>
                <FaPlus />
                <span>{t("teacher.createCourse")}</span>
              </button>
            </div>
          ) : (
            <div className={styles.coursesGrid}>
              {getFilteredCourses().map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <div 
                    className={styles.courseHeader}
                    style={{
                      backgroundImage: `url(${course.thumbnail || '/default-course-thumbnail.png'})`,
                      backgroundColor: course.thumbnail ? 'transparent' : '#161b22'
                    }}
                  >
                    <div className={styles.courseHeaderOverlay}>
                      <div className={styles.courseInfo}>
                        <h3>{course.title}</h3>
                        <div className={styles.courseMeta}>
                          <span className={styles.category}>{getCategoryLabel(course.category)}</span>
                          {course.grade && <span className={styles.grade}>{getGradeLabel(course.grade)}</span>}
                        </div>
                      </div>
                      <div className={styles.courseActions}>
                        <button 
                          className={styles.actionButton} 
                          onClick={() => handleViewCourse(course.id)}
                          title={t("common.view")}
                        >
                          <FaEye />
                        </button>
                        <button 
                          className={styles.actionButton} 
                          onClick={() => handleEditCourse(course.id)}
                          title={t("common.edit")}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className={styles.actionButton} 
                          onClick={() => handleDeleteCourse(course.id)}
                          title={t("common.delete")}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      {course.course_type === 'live' && (
                        <div className={styles.liveBadge}>
                          <span>🔴</span> مباشر
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.courseStats}>
                    <div className={styles.courseStat}>
                      <FaUsers />
                      <span>{course.students_count} طالب</span>
                    </div>
                    <div className={styles.courseStat}>
                      <FaBook />
                      <span>{course.lessons_count} درس</span>
                    </div>
                    <div className={styles.courseStat}>
                      <FaClock />
                      <span>{course.duration}</span>
                    </div>
                    <div className={styles.courseStat}>
                      <FaStar />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  {course.course_type === 'live' && course.schedule && (
                    <div className={styles.schedulePreview}>
                      <div className={styles.scheduleHeader}>
                        <FaCalendarAlt />
                        <span>الجدول الأسبوعي</span>
                      </div>
                      <div className={styles.sessionsList}>
                        {course.schedule.slice(0, 2).map((session, index) => (
                          <div key={index} className={styles.sessionItem}>
                            <span>{session.day_arabic}</span>
                            <span>{session.start_time}</span>
                          </div>
                        ))}
                        {course.schedule.length > 2 && (
                          <span className={styles.moreSchedule}>
                            +{course.schedule.length - 2} جلسات أخرى
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={styles.courseFooter}>
                    <div className={styles.priceInfo}>
                      <span className={styles.price}>{course.price} جنيه</span>
                      {course.original_price && (
                        <span className={styles.originalPrice}>{course.original_price} جنيه</span>
                      )}
                    </div>
                    <div className={styles.revenueInfo}>
                      <span className={styles.revenue}>
                        {course.total_revenue || course.price * course.students_count} جنيه
                      </span>
                      <span className={styles.revenueLabel}>إجمالي الربح</span>
                    </div>
                  </div>

                  {/* Live Session Join Button for Teachers */}
                  {course.course_type === 'live' && (
                    <>
                      <button 
                        className={styles.joinLiveButton}
                        onClick={() => handleJoinLiveSession(course)}
                      >
                        <FaBroadcastTower />
                        <span>الدخول للبث المباشر</span>
                      </button>
                      
                      <div className={styles.seatsBar}>
                        <div className={styles.seatsInfo}>
                          <span>{course.enrolled_seats || 0} / {course.max_seats || 0} مقعد</span>
                        </div>
                        <div className={styles.seatsProgress}>
                          <div 
                            className={styles.seatsProgressFill} 
                            style={{ 
                              width: `${((course.enrolled_seats || 0) / (course.max_seats || 1)) * 100}%`,
                              backgroundColor: course.is_full ? '#f85149' : '#3fb950'
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {!course.is_active && (
                    <div className={styles.inactiveBadge}>{t("common.inactive")}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}