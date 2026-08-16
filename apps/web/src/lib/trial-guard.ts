/**
 * Helper utility to determine access control based on SaaS Tenant Subscription / Trial Status.
 */

export type TenantSubscriptionStatus =
  | "trial"
  | "active"
  | "expired"
  | "suspended"
  | string;

export interface TrialGuardResult {
  allowed: boolean;
  redirectTo?: string;
  reason?: "unauthenticated" | "license_expired" | "already_authenticated";
}

/**
 * Evaluates whether a request should be allowed or redirected based on auth token, status, and path.
 */
export function evaluateTrialGuard(
  pathname: string,
  token: string | null | undefined,
  tenantStatus: TenantSubscriptionStatus | null | undefined,
): TrialGuardResult {
  const isProtectedRoute =
    pathname.startsWith("/pos") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/saas-admin");

  const isOperationalRoute =
    pathname.startsWith("/pos") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/transactions");

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/onboarding";


  // 1. Unauthenticated users trying to access protected routes
  if (isProtectedRoute && !token) {
    return {
      allowed: false,
      redirectTo: "/login",
      reason: "unauthenticated",
    };
  }

  // 2. Authenticated users trying to access login/register
  if (isAuthRoute && token) {
    const isExpired =
      tenantStatus === "expired" || tenantStatus === "suspended";
    return {
      allowed: false,
      redirectTo: isExpired ? "/settings?alert=license_expired" : "/pos",
      reason: "already_authenticated",
    };
  }

  // 3. Operational routes (POS / Products / Transactions) guarded against expired or suspended licenses
  if (
    token &&
    isOperationalRoute &&
    (tenantStatus === "expired" || tenantStatus === "suspended")
  ) {
    return {
      allowed: false,
      redirectTo: "/settings?alert=license_expired",
      reason: "license_expired",
    };
  }

  return {
    allowed: true,
  };
}
