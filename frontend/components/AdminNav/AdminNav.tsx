"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./AdminNav.module.css";
import {
  FaShieldAlt,
  FaTachometerAlt,
  FaUsers,
  FaChalkboardTeacher,
  FaBook,
  FaBuilding,
  FaUserCircle,
  FaSignOutAlt,
  FaChartLine,
} from "react-icons/fa";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";

export default function AdminNav() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authData");
    document.cookie = "authToken=; path=/; max-age=0";
    router.push("/login");
  };

  const isActive = (path: string) => {
    return pathname ? pathname.startsWith(path) : null;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navLeft}>
          <Link href="/admin/dashboard" className={styles.logo}>
            <FaShieldAlt />
            <span>{t("admin.nav.adminPanel")}</span>
          </Link>

          <div className={styles.navLinks}>
            <Link
              href="/admin/dashboard"
              className={`${styles.navLink} ${
                isActive("/admin/dashboard") ? styles.active : ""
              }`}
            >
              <FaTachometerAlt />
              <span>{t("admin.nav.dashboard")}</span>
            </Link>

            <Link
              href="/admin/users"
              className={`${styles.navLink} ${
                isActive("/admin/users") ? styles.active : ""
              }`}
            >
              <FaUsers />
              <span>{t("admin.nav.users")}</span>
            </Link>

            <Link
              href="/admin/teachers"
              className={`${styles.navLink} ${
                isActive("/admin/teachers") ? styles.active : ""
              }`}
            >
              <FaChalkboardTeacher />
              <span>{t("admin.nav.teachers")}</span>
            </Link>

            <Link
              href="/admin/courses"
              className={`${styles.navLink} ${
                isActive("/admin/courses") ? styles.active : ""
              }`}
            >
              <FaBook />
              <span>{t("admin.nav.courses")}</span>
            </Link>

            <Link
              href="/admin/companies"
              className={`${styles.navLink} ${
                isActive("/admin/companies") ? styles.active : ""
              }`}
            >
              <FaBuilding />
              <span>{t("admin.nav.companies")}</span>
            </Link>

            <div id="themeIcon">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className={styles.navRight}>
          <LanguageSwitcher />
          <NotificationDropdown />

          <div className={styles.profileMenu}>
            <button
              className={styles.profileButton}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <FaUserCircle />
            </button>

            {showProfileMenu && (
              <div className={styles.dropdown}>
                <button onClick={handleLogout} className={styles.dropdownItem}>
                  <FaSignOutAlt />
                  <span>{t("common.logout")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
