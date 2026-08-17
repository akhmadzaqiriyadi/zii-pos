import { describe, expect, it, mock } from "bun:test";
import { RoleService } from "@/modules/role/role.service";

// Mock Database with two isolated tenants
const mockRolesStore = [
  {
    id: "role-tenant-a-01",
    tenantId: "tenant-distro-a",
    name: "Supervisor Distro",
    code: "supervisor_distro",
    description: "Khusus untuk Toko Distro A",
    isSystem: false,
    permissions: JSON.stringify(["products:read", "products:create"]),
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { users: 0 },
  },
  {
    id: "role-tenant-b-01",
    tenantId: "tenant-barber-b",
    name: "Kapster Barber",
    code: "kapster_barber",
    description: "Khusus untuk Toko Barber B",
    isSystem: false,
    permissions: JSON.stringify(["pos:access"]),
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { users: 0 },
  },
];

mock.module("@zii/db", () => ({
  db: {
    role: {
      findMany: async (args: { where: { tenantId: string } }) => {
        return mockRolesStore.filter((r) => r.tenantId === args.where.tenantId);
      },
      findFirst: async (args: {
        where: { id?: string; code?: string; tenantId?: string };
      }) => {
        return (
          mockRolesStore.find((r) => {
            const matchesTenant =
              !args.where.tenantId || r.tenantId === args.where.tenantId;
            const matchesId = !args.where.id || r.id === args.where.id;
            const matchesCode = !args.where.code || r.code === args.where.code;
            return matchesTenant && matchesId && matchesCode;
          }) || null
        );
      },
      create: async (args: { data: Record<string, unknown> }) => {
        const newRole = {
          id: `role-${Date.now()}`,
          tenantId: args.data.tenantId as string,
          name: args.data.name as string,
          code: args.data.code as string,
          description: (args.data.description as string) || null,
          isSystem: false,
          permissions: args.data.permissions as string,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { users: 0 },
        };
        mockRolesStore.push(newRole);
        return newRole;
      },
      update: async (args: {
        where: { id: string };
        data: Record<string, unknown>;
      }) => {
        const existing = mockRolesStore.find((r) => r.id === args.where.id);
        if (!existing) throw new Error("Role tidak ditemukan.");
        if (args.data.name) existing.name = args.data.name as string;
        if (args.data.permissions)
          existing.permissions = args.data.permissions as string;
        return existing;
      },
      delete: async (args: { where: { id: string } }) => {
        const idx = mockRolesStore.findIndex((r) => r.id === args.where.id);
        if (idx !== -1) mockRolesStore.splice(idx, 1);
        return { id: args.where.id };
      },
    },
    user: {
      findUnique: async (args: { where: { id: string } }) => {
        if (args.where.id === "user-tenant-a") {
          return {
            id: "user-tenant-a",
            tenantId: "tenant-distro-a",
            role: "supervisor_distro",
            customRole: mockRolesStore.find((r) => r.id === "role-tenant-a-01"),
          };
        }
        return null;
      },
    },
  },
}));

describe("Cross-Tenant Dynamic RBAC & Subdomain Isolation Tests", () => {
  const TENANT_A = "tenant-distro-a";
  const TENANT_B = "tenant-barber-b";

  it("should enforce strict role list partitioning per tenant", async () => {
    const rolesA = await RoleService.getRoles(TENANT_A);
    const rolesB = await RoleService.getRoles(TENANT_B);

    // Tenant A only sees its own custom role and system roles
    expect(rolesA.some((r) => r.code === "supervisor_distro")).toBe(true);
    expect(rolesA.some((r) => r.code === "kapster_barber")).toBe(false);

    // Tenant B only sees its own custom role and system roles
    expect(rolesB.some((r) => r.code === "kapster_barber")).toBe(true);
    expect(rolesB.some((r) => r.code === "supervisor_distro")).toBe(false);
  });

  it("should prevent Tenant B from reading Tenant A's custom role by ID", async () => {
    // Tenant A accessing its own role -> OK
    const roleA = await RoleService.getRoleById(TENANT_A, "role-tenant-a-01");
    expect(roleA).toBeDefined();
    expect(roleA.name).toBe("Supervisor Distro");

    // Tenant B attempting to access Tenant A's role -> 404 / Error
    expect(
      RoleService.getRoleById(TENANT_B, "role-tenant-a-01"),
    ).rejects.toThrow("tidak ditemukan");
  });

  it("should prevent Tenant B from updating Tenant A's custom role", async () => {
    expect(
      RoleService.updateRole(TENANT_B, "role-tenant-a-01", {
        name: "Hacked by Tenant B",
      }),
    ).rejects.toThrow("tidak ditemukan");
  });

  it("should prevent Tenant B from deleting Tenant A's custom role", async () => {
    expect(
      RoleService.deleteRole(TENANT_B, "role-tenant-a-01"),
    ).rejects.toThrow("tidak ditemukan");
  });

  it("should isolate user effective permissions within tenant context", async () => {
    // User from Tenant A in Tenant A context -> Resolves permissions correctly
    const permsInTenantA = await RoleService.getUserEffectivePermissions(
      "user-tenant-a",
      "supervisor_distro",
      TENANT_A,
    );
    expect(permsInTenantA).toContain("products:create");

    // User from Tenant A attempted in Tenant B context -> Cannot resolve custom role from Tenant B
    const permsInTenantB = await RoleService.getUserEffectivePermissions(
      "user-tenant-a",
      "supervisor_distro",
      TENANT_B,
    );
    expect(permsInTenantB).not.toContain("products:create");
  });
});
