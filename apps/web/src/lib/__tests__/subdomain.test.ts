import { describe, expect, it } from "bun:test";
import { extractSubdomain, isTenantSubdomain } from "../subdomain";

describe("Subdomain Utility Unit Tests", () => {
  it("should extract tenant subdomain from multi-tenant localhost", () => {
    expect(extractSubdomain("distro.localhost:3000")).toBe("distro");
    expect(extractSubdomain("barbershop.localhost:3000")).toBe("barbershop");
    expect(extractSubdomain("laundry.localhost")).toBe("laundry");
  });

  it("should extract tenant subdomain from production wildcard domain", () => {
    expect(extractSubdomain("distro.ziipos.com")).toBe("distro");
    expect(extractSubdomain("store-01.ziipos.com")).toBe("store-01");
  });

  it("should return null for main domain or direct IP", () => {
    expect(extractSubdomain("localhost:3000")).toBeNull();
    expect(extractSubdomain("localhost")).toBeNull();
    expect(extractSubdomain("127.0.0.1:3000")).toBeNull();
    expect(extractSubdomain("ziipos.com")).toBeNull();
  });

  it("should ignore reserved subdomains", () => {
    expect(extractSubdomain("www.ziipos.com")).toBeNull();
    expect(extractSubdomain("app.ziipos.com")).toBeNull();
    expect(extractSubdomain("api.ziipos.com")).toBeNull();
    expect(extractSubdomain("admin.ziipos.com")).toBeNull();
  });

  it("should correctly validate isTenantSubdomain helper", () => {
    expect(isTenantSubdomain("distro.ziipos.com")).toBe(true);
    expect(isTenantSubdomain("localhost:3000")).toBe(false);
    expect(isTenantSubdomain("www.ziipos.com")).toBe(false);
  });
});
