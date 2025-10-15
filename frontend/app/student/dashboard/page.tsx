"use client";

import { useState, useEffect } from "react";
import StudentNav from "@/components/StudentNav/StudentNav";
import styles from "./StudentDashboard.module.css";
import { FaSearch, FaBook, FaClock, FaUsers, FaStar, FaShoppingCart, FaTimes, FaVideo, FaCalendarAlt, FaBroadcastTower } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Course {
  id: number;
  title: string;
  description: string;
  teacher_id: number;
  teacher_name: string;
  teacher_email: string;
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
  is_enrolled: boolean;
  
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

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [teacherNameFilter, setTeacherNameFilter] = useState("");
  const [courseTypeFilter, setCourseTypeFilter] = useState<'all' | 'recorded' | 'live'>('all');
  const [enrolledCount, setEnrolledCount] = useState(0);

  useEffect(() => {
    checkAuth();
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, courses, courseTypeFilter]);

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

  const fetchCourses = async (teacherName = "", courseType = 'all') => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      
      const params = new URLSearchParams();
      if (teacherName) {
        params.append("teacher_name", teacherName);
      }
      if (courseType !== 'all') {
        params.append("course_type", courseType);
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/courses?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data.courses || []);
      setFilteredCourses(data.courses || []);
      
      const enrolled = (data.courses || []).filter((course: Course) => course.is_enrolled).length;
      setEnrolledCount(enrolled);
    } catch (error) {
      console.error("Error fetching courses:", error);
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
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (courseTypeFilter !== 'all') {
      filtered = filtered.filter(course => course.course_type === courseTypeFilter);
    }

    setFilteredCourses(filtered);
  };

  const handleTeacherSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses(teacherNameFilter, courseTypeFilter);
  };

  const clearTeacherFilter = () => {
    setTeacherNameFilter("");
    fetchCourses("", courseTypeFilter);
  };

  const handleCourseAction = async (course: Course) => {
  if (course.is_full && !course.is_enrolled) {
    alert("عذراً، هذا الكورس مكتمل العدد");
    return;
  }

  if (course.is_enrolled && course.course_type === 'live') {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      
      if (!authData.token) {
        alert("لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول مرة أخرى.");
        router.push("/login");
        return;
      }

      console.log(course)

      if (!course.schedule || course.schedule.length === 0) {
        alert("لا توجد جلسات مجدولة لهذا الكورس");
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/live/course/${course.id}/next-session`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authData.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (response.status === 401) {
        alert("انتهت صلاحية جلسة الدخول. يرجى تسجيل الدخول مرة أخرى.");
        localStorage.removeItem("authData");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      if (response.status === 404) {
        const nextSession = findNextSessionFromSchedule(course.schedule, course.start_date, course.end_date);
        
        if (nextSession) {
          router.push(`/student/live-class/course/${course.id}`);
        } else {
          alert("لا توجد جلسات مباشرة قادمة لهذا الكورس");
        }
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        
        router.push(`/student/courses/${course.id}`);
        return;
      }

      const data = await response.json();
      
      if (!data || typeof data.success === 'undefined') {
        console.error("Invalid API response structure:", data);
        router.push(`/student/courses/${course.id}`);
        return;
      }
      
      if (data.success && data.session) {
  if (data.session.can_join) {
    router.push(`/student/live-class/${data.session.id}`);
  } else if (data.session.minutes_until_start > 15) {
    const totalMinutes = Math.round(data.session.minutes_until_start);
    const hoursUntil = Math.floor(totalMinutes / 60);
    const minutesUntil = totalMinutes % 60;
    
    let message = 'الجلسة ستبدأ بعد ';
    if (hoursUntil > 0) {
      message += `${hoursUntil} ساعة`;
      if (minutesUntil > 0) {
        message += ` و ${minutesUntil} دقيقة`;
      }
    } else {
      message += `${minutesUntil} دقيقة`;
    }
    message += '\n\nيمكنك الانضمام قبل 15 دقيقة من موعد البدء';
    
    alert(message);
  } else if (data.session.minutes_until_start < -120) {
    alert("انتهت الجلسة المباشرة");
  } else {
    alert("لا يمكن الانضمام للجلسة حالياً");
  }
} else {
  alert("لا توجد جلسات مباشرة قادمة لهذا الكورس");
  router.push(`/student/courses/${course.id}`);
}
    } catch (error) {
      console.error("Error in handleCourseAction:", error);
      
      alert("حدث خطأ. سيتم توجيهك لصفحة الكورس");
      router.push(`/student/courses/${course.id}`);
    }
  } else if (course.is_enrolled) {
    router.push(`/student/courses/${course.id}`);
  } else {
    router.push(`/student/courses/${course.id}`);
  }
};

const findNextSessionFromSchedule = (
  schedule: Array<{
    day: string;
    day_arabic: string;
    start_time: string;
    end_time: string;
    duration: string;
  }>,
  startDate?: string,
  endDate?: string
) => {
  if (!schedule || schedule.length === 0) return null;
  
  const now = new Date();
  const courseStart = startDate ? new Date(startDate) : now;
  const courseEnd = endDate ? new Date(endDate) : new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  
  if (courseStart > now) {
    return {
      isUpcoming: true,
      startsAt: courseStart,
      minutesUntilStart: Math.floor((courseStart.getTime() - now.getTime()) / (1000 * 60))
    };
  }
  
  if (courseEnd < now) {
    return null;
  }
  
  const dayMap: { [key: string]: number } = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };
  
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const dayOfWeek = checkDate.getDay();
    
    for (const session of schedule) {
      if (dayMap[session.day] === dayOfWeek) {
        const [hours, minutes] = session.start_time.split(':').map(Number);
        const sessionTime = new Date(checkDate);
        sessionTime.setHours(hours, minutes, 0, 0);
        
        if (sessionTime.getTime() > now.getTime() - 15 * 60 * 1000) {
          return {
            isUpcoming: true,
            startsAt: sessionTime,
            minutesUntilStart: Math.floor((sessionTime.getTime() - now.getTime()) / (1000 * 60))
          };
        }
      }
    }
  }
  
  return null;
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
    return categoryLabels[category] || { label: category, icon: "📚" };
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
            <h1>مرحباً {user?.name?.split(' ')[0]} 👋</h1>
            <p>استكشف الكورسات المتاحة لـ{getGradeLabel(user?.profile?.grade || "")}</p>
          </div>
          <div className={styles.statsCards}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📚</div>
              <div className={styles.statInfo}>
                <h3>{courses.length}</h3>
                <p>كورس متاح</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎯</div>
              <div className={styles.statInfo}>
                <h3>{enrolledCount}</h3>
                <p>كورس مسجل</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👨‍🏫</div>
              <div className={styles.statInfo}>
                <h3>{new Set(courses.map(c => c.teacher_id)).size}</h3>
                <p>مدرس متاح</p>
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
                placeholder="ابحث عن كورس أو موضوع..."
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

            {/* Teacher Filter */}
            <form onSubmit={handleTeacherSearch} className={styles.teacherSearchForm}>
              <div className={styles.teacherSearchBox}>
                <input
                  type="text"
                  placeholder="البحث باسم المدرس..."
                  className={styles.teacherInput}
                  value={teacherNameFilter}
                  onChange={(e) => setTeacherNameFilter(e.target.value)}
                />
                {teacherNameFilter && (
                  <button
                    type="button"
                    className={styles.clearButton}
                    onClick={clearTeacherFilter}
                  >
                    <FaTimes />
                  </button>
                )}
                <button type="submit" className={styles.searchButton}>
                  بحث
                </button>
              </div>
            </form>
          </div>

          {/* Course Type Filter */}
          <div className={styles.courseTypeFilter}>
            <button 
              className={`${styles.typeButton} ${courseTypeFilter === 'all' ? styles.active : ''}`}
              onClick={() => {
                setCourseTypeFilter('all');
                fetchCourses(teacherNameFilter, 'all');
              }}
            >
              جميع الكورسات
            </button>
            <button 
              className={`${styles.typeButton} ${courseTypeFilter === 'recorded' ? styles.active : ''}`}
              onClick={() => {
                setCourseTypeFilter('recorded');
                fetchCourses(teacherNameFilter, 'recorded');
              }}
            >
              <FaVideo /> كورسات مسجلة
            </button>
            <button 
              className={`${styles.typeButton} ${courseTypeFilter === 'live' ? styles.active : ''}`}
              onClick={() => {
                setCourseTypeFilter('live');
                fetchCourses(teacherNameFilter, 'live');
              }}
            >
              <span className={styles.liveIcon}>🔴</span> بث مباشر
            </button>
          </div>

          {teacherNameFilter && (
            <div className={styles.activeFilter}>
              <span>النتائج للمدرس: &quot;{teacherNameFilter}&quot;</span>
              <button onClick={clearTeacherFilter}>إلغاء التصفية</button>
            </div>
          )}
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
              <h3>لا توجد كورسات</h3>
              <p>جرب البحث باسم مدرس آخر أو تغيير كلمات البحث</p>
            </div>
          ) : (
            <div className={styles.coursesGrid}>
              {filteredCourses.map((course) => {
                const category = getCategoryLabel(course.category);
                return (
                  <div key={course.id} className={styles.courseCard}>
                    <div 
                      onClick={() => handleCourseAction(course)} 
                      className={`${styles.courseThumbnail} cursor-pointer`}
                    >
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          width={320}
                          height={180}
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <span>{category.icon}</span>
                        </div>
                      )}
                      <div className={styles.courseCategory}>
                        {category.icon} {category.label}
                      </div>
                      
                      {/* Live course badges */}
                      {course.course_type === 'live' && course.schedule && course.schedule.length > 0 && (
  <div className={styles.scheduleInfo}>
    <div className={styles.scheduleHeader}>
      <FaCalendarAlt />
      <span>جدول المحاضرات</span>
    </div>
    <div className={styles.sessionsList}>
      {course.schedule.map((session, index) => (
        <div key={index} className={styles.sessionTime}>
          <span className={styles.dayName}>{session.day_arabic}</span>
          <span className={styles.timeRange}>
            {session.start_time} - {session.end_time}
          </span>
        </div>
      ))}
    </div>
    {course.start_date && (
      <p className={styles.startDate}>
        تبدأ في: {new Date(course.start_date + 'T00:00:00').toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    )}
  </div>
)}
                      
                      {course.is_enrolled && (
                        <div className={styles.enrolledBadge}>مسجل</div>
                      )}
                    </div>
                    
                    <div className={styles.courseContent}>
                      <h3>{course.title}</h3>
                      <p className={styles.courseInstructor}>{course.teacher_name}</p>
                      <p className={styles.courseDescription}>{course.description}</p>
                      
                      {/* Schedule for live courses */}
                      {course.course_type === 'live' && course.schedule && course.schedule.length > 0 && (
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
                        <div className={styles.courseStat}>
                          <FaClock />
                          <span>{course.duration}</span>
                        </div>
                        <div className={styles.courseStat}>
                          <FaBook />
                          <span>{course.lessons_count} درس</span>
                        </div>
                        <div className={styles.courseStat}>
                          <FaUsers />
                          <span>{course.students_count} طالب</span>
                        </div>
                        <div className={styles.courseStat}>
                          <FaStar />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      
                      <div className={styles.courseFooter}>
                        <div className={styles.coursePrice}>
                          {course.original_price && (
                            <span className={styles.originalPrice}>
                              {course.original_price} جنيه
                            </span>
                          )}
                          <span className={styles.currentPrice}>{course.price} جنيه</span>
                        </div>
                        <button
                          className={`${styles.enrollButton} ${course.is_enrolled ? styles.enrolled : ''} ${course.is_full && !course.is_enrolled ? styles.disabled : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseAction(course);
                          }}
                          disabled={course.is_full && !course.is_enrolled}
                        >
                          {course.is_enrolled && course.course_type === 'live' ? (
                            <>
                              <FaBroadcastTower />
                              <span>دخول البث المباشر</span>
                            </>
                          ) : course.is_enrolled ? (
                            <>
                              <FaBook />
                              <span>متابعة الدراسة</span>
                            </>
                          ) : course.is_full ? (
                            <>
                              <FaTimes />
                              <span>مكتمل العدد</span>
                            </>
                          ) : (
                            <>
                              <FaShoppingCart />
                              <span>تسجيل الآن</span>
                            </>
                          )}
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