"use client";
import styles from "./Features.module.css";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import NavigationBar from "@/components/Nav/Nav";

export default function FeaturesPage() {
  const t = useTranslations('features');
  const locale = useLocale();

  const mainFeatures = [
    {
      icon: "📺",
      title: t('liveLessons.title'),
      description: t('liveLessons.description'),
      details: [
        t('liveLessons.details.hd'),
        t('liveLessons.details.interaction'),
        t('liveLessons.details.sharing'),
        t('liveLessons.details.recording'),
      ],
    },
    {
      icon: "🪑",
      title: t('seatBooking.title'),
      description: t('seatBooking.description'),
      details: [
        t('seatBooking.details.advance'),
        t('seatBooking.details.reminders'),
        t('seatBooking.details.waitlist'),
        t('seatBooking.details.flexible'),
      ],
    },
    {
      icon: "🏆",
      title: t('rewards.title'),
      description: t('rewards.description'),
      details: [
        t('rewards.details.attendance'),
        t('rewards.details.participation'),
        t('rewards.details.badges'),
        t('rewards.details.leaderboard'),
      ],
    },
    {
      icon: "📝",
      title: t('exams.title'),
      description: t('exams.description'),
      details: [
        t('exams.details.practice'),
        t('exams.details.instant'),
        t('exams.details.reports'),
        t('exams.details.certificates'),
      ],
    },
  ];

  const additionalFeatures = [
    {
      icon: "👨‍👩‍👧",
      title: t('additional.parentDashboard.title'),
      description: t('additional.parentDashboard.description'),
    },
    {
      icon: "📊",
      title: t('additional.detailedReports.title'),
      description: t('additional.detailedReports.description'),
    },
    {
      icon: "💬",
      title: t('additional.discussionForum.title'),
      description: t('additional.discussionForum.description'),
    },
    {
      icon: "📚",
      title: t('additional.digitalLibrary.title'),
      description: t('additional.digitalLibrary.description'),
    },
    {
      icon: "📱",
      title: t('additional.mobileApp.title'),
      description: t('additional.mobileApp.description'),
    },
    {
      icon: "🔔",
      title: t('additional.smartNotifications.title'),
      description: t('additional.smartNotifications.description'),
    },
  ];

  return (
    <div className={styles.container}>
      <NavigationBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}></div>
        <div className={styles.heroContent}>
          <span className={styles.badge}>{t('hero.badge')}</span>
          <h1>
            {t('hero.title')}{" "}
            <span className={styles.gradient}>{t('hero.titleGradient')}</span>
          </h1>
          <p>{t('hero.subtitle')}</p>
        </div>
      </section>

      {/* Main Features */}
      <section className={styles.mainFeatures}>
        <div className={styles.featuresContainer}>
          <div className={styles.sectionHeader}>
            <h2>{t('mainFeatures.title')}</h2>
            <p>{t('mainFeatures.subtitle')}</p>
          </div>

          <div className={styles.featuresGrid}>
            {mainFeatures.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureHeader}>
                  <span className={styles.featureIcon}>{feature.icon}</span>
                  <h3>{feature.title}</h3>
                </div>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
                <ul className={styles.featureDetails}>
                  {feature.details.map((detail, idx) => (
                    <li key={idx}>
                      <span className={styles.checkIcon}>✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className={styles.showcase}>
        <div className={styles.showcaseContainer}>
          <div className={styles.showcaseContent}>
            <span className={styles.showcaseBadge}>{t('showcase.badge')}</span>
            <h2>{t('showcase.title')}</h2>
            <p>{t('showcase.description')}</p>
            <div className={styles.showcaseFeatures}>
              <div className={styles.showcaseFeature}>
                <span className={styles.showcaseIcon}>👥</span>
                <div>
                  <h4>{t('showcase.features.smallClasses.title')}</h4>
                  <p>{t('showcase.features.smallClasses.description')}</p>
                </div>
              </div>
              <div className={styles.showcaseFeature}>
                <span className={styles.showcaseIcon}>🎥</span>
                <div>
                  <h4>{t('showcase.features.autoRecording.title')}</h4>
                  <p>{t('showcase.features.autoRecording.description')}</p>
                </div>
              </div>
              <div className={styles.showcaseFeature}>
                <span className={styles.showcaseIcon}>💭</span>
                <div>
                  <h4>{t('showcase.features.liveChat.title')}</h4>
                  <p>{t('showcase.features.liveChat.description')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.showcaseVisual}>
            <div className={styles.browserWindow}>
              <div className={styles.browserHeader}>
                <div className={styles.browserDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className={styles.browserTitle}>
                  {t('showcase.browserTitle')}
                </span>
              </div>
              <div className={styles.browserContent}>
                <div className={styles.videoPlayer}>
                  <div className={styles.videoOverlay}>
                    <span className={styles.liveIndicator}>{t('showcase.liveIndicator')}</span>
                    <span className={styles.viewerCount}>{t('showcase.viewerCount')}</span>
                  </div>
                </div>
                <div className={styles.chatPanel}>
                  <div className={styles.chatMessage}>
                    {t('showcase.chatMessages.student1')}
                  </div>
                  <div className={styles.chatMessage}>
                    {t('showcase.chatMessages.teacher')}
                  </div>
                  <div className={styles.chatMessage}>
                    {t('showcase.chatMessages.student2')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className={styles.additionalFeatures}>
        <div className={styles.additionalContainer}>
          <h2>{t('additional.title')}</h2>
          <div className={styles.additionalGrid}>
            {additionalFeatures.map((feature, index) => (
              <div key={index} className={styles.additionalCard}>
                <span className={styles.additionalIcon}>{feature.icon}</span>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className={styles.comparison}>
        <div className={styles.comparisonContainer}>
          <h2>{t('comparison.title')}</h2>
          <p className={styles.comparisonSubtitle}>{t('comparison.subtitle')}</p>
          <div className={styles.comparisonTable}>
            <div className={styles.comparisonHeader}>
              <div className={styles.comparisonCell}></div>
              <div className={styles.comparisonCell}>
                <h3>{t('comparison.edvance')}</h3>
              </div>
              <div className={styles.comparisonCell}>
                <h3>{t('comparison.others')}</h3>
              </div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>{t('comparison.features.cost.label')}</div>
              <div className={styles.comparisonValue}>
                <span className={styles.checkMark}>✓</span>
                <span>{t('comparison.features.cost.edvanceValue')}</span>
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.crossMark}>✗</span>
                <span>{t('comparison.features.cost.othersValue')}</span>
              </div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>{t('comparison.features.liveStreaming.label')}</div>
              <div className={styles.comparisonValue}>
                <span className={styles.checkMark}>✓</span>
                <span>{t('comparison.features.liveStreaming.edvanceValue')}</span>
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.crossMark}>✗</span>
                <span>{t('comparison.features.liveStreaming.othersValue')}</span>
              </div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>{t('comparison.features.pointsSystem.label')}</div>
              <div className={styles.comparisonValue}>
                <span className={styles.checkMark}>✓</span>
                <span>{t('comparison.features.pointsSystem.edvanceValue')}</span>
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.crossMark}>✗</span>
                <span>{t('comparison.features.pointsSystem.othersValue')}</span>
              </div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>
                {t('comparison.features.parentTracking.label')}
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.checkMark}>✓</span>
                <span>{t('comparison.features.parentTracking.edvanceValue')}</span>
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.crossMark}>✗</span>
                <span>{t('comparison.features.parentTracking.othersValue')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <h2>{t('stats.title')}</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>📈</span>
              <h3>{t('stats.improvement.value')}</h3>
              <p>{t('stats.improvement.label')}</p>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>⏰</span>
              <h3>{t('stats.support.value')}</h3>
              <p>{t('stats.support.label')}</p>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🎯</span>
              <h3>{t('stats.satisfaction.value')}</h3>
              <p>{t('stats.satisfaction.label')}</p>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🚀</span>
              <h3>{t('stats.latency.value')}</h3>
              <p>{t('stats.latency.label')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.subtitle')}</p>
          <div className={styles.ctaButtons}>
            <Link href={`/${locale}/signup`} className={styles.primaryButton}>
              {t('cta.registerButton')}
            </Link>
            <Link href={`/${locale}/demo`} className={styles.secondaryButton}>
              {t('cta.demoButton')}
            </Link>
          </div>
          <p className={styles.ctaNote}>
            <span className={styles.ctaIcon}>🎁</span>
            {t('cta.note')}
          </p>
        </div>
      </section>
    </div>
  );
}
