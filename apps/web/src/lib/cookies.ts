/**
 * Client-side utility functions to read, write, and delete cookies with dynamic subdomain support.
 */

/**
 * Resolves the cookie domain scope.
 * In production (*.ziipos.com), returns ".ziipos.com" for cross-subdomain sharing.
 * In local development (localhost / 127.0.0.1), returns undefined (host-only cookie).
 */
export function getCookieDomain(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const hostname = window.location.hostname;

  if (hostname.endsWith("ziipos.com")) {
    return ".ziipos.com";
  }

  return undefined;
}

export function setCookie(
  name: string,
  value: string,
  days = 7,
  customDomain?: string,
) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const domain = customDomain ?? getCookieDomain();
  const domainAttribute = domain ? `;domain=${domain}` : "";
  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const secureAttribute = isSecure ? ";Secure" : "";

  document.cookie = `${name}=${encodeURIComponent(
    value,
  )};expires=${expires.toUTCString()};path=/${domainAttribute};SameSite=Lax${secureAttribute}`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

export function deleteCookie(name: string, customDomain?: string) {
  if (typeof document === "undefined") return;
  const domain = customDomain ?? getCookieDomain();
  const domainAttribute = domain ? `;domain=${domain}` : "";

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/${domainAttribute};SameSite=Lax`;
}
