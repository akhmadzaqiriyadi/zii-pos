import { describe, expect, it } from "bun:test";
import { evaluateTrialGuard } from "../trial-guard";

describe("Trial Period Expiry Guard Middleware Unit Tests", () => {
  const dummyToken = "jwt.valid.token";

  it("should allow active or trial tenants to access POS and operational routes", () => {
    // Active tenant
    const activePos = evaluateTrialGuard("/pos", dummyToken, "active");
    expect(activePos.allowed).toBe(true);

    const activeProducts = evaluateTrialGuard(
      "/products",
      dummyToken,
      "active",
    );
    expect(activeProducts.allowed).toBe(true);

    const activeTransactions = evaluateTrialGuard(
      "/transactions",
      dummyToken,
      "active",
    );
    expect(activeTransactions.allowed).toBe(true);

    // Trial tenant
    const trialPos = evaluateTrialGuard("/pos", dummyToken, "trial");
    expect(trialPos.allowed).toBe(true);

    const trialProducts = evaluateTrialGuard("/products", dummyToken, "trial");
    expect(trialProducts.allowed).toBe(true);
  });

  it("should block expired tenants from POS and redirect to settings alert", () => {
    const expiredPos = evaluateTrialGuard("/pos", dummyToken, "expired");
    expect(expiredPos.allowed).toBe(false);
    expect(expiredPos.redirectTo).toBe("/settings?alert=license_expired");
    expect(expiredPos.reason).toBe("license_expired");

    const expiredProducts = evaluateTrialGuard(
      "/products",
      dummyToken,
      "expired",
    );
    expect(expiredProducts.allowed).toBe(false);
    expect(expiredProducts.redirectTo).toBe("/settings?alert=license_expired");

    const expiredTransactions = evaluateTrialGuard(
      "/transactions",
      dummyToken,
      "expired",
    );
    expect(expiredTransactions.allowed).toBe(false);
    expect(expiredTransactions.redirectTo).toBe(
      "/settings?alert=license_expired",
    );
  });

  it("should block suspended tenants from POS and redirect to settings alert", () => {
    const suspendedPos = evaluateTrialGuard("/pos", dummyToken, "suspended");
    expect(suspendedPos.allowed).toBe(false);
    expect(suspendedPos.redirectTo).toBe("/settings?alert=license_expired");
    expect(suspendedPos.reason).toBe("license_expired");
  });

  it("should allow expired tenants to access settings page to renew license", () => {
    const expiredSettings = evaluateTrialGuard(
      "/settings",
      dummyToken,
      "expired",
    );
    expect(expiredSettings.allowed).toBe(true);

    const expiredBilling = evaluateTrialGuard(
      "/settings/billing",
      dummyToken,
      "expired",
    );
    expect(expiredBilling.allowed).toBe(true);
  });

  it("should redirect unauthenticated users to login", () => {
    const noAuthPos = evaluateTrialGuard("/pos", null, "active");
    expect(noAuthPos.allowed).toBe(false);
    expect(noAuthPos.redirectTo).toBe("/login");
    expect(noAuthPos.reason).toBe("unauthenticated");
  });

  it("should redirect authenticated active users away from login/register to /pos", () => {
    const authLogin = evaluateTrialGuard("/login", dummyToken, "active");
    expect(authLogin.allowed).toBe(false);
    expect(authLogin.redirectTo).toBe("/pos");
    expect(authLogin.reason).toBe("already_authenticated");
  });

  it("should redirect authenticated expired users away from login/register to settings alert", () => {
    const authLoginExpired = evaluateTrialGuard(
      "/login",
      dummyToken,
      "expired",
    );
    expect(authLoginExpired.allowed).toBe(false);
    expect(authLoginExpired.redirectTo).toBe("/settings?alert=license_expired");
  });
});
