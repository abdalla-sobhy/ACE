"use client";

import styles from './About.module.css';
import Image from 'next/image';
import Link from 'next/link';
import NavigationBar from '@/components/Nav/Nav';
import { useTranslations, useLocale } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');
  const locale = useLocale();
  const developers = [
    {
      name: "ملك  مجدي",
      role: "Full Stack Developer",
      bio: "مطورة متخصص في Next.js و Node.js، شغوفة بتطوير حلول تعليمية مبتكرة",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      image: ""
    },
    {
      name: "زياد محمود", 
      role: "Full Stack Developer",
      bio: "متخصصة في تصميم واجهات المستخدم وتجربة المستخدم، خبرة في React و TypeScript",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      image: ""
    },
    {
      name: "سلسبيل شحاته",
      role: "frontend Developer", 
      bio: "مطورة فرونت إند متخصصة في React وواجهات المستخدم",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      image: ""
    },
    {
      name: "محمود محمد",
      role: "full stack Designer",
      bio: "مطورة فلستاك بخبرة في Laravel و React لبناء تطبيقات ويب متكاملة",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      image: ""
    }
  ];

  return (
    <div className={styles.container}>
      <NavigationBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroPattern}></div>
        <div className={styles.heroContent}>
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.description')}</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.mission}>
        <div className={styles.missionContainer}>
          <div className={styles.missionContent}>
            <h2>{t('mission.title')}</h2>
            <p>{t('mission.description')}</p>
            <div className={styles.missionPoints}>
              <div className={styles.point}>
                <span className={styles.pointIcon}>🎯</span>
                <div>
                  <h3>{t('mission.free.title')}</h3>
                  <p>{t('mission.free.description')}</p>
                </div>
              </div>
              <div className={styles.point}>
                <span className={styles.pointIcon}>🌍</span>
                <div>
                  <h3>{t('mission.accessible.title')}</h3>
                  <p>{t('mission.accessible.description')}</p>
                </div>
              </div>
              <div className={styles.point}>
                <span className={styles.pointIcon}>⚡</span>
                <div>
                  <h3>{t('mission.interactive.title')}</h3>
                  <p>{t('mission.interactive.description')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.missionVisual}>
            <div className={styles.statsCard}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>50K+</span>
                <span className={styles.statLabel}>{t('mission.beneficiaries')}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>95%</span>
                <span className={styles.statLabel}>{t('mission.satisfaction')}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>27</span>
                <span className={styles.statLabel}>{t('mission.governorates')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.story}>
        <div className={styles.storyContainer}>
          <h2>{t('story.title')}</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h3>{t('story.beginning.title')}</h3>
                <p>{t('story.beginning.description')}</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h3>{t('story.beta.title')}</h3>
                <p>{t('story.beta.description')}</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h3>{t('story.growth.title')}</h3>
                <p>{t('story.growth.description')}</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h3>{t('story.future.title')}</h3>
                <p>{t('story.future.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.team}>
        <div className={styles.teamContainer}>
          <h2>{t('team.title')}</h2>
          <p className={styles.teamSubtitle}>{t('team.subtitle')}</p>
          <div className={styles.teamGrid}>
            {developers.map((dev, index) => (
              <div key={index} className={styles.teamCard}>
                <div className={styles.cardImage}>
                  <Image src={dev.image} alt={dev.name} />
                  <div className={styles.cardOverlay}>
                    <a href={dev.github} target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.95 1.03-2.63-.1-.26-.45-1.25.1-2.6 0 0 .84-.27 2.75 1.03.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.3 2.75-1.03 2.75-1.03.55 1.35.2 2.34.1 2.6.64.68 1.03 1.54 1.03 2.63 0 3.83-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48C19.14 20.17 22 16.42 22 12c0-5.523-4.477-10-10-10z"/>
                      </svg>
                    </a>
                    <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                                                <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <h3>{dev.name}</h3>
                <span className={styles.role}>{dev.role}</span>
                <p className={styles.bio}>{dev.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.values}>
        <div className={styles.valuesContainer}>
          <h2>{t('values.title')}</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.value}>
              <div className={styles.valueIcon}>💡</div>
              <h3>{t('values.innovation.title')}</h3>
              <p>{t('values.innovation.description')}</p>
            </div>
            <div className={styles.value}>
              <div className={styles.valueIcon}>🤝</div>
              <h3>{t('values.equality.title')}</h3>
              <p>{t('values.equality.description')}</p>
            </div>
            <div className={styles.value}>
              <div className={styles.valueIcon}>🌟</div>
              <h3>{t('values.quality.title')}</h3>
              <p>{t('values.quality.description')}</p>
            </div>
            <div className={styles.value}>
              <div className={styles.valueIcon}>❤️</div>
              <h3>{t('values.passion.title')}</h3>
              <p>{t('values.passion.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className={styles.contactCta}>
        <div className={styles.contactContainer}>
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.description')}</p>
          <div className={styles.ctaButtons}>
            <Link href={`/${locale}/signup/student`} className={styles.primaryButton}>
              {t('cta.joinStudent')}
            </Link>
            <Link href={`/${locale}/signup/teacher`} className={styles.secondaryButton}>
              {t('cta.joinTeacher')}
            </Link>
            <Link href={`/${locale}/contact`} className={styles.tertiaryButton}>
              {t('cta.contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}