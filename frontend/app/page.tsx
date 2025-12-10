"use client";

import styles from "./Landing.module.css";
import Link from "next/link";
import NavigationBar from "@/components/Nav/Nav";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

export default function LandingPage() {
  const { t, dir } = useLanguage();

  useEffect(() => {
    // Disable sound errors
    window.addEventListener('error', function(e: ErrorEvent) {
      if (e.message && (e.message.includes('sound') || e.message.includes('.mp3'))) {
        e.preventDefault();
        console.log('Sound file not found - continuing without audio');
      }
    }, true);

    // Override Howler to prevent sound errors
    (window as any).Howler = (window as any).Howler || {
      mute: function() {},
      volume: function() {},
      ctx: { createGain: function() { return { connect: function() {}, gain: { value: 1 } }; } }
    };

    // Load the CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/index.css';
    document.head.appendChild(link);

    // Load the Three.js experience script
    const script = document.createElement('script');
    script.src = '/index.js';
    script.type = 'module';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <div className={styles.container} dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
      <NavigationBar />

      {/* Three.js Canvas - David's Scene */}
      <canvas id="main-canvas" className={styles.threeCanvas}></canvas>

      {/* Required DOM structure for Three.js experience */}
      <div id="intro-container" style={{ display: 'none' }}></div>
      <div id="overlay-container" style={{ pointerEvents: 'none', position: 'fixed', zIndex: 1 }}></div>
      <div id="hover-icon" style={{ position: 'fixed', zIndex: 999 }}></div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <div className={styles.heroTitleFirst}>Edvance</div>
            {t("landing.heroTitle")}
            <br />
            <span className={styles.heroGradient}>{t("landing.heroGradient")}</span>
          </h1>
          <p className={styles.heroDescription}>
            {t("landing.heroDescription")}
            <br />
            {t("landing.heroSubDescription")}
          </p>

          <div className={styles.heroButtons}>
            <Link href="/signup" className={styles.primaryButton}>
              {t("landing.registerAsStudent")}
            </Link>

            <Link href="/company/register" className={styles.secondaryButton}>
              {t("landing.joinAsCompany")}
            </Link>
          </div>

          <div style={{ marginTop: "20px" }}>
            <a href="/experience.html" className={styles.exploreButton} target="_blank" rel="noopener noreferrer">
              ✨ Explore Full Experience
            </a>
          </div>
        </div>
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
