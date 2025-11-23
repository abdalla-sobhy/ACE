"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CompanyNav from "@/components/CompanyNav/CompanyNav";
import styles from "./AiMentor.module.css";
import {
  FaRobot,
  FaPaperPlane,
  FaSpinner,
  FaLightbulb,
  FaBriefcase,
  FaChartLine,
  FaTrash,
  FaBuilding,
  FaUsers,
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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchUser();
    loadHistory();
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
        const userData = await response.json();
        setUser(userData);
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
          data.conversations.reverse().forEach((conv: any) => {
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

  const sendMessage = async (message: string, isQuickAction = false) => {
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
    } catch (error: any) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
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
      icon: <FaUsers />,
      title: "Talent Insights",
      description: "Understand talent market trends in Egypt",
      action: () => sendMessage("What are the current talent market trends in Egypt? What skills are in high demand right now?"),
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: <FaBriefcase />,
      title: "Job Description Help",
      description: "Create effective job descriptions",
      action: () => sendMessage("Help me create an effective job description for a software engineer position. What should I include?"),
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: <FaLightbulb />,
      title: "Interview Questions",
      description: "Get AI-suggested interview questions",
      action: () => sendMessage("What are good interview questions to ask candidates for technical roles? Help me assess both technical and soft skills."),
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: <FaChartLine />,
      title: "Hiring Strategy",
      description: "Optimize your recruitment process",
      action: () => sendMessage("What are best practices for hiring and retaining top talent in Egypt's tech industry?"),
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  return (
    <div className={styles.container}>
      <CompanyNav />

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FaRobot />
            </div>
            <div>
              <h1 className={styles.title}>AI Talent Advisor</h1>
              <p className={styles.subtitle}>
                Your AI assistant for recruitment and talent management
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
              <FaBuilding />
            </div>
            <h2>Welcome to Your AI Talent Advisor!</h2>
            <p>
              I can help you with recruitment strategies, job descriptions, interview questions,
              talent market insights, and more. Try one of the quick actions below or ask me anything!
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
              placeholder="Ask me anything about talent and recruitment..."
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
