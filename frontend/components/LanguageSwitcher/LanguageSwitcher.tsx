"use client";

import { useLanguage } from "@/hooks/useLanguage";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={styles.languageSwitcher}
      aria-label="Toggle language"
      title={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      <span className={styles.languageText}>
        {language === "ar" ? "EN" : "ع"}
      </span>
    </button>
  );
}
