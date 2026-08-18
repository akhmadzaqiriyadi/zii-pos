import { db } from "@zii/db";

export interface UpdateTenantInput {
  name?: string;
  logoUrl?: string;
  phone?: string;
  address?: string;
  receiptFooter?: string;
}

export interface CreateCashierInput {
  name: string;
  email: string;
  password: string;
  roleId?: string;
  role?: string;
}

export class TenantService {
  static async getTenantProfile(tenantId: string) {
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    });

    if (tenant) return tenant;

    return {
      id: tenantId,
      name: "Toko Merchant",
      logoUrl: null,
      phone: null,
      address: null,
      receiptFooter: "Terima kasih telah berbelanja!",
      createdAt: new Date(),
    };
  }

  static async getTenantBySubdomain(subdomain: string) {
    const cleanSubdomain = subdomain.toLowerCase().trim();
    const tenant = await db.tenant.findUnique({
      where: { subdomain: cleanSubdomain },
      select: {
        id: true,
        name: true,
        subdomain: true,
        logoUrl: true,
        status: true,
        phone: true,
        address: true,
        receiptFooter: true,
        createdAt: true,
      },
    });

    if (!tenant) {
      throw new Error(
        `Toko dengan subdomain '${cleanSubdomain}' tidak ditemukan.`,
      );
    }

    return tenant;
  }

  static async updateTenantProfile(tenantId: string, input: UpdateTenantInput) {
    return await db.tenant.update({
      where: { id: tenantId },
      data: input,
    });
  }

  static async getCashiers(tenantId: string) {
    const users = await db.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        roleId: true,
        customRole: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Check active subscription & plan limit
    const subscription = await db.subscription.findFirst({
      where: { tenantId, status: { in: ["active", "trial"] } },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

    const maxCashiers = subscription?.plan?.maxCashiers || 1;
    const planName = subscription?.plan?.name || "Starter Trial";

    return {
      users,
      currentCount: users.length,
      maxCashiers,
      planName,
      isQuotaExceeded: users.length >= maxCashiers,
    };
  }

  static async createCashier(tenantId: string, input: CreateCashierInput) {
    // 1. Check max cashier quota
    const subscription = await db.subscription.findFirst({
      where: { tenantId, status: { in: ["active", "trial"] } },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

    const maxCashiers = subscription?.plan?.maxCashiers || 1;
    const currentCount = await db.user.count({ where: { tenantId } });

    if (currentCount >= maxCashiers) {
      throw new Error(
        `Batas kuota kasir (${maxCashiers} user) telah tercapai untuk paket Anda (${subscription?.plan?.name || "Trial"}). Silakan upgrade paket untuk menambah kasir baru.`,
      );
    }

    // 2. Check email uniqueness
    const existing = await db.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new Error(
        `Email '${input.email}' sudah terdaftar pada sistem ZII POS.`,
      );
    }

    // 3. Resolve role if roleId provided
    let assignedRole = input.role || "cashier";
    let validRoleId: string | null = null;

    if (
      input.roleId &&
      input.roleId !== "cashier" &&
      input.roleId !== "owner"
    ) {
      const customRole = await db.role.findFirst({
        where: { id: input.roleId, tenantId },
      });
      if (customRole) {
        assignedRole = customRole.code;
        validRoleId = customRole.id;
      }
    }

    // 4. Hash password and create cashier user
    const passwordHash = await Bun.password.hash(input.password);
    const newCashier = await db.user.create({
      data: {
        tenantId,
        roleId: validRoleId,
        name: input.name.trim(),
        email: input.email.toLowerCase().trim(),
        passwordHash,
        role: assignedRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        roleId: true,
        createdAt: true,
      },
    });

    return newCashier;
  }

  static async deleteCashier(tenantId: string, cashierId: string) {
    const user = await db.user.findFirst({
      where: { id: cashierId, tenantId },
    });

    if (!user) {
      throw new Error("Pengguna kasir tidak ditemukan di toko ini.");
    }

    if (user.role === "owner") {
      throw new Error("Akun Owner utama toko tidak dapat dihapus.");
    }

    await db.user.delete({
      where: { id: cashierId },
    });

    return { message: "Akun kasir berhasil dihapus." };
  }
}
