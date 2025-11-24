"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CompanyNav from "@/components/CompanyNav/CompanyNav";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Link from "next/link";

import { useLanguage } from "@/hooks/useLanguage";
interface Job {
  id: number;
  title: string;
  description: string;
  job_type: string;
  work_location: string;
  location: string | null;
  salary_range: string | null;
  experience_level: string;
  skills_required: string[];
  is_active: boolean;
  applications_count: number;
  created_at: string;
  updated_at: string;
}

export default function CompanyJobsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    checkAuth();
    fetchJobs();
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

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/jobs`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setJobs(data.job_postings || []);
      } else {
        setError(t("companyJobs.loadError"));
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(t("companyJobs.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
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
        fetchJobs();
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

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || job.job_type === filterType;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && job.is_active) ||
      (filterStatus === "inactive" && !job.is_active);

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.is_active).length,
    inactive: jobs.filter((j) => !j.is_active).length,
    totalApplications: jobs.reduce((sum, j) => sum + j.applications_count, 0),
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

  return (
    <div className="min-h-screen bg-[var(--main-color)] text-[var(--main-text-white)]" dir="rtl">
      <CompanyNav />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8 gap-5 flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <FaBriefcase className="text-[#58a6ff]" />
              <span className="bg-gradient-to-l from-[#58a6ff] to-[#79c0ff] bg-clip-text text-transparent">
                {t("companyJobs.title")}
              </span>
            </h1>
            <p className="text-[var(--p-text)]">
              {t("companyJobs.description")}
            </p>
          </div>
          <Link
            href="/company/jobs/new"
            className="flex items-center gap-2 px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30"
          >
            <FaPlus /> {t("companyJobs.postNewJob")}
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-5 flex items-center gap-4 hover:border-[#58a6ff] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#58a6ff] to-[#79c0ff] flex items-center justify-center flex-shrink-0">
              <FaBriefcase className="text-white text-xl" />
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm text-[var(--p-text)]">{t("companyJobs.totalJobs")}</div>
            </div>
          </div>

          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-5 flex items-center gap-4 hover:border-green-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#3fb950] flex items-center justify-center flex-shrink-0">
              <FaCheckCircle className="text-white text-xl" />
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.active}</div>
              <div className="text-sm text-[var(--p-text)]">{t("companyJobs.activeJobs")}</div>
            </div>
          </div>

          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-5 flex items-center gap-4 hover:border-red-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#f85149] flex items-center justify-center flex-shrink-0">
              <FaTimesCircle className="text-white text-xl" />
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.inactive}</div>
              <div className="text-sm text-[var(--p-text)]">{t("companyJobs.inactiveJobs")}</div>
            </div>
          </div>

          <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-5 flex items-center gap-4 hover:border-purple-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#a371f7] flex items-center justify-center flex-shrink-0">
              <FaUsers className="text-white text-xl" />
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.totalApplications}</div>
              <div className="text-sm text-[var(--p-text)]">{t("companyJobs.totalApplicants")}</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <div className="flex items-center gap-3 px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg focus-within:border-[#58a6ff] focus-within:ring-2 focus-within:ring-[#58a6ff]/20 transition-all">
                <FaSearch className="text-[var(--p-text)]" />
                <input
                  type="text"
                  placeholder={t("companyJobs.searchJobs")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-[var(--main-text-white)] placeholder:text-[var(--p-text)]"
                />
              </div>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 lg:flex-none lg:min-w-[150px] px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] cursor-pointer hover:border-[#58a6ff] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
              >
                <option value="all">{t("common.all")}</option>
                <option value="full_time">{t("companyJobs.fullTime")}</option>
                <option value="part_time">{t("companyJobs.partTime")}</option>
                <option value="internship">{t("companyJobs.internship")}</option>
                <option value="contract">{t("companyJobs.contract")}</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 lg:flex-none lg:min-w-[150px] px-4 py-3 bg-[var(--input-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--main-text-white)] cursor-pointer hover:border-[#58a6ff] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
              >
                <option value="all">{t("common.all")}</option>
                <option value="active">{t("common.active")}</option>
                <option value="inactive">{t("common.inactive")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl p-6 text-center">
            {error}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-5 text-center bg-[var(--sections-color)] border border-[var(--borders)] rounded-xl">
            <FaBriefcase className="text-6xl text-[var(--p-text)] opacity-50 mb-5" />
            <h3 className="text-2xl font-bold mb-3">{t("companyJobs.noJobsFound")}</h3>
            <p className="text-[var(--p-text)] mb-6 max-w-md">
              {t("companyJobs.createFirstJob")}
            </p>
            <Link
              href="/company/jobs/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30"
            >
              <FaPlus /> {t("companyJobs.postNewJob")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-[var(--form-color)] border border-[var(--input-border-color)] rounded-xl p-6 flex flex-col gap-4 hover:border-[#58a6ff] hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all"
              >
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-lg font-semibold flex-1 leading-snug">
                    {job.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      job.is_active
                        ? "bg-green-500/10 text-green-500 border border-green-500/30"
                        : "bg-red-500/10 text-red-500 border border-red-500/30"
                    }`}
                  >
                    {job.is_active ? t("common.active") : t("common.inactive")}
                  </span>
                </div>

                <p className="text-[var(--p-text)] text-sm leading-relaxed line-clamp-3">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-[var(--p-text)]">
                  <div className="flex items-center gap-1.5">
                    <FaBriefcase className="text-[#58a6ff] text-sm" />
                    <span>{getJobTypeLabel(job.job_type)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-[#58a6ff] text-sm" />
                    <span>{getWorkLocationLabel(job.work_location)}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-[#58a6ff] text-sm" />
                      <span>{job.location}</span>
                    </div>
                  )}
                </div>

                {job.skills_required && job.skills_required.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/10 text-[#58a6ff] border border-blue-500/30 rounded-md text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills_required.length > 3 && (
                      <span className="px-3 py-1 bg-blue-500/10 text-[#58a6ff] border border-blue-500/30 rounded-md text-xs font-medium">
                        +{job.skills_required.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-[var(--borders)]">
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    <FaUsers className="text-[#58a6ff]" />
                    <span>{job.applications_count} {t("companyJobs.applicants")}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/company/jobs/${job.id}`}
                      className="w-9 h-9 flex items-center justify-center bg-[var(--input-color)] hover:bg-[#58a6ff] hover:text-white border border-[var(--input-border-color)] hover:border-[#58a6ff] rounded-lg transition-all"
                      title={t("common.view")}
                    >
                      <FaEye className="text-sm" />
                    </Link>
                    <Link
                      href={`/company/jobs/${job.id}/edit`}
                      className="w-9 h-9 flex items-center justify-center bg-[var(--input-color)] hover:bg-[#58a6ff] hover:text-white border border-[var(--input-border-color)] hover:border-[#58a6ff] rounded-lg transition-all"
                      title={t("common.edit")}
                    >
                      <FaEdit className="text-sm" />
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="w-9 h-9 flex items-center justify-center bg-[var(--input-color)] hover:bg-red-500 hover:text-white border border-[var(--input-border-color)] hover:border-red-500 rounded-lg transition-all"
                      title={t("common.delete")}
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[var(--p-text)] pt-3 border-t border-[var(--borders)]">
                  <FaClock />
                  <span>
                    {t("companyJobs.postedOn")} {new Date(job.created_at).toLocaleDateString("en-EG")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
