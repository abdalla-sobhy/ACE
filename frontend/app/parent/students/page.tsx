"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ParentNav from "@/components/ParentNav/ParentNav";
import styles from "./ParentStudents.module.css";
import { useLanguage } from "@/hooks/useLanguage";
import {
  FaSearch,
  FaUsers,
  FaBook,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaTrophy,
  FaCalendarAlt
} from "react-icons/fa";

interface FollowedStudent {
  id: number;
  name: string;
  email: string;
  grade: string;
  courses: number;
  completedLessons: number;
  totalLessons: number;
  progress: number;
  lastActivity: string;
  status: 'approved' | 'pending' | 'rejected';
  joinDate: string;
}

export default function ParentStudents() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'followed' | 'search'>('followed');

  useEffect(() => {
    checkAuth();
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("authData");

    if (!userData || !authData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      const parsedAuth = JSON.parse(authData);

      if (new Date(parsedAuth.expiresAt) < new Date()) {
        localStorage.removeItem("user");
        localStorage.removeItem("authData");
        router.push("/login");
        return;
      }

      if (parsedUser.type !== "parent") {
        router.push("/");
        return;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  };

  // Mock followed students data
  const followedStudents: FollowedStudent[] = [
    {
      id: 1,
      name: language === "ar" ? "أحمد محمد علي" : "Ahmed Mohamed Ali",
      email: "ahmed@example.com",
      grade: language === "ar" ? "الصف الأول الثانوي" : "Grade 10",
      courses: 4,
      completedLessons: 45,
      totalLessons: 60,
      progress: 75,
      lastActivity: "2 " + t("parent.hours") + " " + t("parent.ago"),
      status: 'approved',
      joinDate: language === "ar" ? "15 سبتمبر 2024" : "Sep 15, 2024"
    },
    {
      id: 2,
      name: language === "ar" ? "فاطمة علي حسن" : "Fatima Ali Hassan",
      email: "fatima@example.com",
      grade: language === "ar" ? "الصف الثاني الإعدادي" : "Grade 8",
      courses: 5,
      completedLessons: 68,
      totalLessons: 75,
      progress: 91,
      lastActivity: "4 " + t("parent.hours") + " " + t("parent.ago"),
      status: 'approved',
      joinDate: language === "ar" ? "10 سبتمبر 2024" : "Sep 10, 2024"
    },
    {
      id: 3,
      name: language === "ar" ? "عمر حسن محمود" : "Omar Hassan Mahmoud",
      email: "omar@example.com",
      grade: language === "ar" ? "الصف الخامس الابتدائي" : "Grade 5",
      courses: 3,
      completedLessons: 28,
      totalLessons: 45,
      progress: 62,
      lastActivity: "1 " + (language === "ar" ? "يوم" : "day") + " " + t("parent.ago"),
      status: 'approved',
      joinDate: language === "ar" ? "20 سبتمبر 2024" : "Sep 20, 2024"
    },
    {
      id: 4,
      name: language === "ar" ? "سارة أحمد" : "Sara Ahmed",
      email: "sara@example.com",
      grade: language === "ar" ? "الصف الثالث الثانوي" : "Grade 12",
      courses: 2,
      completedLessons: 0,
      totalLessons: 30,
      progress: 0,
      lastActivity: "3 " + (language === "ar" ? "أيام" : "days") + " " + t("parent.ago"),
      status: 'pending',
      joinDate: language === "ar" ? "22 نوفمبر 2024" : "Nov 22, 2024"
    }
  ];

  const getStatusIcon = (status: FollowedStudent['status']) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className={styles.statusIconApproved} />;
      case 'pending':
        return <FaHourglassHalf className={styles.statusIconPending} />;
      case 'rejected':
        return <FaTimesCircle className={styles.statusIconRejected} />;
    }
  };

  const getStatusText = (status: FollowedStudent['status']) => {
    switch (status) {
      case 'approved':
        return t("parent.approved");
      case 'pending':
        return t("parent.pending");
      case 'rejected':
        return t("parent.rejected");
    }
  };

  const filteredStudents = followedStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <ParentNav />
        <main className={styles.main}>
          <div className={styles.loading}>{t("common.loading")}</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ParentNav />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{t("parent.myStudents")}</h1>
            <p className={styles.subtitle}>{t("parent.studentsOverview")}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'followed' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('followed')}
          >
            <FaUsers />
            {t("parent.myStudents")}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'search' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <FaSearch />
            {t("parent.searchStudent")}
          </button>
        </div>

        {activeTab === 'followed' ? (
          <>
            {/* Search Bar */}
            <div className={styles.searchSection}>
              <div className={styles.searchBar}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder={t("parent.searchByName")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            {/* Students Grid */}
            {filteredStudents.length > 0 ? (
              <div className={styles.studentsGrid}>
                {filteredStudents.map((student) => (
                  <div key={student.id} className={styles.studentCard}>
                    <div className={styles.studentHeader}>
                      <div className={styles.studentAvatar}>
                        <FaUsers />
                      </div>
                      <div className={styles.studentBasicInfo}>
                        <h3 className={styles.studentName}>{student.name}</h3>
                        <p className={styles.studentEmail}>{student.email}</p>
                        <p className={styles.studentGrade}>{student.grade}</p>
                      </div>
                      <div className={styles.statusBadge}>
                        {getStatusIcon(student.status)}
                        <span>{getStatusText(student.status)}</span>
                      </div>
                    </div>

                    <div className={styles.studentStats}>
                      <div className={styles.statItem}>
                        <FaBook />
                        <div>
                          <span className={styles.statValue}>{student.courses}</span>
                          <span className={styles.statLabel}>{t("parent.coursesEnrolled")}</span>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <FaCheckCircle />
                        <div>
                          <span className={styles.statValue}>
                            {student.completedLessons}/{student.totalLessons}
                          </span>
                          <span className={styles.statLabel}>{t("parent.completedLessons")}</span>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <FaClock />
                        <div>
                          <span className={styles.statValue}>{student.lastActivity}</span>
                          <span className={styles.statLabel}>{t("parent.lastActivity")}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.progressSection}>
                      <div className={styles.progressHeader}>
                        <span>{t("parent.overallProgress")}</span>
                        <span className={styles.progressPercent}>{student.progress}%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className={styles.studentFooter}>
                      <div className={styles.joinDate}>
                        <FaCalendarAlt />
                        <span>{student.joinDate}</span>
                      </div>
                      <button className={styles.viewDetailsBtn}>
                        {t("parent.viewDetails")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <FaUsers className={styles.emptyIcon} />
                <h3>{t("parent.noStudentsFound")}</h3>
              </div>
            )}
          </>
        ) : (
          /* Search Tab */
          <div className={styles.searchTab}>
            <div className={styles.searchSection}>
              <div className={styles.searchBar}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder={t("parent.searchByName")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.searchInfo}>
              <FaTrophy className={styles.infoIcon} />
              <div>
                <h3>{t("parent.searchStudent")}</h3>
                <p>{language === "ar"
                  ? "ابحث عن طالب بالاسم أو البريد الإلكتروني أو رقم الطالب لإرسال طلب متابعة"
                  : "Search for a student by name, email, or student ID to send a follow request"
                }</p>
              </div>
            </div>

            {searchQuery && (
              <div className={styles.emptyState}>
                <FaSearch className={styles.emptyIcon} />
                <h3>{language === "ar" ? "ابحث عن الطلاب" : "Search for students"}</h3>
                <p>{language === "ar"
                  ? "أدخل اسم الطالب أو البريد الإلكتروني في شريط البحث أعلاه"
                  : "Enter student name or email in the search bar above"
                }</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
