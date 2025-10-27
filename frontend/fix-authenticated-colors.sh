#!/bin/bash

# Fix all hard-coded colors in container classes for authenticated pages

echo "Fixing hard-coded colors in all authenticated page CSS files..."

# List of CSS files to fix
CSS_FILES="
app/student/dashboard/StudentDashboard.module.css
app/student/profile/StudentProfile.module.css
app/student/courses/[id]/CourseView.module.css
app/student/my-courses/MyCourses.module.css
app/student/my-sessions/MySessions.module.css
app/student/payment/[courseId]/Payment.module.css
app/student/live-class/[sessionId]/LiveClass.module.css
app/teacher/dashboard/TeacherDashboard.module.css
app/teacher/profile/TeacherProfile.module.css
app/teacher/courses/[id]/CourseDetail.module.css
app/teacher/courses/create/CreateCourse.module.css
app/teacher/live-class/[sessionId]/TeacherLiveClass.module.css
app/university_student/dashboard/UniversityDashboard.module.css
app/university_student/profile/UniversityProfile.module.css
app/university_student/jobs/UniversityJobs.module.css
app/university_student/jobs/[id]/JobDetails.module.css
app/university_student/applications/MyApplications.module.css
app/company/dashboard/CompanyDashboard.module.css
app/company/profile/CompanyProfile.module.css
app/company/jobs/Jobs.module.css
app/company/jobs/new/CreateJob.module.css
app/company/applications/Applications.module.css
app/company/applications/[id]/ApplicationDetails.module.css
app/parent/profile/ParentProfile.module.css
"

for file in $CSS_FILES; do
  if [ -f "$file" ]; then
    echo "Processing: $file"

    # Replace hard-coded dark theme colors with CSS variables
    sed -i \
      -e 's/background: #0d1117/background: var(--main-color)/g' \
      -e 's/background: #161b22/background: var(--sections-color)/g' \
      -e 's/background: #0D1117/background: var(--main-color)/g' \
      -e 's/background: #161B22/background: var(--sections-color)/g' \
      -e 's/color: #c9d1d9/color: var(--main-text-white)/g' \
      -e 's/color: #f0f6fc/color: var(--main-text-white-lighter)/g' \
      -e 's/color: #8b949e/color: var(--p-text)/g' \
      -e 's/border: 1px solid #30363d/border: 1px solid var(--borders)/g' \
      -e 's/border-bottom: 1px solid #30363d/border-bottom: 1px solid var(--borders)/g' \
      -e 's/border-top: 1px solid #30363d/border-top: 1px solid var(--borders)/g' \
      -e 's/background-color: #0d1117/background-color: var(--main-color)/g' \
      -e 's/background-color: #161b22/background-color: var(--sections-color)/g' \
      -e 's/border-color: #30363d/border-color: var(--borders)/g' \
      -e 's/#30363d/var(--borders)/g' \
      -e 's/#ffc107/var(--warning)/g' \
      -e 's/#ffecb3/var(--warning-bg)/g' \
      "$file"

    echo "Completed: $file"
  else
    echo "File not found: $file"
  fi
done

echo "All authenticated page CSS files have been updated!"
