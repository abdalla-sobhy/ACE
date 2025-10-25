"use client";

import { useState, useRef, useEffect } from "react";
import { FaBell, FaTimes, FaCheckDouble } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "@/lib/notifications";
import { useTranslations } from "@/hooks/useTranslations";
import styles from "./NotificationDropdown.module.css";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t, locale } = useTranslations();

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationMessage = (notification: Notification) => {
    const data = notification.data as Record<string, string>;

    switch (notification.type) {
      case "App\\Notifications\\NewJobApplication":
        return {
          title: t("notifications.newJobApplication"),
          message: t("notifications.studentApplied", {
            studentName: data.student_name,
            jobTitle: data.job_title
          }),
          link: `/company/applications/${data.application_id}`,
        };

      case "App\\Notifications\\ApplicationStatusUpdated":
        return {
          title: t("notifications.applicationStatusUpdated"),
          message: t("notifications.statusUpdatedTo", {
            jobTitle: data.job_title,
            status: getStatusText(data.new_status)
          }),
          link: `/university_student/applications`,
        };

      case "App\\Notifications\\NewJobPosted":
        return {
          title: t("notifications.newJobPosted"),
          message: t("notifications.companyPostedJob", {
            companyName: data.company_name,
            jobTitle: data.job_title
          }),
          link: `/university_student/jobs/${data.job_id}`,
        };

      case "App\\Notifications\\WelcomeNotification":
        return {
          title: data.title || t("notifications.welcome"),
          message: data.message,
          link: null,
        };

      case "App\\Notifications\\FollowRequestNotification":
        return {
          title: t("notifications.followRequest"),
          message: t("notifications.parentWantsToFollow", {
            parentName: data.parent_name
          }),
          link: `/student/follow-requests`,
        };

      case "App\\Notifications\\FollowRequestApprovedNotification":
        return {
          title: t("notifications.followRequestApproved"),
          message: data.message,
          link: `/parent/students`,
        };

      default:
        return {
          title: t("notifications.notification"),
          message: data.message || t("notifications.newNotification"),
          link: null,
        };
    }
  };

  const getStatusText = (status: string) => {
    const statusKey = `status.${status}`;
    const translated = t(statusKey);
    return translated !== statusKey ? translated : status;
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
      await markAsRead(notification.id);
    }

    const { link } = getNotificationMessage(notification);
    if (link) {
      router.push(link);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
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

    if (diffInSeconds < 60) return t("notifications.time.now");
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t("notifications.time.minutesAgo", { minutes: minutes.toString() });
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t("notifications.time.hoursAgo", { hours: hours.toString() });
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return t("notifications.time.daysAgo", { days: days.toString() });
    }

    return date.toLocaleDateString(locale === 'ar' ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.notificationWrapper} ref={dropdownRef}>
      <button
        className={styles.notificationButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className={styles.notificationBadge}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h3>{t("notifications.title")}</h3>
            {unreadCount > 0 && (
              <button
                className={styles.markAllButton}
                onClick={handleMarkAllAsRead}
                title={t("notifications.markAllAsRead")}
              >
                <FaCheckDouble />
              </button>
            )}
          </div>

          <div className={styles.notificationList}>
            {loading && notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{t("common.loading")}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <FaBell className={styles.emptyIcon} />
                <p>{t("notifications.noNotifications")}</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const { title, message } = getNotificationMessage(notification);
                const isUnread = !notification.read_at;

                return (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${
                      isUnread ? styles.unread : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationTitle}>{title}</div>
                      <div className={styles.notificationMessage}>
                        {message}
                      </div>
                      <div className={styles.notificationTime}>
                        {formatTime(notification.created_at)}
                      </div>
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) =>
                        handleDeleteNotification(e, notification.id)
                      }
                      title={t("notifications.delete")}
                    >
                      <FaTimes />
                    </button>
                    {isUnread && <div className={styles.unreadDot} />}
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className={styles.dropdownFooter}>
              <button
                className={styles.viewAllButton}
                onClick={() => {
                  router.push("/notifications");
                  setIsOpen(false);
                }}
              >
                {t("notifications.viewAll")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
