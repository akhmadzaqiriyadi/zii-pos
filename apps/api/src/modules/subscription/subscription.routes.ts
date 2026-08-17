import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { SubscriptionController } from "./subscription.controller";

export const subscriptionRouter = Router();

// 🌐 Public Webhook callback from Payment Gateway (Midtrans/Xendit)
subscriptionRouter.post("/webhook", SubscriptionController.webhook);

// 🌐 Public route to view / download generated PDF invoice
subscriptionRouter.get(
  "/invoice/:invoiceId/pdf",
  SubscriptionController.downloadInvoicePdf,
);

// 🔒 Protected Merchant Subscription Routes (Requires Owner or Superadmin)
subscriptionRouter.get(
  "/current",
  tenantMiddleware,
  authMiddleware,
  requireRole("owner"),
  SubscriptionController.getCurrentSubscription,
);

subscriptionRouter.post(
  "/checkout",
  tenantMiddleware,
  authMiddleware,
  requireRole("owner"),
  SubscriptionController.checkout,
);
