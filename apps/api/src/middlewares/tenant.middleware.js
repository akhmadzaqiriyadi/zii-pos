import { ApiResponse } from "../utils/api-response";
export function tenantMiddleware(req, res, next) {
    // Extract tenantId from Header (x-tenant-id) or fallback to demo tenant for MVP
    const tenantId = req.headers["x-tenant-id"] || "demo-tenant-01";
    if (!tenantId) {
        return ApiResponse.error(res, "Tenant ID is required", 401);
    }
    req.tenantId = tenantId;
    next();
}
