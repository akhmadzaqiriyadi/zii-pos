import { createErrorResponseSchema, createSuccessResponseSchema, registry, } from "@/config/openapi-registry";
import { z } from "zod";
export const TransactionItemSchema = z.object({
    productId: z.string().openapi({ example: "p1" }),
    productName: z.string().openapi({ example: "Kaos Polos Cotton 30s" }),
    price: z.number().openapi({ example: 65000 }),
    qty: z.number().int().openapi({ example: 2 }),
    subtotal: z.number().openapi({ example: 130000 }),
});
export const TransactionSchema = z
    .object({
    id: z.string().openapi({ example: "trx-1723456789" }),
    tenantId: z.string().openapi({ example: "demo-tenant-01" }),
    customerName: z.string().openapi({ example: "Budi" }),
    customerPhone: z.string().nullable().openapi({ example: "081234567890" }),
    paymentMethod: z
        .enum(["cash", "qris", "transfer"])
        .openapi({ example: "cash" }),
    totalAmount: z.number().openapi({ example: 130000 }),
    status: z.string().openapi({ example: "completed" }),
    createdAt: z.string().openapi({ example: "2026-08-13T14:00:00.000Z" }),
    items: z.array(TransactionItemSchema),
})
    .openapi("Transaction");
export const CreateTransactionSchema = z
    .object({
    customerName: z.string().optional().openapi({ example: "Budi" }),
    customerPhone: z.string().optional().openapi({ example: "081234567890" }),
    paymentMethod: z
        .enum(["cash", "qris", "transfer"])
        .openapi({ example: "cash" }),
    items: z
        .array(z.object({
        productId: z.string().openapi({ example: "p1" }),
        qty: z.number().int().positive().openapi({ example: 2 }),
    }))
        .min(1)
        .openapi({ description: "Daftar item belanja" }),
})
    .openapi("CreateTransactionInput");
// GET /api/v1/transactions
registry.registerPath({
    method: "get",
    path: "/api/v1/transactions",
    summary: "Ambil Riwayat Transaksi Penjualan Merchant",
    tags: ["Transactions"],
    security: [{ TenantHeader: [] }],
    responses: {
        200: {
            description: "200 OK — Data riwayat transaksi berhasil diambil",
            content: {
                "application/json": {
                    schema: createSuccessResponseSchema(z.array(TransactionSchema), "Berhasil mengambil riwayat transaksi"),
                },
            },
        },
        401: {
            description: "401 Unauthorized — Header x-tenant-id hilang atau tidak valid",
            content: {
                "application/json": {
                    schema: createErrorResponseSchema("Header x-tenant-id wajib diisi."),
                },
            },
        },
        500: {
            description: "500 Internal Server Error — Kesalahan server",
            content: {
                "application/json": {
                    schema: createErrorResponseSchema("Gagal mengambil riwayat transaksi."),
                },
            },
        },
    },
});
// POST /api/v1/transactions
registry.registerPath({
    method: "post",
    path: "/api/v1/transactions",
    summary: "Simpan Transaksi Penjualan Baru & Otomatis Potong Stok",
    tags: ["Transactions"],
    security: [{ TenantHeader: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateTransactionSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "201 Created — Transaksi berhasil disimpan & stok terpotong",
            content: {
                "application/json": {
                    schema: createSuccessResponseSchema(TransactionSchema, "Transaksi berhasil disimpan!"),
                },
            },
        },
        400: {
            description: "400 Bad Request — Items kosong / stok produk tidak mencukupi",
            content: {
                "application/json": {
                    schema: createErrorResponseSchema("Item transaksi tidak boleh kosong."),
                },
            },
        },
        401: {
            description: "401 Unauthorized — Header x-tenant-id hilang atau tidak valid",
            content: {
                "application/json": {
                    schema: createErrorResponseSchema("Header x-tenant-id wajib diisi."),
                },
            },
        },
        404: {
            description: "404 Not Found — ID produk tidak ditemukan dalam katalog merchant",
            content: {
                "application/json": {
                    schema: createErrorResponseSchema("Produk tidak ditemukan."),
                },
            },
        },
        500: {
            description: "500 Internal Server Error — Gagal memproses transaksi database",
            content: {
                "application/json": {
                    schema: createErrorResponseSchema("Gagal memproses transaksi."),
                },
            },
        },
    },
});
