#!/bin/bash

# Fix job details page
sed -i 's|<p>t("|<p>{t("|g' /home/user/ACE/frontend/app/university_student/jobs/\[id\]/page.tsx
sed -i 's|<h2>t("|<h2>{t("|g' /home/user/ACE/frontend/app/university_student/jobs/\[id\]/page.tsx
sed -i 's|<h3>t("|<h3>{t("|g' /home/user/ACE/frontend/app/university_student/jobs/\[id\]/page.tsx
sed -i 's|<h4>t("|<h4>{t("|g' /home/user/ACE/frontend/app/university_student/jobs/\[id\]/page.tsx
sed -i 's|<span>t("|<span>{t("|g' /home/user/ACE/frontend/app/university_student/jobs/\[id\]/page.tsx
sed -i 's|")</p>|")}</p>|g' /home/user/ACE/frontend/app/university_student/jobs/\[id\]/page.tsx
sed -i 's|")</h2>|")}</h2>|g' /home/user/ACE/frontend/app/university_student/jobs/\[id\]/page.tsx
sed -i 's|")</h3>|")}</h3>|g' /home/user/ACE/frontend/app/university_student/jobs/\[id\]/page.tsx
sed -i 's|")</h4>|")}</h4>|g' /home/user/ACE/frontend/app/university_student/jobs/\[id\]/page.tsx
sed -i 's|")</span>|")}</span>|g' /home/user/ACE/frontend/app/university_student/jobs/\[id\]/page.tsx
sed -i 's|> t("|> {t("|g' /home/user/ACE/frontend/app/university_student/jobs/\[id\]/page.tsx
sed -i 's|") </|")} </|g' /home/user/ACE/frontend/app/university_student/jobs/\[id\]/page.tsx

# Fix profile page
sed -i 's|<p>t("|<p>{t("|g' /home/user/ACE/frontend/app/university_student/profile/page.tsx
sed -i 's|<h2>t("|<h2>{t("|g' /home/user/ACE/frontend/app/university_student/profile/page.tsx
sed -i 's|<h3>t("|<h3>{t("|g' /home/user/ACE/frontend/app/university_student/profile/page.tsx
sed -i 's|<h4>t("|<h4>{t("|g' /home/user/ACE/frontend/app/university_student/profile/page.tsx
sed -i 's|")</p>|")}</p>|g' /home/user/ACE/frontend/app/university_student/profile/page.tsx
sed -i 's|")</h2>|")}</h2>|g' /home/user/ACE/frontend/app/university_student/profile/page.tsx
sed -i 's|")</h3>|")}</h3>|g' /home/user/ACE/frontend/app/university_student/profile/page.tsx
sed -i 's|")</h4>|")}</h4>|g' /home/user/ACE/frontend/app/university_student/profile/page.tsx
sed -i 's|> t("|> {t("|g' /home/user/ACE/frontend/app/university_student/profile/page.tsx
sed -i 's|") </|")} </|g' /home/user/ACE/frontend/app/university_student/profile/page.tsx
sed -i 's| t("| {t("|g' /home/user/ACE/frontend/app/university_student/profile/page.tsx
sed -i 's|")$|")}|g' /home/user/ACE/frontend/app/university_student/profile/page.tsx

echo "JSX translation fixes applied!"
