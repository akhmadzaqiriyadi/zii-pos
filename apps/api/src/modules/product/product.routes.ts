import { Router } from "express";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { ProductController } from "./product.controller";

const router = Router();

router.use(tenantMiddleware);

router.get("/", ProductController.getProducts);
router.post("/", ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export const productRouter = router;
