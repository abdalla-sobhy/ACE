"use client";

import { useContext } from "react";
import { ThemeContext } from "@/app/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={styles.button}
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Sun className={`${styles.icon} ${styles.sun}`}/>
      ) : (
        <Moon className={`${styles.icon} ${styles.moon}`}/>
      )}
    </button>
  );
}
