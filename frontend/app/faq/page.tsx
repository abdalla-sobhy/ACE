'use client';

import styles from './Faq.module.css';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import NavigationBar from '@/components/Nav/Nav';
import { useLanguage } from '@/hooks/useLanguage';
import arTranslations from '@/locales/ar.json';
import enTranslations from '@/locales/en.json';

export default function FAQPage() {
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Get FAQ items from translations
  const translations = language === 'ar' ? arTranslations : enTranslations;
  const faqs = translations.faq.faqItems.map((item: any) => ({
    ...item,
    helpful: 0,
    notHelpful: 0
  }));

  const faqCategories = [
    { id: 'all', name: t('faq.categoryAll'), icon: '📋', count: 16 },
    { id: 'general', name: t('faq.categoryGeneral'), icon: '💭', count: 4 },
    { id: 'registration', name: t('faq.categoryRegistration'), icon: '👤', count: 4 },
    { id: 'technical', name: t('faq.categoryTechnical'), icon: '⚙️', count: 3 },
    { id: 'educational', name: t('faq.categoryEducational'), icon: '📚', count: 3 },
    { id: 'payment', name: t('faq.categoryPayment'), icon: '💰', count: 2 }
  ];

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, language]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleHelpful = (id: string, isHelpful: boolean) => {
    console.log(`FAQ ${id} marked as ${isHelpful ? 'helpful' : 'not helpful'}`);
    // I need to make an API call here don't forget
  };

  return (
    <div className={styles.container}>
      <NavigationBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroPattern}></div>
        </div>
        <div className={styles.heroContent}>
          <h1>{t('faq.heroTitle')}</h1>
          <p>{t('faq.heroSubtitle')}</p>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder={t('faq.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  className={styles.clearButton}
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <p className={styles.searchResults}>
                {filteredFAQs.length} {t('faq.searchResults')} &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categories}>
        <div className={styles.categoriesContainer}>
          {faqCategories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span className={styles.categoryName}>{category.name}</span>
              <span className={styles.categoryCount}>{category.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* FAQ List */}
      <section className={styles.faqList}>
        <div className={styles.faqContainer}>
          {filteredFAQs.length === 0 ? (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>🔍</span>
              <h3>{t('faq.noResultsTitle')}</h3>
              <p>{t('faq.noResultsDescription')}</p>
              <Link href="/contact" className={styles.contactLink}>
                {t('faq.noResultsLink')}
              </Link>
            </div>
          ) : (
            <div className={styles.faqGrid}>
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className={`${styles.faqItem} ${openItems.includes(faq.id) ? styles.open : ''}`}
                >
                  <button
                    className={styles.faqQuestion}
                    onClick={() => toggleItem(faq.id)}
                  >
                    <span className={styles.questionText}>{faq.question}</span>
                    <span className={styles.expandIcon}>
                      {openItems.includes(faq.id) ? '−' : '+'}
                    </span>
                  </button>

                  {openItems.includes(faq.id) && (
                    <div className={styles.faqAnswer}>
                      <div className={styles.answerContent}>
                        {faq.answer.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>

                      <div className={styles.helpfulness}>
                        <p>{t('faq.helpfulQuestion')}</p>
                        <div className={styles.helpfulnessButtons}>
                          <button
                            className={styles.helpfulButton}
                            onClick={() => handleHelpful(faq.id, true)}
                          >
                            <span>👍</span>
                            <span>{faq.helpful}</span>
                          </button>
                          <button
                            className={styles.notHelpfulButton}
                            onClick={() => handleHelpful(faq.id, false)}
                          >
                            <span>👎</span>
                            <span>{faq.notHelpful}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className={styles.needHelp}>
        <div className={styles.needHelpContainer}>
          <h2>{t('faq.needHelpTitle')}</h2>
          <p>{t('faq.needHelpSubtitle')}</p>
          <div className={styles.helpOptions}>
            <div className={styles.helpCard}>
              <span className={styles.helpIcon}>💬</span>
              <h3>{t('faq.helpLiveChat')}</h3>
              <p>{t('faq.helpLiveChatDescription')}</p>
              <button className={styles.helpButton}>{t('faq.helpLiveChatButton')}</button>
            </div>
            <div className={styles.helpCard}>
              <span className={styles.helpIcon}>📧</span>
              <h3>{t('faq.helpEmail')}</h3>
              <p>{t('faq.helpEmailDescription')}</p>
              <Link href="/contact" className={styles.helpButton}>
                {t('faq.helpEmailButton')}
              </Link>
            </div>
            <div className={styles.helpCard}>
              <span className={styles.helpIcon}>📞</span>
              <h3>{t('faq.helpPhone')}</h3>
              <p>{t('faq.helpPhoneDescription')}</p>
              <button className={styles.helpButton}>{t('faq.helpPhoneButton')}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className={styles.popularTopics}>
        <div className={styles.topicsContainer}>
          <h2>{t('faq.popularTopicsTitle')}</h2>
          <div className={styles.topicsGrid}>
            <Link href="#" className={styles.topicTag}>{t('faq.topicRegistration')}</Link>
            <Link href="#" className={styles.topicTag}>{t('faq.topicPoints')}</Link>
            <Link href="#" className={styles.topicTag}>{t('faq.topicPassword')}</Link>
            <Link href="#" className={styles.topicTag}>{t('faq.topicSeats')}</Link>
            <Link href="#" className={styles.topicTag}>{t('faq.topicLive')}</Link>
            <Link href="#" className={styles.topicTag}>{t('faq.topicExams')}</Link>
            <Link href="#" className={styles.topicTag}>{t('faq.topicCertificates')}</Link>
            <Link href="#" className={styles.topicTag}>{t('faq.topicSystemRequirements')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
