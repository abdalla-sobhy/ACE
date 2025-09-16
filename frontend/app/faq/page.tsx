'use client';

import styles from './Faq.module.css';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import NavigationBar from '@/components/Nav/Nav';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqCategories = [
    { id: 'all', name: 'جميع الأسئلة', icon: '📋', count: 25 },
    { id: 'general', name: 'عامة', icon: '💭', count: 8 },
    { id: 'registration', name: 'التسجيل والحساب', icon: '👤', count: 6 },
    { id: 'technical', name: 'تقنية', icon: '⚙️', count: 5 },
    { id: 'educational', name: 'تعليمية', icon: '📚', count: 4 },
    { id: 'payment', name: 'المدفوعات والنقاط', icon: '💰', count: 2 }
  ];

  const faqs = [
    {
      id: '1',
      category: 'general',
      question: 'هل المنصة مجانية بالفعل؟',
      answer: 'نعم، المنصة مجانية 100% ولا توجد أي رسوم خفية أو اشتراكات مدفوعة. نحن ملتزمون بتوفير التعليم المجاني لجميع الطلاب المصريين.',
      helpful: 234,
      notHelpful: 12
    },
    {
      id: '2',
      category: 'general',
      question: 'ما الفرق بين الطالب والمعلم وولي الأمر؟',
      answer: 'الطالب: يمكنه حضور المحاضرات وحل الامتحانات وكسب النقاط.\nالمعلم: يمكنه إنشاء وإدارة المحاضرات والامتحانات.\nولي الأمر: يمكنه متابعة أداء وحضور أبنائه.',
      helpful: 189,
      notHelpful: 8
    },
    {
      id: '3',
      category: 'general',
      question: 'هل يمكنني استخدام المنصة على الهاتف المحمول؟',
      answer: 'نعم، المنصة متوافقة تماماً مع جميع الأجهزة. يمكنك الوصول إليها من خلال المتصفح على هاتفك، وقريباً سيتوفر تطبيق مخصص للأندرويد و iOS.',
      helpful: 156,
      notHelpful: 5
    },
    {
      id: '4',
      category: 'registration',
      question: 'كيف يمكنني التسجيل في المنصة؟',
      answer: 'يمكنك التسجيل بسهولة من خلال:\n1. الضغط على زر "انضم مجاناً"\n2. اختيار نوع الحساب (طالب/معلم/ولي أمر)\n3. إدخال البيانات المطلوبة\n4. تأكيد البريد الإلكتروني',
      helpful: 298,
      notHelpful: 15
    },
    {
      id: '5',
      category: 'registration',
      question: 'نسيت كلمة المرور، ماذا أفعل؟',
      answer: 'لا تقلق! يمكنك استعادة كلمة المرور من خلال:\n1. الضغط على "نسيت كلمة المرور" في صفحة تسجيل الدخول\n2. إدخال بريدك الإلكتروني\n3. ستصلك رسالة بها رابط لإعادة تعيين كلمة المرور',
      helpful: 167,
      notHelpful: 7
    },
    {
      id: '6',
      category: 'registration',
      question: 'هل يمكنني تغيير نوع حسابي من طالب إلى معلم؟',
      answer: 'نعم، يمكنك التقديم لتغيير نوع الحساب من خلال إعدادات الحساب. سيتم مراجعة طلبك والتحقق من المستندات المطلوبة للمعلمين.',
      helpful: 89,
      notHelpful: 3
    },
    {
      id: '7',
      category: 'technical',
      question: 'ما هي متطلبات الإنترنت للبث المباشر؟',
      answer: 'للحصول على أفضل تجربة:\n• الحد الأدنى: 2 ميجابت/ثانية للمشاهدة بجودة عادية\n• الموصى به: 5 ميجابت/ثانية للمشاهدة بجودة HD\n• للمعلمين: 10 ميجابت/ثانية للبث',
      helpful: 245,
      notHelpful: 18
    },
    {
      id: '8',
      category: 'technical',
      question: 'المحاضرة لا تعمل بشكل جيد، ما الحل؟',
      answer: 'جرب الخطوات التالية:\n1. تحقق من سرعة الإنترنت\n2. أغلق التطبيقات الأخرى\n3. استخدم متصفح Chrome أو Firefox\n4. قلل جودة البث من الإعدادات\n5. اتصل بالدعم الفني إذا استمرت المشكلة',
      helpful: 198,
      notHelpful: 12
    },
    {
      id: '9',
      category: 'educational',
      question: 'كيف يعمل نظام النقاط؟',
      answer: 'تحصل على نقاط من خلال:\n• حضور المحاضرات: 10 نقاط\n• المشاركة الفعالة: 5 نقاط\n• حل الواجبات: 15 نقطة\n• النجاح في الامتحانات: 20-50 نقطة\nيمكن استبدال النقاط بمزايا إضافية مثل جلسات خاصة أو مواد تعليمية إضافية.',
      helpful: 312,
      notHelpful: 22
    },
    {
      id: '10',
      category: 'educational',
      question: 'هل يمكنني مشاهدة المحاضرات المسجلة؟',
      answer: 'نعم، جميع المحاضرات المباشرة يتم تسجيلها تلقائياً وتكون متاحة للمشاهدة لمدة 30 يوماً بعد البث. يمكنك الوصول إليها من قسم "محاضراتي".',
      helpful: 267,
      notHelpful: 14
    },
    {
      id: '11',
      category: 'general',
      question: 'ما هي المراحل التعليمية المتاحة؟',
      answer: 'نغطي جميع المراحل التعليمية:\n• المرحلة الابتدائية (1-6)\n• المرحلة الإعدادية (1-3)\n• المرحلة الثانوية (1-3)\n• دورات تحضيرية للجامعة',
      helpful: 145,
      notHelpful: 6
    },
    {
      id: '12',
      category: 'registration',
      question: 'هل يمكن لولي الأمر متابعة أكثر من طالب؟',
      answer: 'نعم، يمكن لولي الأمر ربط حسابه بعدة حسابات طلاب (أبنائه) ومتابعة أداء كل منهم بشكل منفصل من لوحة تحكم واحدة.',
      helpful: 123,
      notHelpful: 4
    },
    {
      id: '13',
      category: 'technical',
      question: 'هل يمكنني تحميل المحاضرات للمشاهدة بدون إنترنت؟',
      answer: 'حالياً لا يمكن تحميل المحاضرات، ولكن نعمل على إضافة هذه الميزة قريباً للطلاب المميزين الذين يجمعون عدد معين من النقاط.',
      helpful: 87,
      notHelpful: 34
    },
    {
      id: '14',
      category: 'educational',
      question: 'كيف يتم تقييم الامتحانات؟',
      answer: 'الامتحانات لها أنواع مختلفة:\n• اختيار من متعدد: تصحيح فوري\n• أسئلة مقالية: يراجعها المعلم خلال 48 ساعة\n• مشاريع: تقييم شامل خلال أسبوع',
      helpful: 178,
      notHelpful: 9
    },
    {
      id: '15',
      category: 'payment',
      question: 'هل هناك أي مصاريف مخفية؟',
      answer: 'لا، المنصة مجانية تماماً. لا توجد أي رسوم للتسجيل أو حضور المحاضرات أو الامتحانات. حتى الشهادات مجانية!',
            helpful: 289,
      notHelpful: 11
    },
    {
      id: '16',
      category: 'payment',
      question: 'كيف يمكنني دعم المنصة إذا أردت؟',
      answer: 'نقدر رغبتك في الدعم! يمكنك:\n• نشر المنصة بين أصدقائك\n• التطوع كمعلم إذا كنت مؤهلاً\n• التبرع من خلال صفحة الدعم (اختياري تماماً)',
      helpful: 156,
      notHelpful: 5
    }
  ];

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = searchQuery === '' || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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
          <h1>مركز المساعدة</h1>
          <p>إجابات شاملة لجميع أسئلتك</p>
          
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="ابحث عن سؤال أو موضوع..."
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
                {filteredFAQs.length} نتيجة لـ &quot;{searchQuery}&quot;
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
              <h3>لم نجد أي نتائج</h3>
              <p>جرب البحث بكلمات مختلفة أو تصفح الفئات</p>
              <Link href="/contact" className={styles.contactLink}>
                أو اسألنا مباشرة ←
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
                        <p>هل كانت هذه الإجابة مفيدة؟</p>
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
          <h2>لم تجد ما تبحث عنه؟</h2>
          <p>فريق الدعم جاهز لمساعدتك</p>
          <div className={styles.helpOptions}>
            <div className={styles.helpCard}>
              <span className={styles.helpIcon}>💬</span>
              <h3>دردشة مباشرة</h3>
              <p>تحدث مع أحد ممثلي الدعم</p>
              <button className={styles.helpButton}>ابدأ المحادثة</button>
            </div>
            <div className={styles.helpCard}>
              <span className={styles.helpIcon}>📧</span>
              <h3>راسلنا</h3>
              <p>سنرد خلال 24 ساعة</p>
              <Link href="/contact" className={styles.helpButton}>
                أرسل رسالة
              </Link>
            </div>
            <div className={styles.helpCard}>
              <span className={styles.helpIcon}>📞</span>
              <h3>اتصل بنا</h3>
              <p>متاحين من 9ص - 9م</p>
              <button className={styles.helpButton}>15555</button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className={styles.popularTopics}>
        <div className={styles.topicsContainer}>
          <h2>المواضيع الأكثر بحثاً</h2>
          <div className={styles.topicsGrid}>
            <Link href="#" className={styles.topicTag}>كيفية التسجيل</Link>
            <Link href="#" className={styles.topicTag}>نظام النقاط</Link>
            <Link href="#" className={styles.topicTag}>استعادة كلمة المرور</Link>
            <Link href="#" className={styles.topicTag}>حجز المقاعد</Link>
            <Link href="#" className={styles.topicTag}>البث المباشر</Link>
            <Link href="#" className={styles.topicTag}>الامتحانات</Link>
            <Link href="#" className={styles.topicTag}>شهادات الإتمام</Link>
            <Link href="#" className={styles.topicTag}>متطلبات النظام</Link>
          </div>
        </div>
      </section>
    </div>
  );
}