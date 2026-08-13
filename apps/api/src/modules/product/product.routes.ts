import { Router } from "express";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { ProductController } from "./product.controller";

const router = Router();

router.use(tenantMiddleware);

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Mengambil Katalog Produk & Jasa Merchant
 *     tags:
 *       - Products
 *     security:
 *       - TenantHeader: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data produk
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Berhasil mengambil katalog produk
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       stock:
 *                         type: integer
 *                       isService:
 *                         type: boolean
 */
router.get("/", ProductController.getProducts);

export const productRouter = router;
