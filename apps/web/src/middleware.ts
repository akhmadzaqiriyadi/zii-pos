import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { extractSubdomain } from "./lib/subdomain";
import { evaluateTrialGuard } from "./lib/trial-guard";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const subdomain = extractSubdomain(host);
  const token = request.cookies.get("zii_auth_token")?.value;
  const tenantStatus = request.cookies.get("zii_tenant_status")?.value;
  const hasRegistered = request.cookies.get("zii_has_registered")?.value;
  const { pathname } = request.nextUrl;

  // Clone request headers to inject tenant subdomain metadata
  const requestHeaders = new Headers(request.headers);
  if (subdomain) {
    requestHeaders.set("x-tenant-subdomain", subdomain);
  }

  // 1. Redirect legacy /register route to /onboarding
  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 2. Route landing "/" based on user state
  if (pathname === "/") {
    if (token) {
      const isExpired =
        tenantStatus === "expired" || tenantStatus === "suspended";
      return NextResponse.redirect(
        new URL(
          isExpired ? "/settings?alert=license_expired" : "/pos",
          request.url,
        ),
      );
    }
    if (hasRegistered) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 3. Evaluate authentication & trial expiration guard
  const guard = evaluateTrialGuard(pathname, token, tenantStatus);

  if (!guard.allowed && guard.redirectTo) {
    const redirectUrl = new URL(guard.redirectTo, request.url);
    const response = NextResponse.redirect(redirectUrl);
    if (subdomain) {
      response.headers.set("x-tenant-subdomain", subdomain);
    }
    return response;
  }

  // 4. Pass-through with injected headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (subdomain) {
    response.headers.set("x-tenant-subdomain", subdomain);
  }

  return response;
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
