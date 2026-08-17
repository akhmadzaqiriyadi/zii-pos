import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/permission.middleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { TenantController } from "./tenant.controller";

const router = Router();

// 🌐 Public Tenant Subdomain Lookup (No Auth Required)
router.get("/by-subdomain/:subdomain", TenantController.getBySubdomain);

// 🔒 Protected Merchant Routes (Requires Tenant Context & Auth)
router.use(tenantMiddleware);
router.use(authMiddleware);

// Profile & Branding
router.get(
  "/profile",
  requirePermission("settings:manage", "pos:access"),
  TenantController.getProfile,
);
router.put(
  "/profile",
  requirePermission("settings:manage"),
  TenantController.updateProfile,
);

// 👥 Cashier & Multi-User Management Endpoints
router.get(
  "/cashiers",
  requirePermission("cashiers:manage"),
  TenantController.getCashiers,
);
router.post(
  "/cashiers",
  requirePermission("cashiers:manage"),
  TenantController.createCashier,
);
router.delete(
  "/cashiers/:id",
  requirePermission("cashiers:manage"),
  TenantController.deleteCashier,
);

export const tenantRouter = router;
