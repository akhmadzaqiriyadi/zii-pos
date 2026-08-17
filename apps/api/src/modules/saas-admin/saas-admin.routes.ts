import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";
import { PlanController } from "../plan/plan.controller";
import { SaaSAdminController } from "./saas-admin.controller";

export const saasAdminRouter = Router();

// 🔒 Protect all SaaS Admin routes exclusively for Super Admin
saasAdminRouter.use(authMiddleware, requireRole("superadmin"));

// Metrics & Analytics
saasAdminRouter.get("/metrics", SaaSAdminController.getMetrics);

// Merchant Management
saasAdminRouter.get("/tenants", SaaSAdminController.getTenants);
saasAdminRouter.get("/tenants/:id", SaaSAdminController.getTenantDetail);
saasAdminRouter.put(
  "/tenants/:id/status",
  SaaSAdminController.updateTenantStatus,
);

// Dynamic SaaS Plan CRUD for Super Admin
saasAdminRouter.get("/plans", PlanController.getAllPlans);
saasAdminRouter.post("/plans", PlanController.createPlan);
saasAdminRouter.put("/plans/:id", PlanController.updatePlan);
saasAdminRouter.delete("/plans/:id", PlanController.deletePlan);
