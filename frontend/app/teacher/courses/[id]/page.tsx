"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import TeacherNav from "@/components/TeacherNav/TeacherNav";
import styles from "./CourseDetail.module.css";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import {
  FaArrowRight,
  FaPlus,
  FaVideo,
  FaEdit,
  FaTrash,
  FaEye,
  FaUpload,
  FaYoutube,
  FaFile,
  FaClock,
  FaGripVertical,
  FaUnlock,
  FaBook,
  FaImage,
} from "react-icons/fa";

type VideoType = "youtube" | "vimeo" | "upload" | "embed";

interface Lesson {
  id: number;
  title: string;
  description?: string;
  video_url?: string;
  video_type: VideoType;
  duration: string;
  order_index: number;
  is_preview: boolean;
  created_at: string;
}

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
  course_type: "recorded" | "live";
  is_active: boolean;
  lessons?: Lesson[];
}

export default function CourseDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    video_url: "",
    video_type: "youtube" as VideoType,
    duration: "",
    is_preview: false,
    video_file: null as File | null,
    thumbnail_file: null as File | null,
  });

  const checkAuth = useCallback(() => {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("authData");

    if (!userData || !authData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.type !== "teacher") {
      router.push("/");
      return;
    }
  }, [router]);

  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
        }/api/teacher/courses/${courseId}`,
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
        setLessons(data.course.lessons || []);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    checkAuth();
    fetchCourseData();
  }, [checkAuth, fetchCourseData]);

  const validateLessonForm = () => {
    const newErrors: Record<string, string> = {};

    if (!lessonForm.title.trim()) {
      newErrors.title = "عنوان الدرس مطلوب";
    }

    if (
      lessonForm.video_type === "upload" &&
      !lessonForm.video_file &&
      !editingLesson
    ) {
      newErrors.video_file = "يرجى اختيار ملف الفيديو";
    } else if (
      lessonForm.video_type !== "upload" &&
      !lessonForm.video_url.trim()
    ) {
      newErrors.video_url = "رابط الفيديو مطلوب";
    }

    if (!lessonForm.duration.trim()) {
      newErrors.duration = "مدة الدرس مطلوبة";
    } else if (
      !/^([0-9]{1,2}:)?[0-5][0-9]:[0-5][0-9]$/.test(lessonForm.duration)
    ) {
      newErrors.duration = "صيغة غير صحيحة. استخدم MM:SS أو HH:MM:SS";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLessonForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const formData = new FormData();

      formData.append("title", lessonForm.title);
      formData.append("description", lessonForm.description);
      formData.append("video_type", lessonForm.video_type);
      formData.append("duration", lessonForm.duration);
      formData.append("is_preview", lessonForm.is_preview ? "1" : "0");
      formData.append("order_index", String(lessons.length + 1));

      if (lessonForm.thumbnail_file) {
        formData.append("thumbnail", lessonForm.thumbnail_file);
      }

      if (lessonForm.video_type === "upload" && lessonForm.video_file) {
        formData.append("video_file", lessonForm.video_file);
      } else {
        formData.append("video_url", lessonForm.video_url);
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
        }/api/teacher/courses/${courseId}/lessons`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        fetchCourseData();
        setShowAddLesson(false);
        resetForm();
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || "حدث خطأ في إضافة الدرس" });
      }
    } catch (error) {
      console.error("Error adding lesson:", error);
      setErrors({ submit: "حدث خطأ في الاتصال بالخادم" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingLesson || !validateLessonForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
        }/api/teacher/lessons/${editingLesson.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: lessonForm.title,
            description: lessonForm.description,
            video_url:
              lessonForm.video_type !== "upload"
                ? lessonForm.video_url
                : undefined,
            video_type: lessonForm.video_type,
            duration: lessonForm.duration,
            is_preview: lessonForm.is_preview,
          }),
        }
      );

      if (response.ok) {
        fetchCourseData();
        setEditingLesson(null);
        setShowAddLesson(false);
        resetForm();
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || "حدث خطأ في تحديث الدرس" });
      }
    } catch (error) {
      console.error("Error updating lesson:", error);
      setErrors({ submit: "حدث خطأ في الاتصال بالخادم" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الدرس؟")) return;

    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
        }/api/teacher/lessons/${lessonId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      if (response.ok) {
        fetchCourseData();
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  const resetForm = () => {
    setLessonForm({
      title: "",
      description: "",
      video_url: "",
      video_type: "youtube",
      duration: "",
      is_preview: false,
      video_file: null,
      thumbnail_file: null,
    });
    setErrors({});
    setUploadProgress(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          video_file: "حجم الملف يجب أن يكون أقل من 500 ميجابايت",
        }));
        return;
      }
      setLessonForm((prev) => ({ ...prev, video_file: file }));
      setErrors((prev) => ({ ...prev, video_file: "" }));
    }
  };

  const handleLessonThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          thumbnail_file: "حجم الملف يجب أن يكون أقل من 5 ميجابايت",
        }));
        return;
      }
      setLessonForm((prev) => ({ ...prev, thumbnail_file: file }));
      setErrors((prev) => ({ ...prev, thumbnail_file: "" }));
    }
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

  if (!courseId) {
    return (
      <div className={styles.container}>
        <TeacherNav />
        <div className={styles.errorContainer}>
          <p>لم يتم العثور على الكورس</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TeacherNav />

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/teacher/dashboard")}
          >
            <FaArrowRight />
            <span>العودة</span>
          </button>

          <div className={styles.headerActions}>
            <button
              className={styles.editButton}
              onClick={() => router.push(`/teacher/courses/${courseId}/edit`)}
            >
              <FaEdit />
              <span>تعديل الكورس</span>
            </button>
            <button className={styles.previewButton}>
              <FaEye />
              <span>معاينة</span>
            </button>
          </div>
        </div>

        {/* Course Info */}
        <section className={styles.courseInfo}>
          <div className={styles.courseHeader}>
              <div className={styles.thumbnail}>
                <Image
                  src={
                    course?.thumbnail
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}/storage/${course.thumbnail}`
                      : "/default-course-thumbnail.png"
                  }
                  alt={course?.title || "Course thumbnail"}
                  width={200}
                  height={150}
                  style={{ objectFit: "cover" }}
                />
              </div>
            <div className={styles.courseDetails}>
              <h1>{course?.title}</h1>
              <p>{course?.description}</p>
              <div className={styles.courseMeta}>
                <span>{course?.students_count} طالب</span>
                <span>•</span>
                <span>{lessons.length} درس</span>
                <span>•</span>
                <span>{course?.duration}</span>
                <span>•</span>
                <span
                  className={
                    course?.is_active ? styles.active : styles.inactive
                  }
                >
                  {course?.is_active ? {t("common.active")} : "غير نشط"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Lessons Section */}
        <section className={styles.lessonsSection}>
          <div className={styles.sectionHeader}>
            <h2>
              <FaBook />
              <span>محتوى الكورس</span>
            </h2>
            <button
              className={styles.addButton}
              onClick={() => {
                setShowAddLesson(true);
                setEditingLesson(null);
                resetForm();
              }}
            >
              <FaPlus />
              <span>إضافة درس</span>
            </button>
          </div>

          {lessons.length === 0 ? (
            <div className={styles.noLessons}>
              <FaVideo className={styles.noLessonsIcon} />
              <h3>لا توجد دروس حتى الآن</h3>
              <p>ابدأ بإضافة أول درس في الكورس</p>
            </div>
          ) : (
            <div className={styles.lessonsList}>
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className={styles.lessonItem}>
                  <div className={styles.lessonHandle}>
                    <FaGripVertical />
                    <span className={styles.lessonNumber}>{index + 1}</span>
                  </div>

                  <div className={styles.lessonContent}>
                    <div className={styles.lessonInfo}>
                      <h3>{lesson.title}</h3>
                      {lesson.description && <p>{lesson.description}</p>}
                      <div className={styles.lessonMeta}>
                        <span>
                          <FaClock />
                          {lesson.duration}
                        </span>
                        <span>
                          <FaVideo />
                          {lesson.video_type === "youtube"
                            ? "YouTube"
                            : lesson.video_type === "vimeo"
                            ? "Vimeo"
                            : lesson.video_type === "upload"
                            ? "رفع مباشر"
                            : "رابط خارجي"}
                        </span>
                        {lesson.is_preview && (
                          <span className={styles.previewBadge}>
                            <FaUnlock />
                            معاينة مجانية
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.lessonActions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => {
                          setEditingLesson(lesson);
                          setLessonForm({
                            title: lesson.title,
                            description: lesson.description || "",
                            video_url: lesson.video_url || "",
                            video_type: lesson.video_type,
                            duration: lesson.duration,
                            is_preview: lesson.is_preview,
                            video_file: null,
                            thumbnail_file: null,
                          });
                          setShowAddLesson(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add/Edit Lesson Modal */}
        {showAddLesson && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>{editingLesson ? "تعديل الدرس" : "إضافة درس جديد"}</h2>
                <button
                  className={styles.closeButton}
                  onClick={() => {
                    setShowAddLesson(false);
                    setEditingLesson(null);
                    resetForm();
                  }}
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={editingLesson ? handleUpdateLesson : handleAddLesson}
              >
                <div className={styles.formGroup}>
                  <label>عنوان الدرس *</label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="مثال: مقدمة في الجبر"
                    className={errors.title ? styles.error : ""}
                  />
                  {errors.title && (
                    <span className={styles.errorMessage}>{errors.title}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>وصف الدرس (اختياري)</label>
                  <textarea
                    value={lessonForm.description}
                    onChange={(e) =>
                      setLessonForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="شرح مختصر عن محتوى الدرس..."
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>نوع الفيديو</label>
                  <div className={styles.videoTypeButtons}>
                    <button
                      type="button"
                      className={
                        lessonForm.video_type === "youtube" ? styles.active : ""
                      }
                      onClick={() =>
                        setLessonForm((prev) => ({
                          ...prev,
                          video_type: "youtube",
                        }))
                      }
                    >
                      <FaYoutube />
                      <span>YouTube</span>
                    </button>
                    <button
                      type="button"
                      className={
                        lessonForm.video_type === "vimeo" ? styles.active : ""
                      }
                      onClick={() =>
                        setLessonForm((prev) => ({
                          ...prev,
                          video_type: "vimeo",
                        }))
                      }
                    >
                      <span>Vimeo</span>
                    </button>
                    <button
                      type="button"
                      className={
                        lessonForm.video_type === "upload" ? styles.active : ""
                      }
                      onClick={() =>
                        setLessonForm((prev) => ({
                          ...prev,
                          video_type: "upload",
                        }))
                      }
                    >
                      <FaUpload />
                      <span>رفع فيديو</span>
                    </button>
                    <button
                      type="button"
                      className={
                        lessonForm.video_type === "embed" ? styles.active : ""
                      }
                      onClick={() =>
                        setLessonForm((prev) => ({
                          ...prev,
                          video_type: "embed",
                        }))
                      }
                    >
                      <FaFile />
                      <span>رابط خارجي</span>
                    </button>
                  </div>
                </div>

                {lessonForm.video_type !== "upload" ? (
                  <div className={styles.formGroup}>
                    <label>رابط الفيديو *</label>
                    <input
                      type="url"
                      value={lessonForm.video_url}
                      onChange={(e) =>
                        setLessonForm((prev) => ({
                          ...prev,
                          video_url: e.target.value,
                        }))
                      }
                      placeholder={
                        lessonForm.video_type === "youtube"
                          ? "https://www.youtube.com/watch?v=..."
                          : lessonForm.video_type === "vimeo"
                          ? "https://vimeo.com/..."
                          : "https://..."
                      }
                      className={errors.video_url ? styles.error : ""}
                    />
                    {errors.video_url && (
                      <span className={styles.errorMessage}>
                        {errors.video_url}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className={styles.formGroup}>
                    <label>رفع الفيديو *</label>
                    <div className={styles.uploadSection}>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        id="video-upload"
                        className={styles.fileInput}
                      />
                      <label
                        htmlFor="video-upload"
                        className={styles.uploadButton}
                      >
                        <FaUpload />
                        <span>
                          {lessonForm.video_file
                            ? lessonForm.video_file.name
                            : "اختر ملف الفيديو"}
                        </span>
                      </label>
                      <small>الحد الأقصى: 500MB - MP4, MOV, AVI, WMV</small>
                    </div>
                    {errors.video_file && (
                      <span className={styles.errorMessage}>
                        {errors.video_file}
                      </span>
                    )}

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className={styles.uploadProgress}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <span>{uploadProgress}% مكتمل</span>
                      </div>
                    )}
                  </div>
                )}
                <div className={styles.formGroup}>
                  <label>صورة الدرس (اختياري)</label>
                  <div className={styles.uploadSection}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLessonThumbnailChange}
                      id="lesson-thumbnail-upload"
                      className={styles.fileInput}
                    />
                    <label
                      htmlFor="lesson-thumbnail-upload"
                      className={styles.uploadButton}
                    >
                      <FaImage />
                      <span>
                        {lessonForm.thumbnail_file
                          ? lessonForm.thumbnail_file.name
                          : "اختر صورة للدرس"}
                      </span>
                    </label>
                    <small>PNG, JPG حتى 5MB</small>
                  </div>
                  {errors.thumbnail_file && (
                    <span className={styles.errorMessage}>
                      {errors.thumbnail_file}
                    </span>
                  )}
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>مدة الدرس *</label>
                    <input
                      type="text"
                      value={lessonForm.duration}
                      onChange={(e) =>
                        setLessonForm((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      placeholder="مثال: 15:30 أو 1:20:00"
                      className={errors.duration ? styles.error : ""}
                    />
                    <small>الصيغة: MM:SS أو HH:MM:SS</small>
                    {errors.duration && (
                      <span className={styles.errorMessage}>
                        {errors.duration}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={lessonForm.is_preview}
                        onChange={(e) =>
                          setLessonForm((prev) => ({
                            ...prev,
                            is_preview: e.target.checked,
                          }))
                        }
                      />
                      <span>معاينة مجانية</span>
                      <small>يمكن للطلاب غير المسجلين مشاهدة هذا الدرس</small>
                    </label>
                  </div>
                </div>

                {errors.submit && (
                  <div className={styles.submitError}>{errors.submit}</div>
                )}

                <div className={styles.modalActions}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className={styles.spinner} />
                        <span>
                          {editingLesson
                            ? "جاري التحديث..."
                            : "جاري الإضافة..."}
                        </span>
                      </>
                    ) : (
                      <span>
                        {editingLesson ? "حفظ التغييرات" : "إضافة الدرس"}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowAddLesson(false);
                      setEditingLesson(null);
                      resetForm();
                    }}
                    disabled={isSubmitting}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
