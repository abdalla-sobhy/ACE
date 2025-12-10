"use client";

import styles from "./Landing.module.css";
import Link from "next/link";
import NavigationBar from "@/components/Nav/Nav";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

export default function LandingPage() {
  const { t, dir } = useLanguage();

  return (
    <div className={styles.container} dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
      <NavigationBar />

      {/* Hero Section with 3D Scene in iframe */}
      <section className={styles.hero}>
        <iframe
          src="/index2.html"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            pointerEvents: 'auto'
          }}
          title="3D Experience"
        />
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2>{t("landing.whyEdvance")}</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📚</div>
              <h3>{t("landing.feature1Title")}</h3>
              <p>{t("landing.feature1Description")}</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>{t("landing.feature2Title")}</h3>
              <p>{t("landing.feature2Description")}</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📝</div>
              <h3>{t("landing.feature3Title")}</h3>
              <p>{t("landing.feature3Description")}</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🆓</div>
              <h3>{t("landing.feature4Title")}</h3>
              <p>{t("landing.feature4Description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.stat}>
            <h3>{t("landing.pioneering")}</h3>
            <p>{t("landing.registeredStudents")}</p>
          </div>
          <div className={styles.stat}>
            <h3>{t("landing.innovation")}</h3>
            <p>{t("landing.distinguishedTeachers")}</p>
          </div>
          <div className={styles.stat}>
            <h3>{t("landing.connection")}</h3>
            <p>{t("landing.dailyLectures")}</p>
          </div>
          <div className={styles.stat}>
            <h3>{t("landing.unity")}</h3>
            <p>{t("landing.governorates")}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>{t("landing.ctaTitle")}</h2>
        <p>{t("landing.ctaDescription")}</p>
        <Link href="/signup" className={styles.ctaButton}>
          {t("landing.registerNow")}
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerSection}>
            <h4>{t("common.edvance")}</h4>
            <p>{t("landing.footerDescription")}</p>
          </div>
          <div className={styles.footerSection}>
            <h5>{t("landing.forStudents")}</h5>
            <Link href="/schedule">{t("landing.schedule")}</Link>
            <Link href="/exams">{t("landing.exams")}</Link>
          </div>
          <div className={styles.footerSection}>
            <h5>{t("landing.forTeachers")}</h5>
            <Link href="/teach">{t("landing.howToTeach")}</Link>
            <Link href="/resources">{t("landing.resources")}</Link>
          </div>
          <div className={styles.footerSection}>
            <h5>{t("landing.contactUs")}</h5>
            <Link href="/contact">{t("landing.contactLink")}</Link>
            <Link href="/support">{t("landing.support")}</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>{t("landing.footerCopyright")}</p>
        </div>
      </footer>
    </div>
  );
}
