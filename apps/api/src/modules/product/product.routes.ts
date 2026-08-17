import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/permission.middleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { ProductController } from "./product.controller";

const router = Router();

router.use(tenantMiddleware);
router.use(authMiddleware);

// 📦 Read Catalog (pos:access or products:read)
router.get(
  "/",
  requirePermission("products:read", "pos:access"),
  ProductController.getProducts,
);

// 🔒 Granular Product Management Mutations
router.post(
  "/",
  requirePermission("products:create"),
  ProductController.createProduct,
);
router.put(
  "/:id",
  requirePermission("products:update"),
  ProductController.updateProduct,
);
router.delete(
  "/:id",
  requirePermission("products:delete"),
  ProductController.deleteProduct,
);

export const productRouter = router;
