import { describe, expect, it, mock } from "bun:test";
import { TenantService } from "@/modules/tenant/tenant.service";

mock.module("@zii/db", () => ({
  db: {
    tenant: {
      findUnique: async (args: { where: { id: string } }) => ({
        id: args.where.id,
        name: "ZII Distro Studio",
        logoUrl: null,
        phone: "08123456789",
        address: "Jl. Sudirman No. 1",
        receiptFooter: "Terima kasih!",
        createdAt: new Date(),
      }),
      update: async (args: {
        where: { id: string };
        data: Record<string, unknown>;
      }) => ({
        id: args.where.id,
        name: args.data.name || "ZII Updated Store",
        phone: args.data.phone || "0899-8877-6655",
        logoUrl: null,
        address: "Jl. Sudirman No. 1",
        receiptFooter: "Terima kasih!",
        createdAt: new Date(),
      }),
    },
  },
}));

describe("TenantService Unit Tests", () => {
  it("should return tenant profile", async () => {
    const profile = await TenantService.getTenantProfile("tenant-test-01");
    expect(profile).toBeDefined();
    expect(profile).toHaveProperty("id");
    expect(profile).toHaveProperty("name");
  });

  it("should update tenant profile settings", async () => {
    const updated = await TenantService.updateTenantProfile("tenant-test-01", {
      name: "ZII Updated Store",
      phone: "0899-8877-6655",
    });

    expect(updated).toBeDefined();
    expect(updated.name).toBe("ZII Updated Store");
  });
});
