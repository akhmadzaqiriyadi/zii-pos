import { Router } from "express";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.use(tenantMiddleware);

/**
 * @openapi
 * /api/v1/transactions:
 *   get:
 *     summary: Ambil Riwayat Transaksi Penjualan Merchant
 *     tags:
 *       - Transactions
 *     security:
 *       - TenantHeader: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data riwayat transaksi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Berhasil mengambil riwayat transaksi
 *               data:
 *                 - id: trx-1723456789
 *                   tenantId: demo-tenant-01
 *                   customerName: Budi
 *                   customerPhone: 081234567890
 *                   paymentMethod: cash
 *                   totalAmount: 105000
 *                   status: completed
 *                   createdAt: 2026-08-13T14:00:00.000Z
 *                   items:
 *                     - productId: p1
 *                       productName: Kaos Polos Cotton 30s
 *                       price: 65000
 *                       qty: 1
 *                       subtotal: 65000
 *                     - productId: p3
 *                       productName: Jasa Potong & Styling
 *                       price: 40000
 *                       qty: 1
 *                       subtotal: 40000
 *   post:
 *     summary: Simpan Transaksi Penjualan Baru & Otomatis Potong Stok
 *     tags:
 *       - Transactions
 *     security:
 *       - TenantHeader: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: Budi
 *               customerPhone:
 *                 type: string
 *                 example: 081234567890
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, qris, transfer]
 *                 example: cash
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - qty
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: p1
 *                     qty:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       201:
 *         description: Transaksi berhasil disimpan & stok terpotong
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Transaksi berhasil disimpan!
 *               data:
 *                 id: trx-1723456789
 *                 tenantId: demo-tenant-01
 *                 customerName: Budi
 *                 customerPhone: 081234567890
 *                 paymentMethod: cash
 *                 totalAmount: 65000
 *                 status: completed
 *                 createdAt: 2026-08-13T14:00:00.000Z
 *                 items:
 *                   - productId: p1
 *                     productName: Kaos Polos Cotton 30s
 *                     price: 65000
 *                     qty: 1
 *                     subtotal: 65000
 */
router.get("/", TransactionController.getTransactions);
router.post("/", TransactionController.createTransaction);

export const transactionRouter = router;
