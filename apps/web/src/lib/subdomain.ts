/**
 * Subdomain Utility for Multi-Tenant ZII POS
 * Extracts and normalizes tenant subdomains from incoming request hostnames.
 */

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "api",
  "admin",
  "saas-admin",
  "mail",
  "static",
  "assets",
]);

/**
 * Extracts the tenant subdomain from a hostname or host header.
 *
 * Supported formats:
 * - "distro.ziipos.com" -> "distro"
 * - "distro.localhost:3000" -> "distro"
 * - "distro.localhost" -> "distro"
 * - "ziipos.com" / "localhost:3000" / "127.0.0.1:3000" -> null
 * - "www.ziipos.com" / "app.ziipos.com" -> null (reserved)
 */
export function extractSubdomain(
  hostHeader: string | null | undefined,
): string | null {
  if (!hostHeader) return null;

  // Clean host (strip port and trim)
  const host = hostHeader.split(":")[0].trim().toLowerCase();

  // IP addresses or plain localhost have no subdomain
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(host)
  ) {
    return null;
  }

  // Localhost multi-subdomain: e.g. "distro.localhost"
  if (host.endsWith(".localhost")) {
    const parts = host.replace(".localhost", "").split(".");
    const subdomain = parts[parts.length - 1];
    return subdomain && !RESERVED_SUBDOMAINS.has(subdomain) ? subdomain : null;
  }

  // Standard domain parts: e.g. "distro.ziipos.com"
  const parts = host.split(".");
  if (parts.length >= 3) {
    const subdomain = parts[0];
    if (subdomain && !RESERVED_SUBDOMAINS.has(subdomain)) {
      return subdomain;
    }
  }

  return null;
}

/**
 * Helper to check if the current host is a custom tenant subdomain.
 */
export function isTenantSubdomain(
  hostHeader: string | null | undefined,
): boolean {
  return extractSubdomain(hostHeader) !== null;
}
