import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("zii_auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Paths requiring authentication
  const isProtectedRoute =
    pathname.startsWith("/pos") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/settings");

  // Authentication paths (guest only)
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (isProtectedRoute && !token) {
    // Redirect unauthenticated users to the login page
    const loginUrl = new URL("/login", request.url);
    // Keep target url in redirect for user convenience (optional)
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    // Redirect authenticated users trying to access login/register to /pos
    return NextResponse.redirect(new URL("/pos", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pos/:path*",
    "/products/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
