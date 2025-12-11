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
  const [iframeScrollPosition, setIframeScrollPosition] = useState({ scrollTop: 0, scrollHeight: 0, clientHeight: 0 });

  // Listen for scroll position updates from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from same origin
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'IFRAME_SCROLL_UPDATE') {
        setIframeScrollPosition({
          scrollTop: event.data.scrollTop,
          scrollHeight: event.data.scrollHeight,
          clientHeight: event.data.clientHeight
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Lock page scroll until iframe content is fully scrolled
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      const heroElement = heroRef.current;
      const iframe = iframeRef.current;
      if (!heroElement || !iframe) return;

      const heroRect = heroElement.getBoundingClientRect();
      const isHeroInView = heroRect.top <= 0 && heroRect.bottom > window.innerHeight;

      if (isHeroInView) {
        const { scrollTop, scrollHeight, clientHeight } = iframeScrollPosition;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
        const isAtTop = scrollTop <= 10; // 10px threshold

        // Scrolling down
        if (e.deltaY > 0 && !isAtBottom) {
          e.preventDefault();
          iframe.contentWindow?.postMessage({ type: 'SCROLL_IFRAME', deltaY: e.deltaY }, window.location.origin);
        }
        // Scrolling up within iframe
        else if (e.deltaY < 0 && !isAtTop) {
          e.preventDefault();
          iframe.contentWindow?.postMessage({ type: 'SCROLL_IFRAME', deltaY: e.deltaY }, window.location.origin);
        }
        // If at bottom and scrolling down, or at top and scrolling up, allow page scroll
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [iframeScrollPosition]);

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