import { Router } from "express";
import { PlanController } from "../plan/plan.controller";
import { SaaSAdminController } from "./saas-admin.controller";

export const saasAdminRouter = Router();

// Metrics & Analytics
saasAdminRouter.get("/metrics", SaaSAdminController.getMetrics);

// Merchant Management
saasAdminRouter.get("/tenants", SaaSAdminController.getTenants);
saasAdminRouter.put(
  "/tenants/:id/status",
  SaaSAdminController.updateTenantStatus,
);

// Dynamic SaaS Plan CRUD for Super Admin
saasAdminRouter.get("/plans", PlanController.getAllPlans);
saasAdminRouter.post("/plans", PlanController.createPlan);
saasAdminRouter.put("/plans/:id", PlanController.updatePlan);
saasAdminRouter.delete("/plans/:id", PlanController.deletePlan);
