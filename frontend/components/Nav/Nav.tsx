"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./Nav.module.css";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";

export default function Nav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLandingPage = pathname === '/';
  const [isVisible, setIsVisible] = useState(!isLandingPage);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef<HTMLElement>(null);

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

  // Scroll detection for landing page only
  useEffect(() => {
    if (!isLandingPage) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage, lastScrollY]);

  return (
    <nav className={`${styles.nav} ${isLandingPage && !isVisible ? styles.hidden : ''}`} ref={navRef}>
      <div className={styles.navContainer}>
        <div className={styles.navHeader}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            {t("common.edvance")}
          </Link>
          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label={t("nav.menu")}
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
            <Link href="/" className={styles.logoDesktop} onClick={closeMenu}>
              Edvance
            </Link>
            <Link
              href="/features"
              className={pathname === "/features" ? styles.active : ""}
              onClick={closeMenu}
            >
              {t("nav.features")}
            </Link>
            <Link
              href="/about"
              className={pathname === "/about" ? styles.active : ""}
              onClick={closeMenu}
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/contact"
              className={pathname === "/contact" ? styles.active : ""}
              onClick={closeMenu}
            >
              {t("nav.contact")}
            </Link>
            <div id="themeIcon">
              <ThemeToggle />
            </div>
            <div id="languageIcon">
              <LanguageSwitcher />
            </div>
          </div>
          <div className={styles.navRight}>
            <Link
              href="/login"
              className={
                pathname === "/login" ? styles.signInActive : styles.signIn
              }
              onClick={closeMenu}
            >
              {t("nav.login")}
            </Link>
            <Link
              href="/signup"
              className={
                pathname === "/signup" ? styles.signUpActive : styles.signUp
              }
              onClick={closeMenu}
            >
              {t("nav.signup")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
