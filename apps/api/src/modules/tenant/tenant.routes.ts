import { Router } from "express";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { TenantController } from "./tenant.controller";

const router = Router();

// 🌐 Public Tenant Subdomain Lookup (No Auth Required)
router.get("/by-subdomain/:subdomain", TenantController.getBySubdomain);

// 🔒 Protected Merchant Routes (Requires Tenant Context)
router.use(tenantMiddleware);

router.get("/profile", TenantController.getProfile);
router.put("/profile", TenantController.updateProfile);

// 👥 Cashier & Multi-User Management Endpoints
router.get("/cashiers", TenantController.getCashiers);
router.post("/cashiers", TenantController.createCashier);
router.delete("/cashiers/:id", TenantController.deleteCashier);

export const tenantRouter = router;
