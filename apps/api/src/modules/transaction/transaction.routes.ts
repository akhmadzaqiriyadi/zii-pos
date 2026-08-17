import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.use(tenantMiddleware);
router.use(authMiddleware);

// 🛒 Transactions (Cashier, Owner, Superadmin)
router.get(
  "/",
  requireRole("cashier", "owner"),
  TransactionController.getTransactions,
);
router.post(
  "/",
  requireRole("cashier", "owner"),
  TransactionController.createTransaction,
);

export const transactionRouter = router;
