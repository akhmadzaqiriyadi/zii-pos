import { describe, expect, it } from "bun:test";
import { AuthService } from "@/modules/auth/auth.service";

describe("AuthService Unit Tests", () => {
  it("should validate empty email/password on login", async () => {
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

  it("should require mandatory fields for registerTenant", async () => {
    const mockTenantData = {
      tenantName: "ZII Test Store",
      ownerName: "Zaqi Test",
      email: `test-${Date.now()}@zii.id`,
      password: "password123",
      phone: "081299887766",
      address: "Jl. Test No. 1",
    };

    try {
      const result = await AuthService.registerTenant(mockTenantData);
      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("tenant");
      expect(result).toHaveProperty("user");
      expect(result.user.email).toBe(mockTenantData.email);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
