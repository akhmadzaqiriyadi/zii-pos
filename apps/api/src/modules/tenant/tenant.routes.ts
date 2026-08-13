import { Router } from "express";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { TenantController } from "./tenant.controller";

const router = Router();

router.use(tenantMiddleware);

router.get("/profile", TenantController.getProfile);
router.put("/profile", TenantController.updateProfile);

export const tenantRouter = router;
