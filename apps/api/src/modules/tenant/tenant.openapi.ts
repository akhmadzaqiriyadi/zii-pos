import {
  createErrorResponseSchema,
  createSuccessResponseSchema,
  registry,
} from "@/config/openapi-registry";
import { z } from "zod";

export const TenantSchema = z
  .object({
    id: z.string().openapi({ example: "demo-tenant-01" }),
    name: z.string().openapi({ example: "ZII Distro & Laundry Studio" }),
    subdomain: z.string().nullable().openapi({ example: "ziidistro" }),
    logoUrl: z.string().nullable().openapi({
      example: "https://placehold.co/120x120/1e293b/ffffff?text=ZII+STORE",
    }),
    phone: z.string().nullable().openapi({ example: "0812-9988-7766" }),
    address: z
      .string()
      .nullable()
      .openapi({ example: "Jl. Merdeka Raya No. 45, Jakarta" }),
    receiptFooter: z
      .string()
      .nullable()
      .openapi({ example: "Terima kasih telah berbelanja di ZII Store!" }),
    status: z.string().openapi({ example: "active" }),
    createdAt: z.string().openapi({ example: "2026-08-13T14:00:00.000Z" }),
  })
  .openapi("Tenant");

export const UpdateTenantProfileSchema = z
  .object({
    name: z.string().optional().openapi({ example: "ZII Store Premium" }),
    logoUrl: z
      .string()
      .optional()
      .openapi({ example: "https://my-brand.com/logo.png" }),
    phone: z.string().optional().openapi({ example: "081234567890" }),
    address: z
      .string()
      .optional()
      .openapi({ example: "Jl. Sudirman No. 10, Jakarta" }),
    receiptFooter: z.string().optional().openapi({
      example: "Garansi resmi 30 hari. Syarat & Ketentuan berlaku.",
    }),
  })
  .openapi("UpdateTenantInput");

export const CashierUserSchema = z.object({
  id: z.string().openapi({ example: "usr-cashier-01" }),
  name: z.string().openapi({ example: "Budi Santoso" }),
  email: z.string().email().openapi({ example: "budi@distrojaya.com" }),
  role: z.string().openapi({ example: "cashier" }),
  roleId: z.string().nullable().openapi({ example: "role-custom-01" }),
  createdAt: z.string().openapi({ example: "2026-08-15T10:00:00.000Z" }),
});

export const CreateCashierBodySchema = z
  .object({
    name: z.string().openapi({ example: "Budi Santoso" }),
    email: z.string().email().openapi({ example: "budi@distrojaya.com" }),
    password: z.string().min(6).openapi({ example: "password123" }),
    roleId: z.string().optional().openapi({ example: "role-custom-01" }),
  })
  .openapi("CreateCashierInput");

// GET /api/v1/tenants/by-subdomain/{subdomain}
registry.registerPath({
  method: "get",
  path: "/api/v1/tenants/by-subdomain/{subdomain}",
  summary: "Ambil Data & Branding Toko Berdasarkan Subdomain (Public)",
  tags: ["Tenants"],
  request: {
    params: z.object({
      subdomain: z.string().openapi({ example: "ziidistro" }),
    }),
  },
  responses: {
    200: {
      description: "200 OK — Data toko ditemukan",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            TenantSchema,
            "Berhasil mengambil data toko dari subdomain",
          ),
        },
      },
    },
    404: {
      description: "404 Not Found — Subdomain toko tidak ditemukan",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Toko tidak ditemukan."),
        },
      },
    },
  },
});

// GET /api/v1/tenants/profile
registry.registerPath({
  method: "get",
  path: "/api/v1/tenants/profile",
  summary: "Ambil Profil Merchant & Setting White-Label",
  tags: ["Tenants"],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: "200 OK — Profil merchant berhasil diambil",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            TenantSchema,
            "Berhasil mengambil profil merchant",
          ),
        },
      },
    },
    401: {
      description: "401 Unauthorized — Sesi login tidak valid",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Autentikasi gagal."),
        },
      },
    },
  },
});

// PUT /api/v1/tenants/profile
registry.registerPath({
  method: "put",
  path: "/api/v1/tenants/profile",
  summary: "Update Pengaturan White-Label Struk & Profile Merchant",
  tags: ["Tenants"],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateTenantProfileSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "200 OK — Pengaturan White-Label merchant berhasil disimpan",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            TenantSchema,
            "Pengaturan White-Label merchant berhasil disimpan!",
          ),
        },
      },
    },
    403: {
      description:
        "403 Forbidden — Hanya Owner/Superadmin yang dapat mengubah profil",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Akses ditolak."),
        },
      },
    },
  },
});

// GET /api/v1/tenants/cashiers
registry.registerPath({
  method: "get",
  path: "/api/v1/tenants/cashiers",
  summary: "Ambil Daftar Staf Kasir & Informasi Kuota Paket Toko",
  tags: ["Tenants"],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: "200 OK — Daftar kasir berhasil diambil",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            z.object({
              users: z.array(CashierUserSchema),
              currentCount: z.number().openapi({ example: 2 }),
              maxCashiers: z.number().openapi({ example: 5 }),
              planName: z
                .string()
                .openapi({ example: "Pro Merchant White-Label" }),
              isQuotaExceeded: z.boolean().openapi({ example: false }),
            }),
            "Daftar kasir berhasil diambil",
          ),
        },
      },
    },
  },
});

// POST /api/v1/tenants/cashiers
registry.registerPath({
  method: "post",
  path: "/api/v1/tenants/cashiers",
  summary: "Tambah Akun Staf Kasir Baru",
  tags: ["Tenants"],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateCashierBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "201 Created — Akun kasir baru berhasil dibuat",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            CashierUserSchema,
            "Akun kasir baru berhasil ditambahkan!",
          ),
        },
      },
    },
  },
});

// DELETE /api/v1/tenants/cashiers/{id}
registry.registerPath({
  method: "delete",
  path: "/api/v1/tenants/cashiers/{id}",
  summary: "Hapus Akun Staf Kasir Toko",
  tags: ["Tenants"],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "usr-cashier-01" }),
    }),
  },
  responses: {
    200: {
      description: "200 OK — Kasir berhasil dihapus",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            z.null(),
            "Akun kasir berhasil dihapus.",
          ),
        },
      },
    },
  },
});
