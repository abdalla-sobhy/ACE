import { NextResponse } from 'next/server';
import { isEgyptianAcademicDomain, normalizeDomain } from '@/utils/egyptianAcademicDomains';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { 
          valid: false, 
          isAcademic: false, 
          institutionName: '', 
          message: 'البريد الإلكتروني مطلوب' 
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        valid: false,
        isAcademic: false,
        institutionName: '',
        message: 'صيغة البريد الإلكتروني غير صحيحة'
      });
    }

    const domain = normalizeDomain(email);
    
    if (isEgyptianAcademicDomain(email)) {
      const domainToInstitution: Record<string, string> = {
        'cu.edu.eg': 'جامعة القاهرة',
        'alexu.edu.eg': 'جامعة الإسكندرية',
        'aun.edu.eg': 'جامعة أسيوط',
        'mans.edu.eg': 'جامعة المنصورة',
        'zu.edu.eg': 'جامعة الزقازيق',
        'tanta.edu.eg': 'جامعة طنطا',
        'helwan.edu.eg': 'جامعة حلوان',
        'bsu.edu.eg': 'جامعة بني سويف',
        'fayoum.edu.eg': 'جامعة الفيوم',
        'bu.edu.eg': 'جامعة بنها',
        'menofia.edu.eg': 'جامعة المنوفية',
        'suez.edu.eg': 'جامعة السويس',
        'svu.edu.eg': 'جامعة جنوب الوادي',
        'aswu.edu.eg': 'جامعة أسوان',
        'du.edu.eg': 'جامعة دمياط',
        'psu.edu.eg': 'جامعة بورسعيد',
        'azhar.edu.eg': 'جامعة الأزهر',
        'asu.edu.eg': 'جامعة عين شمس',
        'suezcanal.edu.eg': 'جامعة قناة السويس',
        'minia.edu.eg': 'جامعة المنيا',
        'kafr-elsheikh.edu.eg': 'جامعة كفر الشيخ',
        'sohag.edu.eg': 'جامعة سوهاج',
        'dmu.edu.eg': 'جامعة دمنهور',
        'aucegypt.edu': 'الجامعة الأمريكية بالقاهرة',
        'guc.edu.eg': 'الجامعة الألمانية بالقاهرة',
        'bue.edu.eg': 'الجامعة البريطانية في مصر',
        'fue.edu.eg': 'جامعة المستقبل',
        'msa.edu.eg': 'جامعة أكتوبر للعلوم الحديثة والآداب',
        'o6u.edu.eg': 'جامعة 6 أكتوبر',
        'miu.edu.eg': 'جامعة مصر الدولية',
        'must.edu.eg': 'جامعة مصر للعلوم والتكنولوجيا',
        'nu.edu.eg': 'جامعة النيل',
        'aast.edu': 'الأكاديمية العربية للعلوم والتكنولوجيا',
        'pua.edu.eg': 'جامعة فاروس بالإسكندرية',
        'eur.edu.eg': 'الجامعة المصرية الروسية',
        'eui.edu.eg': 'الجامعة المصرية للمعلوماتية',
        'hcu.edu.eg': 'جامعة حورس',
        'bau.edu.eg': 'جامعة بدر',
        'su.edu.eg': 'جامعة سيناء',
        'ngu.edu.eg': 'جامعة نيو جيزة',
        'ufe.edu.eg': 'الجامعة الفرنسية في مصر',
        'hu.edu.eg': 'جامعة هليوبوليس',
        'mu.edu.eg': 'جامعة ميريت',
        'hti.edu.eg': 'المعهد العالي للتكنولوجيا',
        'aiet.edu.eg': 'معهد الإسكندرية للهندسة والتكنولوجيا',
        'bhit.bu.edu.eg': 'معهد بنها العالي للتكنولوجيا',
        'nrc.sci.eg': 'المركز القومي للبحوث',
        'sti.sci.eg': 'معهد العلوم والتكنولوجيا',
      };

      let institutionName = '';
      for (const [academicDomain, name] of Object.entries(domainToInstitution)) {
        if (domain === academicDomain || domain.endsWith(`.${academicDomain}`)) {
          institutionName = name;
          break;
        }
      }

      if (!institutionName) {
        institutionName = 'مؤسسة تعليمية مصرية';
      }

      const laravelApiUrl = process.env.LARAVEL_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      console.log('Attempting to send OTP to:', `${laravelApiUrl}/api/send-otp`);
      console.log('Request data:', { email, institution_name: institutionName });

      // Send OTP to Laravel backend
      try {
        const response = await fetch(`${laravelApiUrl}/api/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email,
            institution_name: institutionName,
          }),
        });

        console.log('Laravel response status:', response.status);
        
        const responseText = await response.text();
        console.log('Laravel response:', responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch {
          console.error('Failed to parse Laravel response as JSON:', responseText);
          return NextResponse.json({
            valid: false,
            isAcademic: true,
            isEgyptian: true,
            institutionName,
            message: 'خطأ في الاستجابة من الخادم'
          }, { status: 500 });
        }

        if (!response.ok) {
          console.error('Laravel API error:', response.status, data);
          
          return NextResponse.json({
            valid: false,
            isAcademic: true,
            isEgyptian: true,
            institutionName,
            message: data.message || 'فشل في إرسال رمز التحقق - خطأ في الخادم'
          }, { status: 500 });
        }

        if (data.success) {
          return NextResponse.json({
            valid: true,
            isAcademic: true,
            isEgyptian: true,
            institutionName,
            requiresOtp: true,
            message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'
          });
        } else {
          return NextResponse.json({
            valid: false,
            isAcademic: true,
            isEgyptian: true,
            institutionName,
            message: data.message || 'فشل في إرسال رمز التحقق'
          }, { status: 500 });
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
          return NextResponse.json({
            valid: false,
            isAcademic: true,
            isEgyptian: true,
            institutionName,
            message: 'لا يمكن الاتصال بخادم التحقق'
          }, { status: 500 });
        }
        
        return NextResponse.json({
          valid: false,
          isAcademic: true,
          isEgyptian: true,
          institutionName,
          message: 'حدث خطأ في إرسال رمز التحقق'
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      valid: false,
      isAcademic: false,
      isEgyptian: false,
      institutionName: '',
      message: 'يجب استخدام بريد إلكتروني من جامعة مصرية معتمدة'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { 
        valid: false, 
        isAcademic: false, 
        institutionName: '', 
        message: 'حدث خطأ في التحقق من البريد الإلكتروني' 
      },
      { status: 500 }
    );
  }
}