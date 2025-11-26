"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./ParentNav.module.css";
import {
  FaHome,
  FaUsers,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaUserFriends,
} from "react-icons/fa";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";

interface User {
  name: string;
  email: string;
  parentProfile?: {
    phone?: string;
  };
}

export default function ParentNav() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authData");
    document.cookie = "authToken=; path=/; max-age=0";
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeMenu();
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isMenuOpen || isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen, isProfileOpen]);

  const navItems = [
    {
      href: "/parent/dashboard",
      label: t("common.dashboard"),
      icon: <FaHome />,
    },
    {
      href: "/parent/students",
      label: t("parent.myStudents"),
      icon: <FaUsers />,
    },
  ];

  return (
    <nav className={styles.nav} ref={navRef}>
      <div className={styles.navContainer}>
        <div className={styles.navHeader}>
          <Link
            href="/parent/dashboard"
            className={styles.logo}
            onClick={closeMenu}
          >
            <FaUserFriends className={styles.logoIcon} />
            <span>{t("common.edvance")}</span>
            <span className={styles.logoSubtitle}>Parent</span>
          </Link>
          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FaBars />
          </button>
        </div>

        <div
          className={`${styles.navContent} w-full ${isMenuOpen ? styles.open : ""}`}
        >
          <div className={styles.navLeft}>
            <Link
              href="/parent/dashboard"
              className={styles.logoDesktop}
            >
              <FaUserFriends className={styles.logoIcon} />
              <span>{t("common.edvance")}</span>
              <span className={styles.logoSubtitle}>Parent</span>
            </Link>
            
          </div>


          <div className={styles.navLeft}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${pathname?.startsWith(item.href) ? styles.active : ""} whitespace-nowrap`}
                onClick={closeMenu}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className={styles.navRight}>
            <ThemeToggle />
            <LanguageSwitcher />
            <NotificationDropdown />

            <div className={styles.profileDropdown} ref={profileRef}>
              <button className={styles.profileButton} onClick={toggleProfile}>
                <div className={styles.avatar}>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className={`${styles.userName} whitespace-nowrap`}>{user?.name}</span>
              </button>

              {isProfileOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownAvatar}>
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className={styles.dropdownInfo}>
                      <p className={styles.dropdownName}>{user?.name}</p>
                      <p className={styles.dropdownEmail}>{user?.email}</p>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  <Link
                    href="/parent/profile"
                    className={styles.dropdownItem}
                  >
                    <FaUser />
                    <span>{t("common.profile")}</span>
                  </Link>
                  <Link
                    href="/parent/students"
                    className={styles.dropdownItem}
                  >
                    <FaUsers />
                    <span>{t("parent.myStudents")}</span>
                  </Link>
                  <button
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    <span>{t("common.logout")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}