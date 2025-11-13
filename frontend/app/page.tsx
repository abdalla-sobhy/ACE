"use client";

import styles from "./Landing.module.css";
import Link from "next/link";
import NavigationBar from "@/components/Nav/Nav";
import { useLanguage } from "@/hooks/useLanguage";

export default function LandingPage() {
  const { t, dir } = useLanguage();

  return (
    <div className={styles.container} style={{ direction: dir, textAlign: dir === 'rtl' ? 'right' : 'left' }}>
      <NavigationBar />

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
          <div className={styles.problemSolutionFlow}>
            <div className={styles.flowHeader}>
              <span className={styles.flowTitle}>{t("landing.scheduleTitle")}</span>
            </div>

            {/* Problem Section */}
            <div className={styles.flowStep}>
              <div className={styles.stepBadge} style={{ backgroundColor: '#ef4444' }}>
                <span className={styles.stepIcon}>❌</span>
                <span className={styles.stepLabel}>{t("landing.problemBadge")}</span>
              </div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>{t("landing.mathematics")}</h4>
                <p className={styles.stepDescription}>{t("landing.physics")}</p>
                <p className={styles.stepDescription}>{t("landing.chemistry")}</p>
              </div>
            </div>

            {/* Arrow Down */}
            <div className={styles.flowArrow}>↓</div>

            {/* Result Section */}
            <div className={styles.flowStep}>
              <div className={styles.stepBadge} style={{ backgroundColor: '#f59e0b' }}>
                <span className={styles.stepIcon}>⚠️</span>
                <span className={styles.stepLabel}>{t("landing.resultBadge")}</span>
              </div>
              <div className={styles.stepContent}>
                <p className={styles.stepDescription}>{t("landing.seatsAvailablePlural")}</p>
              </div>
            </div>

            {/* Arrow Down */}
            <div className={styles.flowArrow}>↓</div>

            {/* Solution Section */}
            <div className={styles.flowStep}>
              <div className={styles.stepBadge} style={{ backgroundColor: '#10b981' }}>
                <span className={styles.stepIcon}>✅</span>
                <span className={styles.stepLabel}>{t("landing.solutionBadge")}</span>
              </div>
              <div className={styles.stepContent}>
                <p className={styles.stepDescriptionBold}>{t("landing.full")}</p>
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
            <div className={styles.statIcon}>🌍</div>
            <p>{t("landing.registeredStudents")}</p>
          </div>
          <div className={styles.stat}>
            <div className={styles.statIcon}>⚡</div>
            <p>{t("landing.distinguishedTeachers")}</p>
          </div>
          <div className={styles.stat}>
            <div className={styles.statIcon}>🎯</div>
            <p>{t("landing.dailyLectures")}</p>
          </div>
          <div className={styles.stat}>
            <div className={styles.statIcon}>🔗</div>
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
