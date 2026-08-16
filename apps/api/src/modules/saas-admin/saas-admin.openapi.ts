import {
  ErrorResponseSchema,
  createErrorResponseSchema,
  createPaginatedResponseSchema,
  createSuccessResponseSchema,
  registry,
} from "@/config/openapi-registry";
import { z } from "zod";
import {
  CreatePlanSchema,
  PlanSchema,
  UpdatePlanSchema,
} from "../plan/plan.openapi";

export const SaaSMetricsSchema = z
  .object({
    totalMerchants: z.number().int().openapi({ example: 42 }),
    activeTrials: z.number().int().openapi({ example: 15 }),
    activePaidMerchants: z.number().int().openapi({ example: 25 }),
    expiredMerchants: z.number().int().openapi({ example: 2 }),
    suspendedMerchants: z.number().int().openapi({ example: 0 }),
    mrr: z.number().openapi({ example: 2475000 }),
    churnRate: z.number().openapi({ example: 4.76 }),
  })
  .openapi("SaaSMetrics");

export const AdminTenantItemSchema = z
  .object({
    id: z.string().openapi({ example: "tenant-01" }),
    name: z.string().openapi({ example: "ZII Distro Studio" }),
    subdomain: z.string().nullable().openapi({ example: "ziidistro" }),
    status: z.string().openapi({ example: "active" }),
    logoUrl: z.string().nullable().openapi({ example: null }),
    phone: z.string().nullable().openapi({ example: "081299887766" }),
    address: z.string().nullable().openapi({ example: "Jakarta" }),
    createdAt: z.string().openapi({ example: "2026-08-13T14:00:00.000Z" }),
    totalUsers: z.number().int().openapi({ example: 3 }),
    totalProducts: z.number().int().openapi({ example: 120 }),
    totalTransactions: z.number().int().openapi({ example: 540 }),
    subscription: z
      .object({
        id: z.string().openapi({ example: "sub-01" }),
        status: z.string().openapi({ example: "active" }),
        planCode: z.string().openapi({ example: "pro" }),
        planName: z.string().openapi({ example: "Pro Merchant White-Label" }),
        startsAt: z.string().openapi({ example: "2026-08-13T14:00:00.000Z" }),
        expiresAt: z.string().openapi({ example: "2026-09-13T14:00:00.000Z" }),
        autoRenew: z.boolean().openapi({ example: true }),
      })
      .nullable()
      .openapi({ example: null }),
  })
  .openapi("AdminTenantItem");

export const UpdateTenantStatusSchema = z
  .object({
    status: z
      .enum(["trial", "active", "expired", "suspended"])
      .openapi({ example: "active" }),
  })
  .openapi("UpdateTenantStatusInput");

// GET /api/v1/saas-admin/metrics
registry.registerPath({
  method: "get",
  path: "/api/v1/saas-admin/metrics",
  summary: "Rekap Total Merchant, Trial Aktif, MRR, & Churn Rate",
  tags: ["SaaS Super Admin"],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: "200 OK — Metrik SaaS berhasil diambil",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            SaaSMetricsSchema,
            "Berhasil mengambil metrik SaaS ZII POS",
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

// GET /api/v1/saas-admin/tenants
registry.registerPath({
  method: "get",
  path: "/api/v1/saas-admin/tenants",
  summary: "Daftar Seluruh Toko Terdaftar & Status Lisensi (Paginated)",
  tags: ["SaaS Super Admin"],
  security: [{ BearerAuth: [] }],
  request: {
    query: z.object({
      page: z.string().optional().openapi({ example: "1" }),
      limit: z.string().optional().openapi({ example: "10" }),
      search: z.string().optional().openapi({ example: "distro" }),
      status: z
        .enum(["trial", "active", "expired", "suspended"])
        .optional()
        .openapi({ example: "active" }),
    }),
  },
  responses: {
    200: {
      description: "200 OK — Daftar merchant berhasil diambil",
      content: {
        "application/json": {
          schema: createPaginatedResponseSchema(
            AdminTenantItemSchema,
            "Berhasil mengambil data merchant",
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

// PUT /api/v1/saas-admin/tenants/:id/status
registry.registerPath({
  method: "put",
  path: "/api/v1/saas-admin/tenants/{id}/status",
  summary: "Suspend / Modifikasi Lisensi Status Toko Manual",
  tags: ["SaaS Super Admin"],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "tenant-01" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateTenantStatusSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "200 OK — Status toko berhasil diubah",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            z.object({ id: z.string(), status: z.string() }),
            "Status merchant berhasil diubah",
          ),
        },
      },
    },
    400: {
      description: "400 Bad Request — Status tidak valid",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Status tidak valid."),
        },
      },
    },
  },
});

// Admin Plan endpoints
registry.registerPath({
  method: "get",
  path: "/api/v1/saas-admin/plans",
  summary: "Daftar Semua Paket SaaS (Super Admin)",
  tags: ["SaaS Plans Admin"],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: "200 OK — Seluruh paket SaaS berhasil diambil",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            z.array(PlanSchema),
            "Berhasil mengambil seluruh data paket SaaS",
          ),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/saas-admin/plans",
  summary: "Tambah Paket Langganan Baru",
  tags: ["SaaS Plans Admin"],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreatePlanSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "201 Created — Paket baru berhasil dibuat",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            PlanSchema,
            "Paket langganan baru berhasil dibuat!",
          ),
        },
      },
    },
    400: {
      description: "400 Bad Request — Validasi gagal",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Kolom wajib diisi."),
        },
      },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/v1/saas-admin/plans/{id}",
  summary: "Edit Harga, Batas Kasir, & Fitur Paket",
  tags: ["SaaS Plans Admin"],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "plan-pro-01" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdatePlanSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "200 OK — Paket berhasil diperbarui",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            PlanSchema,
            "Paket SaaS berhasil diperbarui!",
          ),
        },
      },
    },
    400: {
      description: "400 Bad Request — Gagal update paket",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Gagal memperbarui paket SaaS."),
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/saas-admin/plans/{id}",
  summary: "Nonaktifkan / Hapus Paket",
  tags: ["SaaS Plans Admin"],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "plan-pro-01" }),
    }),
  },
  responses: {
    200: {
      description: "200 OK — Paket berhasil dinonaktifkan/dihapus",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            z.object({ id: z.string() }),
            "Paket berhasil dinonaktifkan/dihapus!",
          ),
        },
      },
    },
  },
});
