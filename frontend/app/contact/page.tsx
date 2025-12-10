"use client";

import styles from "./Contact.module.css";
import Link from "next/link";
import { useState } from "react";
import NavigationBar from "@/components/Nav/Nav";
import { useLanguage } from "@/hooks/useLanguage";
import { MessageCircle, Wrench, BookOpen, Handshake, Clock, Send, Mail, Smartphone, MapPin, Facebook, Twitter, Camera, Tv, Briefcase, AlertTriangle, Phone, ChevronDown } from 'lucide-react';

export default function ContactPage() {
  const { t, dir } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "student",
    subject: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);

  const [activeCategory, setActiveCategory] = useState("general");

  const contactCategories = [
    { id: "general", icon: <MessageCircle size={24} />, title: t("contact.categoryGeneral"), response: t("contact.categoryGeneralResponse") },
    { id: "technical", icon: <Wrench size={24} />, title: t("contact.categoryTechnical"), response: t("contact.categoryTechnicalResponse") },
    {
      id: "educational",
      icon: <BookOpen size={24} />,
      title: t("contact.categoryEducational"),
      response: t("contact.categoryEducationalResponse"),
    },
    { id: "partnership", icon: <Handshake size={24} />, title: t("contact.categoryPartnership"), response: t("contact.categoryPartnershipResponse") },
  ];

  const faqs = [
    {
      question: "هل المنصة مجانية بالفعل؟",
      answer:
        "نعم، المنصة مجانية 100% ولا توجد أي رسوم خفية أو اشتراكات مدفوعة.",
    },
    {
      question: "كيف يمكنني التسجيل كمعلم؟",
      answer:
        'يمكنك التسجيل كمعلم من خلال صفحة التسجيل واختيار "معلم" ثم إرفاق المستندات المطلوبة.',
    },
    {
      question: "هل يمكن لأولياء الأمور متابعة أداء أبنائهم؟",
      answer:
        "نعم، لدينا لوحة تحكم خاصة لأولياء الأمور لمتابعة حضور وأداء أبنائهم بشكل مفصل.",
    },
    {
      question: "ما هي متطلبات الإنترنت للبث المباشر؟",
      answer: "تحتاج إلى سرعة إنترنت لا تقل عن 2 ميجابت للمشاهدة بجودة عالية.",
    },
    {
      question: "كيف يعمل نظام النقاط؟",
      answer:
        "تحصل على نقاط عند الحضور والمشاركة والإنجازات، ويمكن استبدالها بمزايا إضافية.",
    },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, name: t("contact.facebook"), url: "#" },
    { icon: <Twitter size={20} />, name: t("contact.twitter"), url: "#" },
    { icon: <Camera size={20} />, name: t("contact.instagram"), url: "#" },
    { icon: <Tv size={20} />, name: t("contact.youtube"), url: "#" },
    { icon: <Briefcase size={20} />, name: t("contact.linkedin"), url: "#" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setSuccess(true);
  setFormData({
    name: "",
    email: "",
    userType: "student",
    subject: "",
    message: "",
  });
  setTimeout(() => {
    setSuccess(false);
  }, 3000);
};

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.container} style={{ direction: dir, textAlign: dir === 'rtl' ? 'right' : 'left' }}>
      <NavigationBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroPattern}></div>
        <div className={styles.heroContent}>
          <h1>
            {t("contact.heroTitle")} <span className={styles.gradient}>{t("contact.heroTitleGradient")}</span>
          </h1>
          <p>{t("contact.heroSubtitle")}</p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>2-4</span>
              <span className={styles.statLabel}>{t("contact.heroStat1")}</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>98%</span>
              <span className={styles.statLabel}>{t("contact.heroStat2")}</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>{t("contact.heroStat3")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Categories */}
      <section className={styles.categories}>
        <div className={styles.categoriesContainer}>
          <h2>{t("contact.categoriesTitle")}</h2>
          <div className={styles.categoriesGrid}>
            {contactCategories.map((category) => (
              <div
                key={category.id}
                className={`${styles.categoryCard} ${
                  activeCategory === category.id ? styles.active : ""
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <h3>{category.title}</h3>
                <p className={styles.responseTime}>
                  <span className={styles.clockIcon}><Clock size={16} /></span>
                  {t("contact.responseTime")} {category.response}
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
              <h2>{t("contact.formTitle")}</h2>
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">{t("contact.fullName")}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={t("contact.fullNamePlaceholder")}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">{t("contact.yourEmail")}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={t("contact.emailPlaceholder")}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="userType">{t("contact.userType")}</label>
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                    >
                      <option value="student">{t("contact.userTypeStudent")}</option>
                      <option value="teacher">{t("contact.userTypeTeacher")}</option>
                      <option value="parent">{t("contact.userTypeParent")}</option>
                      <option value="other">{t("contact.userTypeOther")}</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="subject">{t("contact.subject")}</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t("contact.subjectPlaceholder")}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">{t("contact.message")}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder={t("contact.messagePlaceholder")}
                    rows={6}
                  />
                </div>
                {success && (
                  <div
                    className="mb-3 rounded-lg border border-green-300 bg-green-100 px-4 py-2 text-green-800 text-sm"
                    style={{ direction: dir, textAlign: dir === "rtl" ? "right" : "left" }}
                  >
                    {t("contact.successMessage")}
                  </div>
                )}
                <button type="submit" className={styles.submitButton}>
                  <span>{t("contact.sendMessage")}</span>
                  <span className={styles.sendIcon}><Send size={20} /></span>
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h3>{t("contact.contactInfoTitle")}</h3>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}><Mail size={24} /></span>
                  <div>
                    <h4>{t("contact.emailLabel")}</h4>
                    <p>{t("contact.emailValue")}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}><Smartphone size={24} /></span>
                  <div>
                    <h4>{t("contact.whatsappLabel")}</h4>
                    <p>{t("contact.whatsappValue")}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}><MapPin size={24} /></span>
                  <div>
                    <h4>{t("contact.addressLabel")}</h4>
                    <p>{t("contact.addressValue")}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}><Clock size={24} /></span>
                  <div>
                    <h4>{t("contact.officeHoursLabel")}</h4>
                    <p>{t("contact.officeHoursValue")}</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className={styles.socialCard}>
                <h3>{t("contact.followUsTitle")}</h3>
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
                <h3>{t("contact.quickResponseTitle")}</h3>
                <p>{t("contact.quickResponseDescription")}</p>
                <button className={styles.chatButton}>
                  <span><MessageCircle size={20} /></span>
                  <span>{t("contact.startChatButton")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.faqContainer}>
          <h2>{t("contact.faqTitle")}</h2>
          <p className={styles.faqSubtitle}>
            {t("contact.faqSubtitle")}
          </p>
          <div className={styles.faqGrid}>
            {faqs.map((faq, index) => (
              <details key={index} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  <span>{faq.question}</span>
                  <span className={styles.faqIcon}><ChevronDown size={20} /></span>
                </summary>
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
          <div className={styles.faqFooter}>
            <p>{t("contact.faqFooterText")}</p>
            <Link href="/faq" className={styles.faqLink}>
              {t("contact.faqFooterLink")}
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className={styles.emergency}>
        <div className={styles.emergencyContainer}>
          <div className={styles.emergencyIcon}><AlertTriangle size={48} /></div>
          <h3>{t("contact.emergencyTitle")}</h3>
          <p>{t("contact.emergencyDescription")}</p>
          <div className={styles.emergencyActions}>
            <button className={styles.emergencyButton}>
              <span><Phone size={20} /></span>
              <span>{t("contact.emergencyCallButton")}</span>
            </button>
            <button className={styles.emergencyChat}>
              <span><MessageCircle size={20} /></span>
              <span>{t("contact.emergencyChatButton")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.map}>
        <div className={styles.mapContainer}>
          <div className={styles.mapContent}>
            <h2>{t("contact.mapTitle")}</h2>
            <p>{t("contact.mapDescription")}</p>
            <div className={styles.mapPlaceholder}>
              <div className={styles.mapOverlay}>
                <span className={styles.mapIcon}><MapPin size={48} /></span>
                <h3>{t("contact.mapLocation")}</h3>
                <p>{t("contact.mapAddress")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
