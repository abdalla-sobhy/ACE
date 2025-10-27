"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./ParentNav.module.css";
import {
  FaHome,
  FaUsers,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";

export default function ParentNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authData");
    document.cookie = "authToken=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navLeft}>
          <Link href="/parent/dashboard" className={styles.logo}>
            Edvance
          </Link>
          <div className={styles.navLinks}>
            <Link
              href="/parent/dashboard"
              className={`${styles.navLink} ${
                pathname === "/parent/dashboard" ? styles.active : ""
              }`}
            >
              <FaHome />
              <span>الرئيسية</span>
            </Link>
            <Link
              href="/parent/students"
              className={`${styles.navLink} ${
                pathname?.startsWith("/parent/students") ? styles.active : ""
              }`}
            >
              <FaUsers />
              <span>الطلاب</span>
            </Link>
          </div>
        </div>

        <div className={styles.navRight}>
            <ThemeToggle />
          <NotificationDropdown />

          <div className={styles.profileMenu}>
            <button
              className={styles.profileButton}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <FaUser />
            </button>

            {isProfileOpen && (
              <div className={styles.dropdown}>
                <Link href="/parent/profile" className={styles.dropdownItem}>
                  <FaUser />
                  <span>الملف الشخصي</span>
                </Link>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
