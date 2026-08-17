import type { NextFunction, Response } from "express";
import { ApiResponse } from "../utils/api-response";
import type { AuthenticatedRequest } from "./tenant.middleware";

export type UserRole = "superadmin" | "owner" | "cashier" | string;

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.userRole;

    if (!role) {
      return ApiResponse.error(
        res,
        "Akses ditolak: Informasi role pengguna tidak ditemukan.",
        null,
        403,
      );
    }

    // Super Admin has universal access
    if (role === "superadmin") {
      return next();
    }

    if (allowedRoles.includes(role)) {
      return next();
    }

    return ApiResponse.error(
      res,
      `Akses ditolak: Tindakan ini memerlukan role [${allowedRoles.join(", ")}]. Role kamu saat ini adalah '${role}'.`,
      null,
      403,
    );
  };
}
