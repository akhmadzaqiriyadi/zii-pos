import { describe, expect, it } from "bun:test";
import { TenantService } from "@/modules/tenant/tenant.service";

describe("TenantService Unit Tests", () => {
  it("should return tenant profile or fallback info", async () => {
    const profile = await TenantService.getTenantProfile("demo-tenant-01");
    expect(profile).toBeDefined();
    expect(profile).toHaveProperty("id");
    expect(profile).toHaveProperty("name");
  });

  it("should update tenant profile settings", async () => {
    const updated = await TenantService.updateTenantProfile("demo-tenant-01", {
      name: "ZII Updated Store",
      phone: "0899-8877-6655",
    });

    expect(updated).toBeDefined();
    expect(updated.name).toBe("ZII Updated Store");
  });
});
