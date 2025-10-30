#!/usr/bin/env python3
"""
Comprehensive script to add i18n support to all remaining pages
"""
import os
import re
from pathlib import Path

def should_update_file(content):
    """Check if file needs updating"""
    # Skip if already has useLanguage from our hook
    if 'from "@/hooks/useLanguage"' in content or "from '@/hooks/useLanguage'" in content:
        return False
    # Update if it has Arabic text
    if re.search(r'[\u0600-\u06FF]', content):
        return True
    return False

def update_file(file_path):
    """Update a single file with i18n support"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if not should_update_file(content):
        return False

    original_content = content

    # Add "use client" if not present
    if '"use client"' not in content and "'use client'" not in content:
        # Add after any leading comments
        lines = content.split('\n')
        insert_index = 0
        for i, line in enumerate(lines):
            if line.strip() and not line.strip().startswith('//') and not line.strip().startswith('/*'):
                insert_index = i
                break
        lines.insert(insert_index, '"use client";\n')
        content = '\n'.join(lines)

    # Add import for useLanguage if not present
    if 'useLanguage' not in content:
        # Find the last import statement
        import_pattern = r'^import\s+.*?from\s+["\'].*?["\'];?\s*$'
        imports = list(re.finditer(import_pattern, content, re.MULTILINE))
        if imports:
            last_import = imports[-1]
            insert_pos = last_import.end()
            content = (
                content[:insert_pos] +
                '\nimport { useLanguage } from "@/hooks/useLanguage";' +
                content[insert_pos:]
            )

    # Add const { t } = useLanguage(); in the component
    # Find the component function
    component_pattern = r'export default function \w+\([^)]*\)\s*\{'
    match = re.search(component_pattern, content)
    if match and 'const { t } = useLanguage()' not in content:
        insert_pos = match.end()
        content = (
            content[:insert_pos] +
            '\n  const { t } = useLanguage();' +
            content[insert_pos:]
        )

    # Common Arabic text replacements
    replacements = {
        # Common UI
        'تحميل': 'common.loading',
        'حفظ': 'common.save',
        'إلغاء': 'common.cancel',
        'حذف': 'common.delete',
        'تعديل': 'common.edit',
        'إرسال': 'common.submit',
        'بحث': 'common.search',
        'تأكيد': 'common.confirm',
        'رجوع': 'common.back',
        'التالي': 'common.next',
        'السابق': 'common.previous',
        'إغلاق': 'common.close',
        'عرض': 'common.view',
        'التفاصيل': 'common.details',
        'المزيد': 'common.more',
        'الكل': 'common.all',
        'نشط': 'common.active',
        'الاسم': 'common.name',
        'البريد الإلكتروني': 'common.email',
        'رقم الهاتف': 'common.phone',
        'العنوان': 'common.address',
        'التاريخ': 'common.date',
        'الوقت': 'common.time',
        'الوصف': 'common.description',
        'رفع': 'common.upload',
        'تحديث': 'common.update',
        'إضافة': 'common.add',
        'إزالة': 'common.remove',

        # Profile
        'الملف الشخصي': 'common.profile',
        'تسجيل الخروج': 'common.logout',
        'لوحة التحكم': 'common.dashboard',
        'الإعدادات': 'common.settings',
        'الإشعارات': 'common.notifications',

        # Student
        'الطالب': 'auth.student',
        'الطلاب': 'teacher.students',
        'كورساتي': 'student.myCourses',
        'دوراتي': 'student.myCourses',
        'الكورسات': 'student.myCourses',
        'الدورات': 'student.myCourses',
        'التقدم': 'student.myProgress',
        'جلساتي': 'student.mySessions',
        'الجلسات': 'student.mySessions',
        'تسجيل الآن': 'landing.registerNow',
        'استكمل المشاهدة': 'student.continueWatching',
        'ابدأ الدورة': 'student.startCourse',
        'عرض الدورة': 'student.viewCourse',

        # Teacher
        'المحاضر': 'auth.teacher',
        'المحاضرين': 'landing.teachers',
        'إنشاء دورة جديدة': 'teacher.createCourse',
        'إنشاء كورس جديد': 'teacher.createCourse',
        'الأرباح': 'teacher.earnings',
        'الإحصائيات': 'teacher.statistics',
        'الجدول': 'landing.schedule',

        # Company
        'الشركة': 'auth.company',
        'الوظائف': 'company.myJobs',
        'الطلبات': 'company.applications',
        'نشر وظيفة': 'company.postJob',
        'إنشاء وظيفة': 'company.postJob',

        # General
        'مرحباً': 'common.welcome',
        'مرحبا': 'common.welcome',
        'نعم': 'common.yes',
        'لا': 'common.no',
        'خطأ': 'common.error',
        'نجح': 'common.success',
    }

    # Only replace in specific contexts (JSX text, attributes)
    for arabic, key in replacements.items():
        # Replace in JSX text nodes: >text<
        pattern1 = f'>{re.escape(arabic)}<'
        replacement1 = f'>{{t("{key}")}}<'
        content = re.sub(pattern1, replacement1, content)

        # Replace in string literals: "text" or 'text' but be careful
        pattern2 = f'"{re.escape(arabic)}"'
        replacement2 = f'{{t("{key}")}}'
        # Only replace if it's likely a UI string (not in comments or imports)
        if '>' in content.split(pattern2)[0][-50:]:  # Check context
            content = re.sub(pattern2, replacement2, content)

    # Write back if changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    base_path = Path('/home/user/ACE/frontend/app')

    # Find all page.tsx files in user-specific directories
    patterns = [
        'student/**/page.tsx',
        'teacher/**/page.tsx',
        'company/**/page.tsx',
        'university_student/**/page.tsx',
        'parent/**/page.tsx',
    ]

    updated_files = []
    skipped_files = []

    for pattern in patterns:
        for file_path in base_path.glob(pattern):
            try:
                if update_file(file_path):
                    updated_files.append(str(file_path.relative_to(base_path.parent)))
                    print(f"✓ Updated: {file_path.relative_to(base_path.parent)}")
                else:
                    skipped_files.append(str(file_path.relative_to(base_path.parent)))
                    print(f"- Skipped: {file_path.relative_to(base_path.parent)}")
            except Exception as e:
                print(f"✗ Error updating {file_path}: {e}")

    print(f"\n\nSummary:")
    print(f"Updated: {len(updated_files)} files")
    print(f"Skipped: {len(skipped_files)} files")

    if updated_files:
        print("\nUpdated files:")
        for f in updated_files:
            print(f"  - {f}")

if __name__ == '__main__':
    main()
