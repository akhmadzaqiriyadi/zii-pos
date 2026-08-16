import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("zii_auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Paths requiring authentication
  const isProtectedRoute =
    pathname === "/pos" || pathname.startsWith("/pos/") ||
    pathname === "/products" || pathname.startsWith("/products/") ||
    pathname === "/settings" || pathname.startsWith("/settings/") ||
    pathname === "/transactions" || pathname.startsWith("/transactions/");

  // Authentication paths (guest only)
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/onboarding";

  if (isProtectedRoute && !token) {
    // Redirect unauthenticated users to the login page
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    // Redirect authenticated users trying to access login/register/onboarding to /pos
    return NextResponse.redirect(new URL("/pos", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pos",
    "/pos/:path*",
    "/products",
    "/products/:path*",
    "/settings",
    "/settings/:path*",
    "/transactions",
    "/transactions/:path*",
    "/login",
    "/register",
    "/onboarding",
  ],
};
