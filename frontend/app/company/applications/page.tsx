"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CompanyNav from "@/components/CompanyNav/CompanyNav";
import styles from "./Applications.module.css";
import {
  FaUser,
  FaBriefcase,
  FaSearch,
  FaEye,
  FaStar,
  FaRegStar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaUserCheck,
} from "react-icons/fa";
import Link from "next/link";

interface Application {
  id: number;
  status: string;
  status_color: string;
  is_favorite: boolean;
  created_at: string;
  viewed_at: string | null;
  student: {
    id: number;
    name: string;
    email: string;
    university: string | null;
    faculty: string | null;
  };
  job: {
    id: number;
    title: string;
  };
}

export default function CompanyApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    checkAuth();
    fetchApplications();
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

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/applications`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        setError("فشل في تحميل الطلبات");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (applicationId: number) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/applications/${applicationId}/favorite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: "قيد الانتظار",
      reviewing: "قيد المراجعة",
      shortlisted: "مرشح مبدئياً",
      interviewed: "تمت المقابلة",
      accepted: "مقبول",
      rejected: "مرفوض",
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FaClock />;
      case "reviewing":
        return <FaHourglassHalf />;
      case "shortlisted":
        return <FaUserCheck />;
      case "interviewed":
        return <FaUserCheck />;
      case "accepted":
        return <FaCheckCircle />;
      case "rejected":
        return <FaTimesCircle />;
      default:
        return <FaClock />;
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || app.status === filterStatus;

    const matchesFavorite = !filterFavorite || app.is_favorite;

    return matchesSearch && matchesStatus && matchesFavorite;
  });

  // Sort applications
  filteredApplications.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "name":
        return a.student.name.localeCompare(b.student.name, "ar");
      default:
        return 0;
    }
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    interviewed: applications.filter((a) => a.status === "interviewed").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    favorites: applications.filter((a) => a.is_favorite).length,
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <CompanyNav />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CompanyNav />

      <main className={styles.main}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <FaUser /> جميع الطلبات
            </h1>
            <p className={styles.subtitle}>
              إدارة ومراجعة جميع طلبات التوظيف المستلمة
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaUser />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.total}</div>
              <div className={styles.statLabel}>إجمالي الطلبات</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#ffa657" }}>
              <FaClock />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.pending}</div>
              <div className={styles.statLabel}>قيد الانتظار</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#58a6ff" }}>
              <FaHourglassHalf />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.reviewing}</div>
              <div className={styles.statLabel}>قيد المراجعة</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#a371f7" }}>
              <FaUserCheck />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.shortlisted}</div>
              <div className={styles.statLabel}>مرشح مبدئياً</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#79c0ff" }}>
              <FaUserCheck />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.interviewed}</div>
              <div className={styles.statLabel}>تمت المقابلة</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#3fb950" }}>
              <FaCheckCircle />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.accepted}</div>
              <div className={styles.statLabel}>مقبول</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#f85149" }}>
              <FaTimesCircle />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.rejected}</div>
              <div className={styles.statLabel}>مرفوض</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#ffd700" }}>
              <FaStar />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.favorites}</div>
              <div className={styles.statLabel}>المفضلة</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <FaSearch />
            <input
              type="text"
              placeholder="ابحث باسم المتقدم، الوظيفة، أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filters}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">كل الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="reviewing">قيد المراجعة</option>
              <option value="shortlisted">مرشح مبدئياً</option>
              <option value="interviewed">تمت المقابلة</option>
              <option value="accepted">مقبول</option>
              <option value="rejected">مرفوض</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="oldest">الأقدم أولاً</option>
              <option value="name">الاسم (أ-ي)</option>
            </select>

            <button
              onClick={() => setFilterFavorite(!filterFavorite)}
              className={`${styles.favoriteFilter} ${
                filterFavorite ? styles.active : ""
              }`}
            >
              <FaStar /> المفضلة فقط
            </button>
          </div>
        </div>

        {/* Applications List */}
        {error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : filteredApplications.length === 0 ? (
          <div className={styles.emptyState}>
            <FaUser />
            <h3>لا توجد طلبات</h3>
            <p>
              {searchTerm || filterStatus !== "all" || filterFavorite
                ? "لا توجد طلبات تطابق معايير البحث"
                : "لم يتم استلام أي طلبات حتى الآن"}
            </p>
          </div>
        ) : (
          <div className={styles.applicationsList}>
            <div className={styles.listHeader}>
              <span>عرض {filteredApplications.length} من {applications.length} طلب</span>
            </div>

            {filteredApplications.map((application) => (
              <div key={application.id} className={styles.applicationCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.studentInfo}>
                    <div className={styles.studentAvatar}>
                      <FaUser />
                    </div>
                    <div className={styles.studentDetails}>
                      <h3 className={styles.studentName}>
                        {application.student.name}
                      </h3>
                      <p className={styles.studentMeta}>
                        {application.student.university && (
                          <span>{application.student.university}</span>
                        )}
                        {application.student.faculty && (
                          <>
                            {application.student.university && " - "}
                            <span>{application.student.faculty}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(application.id)}
                    className={`${styles.favoriteButton} ${
                      application.is_favorite ? styles.favorited : ""
                    }`}
                    title={
                      application.is_favorite
                        ? "إزالة من المفضلة"
                        : "إضافة للمفضلة"
                    }
                  >
                    {application.is_favorite ? <FaStar /> : <FaRegStar />}
                  </button>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.jobInfo}>
                    <FaBriefcase />
                    <span>{application.job.title}</span>
                  </div>

                  <div className={styles.applicationMeta}>
                    <div
                      className={styles.statusBadge}
                      style={{ color: application.status_color }}
                    >
                      {getStatusIcon(application.status)}
                      <span>{getStatusLabel(application.status)}</span>
                    </div>

                    <div className={styles.date}>
                      <FaClock />
                      <span>
                        {new Date(application.created_at).toLocaleDateString(
                          "ar-EG",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    {!application.viewed_at && (
                      <span className={styles.newBadge}>جديد</span>
                    )}
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Link
                    href={`/company/applications/${application.id}`}
                    className={styles.viewButton}
                  >
                    <FaEye /> عرض التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
