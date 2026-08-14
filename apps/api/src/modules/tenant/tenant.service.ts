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

  static async updateTenantProfile(tenantId: string, input: UpdateTenantInput) {
    return await db.tenant.update({
      where: { id: tenantId },
      data: input,
    });
  }
}
