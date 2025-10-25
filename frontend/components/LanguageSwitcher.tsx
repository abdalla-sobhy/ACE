"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FaGlobe } from "react-icons/fa";
import { useLocale } from 'next-intl';
import styles from "./LanguageSwitcher.module.css";

type Locale = 'ar' | 'en';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    startTransition(() => {
      // Store preference in localStorage
      localStorage.setItem('locale', newLocale);

      // Replace the locale in the current path
      const newPath = pathname?.replace(`/${currentLocale}`, `/${newLocale}`) || `/${newLocale}`;

      router.push(newPath);
      router.refresh();
      setIsOpen(false);
    });
  };

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={styles.languageButton}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
      >
        <FaGlobe />
        <span className={styles.currentLang}>
          {currentLocale === 'ar' ? 'العربية' : 'English'}
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button
            className={`${styles.option} ${currentLocale === 'ar' ? styles.active : ''}`}
            onClick={() => switchLanguage('ar')}
          >
            العربية
          </button>
          <button
            className={`${styles.option} ${currentLocale === 'en' ? styles.active : ''}`}
            onClick={() => switchLanguage('en')}
          >
            English
          </button>
        </div>
      )}
    </div>
  );
}
