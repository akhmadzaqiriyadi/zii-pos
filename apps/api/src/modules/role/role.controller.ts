import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/tenant.middleware";
import { ApiResponse } from "../../utils/api-response";
import { RoleService } from "./role.service";

export class RoleController {
  static getPermissionsCatalog(_req: Request, res: Response) {
    const catalog = RoleService.getPermissionsCatalog();
    return ApiResponse.success(
      res,
      "Katalog permission berhasil diambil",
      catalog,
    );
  }

  static async getRoles(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "tenant-default";
      const roles = await RoleService.getRoles(tenantId);
      return ApiResponse.success(res, "Daftar role berhasil diambil", roles);
    } catch (error: unknown) {
      return ApiResponse.error(res, "Gagal mengambil daftar role", error, 500);
    }
  }

  static async getRoleById(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "tenant-default";
      const { id } = req.params;
      const role = await RoleService.getRoleById(tenantId, id);
      return ApiResponse.success(res, "Detail role berhasil diambil", role);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal mengambil detail role.";
      return ApiResponse.error(res, message, error, 404);
    }
  }

  static async createRole(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "tenant-default";
      const { name, code, description, permissions } = req.body;

      if (!name || !code) {
        return ApiResponse.error(
          res,
          "Nama role dan kode role wajib diisi.",
          null,
          400,
        );
      }

      const role = await RoleService.createRole(tenantId, {
        name,
        code,
        description,
        permissions: permissions || [],
      });

      return ApiResponse.success(
        res,
        "Role kustom baru berhasil dibuat!",
        role,
        201,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal membuat role baru.";
      return ApiResponse.error(res, message, error, 400);
    }
  }

  static async updateRole(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "tenant-default";
      const { id } = req.params;
      const { name, description, permissions } = req.body;

      const updated = await RoleService.updateRole(tenantId, id, {
        name,
        description,
        permissions,
      });

      return ApiResponse.success(
        res,
        "Role kustom berhasil diperbarui!",
        updated,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal memperbarui role.";
      return ApiResponse.error(res, message, error, 400);
    }
  }

  static async deleteRole(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "tenant-default";
      const { id } = req.params;

      const result = await RoleService.deleteRole(tenantId, id);
      return ApiResponse.success(res, result.message);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus role.";
      return ApiResponse.error(res, message, error, 400);
    }
  }
}
