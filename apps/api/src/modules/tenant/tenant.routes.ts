import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { TenantController } from "./tenant.controller";

const router = Router();

// 🌐 Public Tenant Subdomain Lookup (No Auth Required)
router.get("/by-subdomain/:subdomain", TenantController.getBySubdomain);

// 🔒 Protected Merchant Routes (Requires Tenant Context & Auth)
router.use(tenantMiddleware);

// Profile
router.get(
  "/profile",
  authMiddleware,
  requireRole("owner", "cashier"),
  TenantController.getProfile,
);
router.put(
  "/profile",
  authMiddleware,
  requireRole("owner"),
  TenantController.updateProfile,
);

// 👥 Cashier & Multi-User Management Endpoints (Owner & Superadmin only)
router.get(
  "/cashiers",
  authMiddleware,
  requireRole("owner"),
  TenantController.getCashiers,
);
router.post(
  "/cashiers",
  authMiddleware,
  requireRole("owner"),
  TenantController.createCashier,
);
router.delete(
  "/cashiers/:id",
  authMiddleware,
  requireRole("owner"),
  TenantController.deleteCashier,
);

export const tenantRouter = router;
