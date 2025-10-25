"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./CompanyNav.module.css";
import {
  FaBuilding,
  FaTachometerAlt,
  FaBriefcase,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslations } from "@/hooks/useTranslations";

export default function CompanyNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { t } = useTranslations();

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
          <Link href="/company/dashboard" className={styles.logo}>
            <FaBuilding />
            <span>Edvance Business</span>
          </Link>

          <div className={styles.navLinks}>
            <Link
              href="/company/dashboard"
              className={`${styles.navLink} ${
                isActive("/company/dashboard") ? styles.active : ""
              }`}
            >
              <FaTachometerAlt />
              <span>{t("nav.dashboard")}</span>
            </Link>

            <Link
              href="/company/jobs"
              className={`${styles.navLink} ${
                isActive("/company/jobs") ? styles.active : ""
              }`}
            >
              <FaBriefcase />
              <span>{t("nav.jobs")}</span>
            </Link>

            <Link
              href="/company/applications"
              className={`${styles.navLink} ${
                isActive("/company/applications") ? styles.active : ""
              }`}
            >
              <FaUsers />
              <span>{t("nav.applications")}</span>
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
                <Link href="/company/profile" className={styles.dropdownItem}>
                  <FaUserCircle />
                  <span>{t("nav.profile")}</span>
                </Link>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>{t("nav.logout")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
