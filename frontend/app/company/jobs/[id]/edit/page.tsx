"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CompanyNav from "@/components/CompanyNav/CompanyNav";
import Link from "next/link";
import {
  FaBriefcase,
  FaArrowLeft,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = (params?.id as string) || "";

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState("full_time");
  const [workLocation, setWorkLocation] = useState("onsite");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("entry");
  const [educationRequirement, setEducationRequirement] = useState("");
  const [skillsRequired, setSkillsRequired] = useState<string[]>([]);
  const [skillsPreferred, setSkillsPreferred] = useState<string[]>([]);
  const [skillRequiredInput, setSkillRequiredInput] = useState("");
  const [skillPreferredInput, setSkillPreferredInput] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState("");
  const [facultiesPreferred, setFacultiesPreferred] = useState<string[]>([]);
  const [facultyInput, setFacultyInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [positionsAvailable, setPositionsAvailable] = useState(1);

  useEffect(() => {
    checkAuth();
    if (jobId) {
      fetchJobDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

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

  const fetchJobDetails = async () => {
    try {
      setFetchLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const job = data.job_posting;

        setTitle(job.title || "");
        setDescription(job.description || "");
        setJobType(job.job_type || "full_time");
        setWorkLocation(job.work_location || "onsite");
        setLocation(job.location || "");
        setSalaryRange(job.salary_range || "");
        setExperienceLevel(job.experience_level || "entry");
        setEducationRequirement(job.education_requirement || "");
        setSkillsRequired(job.skills_required || []);
        setSkillsPreferred(job.skills_preferred || []);
        setRequirements(job.requirements || []);
        setResponsibilities(job.responsibilities || []);
        setBenefits(job.benefits || []);
        setFacultiesPreferred(job.faculties_preferred || []);
        setDeadline(job.application_deadline || "");
        setIsActive(job.is_active);
        setPositionsAvailable(job.positions_available || 1);
      } else {
        setError("فشل في تحميل بيانات الوظيفة");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      setError("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleAddSkillRequired = () => {
    if (skillRequiredInput.trim() && !skillsRequired.includes(skillRequiredInput.trim())) {
      setSkillsRequired([...skillsRequired, skillRequiredInput.trim()]);
      setSkillRequiredInput("");
    }
  };

  const handleRemoveSkillRequired = (skill: string) => {
    setSkillsRequired(skillsRequired.filter((s) => s !== skill));
  };

  const handleAddSkillPreferred = () => {
    if (skillPreferredInput.trim() && !skillsPreferred.includes(skillPreferredInput.trim())) {
      setSkillsPreferred([...skillsPreferred, skillPreferredInput.trim()]);
      setSkillPreferredInput("");
    }
  };

  const handleRemoveSkillPreferred = (skill: string) => {
    setSkillsPreferred(skillsPreferred.filter((s) => s !== skill));
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

  const handleAddBenefit = () => {
    if (benefitInput.trim() && !benefits.includes(benefitInput.trim())) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput("");
    }
  };

  const handleRemoveBenefit = (benefit: string) => {
    setBenefits(benefits.filter((b) => b !== benefit));
  };

  const handleAddFaculty = () => {
    if (facultyInput.trim() && !facultiesPreferred.includes(facultyInput.trim())) {
      setFacultiesPreferred([...facultiesPreferred, facultyInput.trim()]);
      setFacultyInput("");
    }
  };

  const handleRemoveFaculty = (faculty: string) => {
    setFacultiesPreferred(facultiesPreferred.filter((f) => f !== faculty));
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

    if (skillsRequired.length === 0) {
      setError("يرجى إضافة مهارة واحدة على الأقل");
      return;
    }

    if (requirements.length === 0) {
      setError("يرجى إضافة متطلب واحد على الأقل");
      return;
    }

    if (responsibilities.length === 0) {
      setError("يرجى إضافة مسؤولية واحدة على الأقل");
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
        education_requirement: educationRequirement.trim() || null,
        skills_required: skillsRequired,
        skills_preferred: skillsPreferred,
        requirements,
        responsibilities,
        benefits,
        faculties_preferred: facultiesPreferred,
        application_deadline: deadline || null,
        is_active: isActive,
        positions_available: positionsAvailable,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/jobs/${jobId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        router.push(`/company/jobs/${jobId}`);
      } else {
        const data = await response.json();
        setError(data.message || "فشل في تحديث الوظيفة");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      setError("حدث خطأ أثناء تحديث الوظيفة");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[var(--main-color)] text-[var(--main-text-white)]" dir="rtl">
        <CompanyNav />
        <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
          <div className="w-12 h-12 border-4 border-[var(--borders)] border-t-[#58a6ff] rounded-full animate-spin"></div>
          <p className="text-[var(--p-text)]">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--main-color)] text-[var(--main-text-white)]" dir="rtl">
      <CompanyNav />

      <main className="max-w-5xl mx-auto px-6 py-24">
        <div className="mb-6">
          <Link
            href={`/company/jobs/${jobId}`}
            className="inline-flex items-center gap-2 text-[var(--p-text)] hover:text-[#58a6ff] transition-colors"
          >
            <FaArrowLeft className="text-sm" />
            <span>العودة لصفحة الوظيفة</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FaBriefcase className="text-[#58a6ff]" />
            تعديل الوظيفة
          </h1>
          <p className="text-[var(--p-text)]">قم بتحديث بيانات الوظيفة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg p-4">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">المعلومات الأساسية</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  عنوان الوظيفة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                  placeholder="مثال: مطور ويب Full Stack"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  وصف الوظيفة <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all resize-none"
                  placeholder="اكتب وصفاً مفصلاً للوظيفة..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">نوع الوظيفة</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                  >
                    <option value="full_time">دوام كامل</option>
                    <option value="part_time">دوام جزئي</option>
                    <option value="internship">تدريب</option>
                    <option value="contract">عقد</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">طبيعة العمل</label>
                  <select
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                  >
                    <option value="onsite">حضوري</option>
                    <option value="remote">عن بعد</option>
                    <option value="hybrid">مختلط</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الموقع</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                    placeholder="مثال: القاهرة، مصر"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">نطاق الراتب</label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                    placeholder="مثال: 5000 - 8000 جنيه"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">مستوى الخبرة المطلوب</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                  >
                    <option value="entry">مبتدئ (0-1 سنة)</option>
                    <option value="junior">متوسط (1-3 سنوات)</option>
                    <option value="mid">متقدم (3-5 سنوات)</option>
                    <option value="senior">خبير (+5 سنوات)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    عدد الوظائف المتاحة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={positionsAvailable}
                    onChange={(e) => setPositionsAvailable(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                    placeholder="مثال: 1"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">المؤهل العلمي المطلوب</label>
                <input
                  type="text"
                  value={educationRequirement}
                  onChange={(e) => setEducationRequirement(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                  placeholder="مثال: بكالوريوس في علوم الحاسب"
                />
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">
              المهارات المطلوبة <span className="text-red-500">*</span>
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={skillRequiredInput}
                onChange={(e) => setSkillRequiredInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkillRequired())}
                className="flex-1 px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                placeholder="أضف مهارة واضغط Enter أو على زر الإضافة"
              />
              <button
                type="button"
                onClick={handleAddSkillRequired}
                className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-all flex items-center gap-2"
              >
                <FaPlus /> إضافة
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skillsRequired.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 text-[#58a6ff] border border-blue-500/30 rounded-lg"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkillRequired(skill)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">مهارات مفضلة (اختياري)</h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={skillPreferredInput}
                onChange={(e) => setSkillPreferredInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkillPreferred())}
                className="flex-1 px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                placeholder="أضف مهارة مفضلة"
              />
              <button
                type="button"
                onClick={handleAddSkillPreferred}
                className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-all flex items-center gap-2"
              >
                <FaPlus /> إضافة
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skillsPreferred.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-lg"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkillPreferred(skill)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">
              المتطلبات <span className="text-red-500">*</span>
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddRequirement())}
                className="flex-1 px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                placeholder="أضف متطلباً واضغط Enter"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-all flex items-center gap-2"
              >
                <FaPlus /> إضافة
              </button>
            </div>

            <div className="space-y-2">
              {requirements.map((requirement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-[var(--main-color)] border border-[var(--borders)] rounded-lg"
                >
                  <span className="flex-1 text-[var(--p-text)]">{requirement}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(requirement)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">
              المسؤوليات <span className="text-red-500">*</span>
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddResponsibility())}
                className="flex-1 px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                placeholder="أضف مسؤولية واضغط Enter"
              />
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-all flex items-center gap-2"
              >
                <FaPlus /> إضافة
              </button>
            </div>

            <div className="space-y-2">
              {responsibilities.map((responsibility, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-[var(--main-color)] border border-[var(--borders)] rounded-lg"
                >
                  <span className="flex-1 text-[var(--p-text)]">{responsibility}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(responsibility)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">المزايا والحوافز (اختياري)</h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddBenefit())}
                className="flex-1 px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                placeholder="أضف ميزة واضغط Enter"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-all flex items-center gap-2"
              >
                <FaPlus /> إضافة
              </button>
            </div>

            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-[var(--main-color)] border border-[var(--borders)] rounded-lg"
                >
                  <span className="flex-1 text-[var(--p-text)]">{benefit}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(benefit)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Faculties Preferred */}
          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">التخصصات المفضلة (اختياري)</h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={facultyInput}
                onChange={(e) => setFacultyInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFaculty())}
                className="flex-1 px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                placeholder="أضف تخصص واضغط Enter"
              />
              <button
                type="button"
                onClick={handleAddFaculty}
                className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-all flex items-center gap-2"
              >
                <FaPlus /> إضافة
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {facultiesPreferred.map((faculty, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 text-purple-500 border border-purple-500/30 rounded-lg"
                >
                  <span>{faculty}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaculty(faculty)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">معلومات إضافية</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">آخر موعد للتقديم</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 text-[#58a6ff] bg-[var(--input-color)] border-[var(--input-border-color)] rounded focus:ring-2 focus:ring-[#58a6ff]/20"
                />
                <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                  الوظيفة نشطة (يمكن للطلاب التقديم)
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#238636] hover:bg-[#2ea043] disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
            >
              {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
            <Link
              href={`/company/jobs/${jobId}`}
              className="px-6 py-3 bg-[var(--input-color)] hover:bg-[var(--input-border-color)] text-[var(--main-text-white)] border border-[var(--borders)] rounded-lg font-medium transition-all text-center"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
