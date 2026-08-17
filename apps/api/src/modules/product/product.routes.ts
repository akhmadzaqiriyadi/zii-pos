import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { ProductController } from "./product.controller";

const router = Router();

router.use(tenantMiddleware);
router.use(authMiddleware);

// 📦 Read Catalog (Cashier, Owner, Superadmin)
router.get("/", requireRole("cashier", "owner"), ProductController.getProducts);

// 🔒 Product Management Mutation (Owner & Superadmin only)
router.post("/", requireRole("owner"), ProductController.createProduct);
router.put("/:id", requireRole("owner"), ProductController.updateProduct);
router.delete("/:id", requireRole("owner"), ProductController.deleteProduct);

export const productRouter = router;
