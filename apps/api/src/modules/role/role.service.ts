import { db } from "@zii/db";
import {
  DEFAULT_ROLE_PERMISSIONS,
  PERMISSIONS_CATALOG,
} from "../../constants/permissions";

export interface CreateRoleInput {
  name: string;
  code: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissions?: string[];
}

export class RoleService {
  static getPermissionsCatalog() {
    return PERMISSIONS_CATALOG;
  }

  static async getRoles(tenantId: string) {
    // 1. Fetch Tenant's Custom Roles
    const customRoles = await db.role.findMany({
      where: { tenantId },
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    // 2. Format with parsed permissions
    const formattedCustomRoles = customRoles.map((r) => ({
      id: r.id,
      name: r.name,
      code: r.code,
      description: r.description,
      isSystem: r.isSystem,
      permissions: RoleService.parsePermissions(r.permissions),
      userCount: r._count.users,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    // 3. Include Virtual Default System Roles
    const systemRoles = [
      {
        id: "system-owner",
        name: "Pemilik Toko (Owner)",
        code: "owner",
        description:
          "Akses penuh mengelola seluruh operasional toko, produk, staf, dan laporan keuangan.",
        isSystem: true,
        permissions: DEFAULT_ROLE_PERMISSIONS.owner,
        userCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "system-cashier",
        name: "Kasir Operasional",
        code: "cashier",
        description:
          "Akses standar kasir untuk melayani pesanan belanja dan melihat katalog barang.",
        isSystem: true,
        permissions: DEFAULT_ROLE_PERMISSIONS.cashier,
        userCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return [...systemRoles, ...formattedCustomRoles];
  }

  static async getRoleById(tenantId: string, roleId: string) {
    if (roleId === "system-owner" || roleId === "owner") {
      return {
        id: "system-owner",
        name: "Pemilik Toko (Owner)",
        code: "owner",
        description: "Akses penuh mengelola seluruh operasional toko.",
        isSystem: true,
        permissions: DEFAULT_ROLE_PERMISSIONS.owner,
      };
    }

    if (roleId === "system-cashier" || roleId === "cashier") {
      return {
        id: "system-cashier",
        name: "Kasir Operasional",
        code: "cashier",
        description: "Akses standar kasir untuk melayani pesanan belanja.",
        isSystem: true,
        permissions: DEFAULT_ROLE_PERMISSIONS.cashier,
      };
    }

    const role = await db.role.findFirst({
      where: { id: roleId, tenantId },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!role) {
      throw new Error("Role tidak ditemukan.");
    }

    return {
      id: role.id,
      name: role.name,
      code: role.code,
      description: role.description,
      isSystem: role.isSystem,
      permissions: RoleService.parsePermissions(role.permissions),
      userCount: role._count.users,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  static async createRole(tenantId: string, input: CreateRoleInput) {
    const cleanCode = input.code
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]/g, "");

    if (!cleanCode) {
      throw new Error(
        "Kode role wajib diisi dan hanya boleh mengandung huruf, angka, atau underscore.",
      );
    }

    // Check system code collision
    if (["superadmin", "owner", "cashier"].includes(cleanCode)) {
      throw new Error(
        `Kode role '${cleanCode}' adalah role sistem bawaan dan tidak dapat digunakan.`,
      );
    }

    const existing = await db.role.findFirst({
      where: { tenantId, code: cleanCode },
    });

    if (existing) {
      throw new Error(`Role dengan kode '${cleanCode}' sudah ada di tokomu.`);
    }

    const role = await db.role.create({
      data: {
        tenantId,
        name: input.name.trim(),
        code: cleanCode,
        description: input.description?.trim() || null,
        isSystem: false,
        permissions: JSON.stringify(input.permissions || []),
      },
    });

    return {
      ...role,
      permissions: RoleService.parsePermissions(role.permissions),
    };
  }

  static async updateRole(
    tenantId: string,
    roleId: string,
    input: UpdateRoleInput,
  ) {
    const role = await db.role.findFirst({
      where: { id: roleId, tenantId },
    });

    if (!role) {
      throw new Error("Role tidak ditemukan.");
    }

    if (role.isSystem) {
      throw new Error("Role sistem bawaan tidak dapat diubah.");
    }

    const updated = await db.role.update({
      where: { id: role.id },
      data: {
        name: input.name ? input.name.trim() : undefined,
        description:
          input.description !== undefined
            ? input.description?.trim() || null
            : undefined,
        permissions: input.permissions
          ? JSON.stringify(input.permissions)
          : undefined,
      },
    });

    return {
      ...updated,
      permissions: RoleService.parsePermissions(updated.permissions),
    };
  }

  static async deleteRole(tenantId: string, roleId: string) {
    const role = await db.role.findFirst({
      where: { id: roleId, tenantId },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!role) {
      throw new Error("Role tidak ditemukan.");
    }

    if (role.isSystem) {
      throw new Error("Role sistem bawaan tidak dapat dihapus.");
    }

    if (role._count.users > 0) {
      throw new Error(
        `Role '${role.name}' tidak dapat dihapus karena masih digunakan oleh ${role._count.users} staf. Pindahkan staf ke role lain terlebih dahulu.`,
      );
    }

    await db.role.delete({ where: { id: role.id } });

    return { message: `Role '${role.name}' berhasil dihapus.` };
  }

  static async getUserEffectivePermissions(
    userId: string,
    userRole: string,
    tenantId?: string,
  ): Promise<string[]> {
    if (userRole === "superadmin") {
      return ["*"];
    }

    // If default system role
    if (DEFAULT_ROLE_PERMISSIONS[userRole]) {
      return DEFAULT_ROLE_PERMISSIONS[userRole];
    }

    // Check custom role from DB
    if (tenantId) {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: { customRole: true },
      });

      if (
        user &&
        user.tenantId === tenantId &&
        user.customRole &&
        (!user.customRole.tenantId || user.customRole.tenantId === tenantId)
      ) {
        return RoleService.parsePermissions(user.customRole.permissions);
      }
    }

    return DEFAULT_ROLE_PERMISSIONS.cashier;
  }

  private static parsePermissions(permsJson: string): string[] {
    try {
      const parsed = JSON.parse(permsJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
