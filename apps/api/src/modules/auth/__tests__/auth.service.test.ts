import { describe, expect, it, mock } from "bun:test";
import { AuthService } from "@/modules/auth/auth.service";

mock.module("@zii/db", () => ({
  db: {
    user: {
      findUnique: async (args: { where: { email: string } }) => {
        if (args.where.email === "existing@zii.id") {
          return {
            id: "user-1",
            tenantId: "tenant-1",
            name: "Existing User",
            email: "existing@zii.id",
            passwordHash: "$2b$10$xyz",
            role: "owner",
          };
        }
        return null;
      },
    },
    tenant: {
      findUnique: async () => null,
    },
    plan: {
      findUnique: async () => ({
        id: "plan-starter",
        name: "Starter Trial",
        price: 0,
      }),
      findFirst: async () => ({
        id: "plan-starter",
        name: "Starter Trial",
        price: 0,
      }),
    },
    $transaction: async (fn: (tx: unknown) => unknown) => {
      return await fn({
        tenant: {
          create: async (args: { data: Record<string, unknown> }) => ({
            id: "tenant-new",
            name: args.data.name,
            subdomain: args.data.subdomain,
            phone: args.data.phone,
            address: args.data.address,
            status: "trial",
          }),
        },
        user: {
          create: async (args: { data: Record<string, unknown> }) => ({
            id: "user-new",
            tenantId: "tenant-new",
            name: args.data.name,
            email: args.data.email,
            role: "owner",
          }),
        },
        subscription: {
          create: async () => ({
            id: "sub-new",
          }),
        },
      });
    },
  },
}));

describe("AuthService Unit Tests", () => {
  it("should validate empty email/password or invalid credentials on login", async () => {
    try {
      await AuthService.login({
        email: "invalid@zii.id",
        password: "wrongpassword",
      });
      expect(true).toBe(false);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toContain("tidak valid");
      }
    }
  });

  it("should validate and check subdomain availability", async () => {
    // Valid subdomain
    const res1 = await AuthService.checkSubdomainAvailability("ziistore");
    expect(res1.isAvailable).toBe(true);

    // Empty or too short
    const res2 = await AuthService.checkSubdomainAvailability("ab");
    expect(res2.isAvailable).toBe(false);

    // Reserved system subdomain
    const res3 = await AuthService.checkSubdomainAvailability("admin");
    expect(res3.isAvailable).toBe(false);
    expect(res3.message).toContain("kata khusus sistem");
  });

  it("should register tenant successfully", async () => {
    const mockTenantData = {
      tenantName: "ZII Test Store",
      subdomain: "ziitest",
      ownerName: "Zaqi Test",
      email: `test-${Date.now()}@zii.id`,
      password: "password123",
      phone: "081299887766",
      address: "Jl. Test No. 1",
    };

    const result = await AuthService.registerTenant(mockTenantData);
    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("tenant");
    expect(result).toHaveProperty("user");
    expect(result.user.email).toBe(mockTenantData.email);
  });
});
