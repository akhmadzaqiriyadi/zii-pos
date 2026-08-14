import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/tenant.middleware";
import { ApiResponse } from "../../utils/api-response";
import { TenantService } from "./tenant.service";

export class TenantController {
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "tenant-default";
      const tenant = await TenantService.getTenantProfile(tenantId);
      return ApiResponse.success(
        res,
        "Berhasil mengambil profil merchant",
        tenant,
      );
    } catch (error: unknown) {
      return ApiResponse.error(
        res,
        "Gagal mengambil profil merchant",
        error,
        500,
      );
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "tenant-default";
      const { name, logoUrl, phone, address, receiptFooter } = req.body;

      const updated = await TenantService.updateTenantProfile(tenantId, {
        name,
        logoUrl,
        phone,
        address,
        receiptFooter,
      });

      return ApiResponse.success(
        res,
        "Pengaturan White-Label merchant berhasil disimpan!",
        updated,
      );
    } catch (error: unknown) {
      return ApiResponse.error(
        res,
        "Gagal menyimpan pengaturan merchant",
        error,
        500,
      );
    }
  }
}
