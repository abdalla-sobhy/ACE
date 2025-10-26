import styles from "./Landing.module.css";
import Link from "next/link";
import NavigationBar from "@/components/Nav/Nav";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <NavigationBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            التعليم المجاني
            <br />
            <span className={styles.heroGradient}>لكل طالب مصري</span>
          </h1>
          <p className={styles.heroDescription}>
            منصة تعليمية مجانية تماماً تربط الطلاب بأفضل المحاضرين
            <br />
            احجز مقعدك في البث المباشر واحصل على تعليم متميز
          </p>

          <div className={styles.heroButtons}>
            <Link href="/signup/student" className={styles.primaryButton}>
              سجل كطالب
            </Link>
            <Link href="/signup/teacher" className={styles.secondaryButton}>
              انضم كمحاضر
            </Link>
          </div>

          {/* User Types */}
          <div className={styles.userTypes}>
            <div className={styles.userType}>
              <span className={styles.userIcon}>🎓</span>
              <span>طلاب</span>
            </div>
            <div className={styles.userType}>
              <span className={styles.userIcon}>👨‍🏫</span>
              <span>محاضرين</span>
            </div>
            <div className={styles.userType}>
              <span className={styles.userIcon}>👨‍👩‍👧</span>
              <span>أولياء أمور</span>
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
              <span>جدول المحاضرات</span>
            </div>
            <div className={styles.codeContent}>
              <div className={styles.scheduleLine}>
                <span className={styles.time}>10:00 ص</span>
                <span className={styles.subject}>رياضيات - ثانوية عامة</span>
                <span className={styles.seats}>15 مقعد متاح</span>
              </div>
              <div className={styles.scheduleLine}>
                <span className={styles.time}>2:00 م</span>
                <span className={styles.subject}>فيزياء - الصف الثالث</span>
                <span className={styles.seats}>8 مقاعد متاحة</span>
              </div>
              <div className={styles.scheduleLine}>
                <span className={styles.time}>6:00 م</span>
                <span className={styles.subject}>كيمياء - مراجعة نهائية</span>
                <span className={styles.seats}>مكتمل</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2>لماذا Edvance؟</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📚</div>
              <h3>دروس مباشرة تفاعلية</h3>
              <p>احضر المحاضرات مباشرة وتفاعل مع المحاضر والطلاب</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>نظام النقاط</h3>
              <p>اكسب نقاط عند الحضور والمشاركة واستخدمها في مزايا إضافية</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📝</div>
              <h3>امتحانات شاملة</h3>
              <p>اختبر نفسك بامتحانات نهائية معتمدة وتابع تقدمك</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🆓</div>
              <h3>مجاني 100%</h3>
              <p>لا رسوم خفية، التعليم حق للجميع</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.stat}>
            <h3>50,000+</h3>
            <p>طالب مسجل</p>
          </div>
          <div className={styles.stat}>
            <h3>500+</h3>
            <p>محاضر متميز</p>
          </div>
          <div className={styles.stat}>
            <h3>1000+</h3>
            <p>محاضرة يومياً</p>
          </div>
          <div className={styles.stat}>
            <h3>27</h3>
            <p>محافظة</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>ابدأ رحلتك التعليمية اليوم</h2>
        <p>انضم لآلاف الطلاب المصريين في رحلة التعلم المجاني</p>
        <Link href="/signup" className={styles.ctaButton}>
          سجل الآن مجاناً
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerSection}>
            <h4>Edvance</h4>
            <p>منصة تعليمية مجانية لكل طالب مصري</p>
          </div>
          <div className={styles.footerSection}>
            <h5>للطلاب</h5>
            <Link href="/schedule">الجدول</Link>
            <Link href="/exams">الامتحانات</Link>
          </div>
          <div className={styles.footerSection}>
            <h5>للمحاضرين</h5>
            <Link href="/teach">كيف تدرس معنا</Link>
            <Link href="/resources">المصادر</Link>
          </div>
          <div className={styles.footerSection}>
            <h5>تواصل معنا</h5>
            <Link href="/contact">اتصل بنا</Link>
            <Link href="/support">الدعم</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2024 Edvance. صنع بـ ❤️ من أجل مصر</p>
        </div>
      </footer>
    </div>
  );
}
