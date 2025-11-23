"use client";

import React from "react";
import styles from "./Popup.module.css";
import { FaTimes } from "react-icons/fa";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "info" | "success" | "error" | "warning";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

export default function Popup({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  showCancel = false,
}: PopupProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={`${styles.popup} ${styles[type]}`}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        {title && <h3 className={styles.title}>{title}</h3>}

        <div className={styles.message}>{message}</div>

        <div className={styles.buttonContainer}>
          {showCancel && (
            <button className={styles.cancelButton} onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button className={styles.confirmButton} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
