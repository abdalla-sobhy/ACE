import { getAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Define notification data types
interface NewJobApplicationData {
  student_name: string;
  job_title: string;
  application_id: string;
}

interface ApplicationStatusUpdatedData {
  job_title: string;
  new_status: string;
}

interface NewJobPostedData {
  company_name: string;
  job_title: string;
  job_id: string;
}

interface WelcomeNotificationData {
  title?: string;
  message: string;
}

interface FollowRequestNotificationData {
  parent_name: string;
}

interface FollowRequestApprovedNotificationData {
  message: string;
}

interface GenericNotificationData {
  message?: string;
  [key: string]: unknown;
}

export type NotificationData =
  | NewJobApplicationData
  | ApplicationStatusUpdatedData
  | NewJobPostedData
  | WelcomeNotificationData
  | FollowRequestNotificationData
  | FollowRequestApprovedNotificationData
  | GenericNotificationData;

export interface Notification {
  id: string;
  type: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}

export interface NotificationsResponse {
  success: boolean;
  notifications: Notification[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
  unread_count: number;
}

export interface UnreadCountResponse {
  success: boolean;
  unread_count: number;
}

/**
 * Fetch all notifications for the authenticated user
 */
export async function fetchNotifications(
  page: number = 1,
  perPage: number = 15,
  unreadOnly: boolean = false
): Promise<NotificationsResponse> {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    unread_only: unreadOnly.toString(),
  });

  const response = await fetch(`${API_URL}/api/notifications?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  return response.json();
}

/**
 * Get unread notification count
 */
export async function fetchUnreadCount(): Promise<number> {
  const token = getAuthToken();
  if (!token) return 0;

  try {
    const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) return 0;

    const data: UnreadCountResponse = await response.json();
    return data.unread_count;
  } catch (error) {
    console.error('Failed to fetch unread count:', error);
    return 0;
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return false;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return false;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<boolean> {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_URL}/api/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to delete notification:', error);
    return false;
  }
}
