"use client";

import styles from "./Landing.module.css";
import Link from "next/link";
import NavigationBar from "@/components/Nav/Nav";
import { useTranslations, useLocale } from "next-intl";

export default function LandingPage() {
  const t = useTranslations("landing");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  return (
    <div className={styles.container}>
      <NavigationBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {t("hero.title")}
            <br />
            <span className={styles.heroGradient}>{t("hero.subtitle")}</span>
          </h1>
          <p className={styles.heroDescription}>
            {t("hero.description")}
            <br />
            {t("hero.liveBooking")}
          </p>

          <div className={styles.heroButtons}>
            <Link
              href={`/${locale}/signup/student`}
              className={styles.primaryButton}
            >
              {t("hero.registerStudent")}
            </Link>
            <Link
              href={`/${locale}/signup/teacher`}
              className={styles.secondaryButton}
            >
              {t("hero.joinTeacher")}
            </Link>
          </div>

          {/* User Types */}
          <div className={styles.userTypes}>
            <div className={styles.userType}>
              <span className={styles.userIcon}>🎓</span>
              <span>{t("userTypes.students")}</span>
            </div>
            <div className={styles.userType}>
              <span className={styles.userIcon}>👨‍🏫</span>
              <span>{t("userTypes.teachers")}</span>
            </div>
            <div className={styles.userType}>
              <span className={styles.userIcon}>👨‍👩‍👧</span>
              <span>{t("userTypes.parents")}</span>
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
              <span>{t("schedule.title")}</span>
            </div>
            <div className={styles.codeContent}>
              <div className={styles.scheduleLine}>
                <span className={styles.time}>10:00 ص</span>
                <span className={styles.subject}>رياضيات - ثانوية عامة</span>
                <span className={styles.seats}>
                  {t("schedule.seatsAvailable", { count: "15" })}
                </span>
              </div>
              <div className={styles.scheduleLine}>
                <span className={styles.time}>2:00 م</span>
                <span className={styles.subject}>فيزياء - الصف الثالث</span>
                <span className={styles.seats}>
                  {t("schedule.seatsAvailable", { count: "8" })}
                </span>
              </div>
              <div className={styles.scheduleLine}>
                <span className={styles.time}>6:00 م</span>
                <span className={styles.subject}>كيمياء - مراجعة نهائية</span>
                <span className={styles.seats}>{t("schedule.full")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2>{t("features.title")}</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📚</div>
              <h3>{t("features.liveLessons.title")}</h3>
              <p>{t("features.liveLessons.description")}</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>{t("features.pointsSystem.title")}</h3>
              <p>{t("features.pointsSystem.description")}</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📝</div>
              <h3>{t("features.comprehensiveExams.title")}</h3>
              <p>{t("features.comprehensiveExams.description")}</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🆓</div>
              <h3>{t("features.free.title")}</h3>
              <p>{t("features.free.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.stat}>
            <h3>50,000+</h3>
            <p>{t("stats.students")}</p>
          </div>
          <div className={styles.stat}>
            <h3>500+</h3>
            <p>{t("stats.teachers")}</p>
          </div>
          <div className={styles.stat}>
            <h3>1000+</h3>
            <p>{t("stats.lectures")}</p>
          </div>
          <div className={styles.stat}>
            <h3>27</h3>
            <p>{t("stats.cities")}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>{t("cta.title")}</h2>
        <p>{t("cta.description")}</p>
        <Link href={`/${locale}/signup`} className={styles.ctaButton}>
          {t("cta.register")}
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerSection}>
            <h4>Edvance</h4>
            <p>{t("footer.description")}</p>
          </div>
          <div className={styles.footerSection}>
            <h5>{t("footer.forStudents")}</h5>
            <Link href={`/${locale}/courses`}>{tNav("courses")}</Link>
            <Link href={`/${locale}/schedule`}>{tNav("schedule")}</Link>
            <Link href={`/${locale}/exams`}>{tNav("exams")}</Link>
          </div>
          <div className={styles.footerSection}>
            <h5>{t("footer.forTeachers")}</h5>
            <Link href={`/${locale}/teach`}>{t("footer.howToTeach")}</Link>
            <Link href={`/${locale}/resources`}>{t("footer.resources")}</Link>
          </div>
          <div className={styles.footerSection}>
            <h5>{tNav("contact")}</h5>
            <Link href={`/${locale}/contact`}>{t("footer.contactUs")}</Link>
            <Link href={`/${locale}/support`}>{t("footer.support")}</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2024 Edvance. {t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
