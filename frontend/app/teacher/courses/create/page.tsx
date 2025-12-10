"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TeacherNav from "@/components/TeacherNav/TeacherNav";
import styles from "./CreateCourse.module.css";
import {
  FaBook,
  FaVideo,
  FaImage,
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaArrowRight
} from "react-icons/fa";
import { useDropzone } from 'react-dropzone';
import Image from "next/image";
import { Hash, FileEdit, Globe, FlaskConical, Map, Building, Circle } from 'lucide-react';

import { useLanguage } from "@/hooks/useLanguage";
interface Session {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  grade: string;
  course_type: 'recorded' | 'live';
  price: string;
  original_price?: string;
  duration: string;
  lessons_count: string;
  max_seats?: string;
  start_date?: string;
  end_date?: string;
  sessions?: Session[];
  thumbnail?: File | null;
  is_active: boolean;
}

const CATEGORIES = [
  { value: 'math', label: 'الرياضيات', icon: <Hash size={20} /> },
  { value: 'arabic', label: 'اللغة العربية', icon: <FileEdit size={20} /> },
  { value: 'english', label: 'اللغة الإنجليزية', icon: <Globe size={20} /> },
  { value: 'science', label: 'العلوم', icon: <FlaskConical size={20} /> },
  { value: 'social', label: 'الدراسات الاجتماعية', icon: <Map size={20} /> },
  { value: 'religion', label: 'التربية الدينية', icon: <Building size={20} /> },
  { value: 'french', label: 'اللغة الفرنسية', icon: <span>FR</span> },
  { value: 'german', label: 'اللغة الألمانية', icon: <span>DE</span> },
];

const GRADES = [
  { group: 'الابتدائية', options: [
    { value: 'primary_1', label: 'الصف الأول الابتدائي' },
    { value: 'primary_2', label: 'الصف الثاني الابتدائي' },
    { value: 'primary_3', label: 'الصف الثالث الابتدائي' },
    { value: 'primary_4', label: 'الصف الرابع الابتدائي' },
    { value: 'primary_5', label: 'الصف الخامس الابتدائي' },
    { value: 'primary_6', label: 'الصف السادس الابتدائي' },
  ]},
  { group: 'الإعدادية', options: [
    { value: 'prep_1', label: 'الصف الأول الإعدادي' },
    { value: 'prep_2', label: 'الصف الثاني الإعدادي' },
    { value: 'prep_3', label: 'الصف الثالث الإعدادي' },
  ]},
  { group: 'الثانوية', options: [
    { value: 'secondary_1', label: 'الصف الأول الثانوي' },
    { value: 'secondary_2', label: 'الصف الثاني الثانوي' },
    { value: 'secondary_3', label: 'الصف الثالث الثانوي' },
  ]},
];

const DAYS_OF_WEEK = [
  { value: 'saturday', label: 'السبت' },
  { value: 'sunday', label: 'الأحد' },
  { value: 'monday', label: 'الإثنين' },
  { value: 'tuesday', label: 'الثلاثاء' },
  { value: 'wednesday', label: 'الأربعاء' },
  { value: 'thursday', label: 'الخميس' },
  { value: 'friday', label: 'الجمعة' },
];

export default function CreateCoursePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    category: '',
    grade: '',
    course_type: 'recorded',
    price: '',
    original_price: '',
    duration: '',
    lessons_count: '',
    is_active: true,
    sessions: []
  });

  const onDrop = (acceptedFiles: File[]) => {
  const file = acceptedFiles[0];
  if (file) {
    setFormData(prev => ({ ...prev, thumbnail: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  accept: {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif']
  },
  maxSize: 5242880,
  multiple: false
});

  useEffect(() => {
    checkAuth();
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
    if (parsedUser.type !== "teacher") {
      router.push("/");
      return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCourseTypeChange = (type: 'recorded' | 'live') => {
    setFormData(prev => ({
      ...prev,
      course_type: type,
      ...(type === 'recorded' ? {
        max_seats: undefined,
        start_date: undefined,
        end_date: undefined,
        sessions: []
      } : {
        sessions: prev.sessions?.length ? prev.sessions : [{ day_of_week: '', start_time: '', end_time: '' }]
      })
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, thumbnail: 'حجم الملف يجب أن يكون أقل من 5 ميجابايت' }));
        return;
      }

      setFormData(prev => ({ ...prev, thumbnail: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSession = () => {
    setFormData(prev => ({
      ...prev,
      sessions: [...(prev.sessions || []), { day_of_week: '', start_time: '', end_time: '' }]
    }));
  };

  const removeSession = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions?.filter((_, i) => i !== index) || []
    }));
  };

  const updateSession = (index: number, field: keyof Session, value: string) => {
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions?.map((session, i) => 
        i === index ? { ...session, [field]: value } : session
      ) || []
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'عنوان الكورس مطلوب';
        if (!formData.description.trim()) newErrors.description = 'وصف الكورس مطلوب';
        if (!formData.category) newErrors.category = 'يرجى اختيار المادة';
        if (!formData.grade) newErrors.grade = 'يرجى اختيار المرحلة الدراسية';
        break;
        
      case 2:
        if (!formData.price || parseFloat(formData.price) <= 0) {
          newErrors.price = 'السعر يجب أن يكون أكبر من صفر';
        }
        if (!formData.duration.trim()) newErrors.duration = 'مدة الكورس مطلوبة';
        if (!formData.lessons_count || parseInt(formData.lessons_count) <= 0) {
          newErrors.lessons_count = 'عدد الدروس يجب أن يكون أكبر من صفر';
        }
        
        if (formData.course_type === 'live') {
          if (!formData.max_seats || parseInt(formData.max_seats) <= 0) {
            newErrors.max_seats = 'عدد المقاعد يجب أن يكون أكبر من صفر';
          }
          if (!formData.start_date) newErrors.start_date = 'تاريخ البداية مطلوب';
          if (!formData.end_date) newErrors.end_date = 'تاريخ النهاية مطلوب';
                    if (formData.start_date && formData.end_date && new Date(formData.start_date) >= new Date(formData.end_date)) {
            newErrors.end_date = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
          }
          
          if (!formData.sessions || formData.sessions.length === 0) {
            newErrors.sessions = 'يجب إضافة جلسة واحدة على الأقل';
          } else {
            formData.sessions.forEach((session, index) => {
              if (!session.day_of_week) newErrors[`session_${index}_day`] = 'يرجى اختيار اليوم';
              if (!session.start_time) newErrors[`session_${index}_start`] = 'وقت البداية مطلوب';
              if (!session.end_time) newErrors[`session_${index}_end`] = 'وقت النهاية مطلوب';
              if (session.start_time && session.end_time && session.start_time >= session.end_time) {
                newErrors[`session_${index}_end`] = 'وقت النهاية يجب أن يكون بعد وقت البداية';
              }
            });
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;
    
    setIsSubmitting(true);
    
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('grade', formData.grade);
      submitData.append('course_type', formData.course_type);
      submitData.append('price', formData.price);
      if (formData.original_price) submitData.append('original_price', formData.original_price);
      submitData.append('duration', formData.duration);
      submitData.append('lessons_count', formData.lessons_count);
      submitData.append('is_active', formData.is_active ? '1' : '0');
      
      if (formData.thumbnail) {
        submitData.append('thumbnail', formData.thumbnail);
      }
      
      if (formData.course_type === 'live') {
        submitData.append('max_seats', formData.max_seats || '');
        submitData.append('start_date', formData.start_date || '');
        submitData.append('end_date', formData.end_date || '');
        submitData.append('sessions_per_week', String(formData.sessions?.length || 0));
        
        formData.sessions?.forEach((session, index) => {
          submitData.append(`sessions[${index}][day_of_week]`, session.day_of_week);
          submitData.append(`sessions[${index}][start_time]`, session.start_time);
          submitData.append(`sessions[${index}][end_time]`, session.end_time);
        });
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/teacher/courses`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authData.token}`,
            'Accept': 'application/json',
          },
          body: submitData
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        router.push('/teacher/dashboard');
      } else {
        setErrors({ submit: data.message || 'حدث خطأ في إنشاء الكورس' });
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setErrors({ submit: 'حدث خطأ في الاتصال بالخادم' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h2>المعلومات الأساسية</h2>
            
            <div className={styles.courseTypeSelection}>
              <label>نوع الكورس</label>
              <div className={styles.typeButtons}>
                <button
                  type="button"
                  className={`${styles.typeButton} ${formData.course_type === 'recorded' ? styles.active : ''}`}
                  onClick={() => handleCourseTypeChange('recorded')}
                >
                  <FaVideo />
                  <span>كورس مسجل</span>
                  <small>دروس مسجلة مسبقاً</small>
                </button>
                <button
                  type="button"
                  className={`${styles.typeButton} ${formData.course_type === 'live' ? styles.active : ''}`}
                  onClick={() => handleCourseTypeChange('live')}
                >
                  <span className={styles.liveIcon}><Circle className="text-red-500 fill-red-500" size={12} /></span>
                  <span>بث مباشر</span>
                  <small>دروس مباشرة مع الطلاب</small>
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="title">عنوان الكورس *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="مثال: دورة شاملة في الرياضيات للصف الأول الإعدادي"
                className={errors.title ? styles.error : ''}
              />
              {errors.title && <span className={styles.errorMessage}>{errors.title}</span>}
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label htmlFor="description">وصف الكورس *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="اكتب وصفاً تفصيلياً للكورس..."
                rows={5}
                className={errors.description ? styles.error : ''}
              />
              {errors.description && <span className={styles.errorMessage}>{errors.description}</span>}
            </div>

            {/* Category */}
            <div className={styles.formGroup}>
              <label htmlFor="category">المادة *</label>
              <div className={styles.categoryGrid}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`${styles.categoryButton} ${formData.category === cat.value ? styles.active : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  >
                    <span className={styles.categoryIcon}>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
              {errors.category && <span className={styles.errorMessage}>{errors.category}</span>}
            </div>

            {/* Grade */}
            <div className={styles.formGroup}>
              <label htmlFor="grade">المرحلة الدراسية *</label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className={errors.grade ? styles.error : ''}
              >
                <option value="">اختر المرحلة الدراسية</option>
                {GRADES.map(group => (
                  <optgroup key={group.group} label={group.group}>
                    {group.options.map(grade => (
                      <option key={grade.value} value={grade.value}>
                        {grade.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.grade && <span className={styles.errorMessage}>{errors.grade}</span>}
            </div>

            {/* Thumbnail */}
            <div className={styles.formGroup}>
              <label htmlFor="thumbnail">صورة الكورس</label>
              <div className={styles.thumbnailUpload}>
                {thumbnailPreview ? (
                  <div className={styles.thumbnailPreview}>
                    <Image height={10} width={10} src={thumbnailPreview} alt="Course thumbnail" />
                    <button
                      type="button"
                      className={styles.removeThumbnail}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, thumbnail: null }));
                        setThumbnailPreview(null);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ) : (
                  <div {...getRootProps()} className={`${styles.uploadArea} ${isDragActive ? styles.dragging : ''}`}>
                    <input {...getInputProps()} />
                    <FaImage />
                    <span>
                      {isDragActive ? 'أفلت الصورة هنا' : 'اسحب الصورة هنا أو اضغط للاختيار'}
                    </span>
                    <small>PNG, JPG حتى 5MB</small>
                  </div>
                )}
              </div>
              {errors.thumbnail && <span className={styles.errorMessage}>{errors.thumbnail}</span>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <h2>تفاصيل الكورس</h2>

            {/* Pricing */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price">السعر (جنيه) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="150"
                  min="0"
                  step="0.01"
                  className={errors.price ? styles.error : ''}
                />
                {errors.price && <span className={styles.errorMessage}>{errors.price}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="original_price">السعر الأصلي (اختياري)</label>
                <input
                  type="number"
                  id="original_price"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleInputChange}
                  placeholder="200"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Course Info */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="duration">مدة الكورس *</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="مثال: 20 ساعة"
                  className={errors.duration ? styles.error : ''}
                />
                {errors.duration && <span className={styles.errorMessage}>{errors.duration}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lessons_count">عدد الدروس *</label>
                <input
                  type="number"
                  id="lessons_count"
                  name="lessons_count"
                  value={formData.lessons_count}
                  onChange={handleInputChange}
                  placeholder="45"
                  min="1"
                  className={errors.lessons_count ? styles.error : ''}
                />
                {errors.lessons_count && <span className={styles.errorMessage}>{errors.lessons_count}</span>}
              </div>
            </div>

            {/* Live Course Specific Fields */}
            {formData.course_type === 'live' && (
              <>
                <div className={styles.liveSettings}>
                  <h3>إعدادات البث المباشر</h3>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="max_seats">عدد المقاعد المتاحة *</label>
                      <input
                        type="number"
                        id="max_seats"
                        name="max_seats"
                        value={formData.max_seats}
                        onChange={handleInputChange}
                        placeholder="30"
                        min="1"
                        className={errors.max_seats ? styles.error : ''}
                      />
                      {errors.max_seats && <span className={styles.errorMessage}>{errors.max_seats}</span>}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="start_date">تاريخ البداية *</label>
                      <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={errors.start_date ? styles.error : ''}
                      />
                      {errors.start_date && <span className={styles.errorMessage}>{errors.start_date}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="end_date">تاريخ النهاية *</label>
                                            <input
                        type="date"
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        min={formData.start_date || new Date().toISOString().split('T')[0]}
                        className={errors.end_date ? styles.error : ''}
                      />
                      {errors.end_date && <span className={styles.errorMessage}>{errors.end_date}</span>}
                    </div>
                  </div>

                  {/* Sessions Schedule */}
                  <div className={styles.sessionsSection}>
                    <div className={styles.sectionHeader}>
                      <h4>جدول الجلسات الأسبوعية</h4>
                      <button
                        type="button"
                        className={styles.addSessionButton}
                        onClick={addSession}
                      >
                        <FaPlus />
                        <span>إضافة جلسة</span>
                      </button>
                    </div>
                    
                    {errors.sessions && <span className={styles.errorMessage}>{errors.sessions}</span>}
                    
                    {formData.sessions?.map((session, index) => (
                      <div key={index} className={styles.sessionRow}>
                        <div className={styles.sessionNumber}>جلسة {index + 1}</div>
                        
                        <div className={styles.sessionFields}>
                          <div className={styles.formGroup}>
                            <label>اليوم</label>
                            <select
                              value={session.day_of_week}
                              onChange={(e) => updateSession(index, 'day_of_week', e.target.value)}
                              className={errors[`session_${index}_day`] ? styles.error : ''}
                            >
                              <option value="">اختر اليوم</option>
                              {DAYS_OF_WEEK.map(day => (
                                <option key={day.value} value={day.value}>
                                  {day.label}
                                </option>
                              ))}
                            </select>
                            {errors[`session_${index}_day`] && (
                              <span className={styles.errorMessage}>{errors[`session_${index}_day`]}</span>
                            )}
                          </div>

                          <div className={styles.formGroup}>
                            <label>وقت البداية</label>
                            <input
                              type="time"
                              value={session.start_time}
                              onChange={(e) => updateSession(index, 'start_time', e.target.value)}
                              className={errors[`session_${index}_start`] ? styles.error : ''}
                            />
                            {errors[`session_${index}_start`] && (
                              <span className={styles.errorMessage}>{errors[`session_${index}_start`]}</span>
                            )}
                          </div>

                          <div className={styles.formGroup}>
                            <label>وقت النهاية</label>
                            <input
                              type="time"
                              value={session.end_time}
                              onChange={(e) => updateSession(index, 'end_time', e.target.value)}
                              className={errors[`session_${index}_end`] ? styles.error : ''}
                            />
                            {errors[`session_${index}_end`] && (
                              <span className={styles.errorMessage}>{errors[`session_${index}_end`]}</span>
                            )}
                          </div>

                          <button
                            type="button"
                            className={styles.removeSessionButton}
                            onClick={() => removeSession(index)}
                            title="حذف الجلسة"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Active Status */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <span>نشر الكورس مباشرة</span>
                <small>يمكن للطلاب رؤية الكورس والتسجيل فيه</small>
              </label>
            </div>

            {errors.submit && (
              <div className={styles.submitError}>
                {errors.submit}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <TeacherNav />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>{t("teacher.createCourse")}</h1>
          <button 
            className={styles.backButton}
            onClick={() => router.push('/teacher/dashboard')}
          >
            <FaArrowRight />
            <span>العودة للوحة التحكم</span>
          </button>
        </div>

        <div className={styles.formContainer}>
          {/* Progress Steps */}
          <div className={styles.progressSteps}>
            <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepLabel}>المعلومات الأساسية</div>
            </div>
            <div className={styles.stepLine} />
            <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepLabel}>تفاصيل الكورس</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {renderStep()}

            <div className={styles.formActions}>
              {currentStep > 1 && (
                <button
                  type="button"
                  className={styles.previousButton}
                  onClick={handlePrevious}
                >
                  <FaArrowRight />
                  <span>{t("common.previous")}</span>
                </button>
              )}
              
              {currentStep < 2 ? (
                <button
                  type="button"
                  className={styles.nextButton}
                  onClick={handleNext}
                >
                  <span>{t("common.next")}</span>
                  <FaArrowLeft />
                </button>
              ) : (
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className={styles.spinner} />
                      <span>جاري الإنشاء...</span>
                    </>
                  ) : (
                    <>
                      <FaBook />
                      <span>إنشاء الكورس</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}