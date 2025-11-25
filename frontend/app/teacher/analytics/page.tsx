"use client";

import { useState, useEffect } from "react";
import TeacherNav from "@/components/TeacherNav/TeacherNav";
import styles from "./Analytics.module.css";
import {
  FaUsers,
  FaMoneyBillWave,
  FaStar,
  FaChartLine,
  FaBook,
  FaClock
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function TeacherAnalytics() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
      JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  };

  // Mock data for demonstration
  const statsCards = [
    {
      title: t("teacher.studentsEnrolled"),
      value: "1,247",
      change: "+12.5%",
      icon: <FaUsers />,
      color: "blue"
    },
    {
      title: t("teacher.activeCourses"),
      value: "24",
      change: "+3",
      icon: <FaBook />,
      color: "green"
    },
    {
      title: t("teacher.monthlyRevenue"),
      value: "45,680 " + (language === "ar" ? "جنيه" : "EGP"),
      change: "+18.2%",
      icon: <FaMoneyBillWave />,
      color: "purple"
    },
    {
      title: t("teacher.averageRating"),
      value: "4.8",
      change: "+0.3",
      icon: <FaStar />,
      color: "yellow"
    },
    {
      title: t("teacher.completionRate"),
      value: "87.5%",
      change: "+5.2%",
      icon: <FaChartLine />,
      color: "cyan"
    },
    {
      title: t("teacher.totalTeachingHours"),
      value: "342 " + t("teacher.hours"),
      change: "+28",
      icon: <FaClock />,
      color: "orange"
    }
  ];

  // Mock enrollment data for the last 6 months
  const enrollmentData = [
    { month: t("teacher.june"), students: 145, newStudents: 45, returning: 100 },
    { month: t("teacher.july"), students: 189, newStudents: 67, returning: 122 },
    { month: t("teacher.august"), students: 234, newStudents: 89, returning: 145 },
    { month: t("teacher.september"), students: 298, newStudents: 112, returning: 186 },
    { month: t("teacher.october"), students: 356, newStudents: 98, returning: 258 },
    { month: t("teacher.november"), students: 412, newStudents: 134, returning: 278 }
  ];

  // Mock revenue data
  const revenueData = [
    { month: t("teacher.june"), revenue: 28500 },
    { month: t("teacher.july"), revenue: 32100 },
    { month: t("teacher.august"), revenue: 36800 },
    { month: t("teacher.september"), revenue: 41200 },
    { month: t("teacher.october"), revenue: 44500 },
    { month: t("teacher.november"), revenue: 45680 }
  ];

  // Mock course performance data
  const coursePerformanceData = [
    { name: language === "ar" ? "رياضيات متقدمة" : "Advanced Math", students: 156, completion: 92, rating: 4.9 },
    { name: language === "ar" ? "الفيزياء" : "Physics", students: 134, completion: 88, rating: 4.7 },
    { name: language === "ar" ? "البرمجة" : "Programming", students: 198, completion: 85, rating: 4.8 },
    { name: language === "ar" ? "الكيمياء" : "Chemistry", students: 112, completion: 90, rating: 4.6 },
    { name: language === "ar" ? "اللغة الإنجليزية" : "English", students: 223, completion: 87, rating: 4.9 }
  ];

  // Student retention data
  const retentionData = [
    { name: t("teacher.newStudents"), value: 545, color: "var(--accent-blue)" },
    { name: t("teacher.returningStudents"), value: 702, color: "var(--success)" }
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <TeacherNav />
        <main className={styles.main}>
          <div className={styles.loading}>{t("teacher.loadingProfile")}</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TeacherNav />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{t("teacher.analyticsTitle")}</h1>
            <p className={styles.subtitle}>{t("teacher.analyticsSubtitle")}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          {statsCards.map((stat, index) => (
            <div key={index} className={`${styles.statCard} ${styles[stat.color]}`}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{stat.value}</h3>
                <p className={styles.statTitle}>{stat.title}</p>
                <span className={styles.statChange}>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className={styles.chartsGrid}>
          {/* Enrollment Trend */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>{t("teacher.enrollmentTrend")}</h2>
              <p className={styles.chartSubtitle}>{t("teacher.last6Months")}</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--borders)" />
                <XAxis
                  dataKey="month"
                  stroke="var(--main-text-white)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="var(--main-text-white)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--sections-color)',
                    border: '1px solid var(--borders)',
                    borderRadius: '8px',
                    color: 'var(--main-text-white)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="var(--accent-blue)"
                  fillOpacity={1}
                  fill="url(#colorStudents)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Analytics */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>{t("teacher.revenueAnalytics")}</h2>
              <p className={styles.chartSubtitle}>{t("teacher.revenueByMonth")}</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--borders)" />
                <XAxis
                  dataKey="month"
                  stroke="var(--main-text-white)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="var(--main-text-white)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--sections-color)',
                    border: '1px solid var(--borders)',
                    borderRadius: '8px',
                    color: 'var(--main-text-white)'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} ${language === "ar" ? "جنيه" : "EGP"}`, t("teacher.revenue")]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--success)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--success)', r: 5 }}
                  name={t("teacher.revenue")}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* New vs Returning Students */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>{t("teacher.studentEngagement")}</h2>
              <p className={styles.chartSubtitle}>{t("teacher.last6Months")}</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--borders)" />
                <XAxis
                  dataKey="month"
                  stroke="var(--main-text-white)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="var(--main-text-white)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--sections-color)',
                    border: '1px solid var(--borders)',
                    borderRadius: '8px',
                    color: 'var(--main-text-white)'
                  }}
                />
                <Legend />
                <Bar dataKey="newStudents" fill="var(--accent-blue)" name={t("teacher.newStudents")} />
                <Bar dataKey="returning" fill="var(--success)" name={t("teacher.returningStudents")} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Student Retention Pie Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>{t("teacher.studentRetention")}</h2>
              <p className={styles.chartSubtitle}>{t("teacher.thisYear")}</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={retentionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {retentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--sections-color)',
                    border: '1px solid var(--borders)',
                    borderRadius: '8px',
                    color: 'var(--main-text-white)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Course Performance */}
          <div className={`${styles.chartCard} ${styles.fullWidth}`}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>{t("teacher.topPerformingCourses")}</h2>
              <p className={styles.chartSubtitle}>{t("teacher.coursePerformance")}</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursePerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--borders)" />
                <XAxis
                  type="number"
                  stroke="var(--main-text-white)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="var(--main-text-white)"
                  style={{ fontSize: '12px' }}
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--sections-color)',
                    border: '1px solid var(--borders)',
                    borderRadius: '8px',
                    color: 'var(--main-text-white)'
                  }}
                />
                <Legend />
                <Bar dataKey="students" fill="var(--accent-blue)" name={t("teacher.students")} />
                <Bar dataKey="completion" fill="var(--success)" name={t("teacher.completionRate") + " %"} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
