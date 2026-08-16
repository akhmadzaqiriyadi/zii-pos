import { Router } from "express";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { TenantController } from "./tenant.controller";

const router = Router();

router.use(tenantMiddleware);

router.get("/profile", TenantController.getProfile);
router.put("/profile", TenantController.updateProfile);

// 👥 Cashier & Multi-User Management Endpoints
router.get("/cashiers", TenantController.getCashiers);
router.post("/cashiers", TenantController.createCashier);
router.delete("/cashiers/:id", TenantController.deleteCashier);

export const tenantRouter = router;
