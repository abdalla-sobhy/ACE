"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./Nav.module.css";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

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
        <div className={styles.navLeft}>
          <Link href="/" className={styles.logo}>
            EduEgypt
          </Link>
          <Link
            href="/features"
            className={pathname === "/features" ? styles.active : ""}
          >
            المميزات
          </Link>
          <Link
            href="/courses"
            className={pathname === "/courses" ? styles.active : ""}
          >
            الكورسات
          </Link>
          <Link
            href="/about"
            className={pathname === "/about" ? styles.active : ""}
          >
            من نحن
          </Link>
          <Link
            href="/contact"
            className={pathname === "/contact" ? styles.active : ""}
          >
            تواصل معنا
          </Link>
          <div id="themeIcon">
            <ThemeToggle />
          </div>
        </div>
        <div className={styles.navRight}>
          <Link
            href="/login"
            className={pathname === "/login" ? styles.signInActive : styles.signIn}
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/signup"
            className={pathname === "/signup" ? styles.signUpActive : styles.signUp}
          >
            انضم مجاناً
          </Link>
        </div>
      </div>
    </nav>
  );
}