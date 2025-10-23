"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./UniversityStudentNav.module.css";
import {
  FaHome,
  FaBriefcase,
  FaFileAlt,
  FaBook,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaGraduationCap,
  FaClipboardList,
} from "react-icons/fa";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";

interface User {
  name: string;
  email: string;
  universityStudentProfile?: {
    faculty?: string;
    university?: string;
  };
}

export default function UniversityStudentNav() {
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
      href: "/university_student/dashboard",
      label: "الرئيسية",
      icon: <FaHome />,
    },
    {
      href: "/university_student/jobs",
      label: "فرص العمل",
      icon: <FaBriefcase />,
    },
    {
      href: "/university_student/applications",
      label: "طلباتي",
      icon: <FaClipboardList />,
    },
    {
      href: "/university_student/courses",
      label: "الكورسات",
      icon: <FaBook />,
    },
    {
      href: "/university_student/my-courses",
      label: "كورساتي",
      icon: <FaGraduationCap />,
    },
    {
      href: "/university_student/profile",
      label: "ملفي الشخصي",
      icon: <FaFileAlt />,
    },
  ];

  return (
    <nav className={styles.nav} ref={navRef}>
      <div className={styles.navContainer}>
        <div className={styles.navHeader}>
          <Link
            href="/university_student/dashboard"
            className={styles.logo}
            onClick={closeMenu}
          >
            <FaGraduationCap className={styles.logoIcon} />
            <span>Edvance</span>
            <span className={styles.logoSubtitle}>University</span>
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
          className={`${styles.navContent} ${isMenuOpen ? styles.open : ""}`}
        >
          <div className={styles.navLeft}>
            <Link
              href="/university_student/dashboard"
              className={styles.logoDesktop}
            >
              <FaGraduationCap className={styles.logoIcon} />
              <span>Edvance</span>
              <span className={styles.logoSubtitle}>University</span>
            </Link>
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
                      {user?.universityStudentProfile?.faculty && (
                        <p className={styles.dropdownFaculty}>
                          {user.universityStudentProfile.faculty}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  <Link
                    href="/university_student/profile"
                    className={styles.dropdownItem}
                  >
                    <FaUser />
                    <span>الملف الشخصي</span>
                  </Link>
                  <Link
                    href="/university_student/applications"
                    className={styles.dropdownItem}
                  >
                    <FaClipboardList />
                    <span>طلباتي الوظيفية</span>
                  </Link>
                  <button
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    <span>تسجيل الخروج</span>
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
