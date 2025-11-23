"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import StudentNav from "@/components/StudentNav/StudentNav";
import styles from "./AiMentor.module.css";
import {
  FaRobot,
  FaPaperPlane,
  FaSpinner,
  FaLightbulb,
  FaBriefcase,
  FaChartLine,
  FaTrash,
  FaGraduationCap,
  FaBook,
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

export default function AiMentorPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchUser();
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const response = await fetch(`${BACKEND_URL}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await response.json();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem("authToken");
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
      const token = localStorage.getItem("authToken");
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
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
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

  const clearHistory = async () => {
    if (!confirm("Are you sure you want to clear your conversation history?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
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

  const quickActions: QuickAction[] = [
    {
      icon: <FaBook />,
      title: "Career Exploration",
      description: "Explore different career paths and options",
      action: () => sendMessage("I'm a student and want to explore different career options. Can you help me understand what careers might suit my interests and skills?"),
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: <FaLightbulb />,
      title: "Study Tips",
      description: "Get personalized study advice",
      action: () => sendMessage("Can you give me study tips and learning strategies based on my grade level and goals?"),
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: <FaBriefcase />,
      title: "Future Planning",
      description: "Plan your future education and career",
      action: () => sendMessage("Help me plan my future education path. What should I focus on in school to reach my goals?"),
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: <FaChartLine />,
      title: "Skill Development",
      description: "Learn what skills to develop now",
      action: () => sendMessage("What skills should I start developing now that will help me in the future?"),
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  return (
    <div className={styles.container}>
      <StudentNav />

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FaRobot />
            </div>
            <div>
              <h1 className={styles.title}>AI Study & Career Guide</h1>
              <p className={styles.subtitle}>
                Your personal AI assistant for studying and career exploration
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearHistory} className={styles.clearButton}>
              <FaTrash /> Clear History
            </button>
          )}
        </div>

        {messages.length === 0 && (
          <div className={styles.welcomeSection}>
            <div className={styles.welcomeIcon}>
              <FaGraduationCap />
            </div>
            <h2>Welcome to Your AI Study Guide!</h2>
            <p>
              I can help you with study tips, career exploration, future planning, and more.
              Try one of the quick actions below or start a conversation!
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
                    {message.role === "user" ? "You" : <FaRobot />}
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.messageText}>{message.content}</div>
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
                      Thinking...
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
              placeholder="Ask me anything about studying or your future..."
              className={styles.input}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()} className={styles.sendButton}>
              {isLoading ? <FaSpinner className={styles.spinner} /> : <FaPaperPlane />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
