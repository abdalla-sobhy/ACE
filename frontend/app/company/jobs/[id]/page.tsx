"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CompanyNav from "@/components/CompanyNav/CompanyNav";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaEdit,
  FaTrash,
  FaUsers,
  FaCheckCircle,
  FaEye,
  FaMoneyBillWave,
  FaGraduationCap,
  FaLaptopCode,
  FaTasks,
  FaLightbulb,
  FaGift,
  FaArrowLeft,
} from "react-icons/fa";

interface JobPosting {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills_required: string[];
  skills_preferred: string[];
  job_type: string;
  work_location: string;
  location: string | null;
  salary_range: string | null;
  experience_level: string;
  education_requirement: string | null;
  faculties_preferred: string[];
  positions_available: number;
  application_deadline: string | null;
  is_active: boolean;
  views_count: number;
  applications_count: number;
  applications_status: {
    pending: number;
    reviewing: number;
    shortlisted: number;
    interviewed: number;
    accepted: number;
    rejected: number;
  };
  created_at: string;
  updated_at: string;
  is_expired: boolean;
}

export default function JobDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const jobId = (params?.id as string) || "";

  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setLoading(true);
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
        setJob(data.job_posting);
      } else {
        setError(t("companyJobs.loadError"));
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      setError(t("companyJobs.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!confirm(t("companyJobs.deleteConfirm"))) {
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        router.push("/company/jobs");
      } else {
        const data = await response.json();
        alert(data.message || t("companyJobs.deleteError"));
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert(t("companyJobs.deleteError"));
    }
  };

  const getJobTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      full_time: t("companyJobs.fullTime"),
      part_time: t("companyJobs.partTime"),
      internship: t("companyJobs.internship"),
      contract: t("companyJobs.contract"),
    };
    return labels[type] || type;
  };

  const getWorkLocationLabel = (location: string) => {
    const labels: { [key: string]: string } = {
      onsite: t("companyJobs.onsite"),
      remote: t("companyJobs.remote"),
      hybrid: t("companyJobs.hybrid"),
    };
    return labels[location] || location;
  };

  const getExperienceLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      entry: t("companyJobs.entry"),
      junior: t("companyJobs.junior"),
      mid: t("companyJobs.mid"),
      senior: t("companyJobs.senior"),
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--main-color)] text-[var(--main-text-white)]" dir="rtl">
        <CompanyNav />
        <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
          <div className="w-12 h-12 border-4 border-[var(--borders)] border-t-[#58a6ff] rounded-full animate-spin"></div>
          <p className="text-[var(--p-text)]">{t("common.loadingData")}</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[var(--main-color)] text-[var(--main-text-white)]" dir="rtl">
        <CompanyNav />
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl p-6 text-center">
            {error || "الوظيفة غير موجودة"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--main-color)] text-[var(--main-text-white)]" dir="rtl">
      <CompanyNav />

      <main className="max-w-7xl mx-auto px-6 py-24">
        {/* Back Button */}
        <Link
          href="/company/jobs"
          className="inline-flex items-center gap-2 text-[var(--p-text)] hover:text-[#58a6ff] transition-colors mb-6"
        >
          <FaArrowLeft className="text-sm" />
          <span>العودة للوظائف</span>
        </Link>

        {/* Header Section */}
        <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-8 mb-6">
          <div className="flex justify-between items-start gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-[var(--main-text-white)]">
                  {job.title}
                </h1>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    job.is_active
                      ? "bg-green-500/10 text-green-500 border border-green-500/30"
                      : "bg-red-500/10 text-red-500 border border-red-500/30"
                  }`}
                >
                  {job.is_active ? t("common.active") : t("common.inactive")}
                </span>
                {job.is_expired && (
                  <span className="px-4 py-1 rounded-full text-sm font-medium bg-orange-500/10 text-orange-500 border border-orange-500/30">
                    منتهي الصلاحية
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-[var(--p-text)]">
                <div className="flex items-center gap-2">
                  <FaBriefcase className="text-[#58a6ff]" />
                  <span>{getJobTypeLabel(job.job_type)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#58a6ff]" />
                  <span>{getWorkLocationLabel(job.work_location)}</span>
                </div>
                {job.location && (
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#58a6ff]" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.salary_range && (
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-[#58a6ff]" />
                    <span>{job.salary_range}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FaGraduationCap className="text-[#58a6ff]" />
                  <span>{getExperienceLevelLabel(job.experience_level)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/company/jobs/${job.id}/edit`}
                className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-all flex items-center gap-2"
              >
                <FaEdit />
                <span>{t("common.edit")}</span>
              </Link>
              <button
                onClick={handleDeleteJob}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg transition-all flex items-center gap-2"
              >
                <FaTrash />
                <span>{t("common.delete")}</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-[var(--main-color)] rounded-lg border border-[var(--borders)]">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <FaUsers className="text-[#58a6ff]" />
              </div>
              <div>
                <div className="text-2xl font-bold">{job.applications_count}</div>
                <div className="text-sm text-[var(--p-text)]">إجمالي المتقدمين</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--main-color)] rounded-lg border border-[var(--borders)]">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{job.positions_available}</div>
                <div className="text-sm text-[var(--p-text)]">عدد المناصب</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--main-color)] rounded-lg border border-[var(--borders)]">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <FaEye className="text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{job.views_count}</div>
                <div className="text-sm text-[var(--p-text)]">المشاهدات</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--main-color)] rounded-lg border border-[var(--borders)]">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <FaClock className="text-orange-500" />
              </div>
              <div>
                <div className="text-sm font-bold">
                  {job.application_deadline
                    ? new Date(job.application_deadline).toLocaleDateString("ar-EG")
                    : "مفتوح"}
                </div>
                <div className="text-sm text-[var(--p-text)]">آخر موعد للتقديم</div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Status Breakdown */}
        {job.applications_count > 0 && (
          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaUsers className="text-[#58a6ff]" />
              توزيع حالات الطلبات
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-[var(--main-color)] rounded-lg">
                <div className="text-2xl font-bold text-yellow-500">{job.applications_status.pending}</div>
                <div className="text-sm text-[var(--p-text)]">قيد الانتظار</div>
              </div>
              <div className="text-center p-4 bg-[var(--main-color)] rounded-lg">
                <div className="text-2xl font-bold text-blue-500">{job.applications_status.reviewing}</div>
                <div className="text-sm text-[var(--p-text)]">قيد المراجعة</div>
              </div>
              <div className="text-center p-4 bg-[var(--main-color)] rounded-lg">
                <div className="text-2xl font-bold text-purple-500">{job.applications_status.shortlisted}</div>
                <div className="text-sm text-[var(--p-text)]">القائمة المختصرة</div>
              </div>
              <div className="text-center p-4 bg-[var(--main-color)] rounded-lg">
                <div className="text-2xl font-bold text-indigo-500">{job.applications_status.interviewed}</div>
                <div className="text-sm text-[var(--p-text)]">مقابلة</div>
              </div>
              <div className="text-center p-4 bg-[var(--main-color)] rounded-lg">
                <div className="text-2xl font-bold text-green-500">{job.applications_status.accepted}</div>
                <div className="text-sm text-[var(--p-text)]">مقبول</div>
              </div>
              <div className="text-center p-4 bg-[var(--main-color)] rounded-lg">
                <div className="text-2xl font-bold text-red-500">{job.applications_status.rejected}</div>
                <div className="text-sm text-[var(--p-text)]">مرفوض</div>
              </div>
            </div>
            <Link
              href={`/company/applications?job_id=${job.id}`}
              className="mt-4 inline-flex items-center gap-2 text-[#58a6ff] hover:underline"
            >
              عرض جميع الطلبات
            </Link>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">{t("company.jobDescription")}</h2>
              <p className="text-[var(--p-text)] leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaTasks className="text-[#58a6ff]" />
                  المسؤوليات
                </h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-[var(--p-text)]">
                      <span className="text-[#58a6ff] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  المتطلبات
                </h2>
                <ul className="space-y-2">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-[var(--p-text)]">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaGift className="text-[#a371f7]" />
                  المزايا
                </h2>
                <ul className="space-y-2">
                  {job.benefits.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-[var(--p-text)]">
                      <FaGift className="text-[#a371f7] mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Required Skills */}
            {job.skills_required && job.skills_required.length > 0 && (
              <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FaLaptopCode className="text-[#58a6ff]" />
                  المهارات المطلوبة
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/10 text-[#58a6ff] border border-blue-500/30 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Skills */}
            {job.skills_preferred && job.skills_preferred.length > 0 && (
              <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  مهارات مفضلة
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills_preferred.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">معلومات إضافية</h2>
              <div className="space-y-3 text-sm">
                {job.education_requirement && (
                  <div>
                    <div className="text-[var(--p-text)] mb-1">المؤهل المطلوب:</div>
                    <div className="font-medium">{job.education_requirement}</div>
                  </div>
                )}
                {job.faculties_preferred && job.faculties_preferred.length > 0 && (
                  <div>
                    <div className="text-[var(--p-text)] mb-1">التخصصات المفضلة:</div>
                    <div className="font-medium">{job.faculties_preferred.join("، ")}</div>
                  </div>
                )}
                <div className="pt-3 border-t border-[var(--borders)]">
                  <div className="text-[var(--p-text)] mb-1">تاريخ النشر:</div>
                  <div className="font-medium">
                    {new Date(job.created_at).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--p-text)] mb-1">آخر تحديث:</div>
                  <div className="font-medium">
                    {new Date(job.updated_at).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
