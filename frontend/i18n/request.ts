import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'ar' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` needs to be awaited in Next.js 15
  const locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  const validatedLocale = locale as Locale;
  if (!locales.includes(validatedLocale)) notFound();

  return {
    locale: validatedLocale,
    messages: (await import(`../messages/${validatedLocale}.json`)).default
  };
});
