import {
  createErrorResponseSchema,
  createSuccessResponseSchema,
  registry,
} from "@/config/openapi-registry";
import { z } from "zod";

export const PermissionItemSchema = z.object({
  code: z.string().openapi({ example: "products:create" }),
  name: z.string().openapi({ example: "Tambah Produk Baru" }),
  category: z.string().openapi({ example: "Produk & Stok" }),
  description: z
    .string()
    .openapi({ example: "Dapat menambahkan item produk baru" }),
});

export const RoleSchema = z
  .object({
    id: z.string().openapi({ example: "role-custom-01" }),
    tenantId: z.string().nullable().openapi({ example: "tenant-distro-01" }),
    name: z.string().openapi({ example: "Supervisor Kasir" }),
    code: z.string().openapi({ example: "supervisor" }),
    description: z
      .string()
      .nullable()
      .openapi({ example: "Dapat memberikan diskon dan melihat transaksi" }),
    isSystem: z.boolean().openapi({ example: false }),
    permissions: z
      .array(z.string())
      .openapi({
        example: ["pos:access", "pos:discount", "transactions:read"],
      }),
    createdAt: z.string().openapi({ example: "2026-08-17T10:00:00.000Z" }),
  })
  .openapi("Role");

export const CreateRoleBodySchema = z
  .object({
    name: z.string().min(2).openapi({ example: "Admin Gudang" }),
    code: z.string().min(2).openapi({ example: "warehouse_admin" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "Hanya mengelola stok barang" }),
    permissions: z
      .array(z.string())
      .openapi({
        example: ["products:read", "products:create", "products:update"],
      }),
  })
  .openapi("CreateRoleInput");

export const UpdateRoleBodySchema = z
  .object({
    name: z.string().optional().openapi({ example: "Supervisor Lead" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "Full kasir & void transaksi" }),
    permissions: z
      .array(z.string())
      .optional()
      .openapi({ example: ["pos:access", "pos:discount", "pos:void_tx"] }),
  })
  .openapi("UpdateRoleInput");

// GET /api/v1/roles/permissions-catalog
registry.registerPath({
  method: "get",
  path: "/api/v1/roles/permissions-catalog",
  summary: "Ambil Katalog Izin Granular Resmi Sistem ZII POS",
  tags: ["Roles & Permissions (RBAC)"],
  responses: {
    200: {
      description: "200 OK — Katalog permission berhasil diambil",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            z.array(PermissionItemSchema),
            "Katalog permission berhasil diambil",
          ),
        },
      },
    },
  },
});

// GET /api/v1/roles
registry.registerPath({
  method: "get",
  path: "/api/v1/roles",
  summary: "Ambil Daftar Semua Role Toko (Role Bawaan & Role Kustom)",
  tags: ["Roles & Permissions (RBAC)"],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: "200 OK — Daftar role berhasil diambil",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            z.array(RoleSchema),
            "Daftar role berhasil diambil",
          ),
        },
      },
    },
  },
});

// GET /api/v1/roles/{id}
registry.registerPath({
  method: "get",
  path: "/api/v1/roles/{id}",
  summary: "Ambil Detail Role Kustom & Matriks Izin yang Aktif",
  tags: ["Roles & Permissions (RBAC)"],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "role-custom-01" }),
    }),
  },
  responses: {
    200: {
      description: "200 OK — Detail role berhasil diambil",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            RoleSchema,
            "Detail role berhasil diambil",
          ),
        },
      },
    },
    404: {
      description: "404 Not Found — Role tidak ditemukan",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Role tidak ditemukan."),
        },
      },
    },
  },
});

// POST /api/v1/roles
registry.registerPath({
  method: "post",
  path: "/api/v1/roles",
  summary: "Buat Role Kustom Baru dengan Checklist Izin",
  tags: ["Roles & Permissions (RBAC)"],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateRoleBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "201 Created — Role kustom baru berhasil dibuat",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            RoleSchema,
            "Role kustom baru berhasil dibuat!",
          ),
        },
      },
    },
  },
});

// PUT /api/v1/roles/{id}
registry.registerPath({
  method: "put",
  path: "/api/v1/roles/{id}",
  summary: "Perbarui Nama, Deskripsi, atau Matriks Izin Role Kustom",
  tags: ["Roles & Permissions (RBAC)"],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "role-custom-01" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateRoleBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "200 OK — Role kustom berhasil diperbarui",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            RoleSchema,
            "Role kustom berhasil diperbarui!",
          ),
        },
      },
    },
  },
});

// DELETE /api/v1/roles/{id}
registry.registerPath({
  method: "delete",
  path: "/api/v1/roles/{id}",
  summary: "Hapus Role Kustom Toko",
  tags: ["Roles & Permissions (RBAC)"],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "role-custom-01" }),
    }),
  },
  responses: {
    200: {
      description: "200 OK — Role berhasil dihapus",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            z.null(),
            "Role berhasil dihapus.",
          ),
        },
      },
    },
  },
});
