"use client";

import { useState, useEffect } from "react";
import ParentNav from "@/components/ParentNav/ParentNav";
import styles from "./ParentProfile.module.css";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  type: string;
}

export default function ParentProfile() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("authData");

    if (!userData || !authData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    const parsedAuth = JSON.parse(authData);

    if (new Date(parsedAuth.expiresAt) < new Date()) {
      localStorage.removeItem("user");
      localStorage.removeItem("authData");
      router.push("/login");
      return;
    }

    if (parsedUser.type !== "parent") {
      router.push("/");
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={styles.container} dir={language === "ar" ? "rtl" : "ltr"}>
        <ParentNav />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>{t("common.loading")}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container} dir={language === "ar" ? "rtl" : "ltr"}>
      <ParentNav />
      <main className={styles.main}>
        <section className={styles.profileSection}>
          <div className={styles.profileContent}>
            <h1>{t("profile.myProfile")}</h1>

            <div className={styles.profileCard}>
              <div className={styles.avatarSection}>
                <div className={styles.avatar}>
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className={styles.infoSection}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <FaUser />
                  </div>
                  <div className={styles.infoDetails}>
                    <label>{t("common.name")}</label>
                    <p>{user?.name}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <FaEnvelope />
                  </div>
                  <div className={styles.infoDetails}>
                    <label>{t("common.email")}</label>
                    <p>{user?.email}</p>
                  </div>
                </div>

                {user?.phone && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <FaPhone />
                    </div>
                    <div className={styles.infoDetails}>
                      <label>{t("common.phone")}</label>
                      <p>{user.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
