"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./Nav.module.css";

export default function Nav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <nav className={styles.nav} ref={navRef}>
      <div className={styles.navContainer}>
        <div className={styles.navHeader}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            EduEgypt
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
        
        <div className={`${styles.navContent} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.navLeft}>
            <Link
              href="/features"
              className={pathname === "/features" ? styles.active : ""}
              onClick={closeMenu}
            >
              المميزات
            </Link>
            <Link
              href="/courses"
              className={pathname === "/courses" ? styles.active : ""}
              onClick={closeMenu}
            >
              الكورسات
            </Link>
            <Link
              href="/about"
              className={pathname === "/about" ? styles.active : ""}
              onClick={closeMenu}
            >
              من نحن
            </Link>
            <Link
              href="/contact"
              className={pathname === "/contact" ? styles.active : ""}
              onClick={closeMenu}
            >
              تواصل معنا
            </Link>
          </div>
          <div className={styles.navRight}>
            <Link
              href="/login"
              className={pathname === "/login" ? styles.signInActive : styles.signIn}
              onClick={closeMenu}
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/signup"
              className={pathname === "/signup" ? styles.signUpActive : styles.signUp}
              onClick={closeMenu}
            >
              انضم مجاناً
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}