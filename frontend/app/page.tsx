"use client";

import styles from "./Landing.module.css";
import Link from "next/link";
import NavigationBar from "@/components/Nav/Nav";
import { useLanguage } from "@/hooks/useLanguage";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <NavigationBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
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
            <Link href="/signup/student" className={styles.primaryButton}>
              {t("landing.registerAsStudent")}
            </Link>
            
            <Link href="/company/register" className={styles.secondaryButton}>
              {t("landing.joinAsCompany")}
            </Link>
          </div>

          {/* User Types */}
          <div className={styles.userTypes}>
            <div className={styles.userType}>
              <span className={styles.userIcon}>🎓</span>
              <span>{t("landing.students")}</span>
            </div>
            <div className={styles.userType}>
              <span className={styles.userIcon}>👨‍🏫</span>
              <span>{t("landing.teachers")}</span>
            </div>
            <div className={styles.userType}>
              <span className={styles.userIcon}>👨‍👩‍👧</span>
              <span>{t("landing.parents")}</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.codeEditor}>
            <div className={styles.codeHeader}>
              <div className={styles.dots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>{t("landing.scheduleTitle")}</span>
            </div>
            <div className={styles.codeContent}>
              <div className={styles.scheduleLine}>
                <span className={styles.time}>10:00 {t("landing.morning")}</span>
                <span className={styles.subject}>{t("landing.mathematics")}</span>
                <span className={styles.seats}>15 {t("landing.seatsAvailable")}</span>
              </div>
              <div className={styles.scheduleLine}>
                <span className={styles.time}>2:00 {t("landing.afternoon")}</span>
                <span className={styles.subject}>{t("landing.physics")}</span>
                <span className={styles.seats}>8 {t("landing.seatsAvailablePlural")}</span>
              </div>
              <div className={styles.scheduleLine}>
                <span className={styles.time}>6:00 {t("landing.afternoon")}</span>
                <span className={styles.subject}>{t("landing.chemistry")}</span>
                <span className={styles.seats}>{t("landing.full")}</span>
              </div>
            </div>
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
            <h3>50,000+</h3>
            <p>{t("landing.registeredStudents")}</p>
          </div>
          <div className={styles.stat}>
            <h3>500+</h3>
            <p>{t("landing.distinguishedTeachers")}</p>
          </div>
          <div className={styles.stat}>
            <h3>1000+</h3>
            <p>{t("landing.dailyLectures")}</p>
          </div>
          <div className={styles.stat}>
            <h3>27</h3>
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
