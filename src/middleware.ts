import { NextRequest, NextResponse } from "next/server";

import { appRoutes } from "@/lib/constants";

function isExactRoute(pathname: string, route: string) {
  return pathname === route;
}

function isProtectedPath(pathname: string) {
  return appRoutes.protectedRoutes.some((route) => pathname.startsWith(route));
}

function isSharedPath(pathname: string) {
  return appRoutes.sharedRoutes.some((route) => isExactRoute(pathname, route));
}

function isPublicPath(pathname: string) {
  return appRoutes.publicRoutes.some((route) => isExactRoute(pathname, route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies.has("__session");

  // Shared routes are always accessible.
  if (isSharedPath(pathname)) {
    return NextResponse.next();
  }

  // Hint-based UX redirects. Real authorization remains in API Bearer checks and client guards.
  if (isPublicPath(pathname) && hasSessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedPath(pathname) && !hasSessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
