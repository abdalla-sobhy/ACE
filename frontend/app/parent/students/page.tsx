"use client";

import { useState, useEffect } from "react";
import ParentNav from "@/components/ParentNav/ParentNav";
import styles from "./SearchStudents.module.css";
import { FaSearch, FaUserPlus, FaCheck, FaClock, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

interface SearchResult {
  student: {
    id: number;
    name: string;
    email: string;
    profile?: {
      grade: string;
      profile_picture?: string;
    };
  };
  follow_status: "not_following" | "pending" | "following";
}

export default function SearchStudents() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Grade labels mapping
  const gradeLabels: Record<string, string> = {
    'primary_1': t('grades.primary_1'),
    'primary_2': t('grades.primary_2'),
    'primary_3': t('grades.primary_3'),
    'primary_4': t('grades.primary_4'),
    'primary_5': t('grades.primary_5'),
    'primary_6': t('grades.primary_6'),
    'prep_1': t('grades.prep_1'),
    'prep_2': t('grades.prep_2'),
    'prep_3': t('grades.prep_3'),
    'secondary_1': t('grades.secondary_1'),
    'secondary_2': t('grades.secondary_2'),
    'secondary_3': t('grades.secondary_3'),
  };

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
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSearchResult(null);

    if (!email.trim()) {
      setError(t("parent.enterStudentEmail"));
      return;
    }

    setLoading(true);

    try {
      const authData = localStorage.getItem("authData");
      if (!authData) return;

      const { token } = JSON.parse(authData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parent/search-student`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSearchResult(data);
      } else {
        setError(data.message || t("parent.studentNotFound"));
      }
    } catch (error) {
      console.error("Error searching student:", error);
      setError(t("parent.studentNotFound"));
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!searchResult) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const authData = localStorage.getItem("authData");
      if (!authData) return;

      const { token } = JSON.parse(authData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parent/follow-request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ student_id: searchResult.student.id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(t("parent.followRequestSent"));
        setSearchResult({
          ...searchResult,
          follow_status: "pending",
        });
      } else {
        setError(data.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setError("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "following":
        return (
          <span className={`${styles.statusBadge} ${styles.following}`}>
            <FaCheck /> {t("parent.alreadyLinked")}
          </span>
        );
      case "pending":
        return (
          <span className={`${styles.statusBadge} ${styles.pending}`}>
            <FaClock /> {t("parent.requestPending")}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container} dir={language === "ar" ? "rtl" : "ltr"}>
      <ParentNav />
      <main className={styles.main}>
        <section className={styles.searchSection}>
          <div className={styles.searchContent}>
            <h1>{t("parent.linkStudent")}</h1>
            <p>{t("parent.searchByEmail")}</p>

            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="email"
                  className={styles.searchInput}
                  placeholder={t("parent.enterStudentEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className={styles.searchButton}
                disabled={loading}
              >
                {loading ? t("common.loading") : t("parent.search")}
              </button>
            </form>

            {error && (
              <div className={styles.errorMessage}>
                <FaTimes /> {error}
              </div>
            )}

            {success && (
              <div className={styles.successMessage}>
                <FaCheck /> {success}
              </div>
            )}

            {searchResult && (
              <div className={styles.resultCard}>
                <div className={styles.studentAvatar}>
                  {searchResult.student.profile?.profile_picture ? (
                    <img
                      src={searchResult.student.profile.profile_picture}
                      alt={searchResult.student.name}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {searchResult.student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className={styles.studentInfo}>
                  <h3>{searchResult.student.name}</h3>
                  <p className={styles.studentEmail}>
                    {searchResult.student.email}
                  </p>
                  {searchResult.student.profile?.grade && (
                    <p className={styles.studentGrade}>
                      {t("parent.currentGrade")}:{" "}
                      {gradeLabels[searchResult.student.profile.grade] || searchResult.student.profile.grade}
                    </p>
                  )}
                </div>

                <div className={styles.actionSection}>
                  {getStatusBadge(searchResult.follow_status)}

                  {searchResult.follow_status === "not_following" && (
                    <button
                      className={styles.sendRequestButton}
                      onClick={handleSendRequest}
                      disabled={loading}
                    >
                      <FaUserPlus /> {t("parent.sendFollowRequest")}
                    </button>
                  )}

                  {searchResult.follow_status === "following" && (
                    <button
                      className={styles.viewDetailsButton}
                      onClick={() =>
                        router.push(`/parent/students/${searchResult.student.id}`)
                      }
                    >
                      {t("parent.viewDetails")}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}