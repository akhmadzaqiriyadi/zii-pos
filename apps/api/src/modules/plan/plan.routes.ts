import { Router } from "express";
import { PlanController } from "./plan.controller";

export const planRouter = Router();

// Public route for Onboarding & Pricing page
planRouter.get("/", PlanController.getActivePlans);
planRouter.get("/:id", PlanController.getPlanById);
