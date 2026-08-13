import {
  ErrorResponseSchema,
  createErrorResponseSchema,
  createSuccessResponseSchema,
  registry,
} from "@/config/openapi-registry";
import { z } from "zod";

export const TenantSchema = z
  .object({
    id: z.string().openapi({ example: "demo-tenant-01" }),
    name: z.string().openapi({ example: "ZII Distro & Laundry Studio" }),
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

// GET /api/v1/tenants/profile
registry.registerPath({
  method: "get",
  path: "/api/v1/tenants/profile",
  summary: "Ambil Profil Merchant & Setting White-Label",
  tags: ["Tenants"],
  security: [{ TenantHeader: [] }],
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
      description:
        "401 Unauthorized — Header x-tenant-id hilang atau tidak valid",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Header x-tenant-id wajib diisi."),
        },
      },
    },
    404: {
      description: "404 Not Found — Merchant tidak ditemukan dalam database",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Profil merchant tidak ditemukan."),
        },
      },
    },
    500: {
      description:
        "500 Internal Server Error — Kesalahan koneksi database server",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Gagal mengambil profil merchant."),
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
  security: [{ TenantHeader: [] }],
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
    400: {
      description: "400 Bad Request — Format payload request tidak sesuai",
      content: {
        "application/json": {
          schema: createErrorResponseSchema(
            "Format data pengaturan merchant tidak valid.",
          ),
        },
      },
    },
    401: {
      description:
        "401 Unauthorized — Header x-tenant-id hilang atau tidak valid",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Header x-tenant-id wajib diisi."),
        },
      },
    },
    403: {
      description:
        "403 Forbidden — Hanya akun Owner yang memiliki akses ubah profil merchant",
      content: {
        "application/json": {
          schema: createErrorResponseSchema(
            "Akses ditolak. Hanya Role Owner yang dapat memperbarui profil.",
          ),
        },
      },
    },
    500: {
      description: "500 Internal Server Error — Kesalahan sistem database",
      content: {
        "application/json": {
          schema: createErrorResponseSchema(
            "Gagal menyimpan pengaturan merchant.",
          ),
        },
      },
    },
  },
});
