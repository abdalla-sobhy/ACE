"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav/AdminNav";
import styles from "./Courses.module.css";
import { FaBook, FaSearch } from "react-icons/fa";
import { useLanguage } from "@/hooks/useLanguage";

interface Course {
  id: number;
  title: string;
  description: string;
  grade: string;
  price: number;
  status: string;
  created_at: string;
  teacher?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export default function CoursesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    checkAuth();
    fetchCourses();
  }, [statusFilter]);

  const checkAuth = () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.type !== "admin") {
      router.push("/");
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/courses?${params}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCourses(data.data.data || data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCourseStatus = async (courseId: number, status: string) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/courses/${courseId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        alert(t("admin.courses.courseStatusUpdated"));
        fetchCourses();
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <div className={styles.container}>
      <AdminNav />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1><FaBook /> {t("admin.courses.title")}</h1>
          <p>{t("admin.courses.subtitle")}</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FaSearch />
            <input
              type="text"
              placeholder={t("admin.courses.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchCourses()}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.select}
          >
            <option value="">{t("admin.courses.allStatuses")}</option>
            <option value="published">{t("admin.courses.published")}</option>
            <option value="draft">{t("admin.courses.draft")}</option>
            <option value="archived">{t("admin.courses.archived")}</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>{t("admin.courses.loadingCourses")}</p>
          </div>
        ) : (
          <div className={styles.coursesTable}>
            <table>
              <thead>
                <tr>
                  <th>{t("admin.courses.title")}</th>
                  <th>{t("admin.courses.teacher")}</th>
                  <th>{t("admin.courses.grade")}</th>
                  <th>{t("admin.courses.price")}</th>
                  <th>{t("admin.courses.status")}</th>
                  <th>{t("admin.courses.created")}</th>
                  <th>{t("admin.courses.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.title}</td>
                    <td>
                      {course.teacher
                        ? `${course.teacher.first_name} ${course.teacher.last_name}`
                        : t("admin.courses.na")}
                    </td>
                    <td>{course.grade}</td>
                    <td>${course.price}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[course.status]}`}>
                        {course.status}
                      </span>
                    </td>
                    <td>{new Date(course.created_at).toLocaleDateString()}</td>
                    <td>
                      <select
                        value={course.status}
                        onChange={(e) => updateCourseStatus(course.id, e.target.value)}
                        className={styles.statusSelect}
                      >
                        <option value="published">{t("admin.courses.published")}</option>
                        <option value="draft">{t("admin.courses.draft")}</option>
                        <option value="archived">{t("admin.courses.archived")}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
