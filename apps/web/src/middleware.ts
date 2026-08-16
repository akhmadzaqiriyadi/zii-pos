import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("zii_auth_token")?.value;
  const hasRegistered = request.cookies.get("zii_has_registered")?.value;
  const { pathname } = request.nextUrl;

  // 1. Redirect legacy /register route to /onboarding
  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 2. Route landing "/" based on user state
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/pos", request.url));
    }
    if (hasRegistered) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Paths requiring authentication
  const isProtectedRoute =
    pathname === "/pos" || pathname.startsWith("/pos/") ||
    pathname === "/products" || pathname.startsWith("/products/") ||
    pathname === "/settings" || pathname.startsWith("/settings/") ||
    pathname === "/transactions" || pathname.startsWith("/transactions/") ||
    pathname === "/saas-admin" || pathname.startsWith("/saas-admin/");

  // Authentication paths (guest only)
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/onboarding";

  if (isProtectedRoute && !token) {
    // Redirect unauthenticated users to the login page
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    // Redirect authenticated users trying to access login/onboarding to /pos
    return NextResponse.redirect(new URL("/pos", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/pos",
    "/pos/:path*",
    "/products",
    "/products/:path*",
    "/settings",
    "/settings/:path*",
    "/transactions",
    "/transactions/:path*",
    "/saas-admin",
    "/saas-admin/:path*",
    "/login",
    "/register",
    "/onboarding",
  ],
};
