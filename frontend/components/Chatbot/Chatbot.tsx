"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { MessageCircle, X, Minimize2, Send } from "lucide-react";
import styles from "./Chatbot.module.css";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function Chatbot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now(),
        text: t("chatbot.welcomeMessage"),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, t]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Greeting patterns
    if (
      message.match(/^(hi|hello|hey|مرحبا|سلام|اهلا)/i)
    ) {
      return t("chatbot.defaultResponses.greeting");
    }

    // Help patterns
    if (
      message.match(/help|مساعدة|ساعدني/i)
    ) {
      return t("chatbot.defaultResponses.help");
    }

    // Course patterns
    if (
      message.match(/course|كورس|دورة|تعليم|دراسة/i)
    ) {
      return t("chatbot.defaultResponses.courses");
    }

    // Registration patterns
    if (
      message.match(/register|تسجيل|انضم|اشترك/i)
    ) {
      return t("chatbot.defaultResponses.registration");
    }

    // Contact patterns
    if (
      message.match(/contact|تواصل|اتصال|رقم|ايميل/i)
    ) {
      return t("chatbot.defaultResponses.contact");
    }

    // Thank you patterns
    if (
      message.match(/thank|شكر|متشكر/i)
    ) {
      return t("chatbot.defaultResponses.thanks");
    }

    // Default response
    return t("chatbot.defaultResponses.default");
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    setTimeout(() => handleSend(), 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          className={styles.floatingButton}
          onClick={() => setIsOpen(true)}
          aria-label={t("chatbot.title")}
        >
          <MessageCircle className={styles.floatingIcon} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`${styles.chatWindow} ${
            isMinimized ? styles.minimized : ""
          }`}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.headerIcon}>
                <MessageCircle size={20} />
              </div>
              <div className={styles.headerText}>
                <h3 className={styles.headerTitle}>{t("chatbot.title")}</h3>
                <p className={styles.headerSubtitle}>
                  {t("chatbot.subtitle")}
                </p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.iconButton}
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={
                  isMinimized ? t("chatbot.maximize") : t("chatbot.minimize")
                }
              >
                <Minimize2 size={18} />
              </button>
              <button
                className={styles.iconButton}
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                aria-label={t("chatbot.close")}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className={styles.messagesContainer}>
                <div className={styles.messages}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`${styles.message} ${
                        message.sender === "user"
                          ? styles.userMessage
                          : styles.botMessage
                      }`}
                    >
                      <div className={styles.messageContent}>
                        <p className={styles.messageText}>{message.text}</p>
                        <span className={styles.messageTime}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className={`${styles.message} ${styles.botMessage}`}>
                      <div className={styles.messageContent}>
                        <div className={styles.typingIndicator}>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length <= 1 && !isTyping && (
                  <div className={styles.quickReplies}>
                    <button
                      onClick={() =>
                        handleQuickReply(t("chatbot.quickReplies.courses"))
                      }
                      className={styles.quickReply}
                    >
                      {t("chatbot.quickReplies.courses")}
                    </button>
                    <button
                      onClick={() =>
                        handleQuickReply(t("chatbot.quickReplies.howToRegister"))
                      }
                      className={styles.quickReply}
                    >
                      {t("chatbot.quickReplies.howToRegister")}
                    </button>
                    <button
                      onClick={() =>
                        handleQuickReply(t("chatbot.quickReplies.pricing"))
                      }
                      className={styles.quickReply}
                    >
                      {t("chatbot.quickReplies.pricing")}
                    </button>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className={styles.inputContainer}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("chatbot.placeholder")}
                  className={styles.input}
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className={styles.sendButton}
                  aria-label={t("chatbot.send")}
                >
                  <Send size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
