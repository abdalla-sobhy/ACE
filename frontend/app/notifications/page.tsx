"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "@/lib/notifications";
import CompanyNav from "@/components/CompanyNav/CompanyNav";
import styles from "./Notifications.module.css";
import {
  FaBell,
  FaTimes,
  FaCheckDouble,
  FaTrash,
  FaBriefcase,
  FaUserCircle,
  FaArrowLeft,
} from "react-icons/fa";

export default function NotificationsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [filter, setFilter] = useState<"all" | "unread">("all");

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
  };

  const getNotificationMessage = (notification: Notification) => {
    const data = notification.data as Record<string, string>;

    switch (notification.type) {
      case "App\\Notifications\\NewJobApplication":
        return {
          title: t("notifications.newApplication"),
          message: `${data.student_name} ${t("notifications.appliedFor")} ${data.job_title}`,
          icon: <FaBriefcase />,
          link: `/company/applications/${data.application_id}`,
        };

      case "App\\Notifications\\ApplicationStatusUpdated":
        return {
          title: t("notifications.applicationUpdate"),
          message: `${t("notifications.applicationStatusChanged")} ${data.job_title}`,
          icon: <FaBriefcase />,
          link: `/university_student/applications`,
        };

      case "App\\Notifications\\NewJobPosted":
        return {
          title: t("notifications.newJob"),
          message: `${data.company_name} ${t("notifications.postedNewJob")} ${data.job_title}`,
          icon: <FaBriefcase />,
          link: `/university_student/jobs/${data.job_id}`,
        };

      case "App\\Notifications\\WelcomeNotification":
        return {
          title: data.title || t("common.welcome"),
          message: data.message,
          icon: <FaUserCircle />,
          link: null,
        };

      case "App\\Notifications\\FollowRequestNotification":
        return {
          title: t("notifications.newFollowRequest"),
          message: `${data.parent_name} ${t("notifications.wantsToFollow")}`,
          icon: <FaUserCircle />,
          link: `/student/follow-requests`,
        };

      case "App\\Notifications\\FollowRequestApprovedNotification":
        return {
          title: t("notifications.requestApproved"),
          message: data.message,
          icon: <FaUserCircle />,
          link: `/parent/students`,
        };

      default:
        return {
          title: t("notifications.notifications"),
          message: data.message || t("notifications.newNotification"),
          icon: <FaBell />,
          link: null,
        };
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
      await markAsRead(notification.id);
    }

    const { link } = getNotificationMessage(notification);
    if (link) {
      router.push(link);
    }
  };

  const handleDeleteNotification = async (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return t("notifications.justNow");
    if (diffInSeconds < 3600)
      return `${t("notifications.minutesAgo").replace("{n}", Math.floor(diffInSeconds / 60).toString())}`;
    if (diffInSeconds < 86400)
      return `${t("notifications.hoursAgo").replace("{n}", Math.floor(diffInSeconds / 3600).toString())}`;
    if (diffInSeconds < 604800)
      return `${t("notifications.daysAgo").replace("{n}", Math.floor(diffInSeconds / 86400).toString())}`;

    return date.toLocaleDateString("en-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupNotificationsByDate = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const groups: {
      [key: string]: Notification[];
    } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    const filteredNotifications =
      filter === "unread"
        ? notifications.filter((n) => !n.read_at)
        : notifications;

    filteredNotifications.forEach((notification) => {
      const notifDate = new Date(notification.created_at);
      if (notifDate >= today) {
        groups.today.push(notification);
      } else if (notifDate >= yesterday) {
        groups.yesterday.push(notification);
      } else if (notifDate >= thisWeek) {
        groups.thisWeek.push(notification);
      } else {
        groups.older.push(notification);
      }
    });

    return groups;
  };

  const groups = groupNotificationsByDate();

  if (loading && notifications.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>{t("common.loadingData")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CompanyNav />
      <div className={styles.main}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => router.back()}>
            <FaArrowLeft />
          </button>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <FaBell />
              {t("notifications.notifications")}
            </h1>
            {unreadCount > 0 && (
              <p className={styles.subtitle}>
                {t("notifications.unreadCount").replace(
                  "{count}",
                  unreadCount.toString()
                )}
              </p>
            )}
          </div>
          <div className={styles.headerActions}>
            {unreadCount > 0 && (
              <button
                className={styles.markAllButton}
                onClick={markAllAsRead}
                title={t("notifications.markAllAsRead")}
              >
                <FaCheckDouble />
                <span>{t("notifications.markAllAsRead")}</span>
              </button>
            )}
          </div>
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${
              filter === "all" ? styles.active : ""
            }`}
            onClick={() => setFilter("all")}
          >
            {t("common.all")}
            {notifications.length > 0 && (
              <span className={styles.count}>{notifications.length}</span>
            )}
          </button>
          <button
            className={`${styles.filterButton} ${
              filter === "unread" ? styles.active : ""
            }`}
            onClick={() => setFilter("unread")}
          >
            {t("notifications.unread")}
            {unreadCount > 0 && (
              <span className={styles.count}>{unreadCount}</span>
            )}
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <FaBell className={styles.emptyIcon} />
            <h2>{t("notifications.noNotifications")}</h2>
            <p>{t("notifications.noNotificationsDescription")}</p>
          </div>
        ) : (
          <div className={styles.notificationsList}>
            {Object.entries(groups).map(([group, groupNotifications]) => {
              if (groupNotifications.length === 0) return null;

              return (
                <div key={group} className={styles.notificationGroup}>
                  <h2 className={styles.groupTitle}>
                    {t(`notifications.${group}`)}
                  </h2>
                  {groupNotifications.map((notification) => {
                    const { title, message, icon } =
                      getNotificationMessage(notification);
                    const isUnread = !notification.read_at;

                    return (
                      <div
                        key={notification.id}
                        className={`${styles.notificationItem} ${
                          isUnread ? styles.unread : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className={styles.notificationIcon}>{icon}</div>
                        <div className={styles.notificationContent}>
                          <div className={styles.notificationHeader}>
                            <h3 className={styles.notificationTitle}>
                              {title}
                            </h3>
                            <span className={styles.notificationTime}>
                              {formatTime(notification.created_at)}
                            </span>
                          </div>
                          <p className={styles.notificationMessage}>
                            {message}
                          </p>
                        </div>
                        <button
                          className={styles.deleteButton}
                          onClick={(e) =>
                            handleDeleteNotification(e, notification.id)
                          }
                          title={t("notifications.deleteNotification")}
                        >
                          <FaTimes />
                        </button>
                        {isUnread && <div className={styles.unreadDot} />}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
