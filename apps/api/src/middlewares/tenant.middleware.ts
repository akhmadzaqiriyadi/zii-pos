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
  // Extract tenantId from Header (x-tenant-id) or fallback to default tenant
  const rawTenantId = req.headers["x-tenant-id"];
  let tenantId = "tenant-default";

  if (typeof rawTenantId === "string") {
    tenantId = rawTenantId.split(",")[0].trim();
  } else if (Array.isArray(rawTenantId) && rawTenantId.length > 0) {
    tenantId = rawTenantId[0].trim();
  }

  if (!tenantId) {
    return ApiResponse.error(res, "Tenant ID is required", 401);
  }

  req.tenantId = tenantId;
  next();
}
