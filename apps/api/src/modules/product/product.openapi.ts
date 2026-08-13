import {
  createErrorResponseSchema,
  createPaginatedResponseSchema,
  registry,
} from "@/config/openapi-registry";
import { z } from "zod";

export const ProductSchema = z
  .object({
    id: z.string().openapi({ example: "p1" }),
    name: z.string().openapi({ example: "Kaos Polos Cotton 30s" }),
    price: z.number().openapi({ example: 65000 }),
    stock: z.number().int().openapi({ example: 45 }),
    isService: z.boolean().openapi({ example: false }),
  })
  .openapi("Product");

registry.registerPath({
  method: "get",
  path: "/api/v1/products",
  summary:
    "Mengambil Katalog Produk & Jasa Merchant (dengan Filter & Paginasi)",
  tags: ["Products"],
  security: [{ TenantHeader: [] }],
  request: {
    query: z.object({
      page: z
        .string()
        .optional()
        .openapi({ example: "1", description: "Nomor halaman (default: 1)" }),
      limit: z.string().optional().openapi({
        example: "10",
        description: "Jumlah item per halaman (default: 10)",
      }),
      search: z.string().optional().openapi({
        example: "Kaos",
        description: "Filter pencarian nama produk",
      }),
    }),
  },
  responses: {
    200: {
      description:
        "200 OK — Katalog produk berhasil diambil dengan objek metadata paginasi",
      content: {
        "application/json": {
          schema: createPaginatedResponseSchema(
            ProductSchema,
            "Berhasil mengambil katalog produk",
          ),
        },
      },
    },
    401: {
      description: "401 Unauthorized — Tenant Header (x-tenant-id) missing",
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
          schema: createErrorResponseSchema("Gagal mengambil katalog produk."),
        },
      },
    },
  },
});
