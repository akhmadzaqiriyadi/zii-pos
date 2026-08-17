import { describe, expect, it, mock } from "bun:test";
import { RoleService } from "@/modules/role/role.service";

mock.module("@zii/db", () => ({
  db: {
    role: {
      findMany: async () => [
        {
          id: "role-custom-01",
          tenantId: "tenant-test-01",
          name: "Supervisor Kasir",
          code: "supervisor",
          description: "Dapat memberikan diskon dan melihat transaksi",
          isSystem: false,
          permissions: JSON.stringify([
            "pos:access",
            "pos:discount",
            "transactions:read",
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { users: 2 },
        },
      ],
      findFirst: async (args: {
        where: { id?: string; code?: string; tenantId?: string };
      }) => {
        if (
          args.where.code === "supervisor" ||
          args.where.id === "role-custom-01"
        ) {
          return {
            id: "role-custom-01",
            tenantId: "tenant-test-01",
            name: "Supervisor Kasir",
            code: "supervisor",
            description: "Dapat memberikan diskon dan melihat transaksi",
            isSystem: false,
            permissions: JSON.stringify([
              "pos:access",
              "pos:discount",
              "transactions:read",
            ]),
            createdAt: new Date(),
            updatedAt: new Date(),
            _count: { users: 0 },
          };
        }
        if (args.where.id === "role-with-users") {
          return {
            id: "role-with-users",
            tenantId: "tenant-test-01",
            name: "Manajer Toko",
            code: "manager",
            isSystem: false,
            permissions: "[]",
            _count: { users: 3 },
          };
        }
        return null;
      },
      create: async (args: { data: Record<string, unknown> }) => ({
        id: "role-new-01",
        tenantId: args.data.tenantId,
        name: args.data.name,
        code: args.data.code,
        description: args.data.description,
        isSystem: false,
        permissions: args.data.permissions,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: async (args: {
        where: { id: string };
        data: Record<string, unknown>;
      }) => ({
        id: args.where.id,
        name: args.data.name || "Updated Role",
        code: "supervisor",
        description: args.data.description,
        isSystem: false,
        permissions: args.data.permissions || JSON.stringify(["pos:access"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      delete: async () => ({ id: "role-custom-01" }),
    },
    user: {
      findUnique: async (args: { where: { id: string } }) => {
        if (args.where.id === "usr-with-custom-role") {
          return {
            id: "usr-with-custom-role",
            tenantId: "tenant-test-01",
            role: "supervisor",
            customRole: {
              id: "role-custom-01",
              tenantId: "tenant-test-01",
              permissions: JSON.stringify(["pos:access", "pos:discount"]),
            },
          };
        }
        return null;
      },
    },
  },
}));

describe("RoleService Dynamic RBAC Unit Tests", () => {
  it("should return system permissions catalog", () => {
    const catalog = RoleService.getPermissionsCatalog();
    expect(catalog).toBeArray();
    expect(catalog.length).toBeGreaterThanOrEqual(10);
    expect(catalog.some((p) => p.code === "pos:access")).toBe(true);
    expect(catalog.some((p) => p.code === "products:create")).toBe(true);
  });

  it("should get all roles including virtual system roles and custom tenant roles", async () => {
    const roles = await RoleService.getRoles("tenant-test-01");
    expect(roles).toBeArray();
    expect(roles.some((r) => r.code === "owner")).toBe(true);
    expect(roles.some((r) => r.code === "cashier")).toBe(true);
    expect(roles.some((r) => r.code === "supervisor")).toBe(true);
  });

  it("should get role details by id", async () => {
    const role = await RoleService.getRoleById(
      "tenant-test-01",
      "role-custom-01",
    );
    expect(role).toBeDefined();
    expect(role.name).toBe("Supervisor Kasir");
    expect(role.permissions).toContain("pos:discount");
  });

  it("should create new custom role with permissions", async () => {
    const created = await RoleService.createRole("tenant-test-01", {
      name: "Admin Gudang",
      code: "warehouse_admin",
      description: "Hanya mengelola stok barang",
      permissions: ["products:read", "products:create", "products:update"],
    });

    expect(created).toBeDefined();
    expect(created.code).toBe("warehouse_admin");
    expect(created.permissions).toContain("products:create");
  });

  it("should prevent creating role with reserved system code", async () => {
    expect(
      RoleService.createRole("tenant-test-01", {
        name: "Fake Owner",
        code: "owner",
        permissions: [],
      }),
    ).rejects.toThrow("role sistem bawaan");
  });

  it("should update role permissions", async () => {
    const updated = await RoleService.updateRole(
      "tenant-test-01",
      "role-custom-01",
      {
        name: "Supervisor Lead",
        permissions: ["pos:access", "pos:discount", "pos:void_tx"],
      },
    );

    expect(updated).toBeDefined();
    expect(updated.permissions).toContain("pos:void_tx");
  });

  it("should delete custom role when no users assigned", async () => {
    const res = await RoleService.deleteRole(
      "tenant-test-01",
      "role-custom-01",
    );
    expect(res.message).toContain("berhasil dihapus");
  });

  it("should prevent deleting custom role if users are assigned to it", async () => {
    expect(
      RoleService.deleteRole("tenant-test-01", "role-with-users"),
    ).rejects.toThrow("masih digunakan");
  });

  it("should resolve effective user permissions correctly", async () => {
    // Superadmin has wildcard access
    const adminPerms = await RoleService.getUserEffectivePermissions(
      "admin-id",
      "superadmin",
    );
    expect(adminPerms).toEqual(["*"]);

    // Owner has owner preset
    const ownerPerms = await RoleService.getUserEffectivePermissions(
      "owner-id",
      "owner",
    );
    expect(ownerPerms).toContain("products:create");
    expect(ownerPerms).toContain("roles:manage");

    // Custom role resolution from DB
    const customPerms = await RoleService.getUserEffectivePermissions(
      "usr-with-custom-role",
      "supervisor",
      "tenant-test-01",
    );
    expect(customPerms).toContain("pos:discount");
  });
});
