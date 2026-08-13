import { z } from "zod";
import { ErrorResponseSchema, registry } from "../../config/openapi-registry";

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

registry.registerPath({
  method: "get",
  path: "/api/v1/tenants/profile",
  summary: "Ambil Profil Merchant & Setting White-Label",
  tags: ["Tenants"],
  security: [{ TenantHeader: [] }],
  responses: {
    200: {
      description: "200 OK — Profil merchant berhasil diambil",
    },
    401: {
      description:
        "401 Unauthorized — Tenant Header (x-tenant-id) tidak valid / missing",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    404: {
      description: "404 Not Found — Merchant tidak ditemukan",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    500: {
      description: "500 Internal Server Error — Kesalahan server",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

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
      description: "200 OK — Pengaturan merchant berhasil disimpan",
    },
    400: {
      description: "400 Bad Request — Format data tidak valid",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    401: {
      description: "401 Unauthorized — Header x-tenant-id hilang/salah",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    403: {
      description:
        "403 Forbidden — Hanya Owner yang boleh mengubah profil toko",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    500: {
      description: "500 Internal Server Error — Kesalahan database server",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});
