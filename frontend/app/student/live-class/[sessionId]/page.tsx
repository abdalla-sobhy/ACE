/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./LiveClass.module.css";

declare global {
  interface Window {
    jitsiApi: any;
    JitsiMeetExternalAPI: any;
  }
}

export default function LiveClassPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string | undefined;

  const initializeJitsi = useCallback(async () => {
    if (!sessionId) return;

    const authData = JSON.parse(localStorage.getItem("authData") || "{}");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/live/session/${sessionId}/join`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert("Cannot join session");
      router.push("/student/dashboard");
      return;
    }

    const domain = "meet.jit.si";
    const options = {
      roomName: `EduEgypt_Session_${sessionId}`,
      width: "100%",
      height: "100%",
      parentNode: document.querySelector("#jitsi-container"),
      userInfo: {
        displayName: JSON.parse(localStorage.getItem("user") || "{}").name,
      },
      configOverwrite: {
        startWithAudioMuted: true,
        disableModeratorIndicator: false,
        startScreenSharing: false,
      },
      interfaceConfigOverwrite: {
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        FILM_STRIP_MAX_HEIGHT: 120,
      },
    };

    window.jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
  }, [sessionId, router]);

  useEffect(() => {
    if (!sessionId) return;

    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => initializeJitsi();
    document.body.appendChild(script);

    return () => {
      if (window.jitsiApi) {
        window.jitsiApi.dispose();
      }
    };
  }, [sessionId, initializeJitsi]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Live Class Session</h1>
        <button onClick={() => router.push("/student/dashboard")}>
          Leave Class
        </button>
      </div>
      <div id="jitsi-container" className={styles.videoContainer}></div>
    </div>
  );
}
