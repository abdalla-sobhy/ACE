"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import StudentNav from "@/components/StudentNav/StudentNav";
import styles from "./CourseView.module.css";
import { FaPlay, FaLock, FaClock, FaArrowRight, FaShoppingCart, FaCreditCard } from "react-icons/fa";

interface Lesson {
  id: number;
  title: string;
  description?: string;
  video_url?: string;
  video_type: string;
  duration: string;
  order_index: number;
  is_preview: boolean;
  thumbnail?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  teacher_name: string;
  price: number;
  original_price?: number;
  is_enrolled: boolean;
  lessons?: Lesson[];
  course_type: 'recorded' | 'live';
  is_full?: boolean;
  seats_left?: number;
}

export default function StudentCourseView() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/courses/${courseId}/view`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
        
        if (data.course.lessons?.length > 0) {
          const firstLesson = data.course.is_enrolled 
            ? data.course.lessons[0]
            : data.course.lessons.find((l: Lesson) => l.is_preview);
          setCurrentLesson(firstLesson || null);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u') ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    if (videoRef.current) {
      videoRef.current.setAttribute('controlsList', 'nodownload');
      videoRef.current.disablePictureInPicture = true;
      videoRef.current.addEventListener('contextmenu', handleContextMenu);
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      const currentVideo = videoRef.current;
      if (currentVideo) {
        currentVideo.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  }, [currentLesson]);

  const handlePayment = () => {
    router.push(`/student/payment/${courseId}`);
  };

  const handleEnroll = async () => {
    if (course?.price === 0) {
      setEnrolling(true);
      try {
        const authData = JSON.parse(localStorage.getItem("authData") || "{}");
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/courses/${courseId}/enroll`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authData.token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          await fetchCourseData();
          alert("تم التسجيل في الكورس بنجاح!");
        } else {
          const data = await response.json();
          alert(data.message || "حدث خطأ في التسجيل");
        }
      } catch (error) {
        console.error("Error enrolling:", error);
        alert("حدث خطأ في التسجيل");
      } finally {
        setEnrolling(false);
      }
    } else {
      handlePayment();
    }
  };

  const getVideoUrl = (lesson: Lesson) => {
  if (!lesson.video_url) return '';
  
  if (lesson.video_type === 'youtube') {
    const match = lesson.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : lesson.video_url;
  }
  
  if (lesson.video_type === 'upload') {
    const authData = JSON.parse(localStorage.getItem("authData") || "{}");
    const token = authData.token;
    
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stream/lesson/${lesson.id}?token=${token}`;
  }
  
  return lesson.video_url;
};

  if (loading) {
    return (
      <div className={styles.container}>
        <StudentNav />
        <div className={styles.loader}>جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <StudentNav />
      
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={() => router.push('/student/dashboard')}>
            <FaArrowRight /> رجوع
          </button>
          <h1>{course?.title}</h1>
        </div>

        {/* Enrollment Banner for Non-enrolled Users */}
        {!course?.is_enrolled && (
          <div className={styles.enrollmentBanner}>
            <div className={styles.bannerContent}>
              <div className={styles.bannerInfo}>
                <h2>احصل على الوصول الكامل للكورس</h2>
                <p>شاهد جميع الدروس وابدأ رحلة التعلم الآن</p>
                {course?.course_type === 'live' && course.is_full ? (
                  <p className={styles.fullNotice}>عذراً، هذا الكورس مكتمل العدد</p>
                ) : course?.course_type === 'live' && course.seats_left ? (
                  <p className={styles.seatsNotice}>متبقي {course.seats_left} مقاعد فقط!</p>
                ) : null}
              </div>
              <div className={styles.bannerActions}>
                <div className={styles.priceInfo}>
                  {course?.original_price && course.original_price > course.price && (
                    <span className={styles.originalPrice}>{course.original_price} جنيه</span>
                  )}
                  <span className={styles.currentPrice}>{course?.price} جنيه</span>
                </div>
                <button 
                  className={styles.enrollButton}
                  onClick={handleEnroll}
                  disabled={enrolling || (course?.course_type === 'live' && course?.is_full)}
                >
                  {enrolling ? (
                    "جاري المعالجة..."
                  ) : course?.price === 0 ? (
                    <>
                      <FaShoppingCart /> سجل مجاناً
                    </>
                  ) : course?.course_type === 'live' && course?.is_full ? (
                    "مكتمل العدد"
                  ) : (
                    <>
                      <FaCreditCard /> اشترك الآن
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.content}>
          {/* Video Player with Download Prevention */}
          <div className={styles.videoSection}>
            {currentLesson && (course?.is_enrolled || currentLesson.is_preview) ? (
              <div className={styles.videoWrapper}>
                {currentLesson.video_type === 'upload' ? (
                  <div className={styles.secureVideoContainer}>
                    <video
                      src={getVideoUrl(currentLesson)}
                      className={styles.videoPlayer}
                      controls
                      controlsList="nodownload"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    <div className={styles.videoOverlay} />
                  </div>
                ) : (
                  <div className={styles.secureVideoContainer}>
                    <iframe
                      src={getVideoUrl(currentLesson)}
                      className={styles.videoPlayer}
                      allowFullScreen
                    />
                  </div>
                )}
                <h2>{currentLesson.title}</h2>
                {currentLesson.description && <p>{currentLesson.description}</p>}
              </div>
            ) : (
              <div className={styles.locked}>
                {course?.is_enrolled? (
                  <>
                    <h3>لا يوجد دروس حتي الآن</h3>
                    <p>في حالة رفع أي درس جديد سيصلك أشعار علي البريد الألكتروني</p>
                  </>
                ):(<>
                  <FaLock />
                  <h3>محتوى مغلق</h3>
                  <p>يجب الاشتراك في الكورس لمشاهدة هذا الدرس</p>
                  </>
                )}
                
                {!course?.is_enrolled && (
                  <button 
                    className={styles.unlockButton}
                    onClick={handleEnroll}
                    disabled={enrolling || (course?.course_type === 'live' && course?.is_full)}
                  >
                    {course?.price === 0 ? "سجل مجاناً" : "اشترك للمشاهدة"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Lessons List */}
          <div className={styles.lessonsList}>
            <h3>الدروس ({course?.lessons?.length || 0})</h3>
            
            {course?.lessons?.map((lesson, index) => {
              const isAccessible = course.is_enrolled || lesson.is_preview;
              
              return (
                <div
                  key={lesson.id}
                  className={`${styles.lessonItem} ${
                    currentLesson?.id === lesson.id ? styles.active : ''
                  } ${!isAccessible ? styles.locked : ''}`}
                  onClick={() => isAccessible && setCurrentLesson(lesson)}
                >
                  <span className={styles.lessonNumber}>{index + 1}</span>
                  <div className={styles.lessonInfo}>
                    <h4>{lesson.title}</h4>
                    <div className={styles.lessonMeta}>
                      <span><FaClock /> {lesson.duration}</span>
                      {lesson.is_preview && !course.is_enrolled && (
                        <span className={styles.previewBadge}>معاينة مجانية</span>
                      )}
                    </div>
                  </div>
                  {isAccessible ? <FaPlay /> : <FaLock />}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}