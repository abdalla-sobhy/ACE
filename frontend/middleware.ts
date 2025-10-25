import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export function middleware(request: NextRequest) {
  // First, handle i18n routing
  const response = intlMiddleware(request);

  // Check if the response is a redirect; if so, return it immediately
  if (response && (response.status === 307 || response.status === 308 || response.status === 302)) {
    return response;
  }

  // Then apply auth logic
  const token = request.cookies.get("authToken")?.value;
  const userType = request.cookies.get("userType")?.value;
  const pathname = request.nextUrl.pathname;

  // Extract locale and pathname without locale
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
  const localeMatch = pathname.match(/^\/(en|ar)/);
  const currentLocale = localeMatch ? localeMatch[1] : defaultLocale;

  const protectedRoutes = {
    student: ["/student"],
    university_student: ["/university_student"],
    teacher: ["/teacher"],
    parent: ["/parent"],
    company: ["/company"],
    admin: ["/admin"],
  };

  const authRoutes = ["/login", "/signup", "/forgot-password"];

  const isDashboard = pathnameWithoutLocale === "/dashboard";

  const isProtectedRoute = Object.values(protectedRoutes).some((routes) =>
    routes.some((route) => pathnameWithoutLocale.startsWith(route))
  );

  const isAuthRoute = authRoutes.some((route) => pathnameWithoutLocale.startsWith(route));

  // Allow verifyEmail without redirects
  if (pathnameWithoutLocale === "/verifyEmail") {
    return response;
  }

  if ((isProtectedRoute || isDashboard) && !token) {
    const loginUrl = new URL(`/${currentLocale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isDashboard && token && userType) {
    let redirectPath = "/";

    switch (userType) {
      case "student":
        redirectPath = "/student/dashboard";
        break;
      case "university_student":
        redirectPath = "/university_student/dashboard";
        break;
      case "teacher":
        redirectPath = "/teacher/dashboard";
        break;
      case "parent":
        redirectPath = "/parent/dashboard";
        break;
      case "company":
        redirectPath = "/company/dashboard";
        break;
      case "admin":
        redirectPath = "/admin/dashboard";
        break;
    }

    return NextResponse.redirect(new URL(`/${currentLocale}${redirectPath}`, request.url));
  }

  if (isProtectedRoute && token && userType) {
    for (const [type, routes] of Object.entries(protectedRoutes)) {
      if (routes.some((route) => pathnameWithoutLocale.startsWith(route))) {
        if (userType !== type) {
          return NextResponse.redirect(
            new URL(`/${currentLocale}${getDashboardPath(userType)}`, request.url)
          );
        }
      }
    }
  }

  if (isAuthRoute && token && userType) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}${getDashboardPath(userType)}`, request.url)
    );
  }

  return response;
}

export default middleware;

function getDashboardPath(userType: string): string {
  switch (userType) {
    case "student":
      return "/student/dashboard";
    case "university_student":
      return "/university_student/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "parent":
      return "/parent/dashboard";
    case "company":
      return "/company/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

export const config = {
  matcher: [
    '/',
    '/(ar|en)/:path*',
    "/dashboard",
    "/student/:path*",
    "/university_student/:path*",
    "/company/:path*",
    "/teacher/:path*",
    "/parent/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/verifyEmail",
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ],
};
