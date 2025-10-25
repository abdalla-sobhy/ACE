import styles from "./Features.module.css";
import Link from "next/link";
import NavigationBar from "@/components/Nav/Nav";

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: "📺",
      title: "بث مباشر تفاعلي",
      description:
        "احضر المحاضرات بث مباشر بجودة عالية مع إمكانية التفاعل المباشر مع المحاضر",
      details: [
        "جودة فيديو HD",
        "تفاعل مباشر بالصوت والصورة",
        "مشاركة الشاشة والملفات",
        "تسجيل المحاضرات للمراجعة",
      ],
    },
    {
      icon: "🪑",
      title: "نظام حجز المقاعد",
      description:
        "احجز مقعدك في المحاضرة مسبقاً لضمان حضورك وتنظيم أفضل للفصول",
      details: [
        "حجز مسبق للمحاضرات",
        "إشعارات تذكيرية",
        "قائمة انتظار ذكية",
        "إلغاء مرن للحجز",
      ],
    },
    {
      icon: "🏆",
      title: "نظام النقاط والمكافآت",
      description: "اكسب نقاط مع كل حضور ومشاركة واستبدلها بمزايا إضافية",
      details: [
        "نقاط للحضور المنتظم",
        "مكافآت للمشاركة الفعالة",
        "شارات الإنجاز",
        "لوحة المتصدرين",
      ],
    },
    {
      icon: "📝",
      title: "امتحانات شاملة",
      description:
        "اختبر معلوماتك بامتحانات معتمدة مع تقييم فوري وتقارير مفصلة",
      details: [
        "امتحانات تجريبية",
        "تصحيح فوري",
        "تقارير الأداء المفصلة",
        "شهادات معتمدة",
      ],
    },
  ];

  const additionalFeatures = [
    {
      icon: "👨‍👩‍👧",
      title: "لوحة تحكم أولياء الأمور",
      description: "متابعة دقيقة لتقدم الأبناء وحضورهم",
    },
    {
      icon: "📊",
      title: "تقارير تفصيلية",
      description: "احصائيات شاملة عن الأداء والتقدم الدراسي",
    },
    {
      icon: "💬",
      title: "منتدى نقاش",
      description: "تواصل مع زملائك والمعلمين خارج وقت المحاضرة",
    },
    {
      icon: "📚",
      title: "مكتبة رقمية",
      description: "مصادر تعليمية وملخصات وكتب رقمية",
    },
    {
      icon: "📱",
      title: "تطبيق موبايل",
      description: "تعلم في أي وقت ومن أي مكان",
    },
    {
      icon: "🔔",
      title: "إشعارات ذكية",
      description: "لا تفوت أي محاضرة أو موعد مهم",
    },
  ];

  return (
    <div className={styles.container}>
      <NavigationBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}></div>
        <div className={styles.heroContent}>
          <span className={styles.badge}>المنصة الأولى في مصر</span>
          <h1>
            مميزات تجعل التعلم{" "}
            <span className={styles.gradient}>أسهل وأمتع</span>
          </h1>
          <p>منصة متكاملة مصممة خصيصاً لتلبية احتياجات الطالب المصري</p>
        </div>
      </section>

      {/* Main Features */}
      <section className={styles.mainFeatures}>
        <div className={styles.featuresContainer}>
          <div className={styles.sectionHeader}>
            <h2>المميزات الأساسية</h2>
            <p>كل ما تحتاجه للتفوق الدراسي في مكان واحد</p>
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
            <span className={styles.showcaseBadge}>الأكثر طلباً</span>
            <h2>نظام البث المباشر المتطور</h2>
            <p>
              تقنية بث عالية الجودة تضمن تجربة تعليمية سلسة ومتواصلة مع إمكانيات
              تفاعل متقدمة تجعلك تشعر وكأنك في فصل دراسي حقيقي
            </p>
            <div className={styles.showcaseFeatures}>
              <div className={styles.showcaseFeature}>
                <span className={styles.showcaseIcon}>👥</span>
                <div>
                  <h4>فصول صغيرة</h4>
                  <p>15-20 طالب فقط لضمان التفاعل</p>
                </div>
              </div>
              <div className={styles.showcaseFeature}>
                <span className={styles.showcaseIcon}>🎥</span>
                <div>
                  <h4>تسجيل تلقائي</h4>
                  <p>جميع المحاضرات متاحة للمراجعة</p>
                </div>
              </div>
              <div className={styles.showcaseFeature}>
                <span className={styles.showcaseIcon}>💭</span>
                <div>
                  <h4>دردشة مباشرة</h4>
                  <p>اسأل واحصل على إجابات فورية</p>
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
                  محاضرة الفيزياء - بث مباشر
                </span>
              </div>
              <div className={styles.browserContent}>
                <div className={styles.videoPlayer}>
                  <div className={styles.videoOverlay}>
                    <span className={styles.liveIndicator}>● مباشر</span>
                    <span className={styles.viewerCount}>👥 18 طالب</span>
                  </div>
                </div>
                <div className={styles.chatPanel}>
                  <div className={styles.chatMessage}>
                    <strong>أحمد:</strong> هل يمكن إعادة الشرح؟
                  </div>
                  <div className={styles.chatMessage}>
                    <strong>المعلم:</strong> بالتأكيد! دعني أوضح أكثر
                  </div>
                  <div className={styles.chatMessage}>
                    <strong>سارة:</strong> شكراً، واضح الآن!
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
          <h2>مميزات إضافية تثري تجربتك</h2>
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
          <h2>لماذا Edvance؟</h2>
          <p className={styles.comparisonSubtitle}>مقارنة سريعة توضح الفرق</p>
          <div className={styles.comparisonTable}>
            <div className={styles.comparisonHeader}>
              <div className={styles.comparisonCell}></div>
              <div className={styles.comparisonCell}>
                <h3>Edvance</h3>
              </div>
              <div className={styles.comparisonCell}>
                <h3>المنصات الأخرى</h3>
              </div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>التكلفة</div>
              <div className={styles.comparisonValue}>
                <span className={styles.checkMark}>✓</span>
                <span>مجاني 100%</span>
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.crossMark}>✗</span>
                <span>اشتراكات شهرية</span>
              </div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>بث مباشر تفاعلي</div>
              <div className={styles.comparisonValue}>
                <span className={styles.checkMark}>✓</span>
                <span>متاح لجميع الكورسات</span>
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.crossMark}>✗</span>
                <span>فيديوهات مسجلة فقط</span>
              </div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>نظام النقاط</div>
              <div className={styles.comparisonValue}>
                <span className={styles.checkMark}>✓</span>
                <span>نظام متكامل</span>
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.crossMark}>✗</span>
                <span>غير متوفر</span>
              </div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>
                متابعة أولياء الأمور
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.checkMark}>✓</span>
                <span>لوحة تحكم مخصصة</span>
              </div>
              <div className={styles.comparisonValue}>
                <span className={styles.crossMark}>✗</span>
                <span>محدود أو غير متاح</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <h2>أرقام تتحدث عن النجاح</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>📈</span>
              <h3>98%</h3>
              <p>نسبة تحسن الطلاب</p>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>⏰</span>
              <h3>24/7</h3>
              <p>دعم فني متواصل</p>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🎯</span>
              <h3>95%</h3>
              <p>نسبة رضا الطلاب</p>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🚀</span>
              <h3>0.5 ثانية</h3>
              <p>زمن تأخير البث</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2>ابدأ رحلتك التعليمية اليوم</h2>
          <p>انضم لآلاف الطلاب الذين يحققون أحلامهم معنا</p>
          <div className={styles.ctaButtons}>
            <Link href="/signup" className={styles.primaryButton}>
              سجل مجاناً الآن
            </Link>
            <Link href="/demo" className={styles.secondaryButton}>
              جرب عرض تجريبي
            </Link>
          </div>
          <p className={styles.ctaNote}>
            <span className={styles.ctaIcon}>🎁</span>
            احصل على 100 نقطة ترحيبية عند التسجيل
          </p>
        </div>
      </section>
    </div>
  );
}
