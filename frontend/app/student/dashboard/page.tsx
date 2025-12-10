"use client";

import { useState, useEffect, ReactElement } from "react";
import StudentNav from "@/components/StudentNav/StudentNav";
import styles from "./StudentDashboard.module.css";
import { FaSearch, FaBook, FaClock, FaUsers, FaStar, FaShoppingCart, FaTimes, FaVideo, FaCalendarAlt, FaBroadcastTower } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import {
  FileEdit,
  Globe,
  Hash,
  FlaskConical,
  Map,
  Building,
  BookOpen,
  Target,
  GraduationCap,
  Search,
  Circle
} from "lucide-react";

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
  const { t } = useLanguage();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    alert(t("student.courseFull"));
    return;
  }

  if (course.is_enrolled && course.course_type === 'live') {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      
      if (!authData.token) {
        alert(t("student.authTokenNotFound"));
        router.push("/login");
        return;
      }

      console.log(course)

      if (!course.schedule || course.schedule.length === 0) {
        alert(t("student.noScheduledSessions"));
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
        alert(t("auth.sessionExpired"));
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
          alert(t("student.noUpcomingLiveSessions"));
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
    
    let message = t('student.sessionStartsIn') + ' ';
    if (hoursUntil > 0) {
      message += `${hoursUntil} ${t('student.hours')}`;
      if (minutesUntil > 0) {
        message += ` ${t('common.and')} ${minutesUntil} ${t('student.minutes')}`;
      }
    } else {
      message += `${minutesUntil} ${t('student.minutes')}`;
    }
    message += '\n\n' + t('student.canJoin15MinsBefore');

    alert(message);
  } else if (data.session.minutes_until_start < -120) {
    alert(t("student.sessionEnded"));
  } else {
    alert(t("student.cannotJoinNow"));
  }
} else {
  alert(t("student.noUpcomingLiveSessions"));
  router.push(`/student/courses/${course.id}`);
}
    } catch (error) {
      console.error("Error in handleCourseAction:", error);

      alert(t("student.errorRedirectingToCourse"));
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
    const gradeKeys: { [key: string]: string } = {
      primary_1: "grades.primary_1",
      primary_2: "grades.primary_2",
      primary_3: "grades.primary_3",
      primary_4: "grades.primary_4",
      primary_5: "grades.primary_5",
      primary_6: "grades.primary_6",
      prep_1: "grades.prep_1",
      prep_2: "grades.prep_2",
      prep_3: "grades.prep_3",
      secondary_1: "grades.secondary_1",
      secondary_2: "grades.secondary_2",
      secondary_3: "grades.secondary_3",
    };
    return t(gradeKeys[grade] || grade);
  };

    const getCategoryLabel = (category: string) => {
    const categoryData: { [key: string]: { labelKey: string; icon: ReactElement } } = {
      arabic: { labelKey: "categories.arabic", icon: <FileEdit size={16} /> },
      english: { labelKey: "categories.english", icon: <Globe size={16} /> },
      math: { labelKey: "categories.math", icon: <Hash size={16} /> },
      science: { labelKey: "categories.science", icon: <FlaskConical size={16} /> },
      social: { labelKey: "categories.social", icon: <Map size={16} /> },
      religion: { labelKey: "categories.religion", icon: <Building size={16} /> },
      french: { labelKey: "categories.french", icon: <span>FR</span> },
      german: { labelKey: "categories.german", icon: <span>DE</span> },
    };
    const data = categoryData[category] || { labelKey: category, icon: <BookOpen size={16} /> };
    return { label: t(data.labelKey), icon: data.icon };
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
            <h1>{t("common.welcome")} {user?.name?.split(' ')[0]}</h1>
            <p>{t("student.availableCoursesFor")}{getGradeLabel(user?.profile?.grade || "")}</p>
          </div>
          <div className={styles.statsCards}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><BookOpen size={32} /></div>
              <div className={styles.statInfo}>
                <h3>{courses.length}</h3>
                <p>{t("student.coursesAvailable")}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><Target size={32} /></div>
              <div className={styles.statInfo}>
                <h3>{enrolledCount}</h3>
                <p>{t("student.coursesEnrolled")}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><GraduationCap size={32} /></div>
              <div className={styles.statInfo}>
                <h3>{new Set(courses.map(c => c.teacher_id)).size}</h3>
                <p>{t("student.teachersAvailable")}</p>
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

            {/* Teacher Filter */}
            <form onSubmit={handleTeacherSearch} className={styles.teacherSearchForm}>
              <div className={styles.teacherSearchBox}>
                <input
                  type="text"
                  placeholder={t("student.searchByTeacherName")}
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
              {t("student.allCourses")}
            </button>
            <button 
              className={`${styles.typeButton} ${courseTypeFilter === 'recorded' ? styles.active : ''}`}
              onClick={() => {
                setCourseTypeFilter('recorded');
                fetchCourses(teacherNameFilter, 'recorded');
              }}
            >
              <FaVideo />{t("student.recordedCourses")}
            </button>
            <button 
              className={`${styles.typeButton} ${courseTypeFilter === 'live' ? styles.active : ''}`}
              onClick={() => {
                setCourseTypeFilter('live');
                fetchCourses(teacherNameFilter, 'live');
              }}
            >
              <Circle className="text-red-500 fill-red-500" size={12} />{t("student.liveStream")}
            </button>
          </div>

          {teacherNameFilter && (
            <div className={styles.activeFilter}>
              <span>النتائج للمدرس: &quot;{teacherNameFilter}&quot;</span>
              <button onClick={clearTeacherFilter}>{t("student.clearFilter")}</button>
            </div>
          )}
        </section>

        {/* Courses Grid */}
        <section className={styles.coursesSection}>
          <div className={styles.coursesHeader}>
            <h2>{t("student.availableCourses")}</h2>
            <p>{filteredCourses.length} {t("student.courses")}</p>
          </div>

          {filteredCourses.length === 0 ? (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}><Search size={48} /></span>
              <h3>{t("student.noCoursesFound")}</h3>
              <p>{t("student.tryDifferentSearch")}</p>
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
                          <FaBook />
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
      <span>{t("student.lectureSchedule")}</span>
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
        تبدأ في: {new Date(course.start_date + 'T00:00:00').toLocaleDateString('en-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    )}
  </div>
)}
                      
                      {course.is_enrolled && (
                        <div className={styles.enrolledBadge}>{t("student.enrolled")}</div>
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
                              {t("student.startsOn")}  {new Date(course.start_date).toLocaleDateString('en-EG')}
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
                          <span>{course.lessons_count} {t("student.lesson")}</span>
                        </div>
                        <div className={styles.courseStat}>
                          <FaUsers />
                          <span>{course.students_count} {t("student.student")}</span>
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
                              {course.original_price} EGP
                            </span>
                          )}
                          <span className={styles.currentPrice}>{course.price} EGP</span>
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
                              <span>{t("student.enterLiveStream")}</span>
                            </>
                          ) : course.is_enrolled ? (
                            <>
                              <FaBook />
                              <span>{t("student.continueStudy")}</span>
                            </>
                          ) : course.is_full ? (
                            <>
                              <FaTimes />
                              <span>{t("landing.full")}</span>
                            </>
                          ) : (
                            <>
                              <FaShoppingCart />
                              <span>{t("landing.registerNow")}</span>
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