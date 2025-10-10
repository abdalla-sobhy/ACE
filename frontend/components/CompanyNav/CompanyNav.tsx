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
  FaBell,
} from "react-icons/fa";

export default function CompanyNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState(3); // not now

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authData");
    document.cookie = "authToken=; path=/; max-age=0";
    router.push("/login");
  };

  const isActive = (path: string) => {
    return pathname? pathname.startsWith(path):null;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navLeft}>
          <Link href="/company/dashboard" className={styles.logo}>
            <FaBuilding />
            <span>EduEgypt Business</span>
          </Link>
          
          <div className={styles.navLinks}>
            <Link 
              href="/company/dashboard" 
              className={`${styles.navLink} ${isActive('/company/dashboard') ? styles.active : ''}`}
            >
              <FaTachometerAlt />
              <span>لوحة التحكم</span>
            </Link>
            
            <Link 
              href="/company/jobs" 
              className={`${styles.navLink} ${isActive('/company/jobs') ? styles.active : ''}`}
            >
              <FaBriefcase />
              <span>الوظائف</span>
            </Link>
            
            <Link 
              href="/company/applications" 
              className={`${styles.navLink} ${isActive('/company/applications') ? styles.active : ''}`}
            >
              <FaUsers />
              <span>الطلبات</span>
            </Link>
          </div>
        </div>

        <div className={styles.navRight}>
          <button className={styles.notificationButton}>
            <FaBell />
            {notifications > 0 && (
              <span className={styles.notificationBadge}>{notifications}</span>
            )}
          </button>

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