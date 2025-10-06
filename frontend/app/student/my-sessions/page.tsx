"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentNav from "@/components/StudentNav/StudentNav";
import styles from "./MySessions.module.css";
import { FaVideo, FaCalendarAlt, FaClock } from "react-icons/fa";

interface LiveSession {
  id: number;
  course_title: string;
  session_date: string;
  start_time: string;
  end_time: string;
  status: string;
  can_join: boolean;
}

export default function MySessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  const fetchUpcomingSessions = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/live/sessions/upcoming`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinSession = (sessionId: number) => {
    router.push(`/student/live-class/${sessionId}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <StudentNav />
        <div className={styles.loader}>جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <StudentNav />
      
      <main className={styles.main}>
        <h1>الجلسات المباشرة القادمة</h1>
        
        {sessions.length === 0 ? (
          <div className={styles.noSessions}>
            <FaVideo />
            <p>لا توجد جلسات مباشرة قادمة</p>
          </div>
        ) : (
          <div className={styles.sessionsGrid}>
            {sessions.map((session) => (
              <div key={session.id} className={styles.sessionCard}>
                <h3>{session.course_title}</h3>
                <div className={styles.sessionInfo}>
                  <span><FaCalendarAlt /> {session.session_date}</span>
                  <span><FaClock /> {session.start_time} - {session.end_time}</span>
                </div>
                <button
                  onClick={() => joinSession(session.id)}
                  disabled={!session.can_join}
                  className={session.can_join ? styles.joinButton : styles.disabledButton}
                >
                  {session.can_join ? "انضم الآن" : "الجلسة غير متاحة بعد"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}