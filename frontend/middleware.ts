import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const userType = request.cookies.get("userType")?.value;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = {
    student: ["/student"],
    university_student: ["/university_student"],
    teacher: ["/teacher"],
    parent: ["/parent"],
    company: ["/company"],
    admin: ["/admin"],
  };

  const authRoutes = ["/login", "/signup", "/forgot-password"];

  const isDashboard = pathname === "/dashboard";

  const isProtectedRoute = Object.values(protectedRoutes).some((routes) =>
    routes.some((route) => pathname.startsWith(route))
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (pathname === "/verifyEmail") {
    return NextResponse.next();
  }

  if (pathname === "/company/register") {
  return NextResponse.next();
}

  if ((isProtectedRoute || isDashboard) && !token) {
    const loginUrl = new URL("/login", request.url);
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

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (isProtectedRoute && token && userType) {
    for (const [type, routes] of Object.entries(protectedRoutes)) {
      if (routes.some((route) => pathname.startsWith(route))) {
        if (userType !== type) {
          return NextResponse.redirect(
            new URL(getDashboardPath(userType), request.url)
          );
        }
      }
    }
  }

  if (isAuthRoute && token && userType) {
    return NextResponse.redirect(
      new URL(getDashboardPath(userType), request.url)
    );
  }

  return NextResponse.next();
}

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
  ],
};
