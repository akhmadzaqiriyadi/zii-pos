import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/api-response";
import { SaaSAdminService } from "./saas-admin.service";

export class SaaSAdminController {
  static async getMetrics(_req: Request, res: Response) {
    try {
      const metrics = await SaaSAdminService.getMetrics();
      return ApiResponse.success(
        res,
        "Berhasil mengambil metrik SaaS ZII POS",
        metrics,
      );
    } catch (error: unknown) {
      return ApiResponse.error(res, "Gagal mengambil metrik SaaS", error, 500);
    }
  }

  static async getTenants(req: Request, res: Response) {
    try {
      const { page, limit, search, status } = req.query;

      const result = await SaaSAdminService.getTenants({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search ? String(search) : undefined,
        status: status ? String(status) : undefined,
      });

      return ApiResponse.paginated(
        res,
        "Berhasil mengambil daftar merchant",
        result.tenants,
        result.meta,
      );
    } catch (error: unknown) {
      return ApiResponse.error(
        res,
        "Gagal mengambil daftar merchant",
        error,
        500,
      );
    }
  }

  static async updateTenantStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      if (!status) {
        return ApiResponse.error(res, "Kolom status wajib diisi.", null, 400);
      }

      const updated = await SaaSAdminService.updateTenantStatus(id, status);

      return ApiResponse.success(
        res,
        `Status merchant berhasil diubah menjadi '${status}'`,
        updated,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengubah status merchant";
      return ApiResponse.error(res, message, error, 400);
    }
  }

  static async getTenantDetail(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const detail = await SaaSAdminService.getTenantDetail(id);
      return ApiResponse.success(
        res,
        "Berhasil mengambil detail merchant",
        detail,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil detail merchant";
      return ApiResponse.error(res, message, error, 404);
    }
  }
}
