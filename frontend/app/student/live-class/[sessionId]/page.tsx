/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./LiveClass.module.css";

import { useLanguage } from "@/hooks/useLanguage";
declare global {
  interface Window {
    jitsiApi: any;
    JitsiMeetExternalAPI: any;
  }
}

export default function LiveClassPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string | undefined;
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || isInitialized.current) return;

    let jitsiApi: any = null;

    const initializeJitsi = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get auth data
        const authData = JSON.parse(localStorage.getItem("authData") || "{}");

        if (!authData.token) {
          throw new Error("لم يتم العثور على بيانات المصادقة");
        }

        // Join session API call
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/live/session/${sessionId}/join`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authData.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "لا يمكن الانضمام للجلسة");
        }

        // Wait for JitsiMeetExternalAPI to be available
        if (typeof window.JitsiMeetExternalAPI === "undefined") {
          throw new Error("فشل تحميل أداة المؤتمر");
        }

        // Clear container first
        if (jitsiContainerRef.current) {
          jitsiContainerRef.current.innerHTML = "";
        }

        const domain = "meet.jit.si";
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const roomName = `EdvanceSession${sessionId}`;
        const options = {
  roomName: roomName, // NO timestamp!
  width: "100%",
  height: "100%",
  parentNode: jitsiContainerRef.current,
  userInfo: {
    displayName: user.name || "طالب",
    email: user.email,
  },
  configOverwrite: {
    startWithAudioMuted: true,
    startWithVideoMuted: false,
    prejoinPageEnabled: false,
    enableWelcomePage: false,
    requireDisplayName: false,
  },
  interfaceConfigOverwrite: {
    DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
    FILM_STRIP_MAX_HEIGHT: 120,
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
  },
};

        jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
        window.jitsiApi = jitsiApi;
        isInitialized.current = true;

        // Add event listeners
        jitsiApi.addListener("videoConferenceJoined", () => {
          setLoading(false);
        });

        jitsiApi.addListener("videoConferenceLeft", () => {
          router.push("/student/dashboard");
        });

        jitsiApi.addListener("readyToClose", () => {
          router.push("/student/dashboard");
        });

        // Timeout for loading state
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      } catch (err: any) {
        console.error("Error initializing Jitsi:", err);
        setError(err.message || "حدث خطأ أثناء تحميل الجلسة");
        setLoading(false);
      }
    };

    // Load Jitsi script
    const loadJitsiScript = () => {
      const existingScript = document.querySelector(
        'script[src="https://meet.jit.si/external_api.js"]'
      );

      if (existingScript) {
        if (window.JitsiMeetExternalAPI) {
          initializeJitsi();
        } else {
          existingScript.addEventListener("load", initializeJitsi);
        }
        return;
      }

      const scriptElement = document.createElement("script");
      scriptElement.src = "https://meet.jit.si/external_api.js";
      scriptElement.async = true;
      scriptElement.onload = () => {
        initializeJitsi();
      };
      scriptElement.onerror = () => {
        setError("فشل تحميل أداة المؤتمر");
        setLoading(false);
      };
      document.body.appendChild(scriptElement);
    };

    loadJitsiScript();

    // Cleanup function
    return () => {
      if (jitsiApi) {
        try {
          jitsiApi.dispose();
        } catch (e) {
          console.error("Error disposing Jitsi API:", e);
        }
        jitsiApi = null;
      }
      window.jitsiApi = null;
      isInitialized.current = false;
    };
  }, [sessionId, router]);

  const handleLeave = () => {
    if (window.jitsiApi) {
      try {
        window.jitsiApi.executeCommand("hangup");
      } catch (e) {
        console.error("Error hanging up:", e);
      }
    }
    router.push("/student/dashboard");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>الجلسة المباشرة</h1>
        <button onClick={handleLeave} className={styles.leaveButton}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="16 17 21 12 16 7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="21"
              y1="12"
              x2="9"
              y2="12"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>مغادرة الجلسة</span>
        </button>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>جاري تحميل الجلسة المباشرة...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>حدث خطأ</h2>
          <p>{error}</p>
          <button
            onClick={() => router.push("/student/dashboard")}
            className={styles.errorButton}
          >
            العودة للوحة التحكم
          </button>
        </div>
      )}

      <div
        ref={jitsiContainerRef}
        id="jitsi-container"
        className={styles.videoContainer}
        style={{ display: loading || error ? "none" : "block" }}
      />
    </div>
  );
}
