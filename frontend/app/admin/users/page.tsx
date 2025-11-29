"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav/AdminNav";
import styles from "./Users.module.css";
import { FaUsers, FaSearch, FaBan, FaCheck } from "react-icons/fa";
import { useLanguage } from "@/hooks/useLanguage";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  status: string;
  created_at: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export default function UsersPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Reset to page 1 when filters change
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchUsers();
    }
  }, [userType, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const params = new URLSearchParams();
      if (userType) params.append("user_type", userType);
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);
      params.append("page", currentPage.toString());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users?${params}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.data || data.data);
        setPagination({
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total,
          from: data.data.from,
          to: data.data.to,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = async (userId: number) => {
    if (!confirm(t("admin.users.confirmSuspend"))) return;

    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${userId}/suspend`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        alert(t("admin.users.userSuspendedSuccess"));
        fetchUsers();
      }
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  const activateUser = async (userId: number) => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${userId}/activate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        alert(t("admin.users.userActivatedSuccess"));
        fetchUsers();
      }
    } catch (error) {
      console.error("Error activating user:", error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let end = Math.min(pagination.last_page, start + maxPages - 1);

    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={styles.container}>
      <AdminNav />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1><FaUsers /> {t("admin.users.title")}</h1>
          <p>{t("admin.users.subtitle")}</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FaSearch />
            <input
              type="text"
              placeholder={t("admin.users.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
            />
          </div>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className={styles.select}
          >
            <option value="">{t("admin.users.allUserTypes")}</option>
            <option value="student">{t("admin.users.students")}</option>
            <option value="university_student">{t("admin.users.universityStudents")}</option>
            <option value="teacher">{t("admin.users.teachers")}</option>
            <option value="parent">{t("admin.users.parents")}</option>
            <option value="company">{t("admin.users.companies")}</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.select}
          >
            <option value="">{t("admin.users.allStatuses")}</option>
            <option value="active">{t("admin.users.active")}</option>
            <option value="suspended">{t("admin.users.suspended")}</option>
            <option value="pending">{t("admin.users.pending")}</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>{t("admin.users.loadingUsers")}</p>
          </div>
        ) : (
          <div className={styles.usersTable}>
            <table>
              <thead>
                <tr>
                  <th>{t("admin.users.name")}</th>
                  <th>{t("admin.users.email")}</th>
                  <th>{t("admin.users.type")}</th>
                  <th>{t("admin.users.status")}</th>
                  <th>{t("admin.users.joined")}</th>
                  <th>{t("admin.users.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{`${user.first_name} ${user.last_name}`}</td>
                    <td>{user.email}</td>
                    <td><span className={styles.typeBadge}>{user.user_type}</span></td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actions}>
                        {user.status === 'active' ? (
                          <button
                            className={styles.suspendBtn}
                            onClick={() => suspendUser(user.id)}
                            title={t("admin.users.suspend")}
                          >
                            <FaBan />
                          </button>
                        ) : (
                          <button
                            className={styles.activateBtn}
                            onClick={() => activateUser(user.id)}
                            title={t("admin.users.activate")}
                          >
                            <FaCheck />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pagination.last_page > 1 && (
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Showing {pagination.from} to {pagination.to} of {pagination.total} users
            </div>
            <div className={styles.paginationControls}>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                Previous
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.last_page}
                className={styles.pageButton}
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(pagination.last_page)}
                disabled={currentPage === pagination.last_page}
                className={styles.pageButton}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
