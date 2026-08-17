import { describe, expect, it, mock } from "bun:test";
import { TenantService } from "@/modules/tenant/tenant.service";

mock.module("@zii/db", () => ({
  db: {
    tenant: {
      findUnique: async (args: {
        where: { id?: string; subdomain?: string };
      }) => {
        if (args.where.subdomain === "notfound") return null;
        return {
          id: args.where.id || "tenant-test-01",
          name: "ZII Distro Studio",
          subdomain: args.where.subdomain || "ziidistro",
          logoUrl: "https://zii.id/logo.png",
          phone: "08123456789",
          address: "Jl. Sudirman No. 1",
          receiptFooter: "Terima kasih!",
          createdAt: new Date(),
        };
      },
      update: async (args: {
        where: { id: string };
        data: Record<string, unknown>;
      }) => ({
        id: args.where.id,
        name: args.data.name || "ZII Updated Store",
        phone: args.data.phone || "0899-8877-6655",
        logoUrl: args.data.logoUrl || null,
        address: "Jl. Sudirman No. 1",
        receiptFooter: "Terima kasih!",
        createdAt: new Date(),
      }),
    },
    user: {
      findMany: async () => [
        {
          id: "usr-01",
          name: "Owner Zaki",
          email: "owner@zii.id",
          role: "owner",
          createdAt: new Date(),
        },
      ],
      findUnique: async (args: { where: { email: string } }) => {
        if (args.where.email === "exists@zii.id") {
          return { id: "usr-99", email: "exists@zii.id" };
        }
        return null;
      },
      findFirst: async (args: { where: { id: string; tenantId: string } }) => {
        if (args.where.id === "owner-id") {
          return {
            id: "owner-id",
            role: "owner",
            tenantId: args.where.tenantId,
          };
        }
        if (args.where.id === "cashier-id") {
          return {
            id: "cashier-id",
            role: "cashier",
            tenantId: args.where.tenantId,
          };
        }
        return null;
      },
      count: async () => 1,
      create: async (args: { data: Record<string, unknown> }) => ({
        id: "usr-new-01",
        name: args.data.name,
        email: args.data.email,
        role: "cashier",
        createdAt: new Date(),
      }),
      delete: async () => ({ id: "cashier-id" }),
    },
    subscription: {
      findFirst: async () => ({
        id: "sub-01",
        status: "active",
        plan: {
          id: "plan-pro",
          name: "Pro Merchant White-Label",
          maxCashiers: 5,
        },
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

  it("should return tenant by subdomain", async () => {
    const tenant = await TenantService.getTenantBySubdomain("ziidistro");
    expect(tenant).toBeDefined();
    expect(tenant.subdomain).toBe("ziidistro");
  });

  it("should throw error if tenant subdomain not found", async () => {
    expect(TenantService.getTenantBySubdomain("notfound")).rejects.toThrow(
      "tidak ditemukan",
    );
  });

  it("should update tenant profile settings", async () => {
    const updated = await TenantService.updateTenantProfile("tenant-test-01", {
      name: "ZII Updated Store",
      phone: "0899-8877-6655",
      logoUrl: "https://zii.id/logo.png",
    });

    expect(updated).toBeDefined();
    expect(updated.name).toBe("ZII Updated Store");
  });

  it("should return cashier list with plan quota info", async () => {
    const res = await TenantService.getCashiers("tenant-test-01");
    expect(res.users).toBeArray();
    expect(res.maxCashiers).toBe(5);
    expect(res.currentCount).toBe(1);
    expect(res.isQuotaExceeded).toBe(false);
  });

  it("should create new cashier within quota", async () => {
    const newCashier = await TenantService.createCashier("tenant-test-01", {
      name: "Kasir Baru",
      email: "kasirbaru@zii.id",
      password: "password123",
    });

    expect(newCashier).toBeDefined();
    expect(newCashier.email).toBe("kasirbaru@zii.id");
    expect(newCashier.role).toBe("cashier");
  });

  it("should throw error if email already registered", async () => {
    expect(
      TenantService.createCashier("tenant-test-01", {
        name: "Kasir Duplikat",
        email: "exists@zii.id",
        password: "password123",
      }),
    ).rejects.toThrow("sudah terdaftar");
  });

  it("should delete cashier successfully", async () => {
    const res = await TenantService.deleteCashier(
      "tenant-test-01",
      "cashier-id",
    );
    expect(res.message).toContain("berhasil dihapus");
  });

  it("should prevent deleting owner account", async () => {
    expect(
      TenantService.deleteCashier("tenant-test-01", "owner-id"),
    ).rejects.toThrow("Owner utama toko tidak dapat dihapus");
  });
});
