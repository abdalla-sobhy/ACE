"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import UniversityStudentNav from "@/components/UniversityStudentNav/UniversityStudentNav";
import Popup from "@/components/Popup/Popup";
import styles from "./AiMentor.module.css";
import { getAuthToken } from "@/lib/auth";
import { useLanguage } from "@/hooks/useLanguage";
import {
  FaRobot,
  FaPaperPlane,
  FaSpinner,
  FaLightbulb,
  FaBriefcase,
  FaChartLine,
  FaFileAlt,
  FaTrash,
  FaGraduationCap,
} from "react-icons/fa";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: () => void;
  gradient: string;
}

interface UserProfile {
  name?: string;
  email?: string;
  universityStudentProfile?: {
    faculty?: string;
    university?: string;
  };
}

export default function AiMentorPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    message: string;
    type?: "info" | "success" | "error" | "warning";
  }>({
    isOpen: false,
    message: "",
    type: "info",
  });
  const [confirmPopup, setConfirmPopup] = useState({
  isOpen: false,
  message: "",
  onConfirm: () => {},
});

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadHistory = async () => {
    try {
      const token = getAuthToken();
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const response = await fetch(`${BACKEND_URL}/api/ai-career/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.conversations.length > 0) {
          const loadedMessages: Message[] = [];
          data.conversations.reverse().forEach((conv: { id: number; user_message: string; ai_response: string; created_at: string }) => {
            loadedMessages.push({
              id: `user-${conv.id}`,
              role: "user",
              content: conv.user_message,
              timestamp: new Date(conv.created_at),
            });
            loadedMessages.push({
              id: `assistant-${conv.id}`,
              role: "assistant",
              content: conv.ai_response,
              timestamp: new Date(conv.created_at),
            });
          });
          setMessages(loadedMessages);
        }
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const token = getAuthToken();
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const response = await fetch(`${BACKEND_URL}/api/ai-career/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          include_profile: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || "Failed to get response");
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `${t("aiMentor.errorMessage")} ${error instanceof Error ? error.message : ''}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const clearHistory = () => {
  setConfirmPopup({
    isOpen: true,
    message: t("aiMentor.clearHistoryConfirm"),
    onConfirm: executeClearHistory,
  });
};


  const executeClearHistory = async () => {
    try {
      const token = getAuthToken();
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const response = await fetch(`${BACKEND_URL}/api/ai-career/history`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const analyzeCv = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const response = await fetch(`${BACKEND_URL}/api/ai-career/analyze-cv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.success) {
        const userMsg: Message = {
          id: `user-${Date.now()}`,
          role: "user",
          content: t("aiMentor.analyzeCvRequest"),
          timestamp: new Date(),
        };
        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg, assistantMsg]);
      } else {
        setPopupState({
          isOpen: true,
          message: data.message || t("aiMentor.uploadCvFirst"),
          type: "warning",
        });
      }
    } catch {
      setPopupState({
        isOpen: true,
        message: t("aiMentor.errorAnalyzingCv"),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLearningPath = async () => {
    sendMessage(t("aiMentor.learningPathRequest"));
  };

  const getJobRecommendations = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const response = await fetch(`${BACKEND_URL}/api/ai-career/job-recommendations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        const userMsg: Message = {
          id: `user-${Date.now()}`,
          role: "user",
          content: t("aiMentor.jobSuitRequest"),
          timestamp: new Date(),
        };
        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg, assistantMsg]);
      }
    } catch (error) {
      console.error("Error getting job recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      icon: <FaFileAlt />,
      title: t("aiMentor.analyzeCv"),
      description: t("aiMentor.analyzeCvDesc"),
      action: analyzeCv,
      gradient: "linear-gradient(135deg, var(--gradient-blue-start, #58a6ff) 0%, var(--gradient-blue-end, #1f6feb) 100%)",
    },
    {
      icon: <FaLightbulb />,
      title: t("aiMentor.learningPath"),
      description: t("aiMentor.learningPathDesc"),
      action: getLearningPath,
      gradient: "linear-gradient(135deg, var(--gradient-blue-start, #58a6ff) 0%, var(--gradient-blue-end, #1f6feb) 100%)",
    },
    {
      icon: <FaBriefcase />,
      title: t("aiMentor.jobRecommendations"),
      description: t("aiMentor.jobRecommendationsDesc"),
      action: getJobRecommendations,
      gradient: "linear-gradient(135deg, var(--gradient-blue-start, #58a6ff) 0%, var(--gradient-blue-end, #1f6feb) 100%)",
    },
    {
      icon: <FaChartLine />,
      title: t("aiMentor.skillsGapAnalysis"),
      description: t("aiMentor.skillsGapAnalysisDesc"),
      action: () => sendMessage(t("aiMentor.skillsGapRequest")),
      gradient: "linear-gradient(135deg, var(--gradient-blue-start, #58a6ff) 0%, var(--gradient-blue-end, #1f6feb) 100%)",
    },
  ];

  function formatText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/^\* (.*)$/gm, "• $1");
}

  return (
    <div className={styles.container}>
      <UniversityStudentNav />

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FaRobot />
            </div>
            <div>
              <h1 className={styles.title}>{t("aiMentor.title")}</h1>
              <p className={styles.subtitle}>
                {t("aiMentor.subtitle")}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearHistory} className={styles.clearButton}>
              <FaTrash /> {t("aiMentor.clearHistory")}
            </button>
          )}
        </div>

        {messages.length === 0 && (
          <div className={styles.welcomeSection}>
            <div className={styles.welcomeIcon}>
              <FaGraduationCap />
            </div>
            <h2>{t("aiMentor.welcomeTitle")}</h2>
            <p>
              {t("aiMentor.welcomeDescription")}
            </p>

            <div className={styles.quickActions}>
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className={styles.quickActionCard}
                  onClick={action.action}
                  style={{ background: action.gradient }}
                >
                  <div className={styles.quickActionIcon}>{action.icon}</div>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className={styles.chatContainer}>
            <div className={styles.messagesContainer}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.role === "user" ? styles.userMessage : styles.assistantMessage
                  }`}
                >
                  <div className={styles.messageIcon}>
                    {message.role === "user" ? t("aiMentor.you") : <FaRobot />}
                  </div>
                  <div className={styles.messageContent}>
                    <div
                        className={styles.messageText}
                        dangerouslySetInnerHTML={{
                          __html: formatText(message.content),
                        }}
                      />
                    <div className={styles.messageTime}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.message} ${styles.assistantMessage}`}>
                  <div className={styles.messageIcon}>
                    <FaRobot />
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.loadingDots}>
                      <FaSpinner className={styles.spinner} />
                      {t("aiMentor.thinking")}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <div className={styles.inputContainer}>
          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t("aiMentor.inputPlaceholder")}
              className={styles.input}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()} className={styles.sendButton}>
              {isLoading ? <FaSpinner className={styles.spinner} /> : <FaPaperPlane />}
            </button>
          </form>
        </div>
      </div>

      <Popup
        isOpen={popupState.isOpen}
        onClose={() => setPopupState({ ...popupState, isOpen: false })}
        message={popupState.message}
        type={popupState.type}
      />
      <Popup
        isOpen={confirmPopup.isOpen}
        onClose={() => setConfirmPopup({ ...confirmPopup, isOpen: false })}
        message={confirmPopup.message}
        type="warning"
        confirmText={t("common.confirm")}
        cancelText={t("common.cancel")}
        showCancel={true}
        onConfirm={() => {
          confirmPopup.onConfirm();
          setConfirmPopup({ ...confirmPopup, isOpen: false });
        }}
      />
    </div>
  );
}