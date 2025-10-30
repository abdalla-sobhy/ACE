/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import AgoraRTC from "agora-rtc-sdk-ng";
import styles from "./TeacherLiveClass.module.css";

import { useLanguage } from "@/hooks/useLanguage";
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export default function TeacherLiveClassPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string;
  
  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const leaveChannel = useCallback(async () => {
    try {
      localAudioTrack?.close();
      localVideoTrack?.close();
      await client.leave();
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  }, [localAudioTrack, localVideoTrack]);

  const initializeAgora = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      if (!authData.token) {
        throw new Error("لم يتم العثور على بيانات المصادقة");
      }

      // Get Agora token from backend
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

      const { stream_data } = data;

      // Create local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
        { encoderConfig: "music_standard" },
        { encoderConfig: "720p_2" }
      );
      
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      // Join channel
      await client.join(
        stream_data.app_id,
        stream_data.channel,
        stream_data.token,
        stream_data.uid
      );

      // Publish tracks
      await client.publish([audioTrack, videoTrack]);

      // Play local video
      videoTrack.play("local-player");

      // Handle remote users joining
      client.on("user-published", async (remoteUser, mediaType) => {
        await client.subscribe(remoteUser, mediaType);
        
        if (mediaType === "video") {
          const remoteVideoTrack = remoteUser.videoTrack;
          const playerContainer = document.createElement("div");
          playerContainer.id = `player-${remoteUser.uid}`;
          playerContainer.className = styles.remotePlayer;
          
          const nameLabel = document.createElement("div");
          nameLabel.className = styles.playerName;
          nameLabel.textContent = `طالب ${remoteUser.uid}`;
          playerContainer.appendChild(nameLabel);
          
          document.getElementById("remote-players")?.appendChild(playerContainer);
          remoteVideoTrack?.play(`player-${remoteUser.uid}`);
        }
        
        if (mediaType === "audio") {
          remoteUser.audioTrack?.play();
        }

        setRemoteUsers((prev) => {
          const exists = prev.find(u => u.uid === remoteUser.uid);
          if (exists) return prev;
          return [...prev, remoteUser];
        });
      });

      // Handle remote users leaving
      client.on("user-unpublished", (remoteUser) => {
        const playerContainer = document.getElementById(`player-${remoteUser.uid}`);
        playerContainer?.remove();
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== remoteUser.uid));
      });

      client.on("user-left", (remoteUser) => {
        const playerContainer = document.getElementById(`player-${remoteUser.uid}`);
        playerContainer?.remove();
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== remoteUser.uid));
      });

      // Start session on backend
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/live/session/${sessionId}/start`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSessionStarted(true);
      setLoading(false);
    } catch (error: any) {
      console.error("Error initializing Agora:", error);
      setError(error.message || "حدث خطأ أثناء الاتصال");
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    
    initializeAgora();
    
    return () => {
      leaveChannel();
    };
  }, [sessionId, initializeAgora, leaveChannel]);

  const handleEndSession = async () => {
    const authData = JSON.parse(localStorage.getItem("authData") || "{}");
    
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/live/session/${sessionId}/end`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error ending session:", error);
    }
    
    await leaveChannel();
    router.push("/teacher/dashboard");
  };

  const toggleMic = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!micEnabled);
      setMicEnabled(!micEnabled);
    }
  };

  const toggleCamera = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!cameraEnabled);
      setCameraEnabled(!cameraEnabled);
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>البث المباشر</h1>
        </div>
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>حدث خطأ</h2>
          <p>{error}</p>
          <button onClick={() => router.push("/teacher/dashboard")} className={styles.errorButton}>
            العودة للوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>البث المباشر</h1>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>جاري الاتصال بالجلسة المباشرة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>البث المباشر - أنت المعلم</h1>
        <div className={styles.headerActions}>
          {sessionStarted && (
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot}></span>
              <span>جلسة مباشرة</span>
            </div>
          )}
          <div className={styles.participantsCount}>
            <span>👥</span>
            <span>{remoteUsers.length + 1} مشارك</span>
          </div>
          <button 
            onClick={toggleMic} 
            className={`${styles.controlButton} ${!micEnabled ? styles.disabled : ''}`}
            title={micEnabled ? "كتم الصوت" : "تشغيل الصوت"}
          >
            {micEnabled ? "🎤" : "🔇"}
          </button>
          <button 
            onClick={toggleCamera} 
            className={`${styles.controlButton} ${!cameraEnabled ? styles.disabled : ''}`}
            title={cameraEnabled ? "إيقاف الكاميرا" : "تشغيل الكاميرا"}
          >
            {cameraEnabled ? "📹" : "📷"}
          </button>
          <button onClick={handleEndSession} className={styles.endButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18.36 6L6 18.36" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 6l12.36 12.36" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>إنهاء الجلسة</span>
          </button>
        </div>
      </div>

      <div className={styles.videoGrid}>
        <div className={styles.localPlayerContainer}>
          <div id="local-player" className={styles.localPlayer}></div>
          <div className={styles.playerLabel}>أنت (المعلم)</div>
        </div>
        
        <div className={styles.remotePlayersContainer}>
          <div id="remote-players" className={styles.remotePlayers}>
            {remoteUsers.length === 0 && (
              <div className={styles.waitingMessage}>
                <p>⏳ في انتظار انضمام الطلاب...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}