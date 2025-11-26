"use client";

import { useState, useEffect } from "react";
import StudentNav from "@/components/StudentNav/StudentNav";
import styles from "./FollowRequests.module.css";
import { FaCheck, FaTimes, FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

interface FollowRequest {
  id: number;
  parent: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
}

export default function FollowRequests() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    checkAuth();
    fetchFollowRequests();
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

    if (parsedUser.type !== "student") {
      router.push("/");
      return;
    }
  };

  const fetchFollowRequests = async () => {
    try {
      const authData = localStorage.getItem("authData");
      if (!authData) return;

      const { token } = JSON.parse(authData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/follow-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Error fetching follow requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: number, action: "approve" | "reject") => {
    setProcessing(requestId);
    setMessage(null);

    try {
      const authData = localStorage.getItem("authData");
      if (!authData) return;

      const { token } = JSON.parse(authData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/follow-request/${requestId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      if (response.ok) {
        setMessage({
          type: "success",
          text: action === "approve"
            ? t("parent.acceptedSuccessfully")
            : t("parent.rejectedSuccessfully"),
        });

        // Remove the request from the list
        setRequests(requests.filter(req => req.id !== requestId));
      } else {
        setMessage({
          type: "error",
          text: "Failed to process request",
        });
      }
    } catch (error) {
      console.error("Error handling request:", error);
      setMessage({
        type: "error",
        text: "Failed to process request",
      });
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 24) {
      return `${diffInHours} ${t("parent.ago")}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${t("common.days")} ${t("parent.ago")}`;
    } else {
      return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US");
    }
  };

  if (loading) {
    return (
      <div className={styles.container} dir={language === "ar" ? "rtl" : "ltr"}>
        <StudentNav />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>{t("common.loading")}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container} dir={language === "ar" ? "rtl" : "ltr"}>
      <StudentNav />
      <main className={styles.main}>
        <section className={styles.requestsSection}>
          <div className={styles.requestsContent}>
            <div className={styles.header}>
              <h1>{t("parent.followRequests")}</h1>
              <p>{t("parent.newFollowRequests")}</p>
            </div>

            {message && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.type === "success" ? <FaCheck /> : <FaTimes />}
                {message.text}
              </div>
            )}

            {requests.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <FaUsers />
                </div>
                <h3>{t("parent.noFollowRequests")}</h3>
                <p>{t("parent.wantsToFollowYou")}</p>
              </div>
            ) : (
              <div className={styles.requestsList}>
                {requests.map((request) => (
                  <div key={request.id} className={styles.requestCard}>
                    <div className={styles.requestAvatar}>
                      {request.parent.name.charAt(0).toUpperCase()}
                    </div>

                    <div className={styles.requestInfo}>
                      <h3>{request.parent.name}</h3>
                      <p className={styles.requestEmail}>{request.parent.email}</p>
                      <p className={styles.requestMessage}>
                        {t("parent.wantsToFollowYou")}
                      </p>
                      <p className={styles.requestTime}>{formatDate(request.created_at)}</p>
                    </div>

                    <div className={styles.requestActions}>
                      <button
                        className={styles.approveButton}
                        onClick={() => handleRequest(request.id, "approve")}
                        disabled={processing === request.id}
                      >
                        <FaCheck />
                        <span>{t("parent.acceptRequest")}</span>
                      </button>

                      <button
                        className={styles.rejectButton}
                        onClick={() => handleRequest(request.id, "reject")}
                        disabled={processing === request.id}
                      >
                        <FaTimes />
                        <span>{t("parent.rejectRequest")}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
