import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/permission.middleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.use(tenantMiddleware);
router.use(authMiddleware);

// 🛒 Transactions (pos:access for create, transactions:read for history)
router.get(
  "/",
  requirePermission("transactions:read", "pos:access"),
  TransactionController.getTransactions,
);
router.post(
  "/",
  requirePermission("pos:access"),
  TransactionController.createTransaction,
);

export const transactionRouter = router;
