"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CompanyNav from "@/components/CompanyNav/CompanyNav";
import styles from "./CreateJob.module.css";
import {
  FaBriefcase,
  FaArrowRight,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState("full_time");
  const [workLocation, setWorkLocation] = useState("onsite");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("entry");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [benefits, setBenefits] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isActive, setIsActive] = useState(true);

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
    if (parsedUser.type !== "company") {
      router.push("/");
      return;
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim() && !requirements.includes(requirementInput.trim())) {
      setRequirements([...requirements, requirementInput.trim()]);
      setRequirementInput("");
    }
  };

  const handleRemoveRequirement = (requirement: string) => {
    setRequirements(requirements.filter((r) => r !== requirement));
  };

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim() && !responsibilities.includes(responsibilityInput.trim())) {
      setResponsibilities([...responsibilities, responsibilityInput.trim()]);
      setResponsibilityInput("");
    }
  };

  const handleRemoveResponsibility = (responsibility: string) => {
    setResponsibilities(responsibilities.filter((r) => r !== responsibility));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("يرجى إدخال عنوان الوظيفة");
      return;
    }

    if (!description.trim()) {
      setError("يرجى إدخال وصف الوظيفة");
      return;
    }

    if (skills.length === 0) {
      setError("يرجى إضافة مهارة واحدة على الأقل");
      return;
    }

    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const payload = {
        title: title.trim(),
        description: description.trim(),
        job_type: jobType,
        work_location: workLocation,
        location: location.trim() || null,
        salary_range: salaryRange.trim() || null,
        experience_level: experienceLevel,
        skills,
        requirements,
        responsibilities,
        benefits: benefits.trim() || null,
        deadline: deadline || null,
        is_active: isActive,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/jobs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        router.push("/company/jobs");
      } else {
        const data = await response.json();
        setError(data.message || "فشل في إنشاء الوظيفة");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      setError("حدث خطأ أثناء إنشاء الوظيفة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <CompanyNav />

      <main className={styles.main}>
        <div className={styles.header}>
          <Link href="/company/jobs" className={styles.backLink}>
            <FaArrowRight /> العودة للوظائف
          </Link>
          <h1 className={styles.title}>
            <FaBriefcase /> إضافة وظيفة جديدة
          </h1>
          <p className={styles.subtitle}>
            قم بملء البيانات التالية لإنشاء إعلان وظيفي جديد
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>المعلومات الأساسية</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                عنوان الوظيفة <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                placeholder="مثال: مطور ويب Full Stack"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                وصف الوظيفة <span className={styles.required}>*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
                placeholder="اكتب وصفاً مفصلاً للوظيفة..."
                rows={6}
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>نوع الوظيفة</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className={styles.select}
                >
                  <option value="full_time">دوام كامل</option>
                  <option value="part_time">دوام جزئي</option>
                  <option value="internship">تدريب</option>
                  <option value="contract">عقد</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>طبيعة العمل</label>
                <select
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  className={styles.select}
                >
                  <option value="onsite">حضوري</option>
                  <option value="remote">عن بعد</option>
                  <option value="hybrid">مختلط</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>الموقع</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={styles.input}
                  placeholder="مثال: القاهرة، مصر"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>نطاق الراتب</label>
                <input
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className={styles.input}
                  placeholder="مثال: 5000 - 8000 جنيه"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>مستوى الخبرة المطلوب</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className={styles.select}
              >
                <option value="entry">مبتدئ (0-1 سنة)</option>
                <option value="junior">متوسط (1-3 سنوات)</option>
                <option value="mid">متقدم (3-5 سنوات)</option>
                <option value="senior">خبير (+5 سنوات)</option>
              </select>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              المهارات المطلوبة <span className={styles.required}>*</span>
            </h2>

            <div className={styles.arrayInput}>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                className={styles.input}
                placeholder="أضف مهارة واضغط Enter أو على زر الإضافة"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className={styles.addButton}
              >
                <FaPlus /> إضافة
              </button>
            </div>

            <div className={styles.tagsList}>
              {skills.map((skill, index) => (
                <div key={index} className={styles.tag}>
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className={styles.removeTag}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>المتطلبات</h2>

            <div className={styles.arrayInput}>
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddRequirement())}
                className={styles.input}
                placeholder="أضف متطلباً واضغط Enter"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className={styles.addButton}
              >
                <FaPlus /> إضافة
              </button>
            </div>

            <div className={styles.tagsList}>
              {requirements.map((requirement, index) => (
                <div key={index} className={styles.tag}>
                  <span>{requirement}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(requirement)}
                    className={styles.removeTag}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>المسؤوليات</h2>

            <div className={styles.arrayInput}>
              <input
                type="text"
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddResponsibility())}
                className={styles.input}
                placeholder="أضف مسؤولية واضغط Enter"
              />
              <button
                type="button"
                onClick={handleAddResponsibility}
                className={styles.addButton}
              >
                <FaPlus /> إضافة
              </button>
            </div>

            <div className={styles.tagsList}>
              {responsibilities.map((responsibility, index) => (
                <div key={index} className={styles.tag}>
                  <span>{responsibility}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(responsibility)}
                    className={styles.removeTag}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>معلومات إضافية</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>المزايا والحوافز</label>
              <textarea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className={styles.textarea}
                placeholder="اذكر المزايا والحوافز المقدمة..."
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>آخر موعد للتقديم</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>نشر الوظيفة فوراً</span>
              </label>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "جاري الإنشاء..." : "نشر الوظيفة"}
            </button>
            <Link href="/company/jobs" className={styles.cancelButton}>
              إلغاء
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
