import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/tenant.middleware";
import { ApiResponse } from "../../utils/api-response";
import { TenantService } from "./tenant.service";

export class TenantController {
  static async getBySubdomain(req: Request, res: Response) {
    try {
      const { subdomain } = req.params;
      const tenant = await TenantService.getTenantBySubdomain(subdomain);
      return ApiResponse.success(
        res,
        "Berhasil mengambil data toko dari subdomain",
        tenant,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Toko tidak ditemukan.";
      return ApiResponse.error(res, message, error, 404);
    }
  }

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

  static async getCashiers(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "tenant-default";
      const data = await TenantService.getCashiers(tenantId);
      return ApiResponse.success(res, "Daftar kasir berhasil diambil", data);
    } catch (error: unknown) {
      return ApiResponse.error(res, "Gagal mengambil daftar kasir", error, 500);
    }
  }

  static async createCashier(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "tenant-default";
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return ApiResponse.error(
          res,
          "Nama, email, dan password wajib diisi.",
          null,
          400,
        );
      }

      const newCashier = await TenantService.createCashier(tenantId, {
        name,
        email,
        password,
      });

      return ApiResponse.success(
        res,
        "Akun kasir baru berhasil ditambahkan!",
        newCashier,
        201,
      );
    } catch (error: unknown) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Gagal menambahkan kasir baru",
        error,
        400,
      );
    }
  }

  static async deleteCashier(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "tenant-default";
      const { id } = req.params;

      const result = await TenantService.deleteCashier(tenantId, id);
      return ApiResponse.success(res, result.message);
    } catch (error: unknown) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Gagal menghapus kasir",
        error,
        400,
      );
    }
  }
}
