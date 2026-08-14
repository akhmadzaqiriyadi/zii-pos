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
    $transaction: async (fn: (tx: unknown) => unknown) => {
      return await fn({
        tenant: {
          create: async (args: { data: Record<string, unknown> }) => ({
            id: "tenant-new",
            name: args.data.name,
            phone: args.data.phone,
            address: args.data.address,
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

  it("should register tenant successfully", async () => {
    const mockTenantData = {
      tenantName: "ZII Test Store",
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
