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
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useTranslations, useLocale } from "@/hooks/useTranslations";

export default function ParentNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t } = useTranslations();
  const locale = useLocale();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authData");
    document.cookie = "authToken=; path=/; max-age=0";
    router.push(`/${locale}/login`);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navLeft}>
          <Link href={`/${locale}/parent/dashboard`} className={styles.logo}>
            Edvance
          </Link>
          <div className={styles.navLinks}>
            <Link
              href={`/${locale}/parent/dashboard`}
              className={`${styles.navLink} ${
                pathname === `/${locale}/parent/dashboard` ? styles.active : ""
              }`}
            >
              <FaHome />
              <span>{t("nav.home")}</span>
            </Link>
            <Link
              href={`/${locale}/parent/students`}
              className={`${styles.navLink} ${
                pathname?.startsWith(`/${locale}/parent/students`) ? styles.active : ""
              }`}
            >
              <FaUsers />
              <span>{t("nav.students")}</span>
            </Link>
          </div>
        </div>

        <div className={styles.navRight}>
          <ThemeToggle />
          <LanguageSwitcher />
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
                <Link href={`/${locale}/parent/profile`} className={styles.dropdownItem}>
                  <FaUser />
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
