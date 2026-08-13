import { ErrorResponseSchema, registry } from "@/config/openapi-registry";
import { z } from "zod";

export const CreateTransactionSchema = z
  .object({
    customerName: z.string().optional().openapi({ example: "Budi" }),
    customerPhone: z.string().optional().openapi({ example: "081234567890" }),
    paymentMethod: z
      .enum(["cash", "qris", "transfer"])
      .openapi({ example: "cash" }),
    items: z
      .array(
        z.object({
          productId: z.string().openapi({ example: "p1" }),
          qty: z.number().int().positive().openapi({ example: 2 }),
        }),
      )
      .min(1)
      .openapi({ description: "Daftar item belanja" }),
  })
  .openapi("CreateTransactionInput");

registry.registerPath({
  method: "get",
  path: "/api/v1/transactions",
  summary: "Ambil Riwayat Transaksi Penjualan Merchant",
  tags: ["Transactions"],
  security: [{ TenantHeader: [] }],
  responses: {
    200: {
      description: "200 OK — Data riwayat transaksi ditemukan",
    },
    401: {
      description: "401 Unauthorized — Tenant Header missing",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    500: {
      description: "500 Internal Server Error — Kesalahan server",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

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
    },
    400: {
      description:
        "400 Bad Request — Items kosong / stok produk tidak mencukupi",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    401: {
      description: "401 Unauthorized — Tenant Header missing",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "404 Not Found — Salah satu ID Produk tidak ditemukan",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    500: {
      description:
        "500 Internal Server Error — Gagal memproses transaksi database",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});
