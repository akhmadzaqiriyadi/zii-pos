import { describe, expect, it, mock } from "bun:test";
import { useHasPermission } from "../useHasPermission";

// Mock useAuth return value
let mockUser: { role: string; email?: string; permissions?: string[] } | null =
  null;

mock.module("../useAuth", () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

describe("useHasPermission Hook Unit Tests", () => {
  it("should return false if no user is authenticated", () => {
    mockUser = null;
    expect(useHasPermission("pos:access")).toBe(false);
  });

  it("should return true for superadmin on any permission (universal bypass)", () => {
    mockUser = { role: "superadmin", permissions: ["*"] };
    expect(useHasPermission("pos:access")).toBe(true);
    expect(useHasPermission("saas:admin")).toBe(true);
    expect(useHasPermission("products:delete")).toBe(true);
  });

  it("should return true for owner on owner permissions", () => {
    mockUser = { role: "owner", email: "owner@distro.com" };
    expect(useHasPermission("products:create")).toBe(true);
    expect(useHasPermission("roles:manage")).toBe(true);
    expect(useHasPermission("cashiers:manage")).toBe(true);
  });

  it("should return true for cashier on cashier permissions, and false on restricted permissions", () => {
    mockUser = { role: "cashier", email: "siti.kasir@distro.com" };
    expect(useHasPermission("pos:access")).toBe(true);
    expect(useHasPermission("products:read")).toBe(true);
    expect(useHasPermission("products:delete")).toBe(false);
    expect(useHasPermission("roles:manage")).toBe(false);
  });

  it("should evaluate custom role permissions correctly", () => {
    mockUser = {
      role: "supervisor",
      permissions: ["pos:access", "pos:discount", "transactions:export"],
    };
    expect(useHasPermission("pos:discount")).toBe(true);
    expect(useHasPermission("transactions:export")).toBe(true);
    expect(useHasPermission("products:delete")).toBe(false);
  });
});
