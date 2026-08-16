import {
  ErrorResponseSchema,
  createErrorResponseSchema,
  createSuccessResponseSchema,
  registry,
} from "@/config/openapi-registry";
import { z } from "zod";

export const PlanSchema = z
  .object({
    id: z.string().openapi({ example: "plan-pro-01" }),
    code: z.string().openapi({ example: "pro" }),
    name: z.string().openapi({ example: "Pro Merchant White-Label" }),
    price: z.number().openapi({ example: 99000 }),
    billingCycle: z.string().openapi({ example: "monthly" }),
    maxCashiers: z.number().int().openapi({ example: 5 }),
    allowWhiteLabel: z.boolean().openapi({ example: true }),
    allowExportExcel: z.boolean().openapi({ example: true }),
    featuresJson: z.string().openapi({
      example:
        '["Multi-kasir hingga 5 user","Custom Logo & Header Struk","Ekspor Laporan Excel / CSV","Support Prioritas WA 24/7"]',
    }),
    isActive: z.boolean().openapi({ example: true }),
    createdAt: z.string().openapi({ example: "2026-08-13T14:00:00.000Z" }),
  })
  .openapi("Plan");

export const CreatePlanSchema = z
  .object({
    code: z.string().openapi({ example: "starter" }),
    name: z.string().openapi({ example: "Starter Merchant" }),
    price: z.number().openapi({ example: 49000 }),
    billingCycle: z
      .enum(["monthly", "yearly"])
      .optional()
      .openapi({ example: "monthly" }),
    maxCashiers: z.number().int().optional().openapi({ example: 1 }),
    allowWhiteLabel: z.boolean().optional().openapi({ example: false }),
    allowExportExcel: z.boolean().optional().openapi({ example: false }),
    featuresJson: z.union([z.string(), z.array(z.string())]).openapi({
      example:
        '["1 Akun Kasir", "Laporan Transaksi Harian", "Cetak Struk Thermal"]',
    }),
    isActive: z.boolean().optional().openapi({ example: true }),
  })
  .openapi("CreatePlanInput");

export const UpdatePlanSchema = z
  .object({
    name: z.string().optional().openapi({ example: "Pro Merchant Updated" }),
    price: z.number().optional().openapi({ example: 89000 }),
    billingCycle: z
      .enum(["monthly", "yearly"])
      .optional()
      .openapi({ example: "monthly" }),
    maxCashiers: z.number().int().optional().openapi({ example: 5 }),
    allowWhiteLabel: z.boolean().optional().openapi({ example: true }),
    allowExportExcel: z.boolean().optional().openapi({ example: true }),
    featuresJson: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .openapi({
        example: '["Multi-kasir 5 user", "Custom Logo Struk", "Ekspor Excel"]',
      }),
    isActive: z.boolean().optional().openapi({ example: true }),
  })
  .openapi("UpdatePlanInput");

// GET /api/v1/plans
registry.registerPath({
  method: "get",
  path: "/api/v1/plans",
  summary: "Daftar Paket Langganan Aktif (Public Onboarding)",
  tags: ["SaaS Plans"],
  responses: {
    200: {
      description: "200 OK — Berhasil mengambil paket aktif",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            z.array(PlanSchema),
            "Berhasil mengambil daftar paket langganan aktif",
          ),
        },
      },
    },
    500: {
      description: "500 Internal Server Error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// GET /api/v1/plans/:id
registry.registerPath({
  method: "get",
  path: "/api/v1/plans/{id}",
  summary: "Detail Paket Berdasarkan ID",
  tags: ["SaaS Plans"],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "plan-pro-01" }),
    }),
  },
  responses: {
    200: {
      description: "200 OK — Detail paket berhasil diambil",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            PlanSchema,
            "Berhasil mengambil detail paket",
          ),
        },
      },
    },
    404: {
      description: "404 Not Found — Paket tidak ditemukan",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Paket SaaS tidak ditemukan."),
        },
      },
    },
  },
});
