import { db } from "@zii/db";

export interface UpdateTenantInput {
  name?: string;
  logoUrl?: string;
  phone?: string;
  address?: string;
  receiptFooter?: string;
}

export class TenantService {
  static async getTenantProfile(tenantId: string) {
    try {
      const tenant = await db.tenant.findUnique({
        where: { id: tenantId },
      });

      if (tenant) return tenant;
    } catch {
      // Fallback demo
    }

    return {
      id: tenantId,
      name: "ZII Distro & Laundry Studio",
      logoUrl: "https://placehold.co/120x120/1e293b/ffffff?text=ZII+STORE",
      phone: "0812-9988-7766",
      address: "Jl. Merdeka Raya No. 45, Jakarta",
      receiptFooter: "Terima kasih telah berbelanja di ZII Store!",
      createdAt: new Date(),
    };
  }

  static async updateTenantProfile(tenantId: string, input: UpdateTenantInput) {
    try {
      return await db.tenant.update({
        where: { id: tenantId },
        data: input,
      });
    } catch {
      return {
        id: tenantId,
        name: input.name || "ZII Distro & Laundry Studio",
        logoUrl: input.logoUrl,
        phone: input.phone || "0812-9988-7766",
        address: input.address || "Jl. Merdeka Raya No. 45, Jakarta",
        receiptFooter:
          input.receiptFooter || "Terima kasih telah berbelanja di ZII Store!",
        createdAt: new Date(),
      };
    }
  }
}
