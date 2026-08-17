import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiResponse } from "../utils/api-response";
import type { AuthenticatedRequest } from "./tenant.middleware";

export interface JwtUserPayload {
  userId: string;
  tenantId: string;
  role: "superadmin" | "owner" | "cashier" | string;
  iat?: number;
  exp?: number;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ApiResponse.error(
      res,
      "Autentikasi gagal: Token tidak ditemukan. Silakan login terlebih dahulu.",
      null,
      401,
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    // If tenantId was not already resolved, use token's tenantId
    if (!req.tenantId || req.tenantId === "tenant-default") {
      req.tenantId = decoded.tenantId;
    }

    next();
  } catch (error: unknown) {
    const message =
      error instanceof jwt.TokenExpiredError
        ? "Sesi login telah kedaluwarsa. Silakan login kembali."
        : "Autentikasi gagal: Token tidak valid.";

    return ApiResponse.error(res, message, null, 401);
  }
}
