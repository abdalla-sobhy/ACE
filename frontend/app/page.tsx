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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeScrollState, setIframeScrollState] = useState({
    isAtTop: true,
    isAtBottom: false
  });
  const [allowParentScroll, setAllowParentScroll] = useState(false);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'iframeScrollState') {
        setIframeScrollState({
          isAtTop: event.data.isAtTop,
          isAtBottom: event.data.isAtBottom
        });
      } else if (event.data && event.data.type === 'iframeScrollComplete') {
        // Iframe has finished scrolling in a direction
        if (event.data.direction === 'down') {
          // Allow parent page to scroll down
          setAllowParentScroll(true);
        } else if (event.data.direction === 'up') {
          // When iframe signals scroll complete upward while at top,
          // we would handle this if parent were scrolled
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle scroll to lock/unlock based on iframe state
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const heroElement = heroRef.current;
      if (!heroElement) return;

      const heroRect = heroElement.getBoundingClientRect();
      // Hero is fully covering the viewport
      const heroFullyInView = heroRect.top <= 0 && heroRect.bottom >= window.innerHeight;
      // Hero is at least partially in view
      const heroPartiallyInView = heroRect.top < window.innerHeight && heroRect.bottom > 0;

      // Scrolling down
      if (e.deltaY > 0) {
        // If hero is fully in view and iframe hasn't reached bottom, prevent parent scroll
        if (heroFullyInView && !iframeScrollState.isAtBottom && !allowParentScroll) {
          e.preventDefault();
          return;
        }
      }

      // Scrolling up
      if (e.deltaY < 0) {
        // If we're at the top of the parent page and hero is in view
        if (window.scrollY <= 0 && heroPartiallyInView) {
          // If iframe is not at top, we should let iframe handle the scroll
          if (!iframeScrollState.isAtTop) {
            // Reset parent scroll allowance so next time we scroll down,
            // we wait for iframe to finish first
            setAllowParentScroll(false);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [iframeScrollState, allowParentScroll]);

  // Reset allowParentScroll when iframe goes back to top
  useEffect(() => {
    if (iframeScrollState.isAtTop) {
      setAllowParentScroll(false);
    }
  }, [iframeScrollState.isAtTop]);

  // Handle touch events for mobile
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const heroElement = heroRef.current;
      if (!heroElement) return;

      const heroRect = heroElement.getBoundingClientRect();
      const heroFullyInView = heroRect.top <= 0 && heroRect.bottom >= window.innerHeight;
      const deltaY = touchStartY - e.touches[0].clientY;

      // Scrolling down on mobile
      if (deltaY > 0) {
        if (heroFullyInView && !iframeScrollState.isAtBottom && !allowParentScroll) {
          e.preventDefault();
        }
      }

      touchStartY = e.touches[0].clientY;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [iframeScrollState, allowParentScroll]);

  return (
    <div className={styles.container} dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
      <NavigationBar />

      {/* Hero Section with 3D Scene in iframe */}
      <section className={styles.hero} ref={heroRef}>
        <iframe
          ref={iframeRef}
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
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        />
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