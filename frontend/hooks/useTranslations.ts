"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import arTranslations from "@/messages/ar.json";
import enTranslations from "@/messages/en.json";

type Translations = typeof arTranslations;
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationKey = NestedKeyOf<Translations>;

export function useTranslations() {
  const pathname = usePathname();

  // Determine locale from pathname or default to 'ar'
  const locale = pathname?.startsWith('/en') ? 'en' : 'ar';

  const messages = useMemo(() => {
    return locale === 'en' ? enTranslations : arTranslations;
  }, [locale]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters in the translation
    if (params) {
      return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
        return str.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      }, value);
    }

    return value;
  };

  return { t, locale };
}

export function useLocale() {
  const pathname = usePathname();
  return pathname?.startsWith('/en') ? 'en' : 'ar';
}
