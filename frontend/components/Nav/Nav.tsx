"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./Nav.module.css";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations, useLocale } from 'next-intl';

export default function Nav() {
  const pathname = usePathname();
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const t = useTranslations('nav');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 968) {
        closeMenu();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className={styles.nav} ref={navRef}>
      <div className={styles.navContainer}>
        <div className={styles.navHeader}>
          <Link href={`/${locale}`} className={styles.logo} onClick={closeMenu}>
            Edvance
          </Link>
          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div
          className={`${styles.navContent} ${isMenuOpen ? styles.open : ""}`}
        >
          <div className={styles.navLeft}>
            <Link href={`/${locale}`} className={styles.logoDesktop} onClick={closeMenu}>
              Edvance
            </Link>
            <Link
              href={`/${locale}/features`}
              className={pathname === `/${locale}/features` ? styles.active : ""}
              onClick={closeMenu}
            >
              {t('features')}
            </Link>
            <Link
              href={`/${locale}/courses`}
              className={pathname === `/${locale}/courses` ? styles.active : ""}
              onClick={closeMenu}
            >
              {t('courses')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className={pathname === `/${locale}/about` ? styles.active : ""}
              onClick={closeMenu}
            >
              {t('about')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className={pathname === `/${locale}/contact` ? styles.active : ""}
              onClick={closeMenu}
            >
              {t('contact')}
            </Link>
            <div id="themeIcon">
              <ThemeToggle />
            </div>
            <LanguageSwitcher />
          </div>
          <div className={styles.navRight}>
            <Link
              href={`/${locale}/login`}
              className={
                pathname === `/${locale}/login` ? styles.signInActive : styles.signIn
              }
              onClick={closeMenu}
            >
              {t('login')}
            </Link>
            <Link
              href={`/${locale}/signup`}
              className={
                pathname === `/${locale}/signup` ? styles.signUpActive : styles.signUp
              }
              onClick={closeMenu}
            >
              {t('signup')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
