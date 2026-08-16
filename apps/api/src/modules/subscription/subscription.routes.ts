import { Router } from "express";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { SubscriptionController } from "./subscription.controller";

export const subscriptionRouter = Router();

// Public Webhook callback from Payment Gateway (Midtrans/Xendit)
subscriptionRouter.post("/webhook", SubscriptionController.webhook);

// Public route to view / download generated PDF invoice
subscriptionRouter.get(
  "/invoice/:invoiceId/pdf",
  SubscriptionController.downloadInvoicePdf,
);

// Protected Merchant Routes (requires x-tenant-id)
subscriptionRouter.get(
  "/current",
  tenantMiddleware,
  SubscriptionController.getCurrentSubscription,
);
subscriptionRouter.post(
  "/checkout",
  tenantMiddleware,
  SubscriptionController.checkout,
);
