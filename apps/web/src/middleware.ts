import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { extractSubdomain } from "./lib/subdomain";
import { evaluateTrialGuard } from "./lib/trial-guard";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const subdomain = extractSubdomain(host);
  const token = request.cookies.get("zii_auth_token")?.value;
  const tenantStatus = request.cookies.get("zii_tenant_status")?.value;
  const tenantSubdomainCookie = request.cookies.get(
    "zii_tenant_subdomain",
  )?.value;
  const hasRegistered = request.cookies.get("zii_has_registered")?.value;
  const { pathname } = request.nextUrl;

  // Clone request headers to inject tenant subdomain metadata
  const requestHeaders = new Headers(request.headers);
  if (subdomain) {
    requestHeaders.set("x-tenant-subdomain", subdomain);
  }

  // 1. Redirect legacy /register route to /onboarding
  if (pathname === "/register") {
    if (subdomain) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 2. Handle /onboarding route
  if (pathname === "/onboarding") {
    if (subdomain) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // 3. Route landing "/" based on tenant subdomain and auth state
  if (pathname === "/") {
    // If accessing a specific merchant subdomain (e.g. ziidistro.localhost:3000), redirect to POS or login
    if (subdomain) {
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
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // On root domain (e.g. localhost:3000 or ziipos.com), show the Public Landing Page
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    return response;
  }

  // 4. Auto-redirect authenticated merchant users on root domain to their dedicated tenant subdomain (except /login)
  if (
    token &&
    !subdomain &&
    tenantSubdomainCookie &&
    tenantSubdomainCookie !== "localhost" &&
    pathname !== "/login" &&
    (pathname.startsWith("/pos") ||
      pathname.startsWith("/products") ||
      pathname.startsWith("/transactions") ||
      pathname.startsWith("/settings"))
  ) {
    const isLocal = host?.includes("localhost");
    const port = host?.includes(":") ? `:${host.split(":")[1]}` : "";
    const redirectHostname = isLocal
      ? `${tenantSubdomainCookie}.localhost${port}`
      : `${tenantSubdomainCookie}.ziipos.com`;
    const protocol = request.nextUrl.protocol;
    return NextResponse.redirect(
      new URL(
        `${protocol}//${redirectHostname}${pathname}${request.nextUrl.search}`,
      ),
    );
  }

  // 5. Evaluate authentication & trial expiration guard (allow /login so users can switch accounts)
  if (pathname !== "/login") {
    const guard = evaluateTrialGuard(pathname, token, tenantStatus);

    if (!guard.allowed && guard.redirectTo) {
      const redirectUrl = new URL(guard.redirectTo, request.url);
      const response = NextResponse.redirect(redirectUrl);
      if (subdomain) {
        response.headers.set("x-tenant-subdomain", subdomain);
      }
      return response;
    }
  }

  // 6. Pass-through with injected headers
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
