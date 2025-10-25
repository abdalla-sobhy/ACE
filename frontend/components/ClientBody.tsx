"use client";

import { ReactNode, useEffect } from "react";
import { useLocale } from "@/hooks/useTranslations";

interface ClientBodyProps {
  children: ReactNode;
  className: string;
}

export default function ClientBody({ children, className }: ClientBodyProps) {
  const locale = useLocale();

  useEffect(() => {
    // Set the document direction and language
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;

    // Store locale in localStorage for persistence
    if (typeof window !== 'undefined') {
      const storedLocale = localStorage.getItem('locale');
      if (!storedLocale) {
        localStorage.setItem('locale', locale);
      }
    }
  }, [locale]);

  return (
    <body className={className} suppressHydrationWarning>
      {children}
    </body>
  );
}