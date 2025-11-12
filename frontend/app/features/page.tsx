"use client";

import styles from "./Features.module.css";
import Link from "next/link";
import NavigationBar from "@/components/Nav/Nav";
import { useLanguage } from "@/hooks/useLanguage";

export default function FeaturesPage() {
  const { t, language } = useLanguage();

  const mainFeatures = [
    {
      icon: "📺",
      title: t("features.feature1"),
      description: t("features.feature1Description"),
      details: [
        t("features.feature1Detail1"),
        t("features.feature1Detail2"),
        t("features.feature1Detail3"),
        t("features.feature1Detail4"),
      ],
    },
    {
      icon: "🪑",
      title: t("features.feature2"),
      description: t("features.feature2Description"),
      details: [
        t("features.feature2Detail1"),
        t("features.feature2Detail2"),
        t("features.feature2Detail3"),
        t("features.feature2Detail4"),
      ],
    },
    {
      icon: "🏆",
      title: t("features.feature3"),
      description: t("features.feature3Description"),
      details: [
        t("features.feature3Detail1"),
        t("features.feature3Detail2"),
        t("features.feature3Detail3"),
        t("features.feature3Detail4"),
      ],
    },
    {
      icon: "📝",
      title: t("features.feature4"),
      description: t("features.feature4Description"),
      details: [
        t("features.feature4Detail1"),
        t("features.feature4Detail2"),
        t("features.feature4Detail3"),
        t("features.feature4Detail4"),
      ],
    },
  ];

  const additionalFeatures = [
    {
      icon: "👨‍👩‍👧",
      title: t("features.additionalFeature1"),
      description: t("features.additionalFeature1Description"),
    },
    {
      icon: "📊",
      title: t("features.additionalFeature2"),
      description: t("features.additionalFeature2Description"),
    },
    {
      icon: "💬",
      title: t("features.additionalFeature3"),
      description: t("features.additionalFeature3Description"),
    },
    {
      icon: "📚",
      title: t("features.additionalFeature4"),
      description: t("features.additionalFeature4Description"),
    },
    {
      icon: "📱",
      title: t("features.additionalFeature5"),
      description: t("features.additionalFeature5Description"),
    },
    {
      icon: "🔔",
      title: t("features.additionalFeature6"),
      description: t("features.additionalFeature6Description"),
    },
  ];

  return (
    <div className={styles.container} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <NavigationBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}></div>
        <div className={styles.heroContent}>
          <span className={styles.badge}>{t("features.heroBadge")}</span>
          <h1>
            {t("features.heroTitle")}{" "}
            <span className={styles.gradient}>{t("features.heroTitleGradient")}</span>
          </h1>
          <p>{t("features.heroSubtitle")}</p>
        </div>
      </section>

      {/* Main Features */}
      <section className={styles.mainFeatures}>
        <div className={styles.featuresContainer}>
          <div className={styles.sectionHeader}>
            <h2>{t("features.mainFeaturesTitle")}</h2>
            <p>{t("features.mainFeaturesSubtitle")}</p>
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
            <span className={styles.showcaseBadge}>{t("features.showcaseBadge")}</span>
            <h2>{t("features.showcaseTitle")}</h2>
            <p>{t("features.showcaseDescription")}</p>
            <div className={styles.showcaseFeatures}>
              <div className={styles.showcaseFeature}>
                <span className={styles.showcaseIcon}>👥</span>
                <div>
                  <h4>{t("features.showcaseFeature1Title")}</h4>
                  <p>{t("features.showcaseFeature1Description")}</p>
                </div>
              </div>
              <div className={styles.showcaseFeature}>
                <span className={styles.showcaseIcon}>🎥</span>
                <div>
                  <h4>{t("features.showcaseFeature2Title")}</h4>
                  <p>{t("features.showcaseFeature2Description")}</p>
                </div>
              </div>
              <div className={styles.showcaseFeature}>
                <span className={styles.showcaseIcon}>💭</span>
                <div>
                  <h4>{t("features.showcaseFeature3Title")}</h4>
                  <p>{t("features.showcaseFeature3Description")}</p>
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
                  {t("features.demoTitle")} - {t("features.liveIndicator")}
                </span>
              </div>
              <div className={styles.browserContent}>
                <div className={styles.videoPlayer}>
                  <div className={styles.videoOverlay}>
                    <span className={styles.liveIndicator}>● {t("features.liveIndicator")}</span>
                    <span className={styles.viewerCount}>👥 18 {t("features.viewerCount")}</span>
                  </div>
                </div>
                <div className={styles.chatPanel}>
                  <div className={styles.chatMessage}>
                    <strong>{t("features.demoChat.message1.user")}:</strong> {t("features.demoChat.message1.text")}
                  </div>
                  <div className={styles.chatMessage}>
                    <strong>{t("features.demoChat.message2.user")}:</strong> {t("features.demoChat.message2.text")}
                  </div>
                  <div className={styles.chatMessage}>
                    <strong>{t("features.demoChat.message3.user")}:</strong> {t("features.demoChat.message3.text")}
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
          <h2>{t("features.additionalFeaturesTitle")}</h2>
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
          <h2>{t("features.comparisonTitle")}</h2>
          <p className={styles.comparisonSubtitle}>{t("features.comparisonSubtitle")}</p>
          <div className={styles.comparisonTable}>
            <div className={styles.comparisonHeader}>
              <div className={styles.comparisonCell}></div>
              <div className={styles.comparisonCell}>
                <h3>{t("features.comparisonEdvance")}</h3>
              </div>
              <div className={styles.comparisonCell}>
                <h3>{t("features.comparisonOthers")}</h3>
              </div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>{t("features.comparisonCost")}</div>
              <div className={styles.comparisonValue}>
                <span className={styles.checkMark}>✓</span>
                <span>{t("features.comparisonCostEdvance")}</span>
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.crossMark}>✗</span>
                <span>{t("features.comparisonCostOthers")}</span>
              </div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>{t("features.comparisonLive")}</div>
              <div className={styles.comparisonValue}>
                <span className={styles.checkMark}>✓</span>
                <span>{t("features.comparisonLiveEdvance")}</span>
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.crossMark}>✗</span>
                <span>{t("features.comparisonLiveOthers")}</span>
              </div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>{t("features.comparisonPoints")}</div>
              <div className={styles.comparisonValue}>
                <span className={styles.checkMark}>✓</span>
                <span>{t("features.comparisonPointsEdvance")}</span>
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.crossMark}>✗</span>
                <span>{t("features.comparisonPointsOthers")}</span>
              </div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>
                {t("features.comparisonParents")}
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.checkMark}>✓</span>
                <span>{t("features.comparisonParentsEdvance")}</span>
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.crossMark}>✗</span>
                <span>{t("features.comparisonParentsOthers")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <h2>{t("features.statsTitle")}</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>📈</span>
              <h3>98%</h3>
              <p>{t("features.statImprovement")}</p>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>⏰</span>
              <h3>24/7</h3>
              <p>{t("features.statSupport")}</p>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🎯</span>
              <h3>95%</h3>
              <p>{t("features.statSatisfaction")}</p>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🚀</span>
              <h3>0.5 {t("common.time")}</h3>
              <p>{t("features.statLatency")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2>{t("features.ctaTitle")}</h2>
          <p>{t("features.ctaDescription")}</p>
          <div className={styles.ctaButtons}>
            <Link href="/signup" className={styles.primaryButton}>
              {t("features.ctaRegisterButton")}
            </Link>
            <Link href="/demo" className={styles.secondaryButton}>
              {t("features.ctaDemoButton")}
            </Link>
          </div>
          <p className={styles.ctaNote}>
            <span className={styles.ctaIcon}>🎁</span>
            {t("features.ctaNote")}
          </p>
        </div>
      </section>
    </div>
  );
}
