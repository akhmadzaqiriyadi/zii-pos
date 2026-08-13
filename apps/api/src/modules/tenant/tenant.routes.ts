import { Router } from "express";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { TenantController } from "./tenant.controller";

const router = Router();

router.use(tenantMiddleware);

/**
 * @openapi
 * /api/v1/tenants/profile:
 *   get:
 *     summary: Ambil Profil Merchant & Setting White-Label
 *     tags:
 *       - Tenants
 *     security:
 *       - TenantHeader: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil profil merchant
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Berhasil mengambil profil merchant
 *               data:
 *                 id: demo-tenant-01
 *                 name: ZII Distro & Laundry Studio
 *                 logoUrl: https://placehold.co/120x120/1e293b/ffffff?text=ZII+STORE
 *                 phone: 0812-9988-7766
 *                 address: Jl. Merdeka Raya No. 45, Jakarta
 *                 receiptFooter: Terima kasih telah berbelanja di ZII Store! Simpan nota ini sebagai bukti garansi.
 *   put:
 *     summary: Update Pengaturan White-Label Struk & Profile Merchant
 *     tags:
 *       - Tenants
 *     security:
 *       - TenantHeader: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: ZII Store Premium
 *               logoUrl:
 *                 type: string
 *                 example: https://my-brand.com/logo.png
 *               phone:
 *                 type: string
 *                 example: 081234567890
 *               address:
 *                 type: string
 *                 example: Jl. Sudirman No. 10, Jakarta
 *               receiptFooter:
 *                 type: string
 *                 example: Garansi resmi 30 hari. Syarat & Ketentuan berlaku.
 *     responses:
 *       200:
 *         description: Pengaturan merchant berhasil diperbarui
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Pengaturan White-Label merchant berhasil disimpan!
 *               data:
 *                 id: demo-tenant-01
 *                 name: ZII Store Premium
 *                 logoUrl: https://my-brand.com/logo.png
 *                 phone: 081234567890
 *                 address: Jl. Sudirman No. 10, Jakarta
 *                 receiptFooter: Garansi resmi 30 hari. Syarat & Ketentuan berlaku.
 */
router.get("/profile", TenantController.getProfile);
router.put("/profile", TenantController.updateProfile);

export const tenantRouter = router;
