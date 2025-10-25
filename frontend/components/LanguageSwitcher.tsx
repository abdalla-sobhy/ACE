"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FaGlobe } from "react-icons/fa";
import styles from "./LanguageSwitcher.module.css";

type Locale = 'ar' | 'en';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  // Get current locale from pathname or default to 'ar'
  const currentLocale: Locale = pathname?.startsWith('/en') ? 'en' : 'ar';

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    startTransition(() => {
      // Store preference in localStorage
      localStorage.setItem('locale', newLocale);

      // Update document direction
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLocale;

      // Navigate to the new locale path
      let newPath = pathname || '/';

      if (currentLocale === 'ar' && newLocale === 'en') {
        // Switching from Arabic to English: add /en prefix
        newPath = `/en${pathname || '/'}`;
      } else if (currentLocale === 'en' && newLocale === 'ar') {
        // Switching from English to Arabic: remove /en prefix
        newPath = (pathname || '/').replace(/^\/en/, '') || '/';
      }

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
