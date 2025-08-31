"use client";

import styles from './Contact.module.css';
import Link from 'next/link';
import { useState } from 'react';
import NavigationBar from '@/components/Nav/Nav';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'student',
    subject: '',
    message: ''
  });

  const [activeCategory, setActiveCategory] = useState('general');

  const contactCategories = [
    { id: 'general', icon: '💬', title: 'استفسارات عامة', response: '24 ساعة' },
    { id: 'technical', icon: '🛠️', title: 'دعم فني', response: '2-4 ساعات' },
    { id: 'educational', icon: '📚', title: 'أسئلة تعليمية', response: '12 ساعة' },
    { id: 'partnership', icon: '🤝', title: 'شراكات', response: '48 ساعة' }
  ];

  const faqs = [
    {
      question: 'هل المنصة مجانية بالفعل؟',
      answer: 'نعم، المنصة مجانية 100% ولا توجد أي رسوم خفية أو اشتراكات مدفوعة.'
    },
    {
      question: 'كيف يمكنني التسجيل كمعلم؟',
      answer: 'يمكنك التسجيل كمعلم من خلال صفحة التسجيل واختيار "معلم" ثم إرفاق المستندات المطلوبة.'
    },
    {
      question: 'هل يمكن لأولياء الأمور متابعة أداء أبنائهم؟',
      answer: 'نعم، لدينا لوحة تحكم خاصة لأولياء الأمور لمتابعة حضور وأداء أبنائهم بشكل مفصل.'
    },
    {
      question: 'ما هي متطلبات الإنترنت للبث المباشر؟',
      answer: 'تحتاج إلى سرعة إنترنت لا تقل عن 2 ميجابت للمشاهدة بجودة عالية.'
    },
    {
      question: 'كيف يعمل نظام النقاط؟',
      answer: 'تحصل على نقاط عند الحضور والمشاركة والإنجازات، ويمكن استبدالها بمزايا إضافية.'
    }
  ];

  const socialLinks = [
    { icon: '📘', name: 'Facebook', url: '#' },
    { icon: '🐦', name: 'Twitter', url: '#' },
    { icon: '📷', name: 'Instagram', url: '#' },
    { icon: '📺', name: 'YouTube', url: '#' },
    { icon: '💼', name: 'LinkedIn', url: '#' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.container}>
      <NavigationBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroPattern}></div>
        <div className={styles.heroContent}>
          <h1>نحن هنا <span className={styles.gradient}>لمساعدتك</span></h1>
          <p>فريق الدعم متواجد على مدار الساعة للإجابة على استفساراتك</p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>2-4</span>
              <span className={styles.statLabel}>ساعات متوسط الرد</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>98%</span>
              <span className={styles.statLabel}>نسبة رضا العملاء</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>دعم متواصل</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Categories */}
      <section className={styles.categories}>
        <div className={styles.categoriesContainer}>
          <h2>اختر نوع الاستفسار</h2>
          <div className={styles.categoriesGrid}>
            {contactCategories.map((category) => (
              <div
                key={category.id}
                className={`${styles.categoryCard} ${activeCategory === category.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <h3>{category.title}</h3>
                <p className={styles.responseTime}>
                  <span className={styles.clockIcon}>⏰</span>
                  وقت الرد: {category.response}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className={styles.mainContact}>
        <div className={styles.contactContainer}>
          <div className={styles.contactGrid}>
            {/* Contact Form */}
            <div className={styles.formSection}>
              <h2>أرسل رسالتك</h2>
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">الاسم الكامل</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">البريد الإلكتروني</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="userType">نوع المستخدم</label>
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                    >
                      <option value="student">طالب</option>
                      <option value="teacher">معلم</option>
                      <option value="parent">ولي أمر</option>
                      <option value="other">آخر</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="subject">الموضوع</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="موضوع الرسالة"
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="message">الرسالة</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="اكتب رسالتك هنا..."
                    rows={6}
                  />
                </div>
                
                <button type="submit" className={styles.submitButton}>
                  <span>إرسال الرسالة</span>
                  <span className={styles.sendIcon}>📤</span>
                </button>
              </form>
            </div>

                        {/* Contact Info */}
            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h3>معلومات التواصل</h3>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📧</span>
                  <div>
                    <h4>البريد الإلكتروني</h4>
                    <p>support@eduegypt.com</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📱</span>
                  <div>
                    <h4>الواتساب</h4>
                    <p>+20 123 456 7890</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📍</span>
                  <div>
                    <h4>العنوان</h4>
                    <p>القاهرة، مصر</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>🕐</span>
                  <div>
                    <h4>ساعات العمل</h4>
                    <p>24/7 دعم متواصل</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className={styles.socialCard}>
                <h3>تابعنا على</h3>
                <div className={styles.socialLinks}>
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      className={styles.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className={styles.socialIcon}>{link.icon}</span>
                      <span>{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Response */}
              <div className={styles.quickResponse}>
                <h3>للرد السريع</h3>
                <p>استخدم الدردشة المباشرة في أسفل الصفحة للحصول على إجابة فورية</p>
                <button className={styles.chatButton}>
                  <span>💬</span>
                  <span>ابدأ محادثة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.faqContainer}>
          <h2>الأسئلة الشائعة</h2>
          <p className={styles.faqSubtitle}>إجابات سريعة للأسئلة الأكثر شيوعاً</p>
          <div className={styles.faqGrid}>
            {faqs.map((faq, index) => (
              <details key={index} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  <span>{faq.question}</span>
                  <span className={styles.faqIcon}>⌄</span>
                </summary>
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
          <div className={styles.faqFooter}>
            <p>لم تجد إجابة لسؤالك؟</p>
            <Link href="/faq" className={styles.faqLink}>
              عرض جميع الأسئلة الشائعة ←
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className={styles.emergency}>
        <div className={styles.emergencyContainer}>
          <div className={styles.emergencyIcon}>🚨</div>
          <h3>للحالات الطارئة</h3>
          <p>إذا كنت تواجه مشكلة تقنية عاجلة أثناء محاضرة مباشرة</p>
          <div className={styles.emergencyActions}>
            <button className={styles.emergencyButton}>
              <span>📞</span>
              <span>اتصل الآن: 15555</span>
            </button>
            <button className={styles.emergencyChat}>
              <span>💬</span>
              <span>دردشة طارئة</span>
            </button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.map}>
        <div className={styles.mapContainer}>
          <div className={styles.mapContent}>
            <h2>موقعنا</h2>
            <p>يمكنك زيارتنا في مقرنا الرئيسي</p>
            <div className={styles.mapPlaceholder}>
              <div className={styles.mapOverlay}>
                <span className={styles.mapIcon}>📍</span>
                <h3>القاهرة، مصر</h3>
                <p>شارع التعليم، مبنى رقم 10</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}