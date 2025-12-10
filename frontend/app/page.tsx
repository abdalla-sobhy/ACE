"use client";

import styles from "./Landing.module.css";
import Link from "next/link";
import NavigationBar from "@/components/Nav/Nav";
import { useLanguage } from "@/hooks/useLanguage";
import { BookOpen, Target, FileEdit, DollarSign } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function LandingPage() {
  const { t, dir } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [isHeroLocked, setIsHeroLocked] = useState(true);

  // Hide scrollbar on landing page
  useEffect(() => {
    // Type-safe way to set CSS properties
    document.body.style.setProperty('-ms-overflow-style', 'none');
    document.body.style.setProperty('scrollbar-width', 'none');
    document.body.classList.add('hide-scrollbar');

    return () => {
      document.body.style.removeProperty('-ms-overflow-style');
      document.body.style.removeProperty('scrollbar-width');
      document.body.classList.remove('hide-scrollbar');
    };
  }, []);

  // Hero section scroll lock
  useEffect(() => {
    let heroScrollAmount = 0;
    const SCROLL_THRESHOLD = 800; // Amount of scroll needed to unlock

    const handleWheel = (e: WheelEvent) => {
      if (!isHeroLocked) return;

      const scrollTop = window.scrollY;

      // If already scrolled past hero, unlock
      if (scrollTop > 100) {
        setIsHeroLocked(false);
        return;
      }

      // Prevent page scroll while in hero
      e.preventDefault();

      // Track scroll amount
      heroScrollAmount += Math.abs(e.deltaY);
      const progress = Math.min((heroScrollAmount / SCROLL_THRESHOLD) * 100, 100);
      setHeroScrollProgress(progress);

      // Unlock when threshold reached
      if (heroScrollAmount >= SCROLL_THRESHOLD) {
        setIsHeroLocked(false);
        // Smooth scroll to features section
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    };

    if (isHeroLocked) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isHeroLocked]);

  return (
    <div className={styles.container} dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
      <NavigationBar />

      {/* Hero Section with 3D Scene in iframe */}
      <section className={styles.hero} ref={heroRef}>
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
        {/* Scroll indicator */}
        {isHeroLocked && (
          <div className={styles.scrollIndicator}>
            <div className={styles.scrollProgress} style={{ width: `${heroScrollProgress}%` }} />
            <p className={styles.scrollText}>Scroll to explore</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2>{t("landing.whyEdvance")}</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><BookOpen size={32} /></div>
              <h3>{t("landing.feature1Title")}</h3>
              <p>{t("landing.feature1Description")}</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><Target size={32} /></div>
              <h3>{t("landing.feature2Title")}</h3>
              <p>{t("landing.feature2Description")}</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><FileEdit size={32} /></div>
              <h3>{t("landing.feature3Title")}</h3>
              <p>{t("landing.feature3Description")}</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><DollarSign size={32} /></div>
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
