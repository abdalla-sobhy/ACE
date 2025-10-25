// Locale configuration for the application
export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'ar' as const;

export type Locale = (typeof locales)[number];
