import { db } from "@zii/db";
import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";

export interface AuthenticatedRequest extends Request {
  tenantId?: string;
  userId?: string;
}

export async function tenantMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  // 1. Try to extract tenantId from Header (x-tenant-id)
  const rawTenantId = req.headers["x-tenant-id"];
  let tenantId = "";

  if (typeof rawTenantId === "string") {
    tenantId = rawTenantId.split(",")[0].trim();
  } else if (Array.isArray(rawTenantId) && rawTenantId.length > 0) {
    tenantId = rawTenantId[0].trim();
  }

  // 2. If no direct tenantId or is default, try to resolve from x-tenant-subdomain header
  if (!tenantId || tenantId === "tenant-default") {
    const rawSubdomain = req.headers["x-tenant-subdomain"];
    let subdomain = "";

    if (typeof rawSubdomain === "string") {
      subdomain = rawSubdomain.split(",")[0].trim();
    } else if (Array.isArray(rawSubdomain) && rawSubdomain.length > 0) {
      subdomain = rawSubdomain[0].trim();
    }

    if (subdomain && subdomain !== "localhost") {
      try {
        const tenant = await db.tenant.findUnique({
          where: { subdomain },
          select: { id: true },
        });
        if (tenant) {
          tenantId = tenant.id;
        }
      } catch {
        // Fallback gracefully
      }
    }
  }

  req.tenantId = tenantId || "tenant-default";
  next();
}
