import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to protect routes
 * Add this to middleware.ts to protect specific pages
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of protected routes
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  // Check if the current route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    // You could add logic here to check if user is authenticated
    // For now, this is just a template
    console.log(`Protected route accessed: ${pathname}`);
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
