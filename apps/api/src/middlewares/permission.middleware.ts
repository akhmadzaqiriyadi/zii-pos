import type { NextFunction, Response } from "express";
import { RoleService } from "../modules/role/role.service";
import { ApiResponse } from "../utils/api-response";
import type { AuthenticatedRequest } from "./tenant.middleware";

export function requirePermission(...requiredPermissions: string[]) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const role = req.userRole;
    const userId = req.userId;
    const tenantId = req.tenantId;

    if (!role || !userId) {
      return ApiResponse.error(
        res,
        "Akses ditolak: Informasi autentikasi pengguna tidak lengkap.",
        null,
        403,
      );
    }

    // Super Admin has universal access
    if (role === "superadmin") {
      return next();
    }

    try {
      const userPermissions = await RoleService.getUserEffectivePermissions(
        userId,
        role,
        tenantId,
      );

      // Check wildcard or specific permission match
      const hasPermission =
        userPermissions.includes("*") ||
        requiredPermissions.some((perm) => userPermissions.includes(perm));

      if (hasPermission) {
        return next();
      }

      return ApiResponse.error(
        res,
        `Akses ditolak: Tindakan ini memerlukan izin [${requiredPermissions.join(", ")}]. Role kamu '${role}' tidak memiliki hak akses yang memadai.`,
        null,
        403,
      );
    } catch {
      return ApiResponse.error(
        res,
        "Gagal memverifikasi izin hak akses pengguna.",
        null,
        500,
      );
    }
  };
}
