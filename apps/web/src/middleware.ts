import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { extractSubdomain } from "./lib/subdomain";
import { evaluateTrialGuard } from "./lib/trial-guard";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const subdomain = extractSubdomain(host);
  const token = request.cookies.get("zii_auth_token")?.value;
  const tenantStatus = request.cookies.get("zii_tenant_status")?.value;
  const { pathname } = request.nextUrl;

  // Clone request headers to inject tenant subdomain metadata
  const requestHeaders = new Headers(request.headers);
  if (subdomain) {
    requestHeaders.set("x-tenant-subdomain", subdomain);
  }

  // Evaluate authentication & trial expiration guard
  const guard = evaluateTrialGuard(pathname, token, tenantStatus);

  if (!guard.allowed && guard.redirectTo) {
    const redirectUrl = new URL(guard.redirectTo, request.url);
    const response = NextResponse.redirect(redirectUrl);
    if (subdomain) {
      response.headers.set("x-tenant-subdomain", subdomain);
    }
    return response;
  }

  // Pass-through with injected headers
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
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
