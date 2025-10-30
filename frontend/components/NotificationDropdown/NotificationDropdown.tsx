"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { FaBell, FaTimes, FaCheckDouble } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "@/lib/notifications";
import styles from "./NotificationDropdown.module.css";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
          title: t("notifications.newApplication"),
          message: `تقدم ${data.student_name} لوظيفة ${data.job_title}`,
          link: `/company/applications/${data.application_id}`,
        };

      case "App\\Notifications\\ApplicationStatusUpdated":
        return {
          title: t("notifications.applicationUpdate"),
          message: `تم تحديث حالة طلبك في ${data.job_title} إلى: ${getStatusText(data.new_status)}`,
          link: `/university_student/applications`,
        };

      case "App\\Notifications\\NewJobPosted":
        return {
          title: t("notifications.newJob"),
          message: `${data.company_name} نشرت وظيفة جديدة: ${data.job_title}`,
          link: `/university_student/jobs/${data.job_id}`,
        };

      case "App\\Notifications\\WelcomeNotification":
        return {
          title: data.title || t("common.welcome"),
          message: data.message,
          link: null,
        };

      case "App\\Notifications\\FollowRequestNotification":
        return {
          title: t("notifications.newFollowRequest"),
          message: `${data.parent_name} يريد متابعة تقدمك`,
          link: `/student/follow-requests`,
        };

      case "App\\Notifications\\FollowRequestApprovedNotification":
        return {
          title: t("notifications.requestApproved"),
          message: data.message,
          link: `/parent/students`,
        };

      default:
        return {
          title: t("notifications.notifications"),
          message: data.message || t("notifications.newNotification"),
          link: null,
        };
    }
  };

  const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
      pending: t("common.pending"),
      approved: t("common.approved"),
      rejected: t("common.rejected"),
      under_review: t("student.underReview"),
    };
    return statusMap[status] || status;
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

    if (diffInSeconds < 60) return "الآن";
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 604800) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;

    return date.toLocaleDateString("ar-EG", {
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
            <h3>الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                className={styles.markAllButton}
                onClick={handleMarkAllAsRead}
                title="تحديد الكل كمقروء"
              >
                <FaCheckDouble />
              </button>
            )}
          </div>

          <div className={styles.notificationList}>
            {loading && notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <p>جاري التحميل...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <FaBell className={styles.emptyIcon} />
                <p>لا توجد إشعارات</p>
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
                      title="حذف"
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
                عرض جميع الإشعارات
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
