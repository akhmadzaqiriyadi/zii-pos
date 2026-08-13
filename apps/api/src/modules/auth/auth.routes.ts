import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/auth/register-tenant:
 *   post:
 *     summary: Register Tenant / Merchant Baru & Account Owner
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tenantName
 *               - ownerName
 *               - email
 *               - password
 *             properties:
 *               tenantName:
 *                 type: string
 *                 example: ZII Distro & Laundry Studio
 *               ownerName:
 *                 type: string
 *                 example: Zaqi
 *               email:
 *                 type: string
 *                 example: zaqi@zii.id
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: 081299887766
 *               address:
 *                 type: string
 *                 example: Jl. Merdeka No. 45, Jakarta
 *     responses:
 *       201:
 *         description: Pendaftaran merchant berhasil
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Pendaftaran Merchant ZII POS berhasil!
 *               data:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 tenant:
 *                   id: t123-uuid
 *                   name: ZII Distro & Laundry Studio
 *                   phone: 081299887766
 *                   address: Jl. Merdeka No. 45, Jakarta
 *                   receiptFooter: Terima kasih telah berbelanja!
 *                 user:
 *                   id: u123-uuid
 *                   name: Zaqi
 *                   email: zaqi@zii.id
 *                   role: owner
 *       400:
 *         description: Validasi gagal atau email sudah terdaftar
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Email sudah terdaftar. Silakan gunakan email lain.
 */
router.post("/register-tenant", AuthController.registerTenant);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Login User Kasir / Owner
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: zaqi@zii.id
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan JWT Token & Data Tenant
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Login berhasil!
 *               data:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 tenant:
 *                   id: t123-uuid
 *                   name: ZII Distro & Laundry Studio
 *                 user:
 *                   id: u123-uuid
 *                   name: Zaqi
 *                   email: zaqi@zii.id
 *                   role: owner
 *       401:
 *         description: Email atau password salah
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Email atau password tidak valid.
 */
router.post("/login", AuthController.login);

export const authRouter = router;
