import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";

export interface AuthenticatedRequest extends Request {
  tenantId?: string;
  userId?: string;
}

export function tenantMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  // Extract tenantId from Header (x-tenant-id) or fallback to demo tenant for MVP
  const tenantId = (req.headers["x-tenant-id"] as string) || "demo-tenant-01";

  if (!tenantId) {
    return ApiResponse.error(res, "Tenant ID is required", 401);
  }

  req.tenantId = tenantId;
  next();
}
