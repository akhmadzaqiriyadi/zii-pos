import { Router } from "express";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { TransactionController } from "./transaction.controller";
const router = Router();
router.use(tenantMiddleware);
router.get("/", TransactionController.getTransactions);
router.post("/", TransactionController.createTransaction);
export const transactionRouter = router;
