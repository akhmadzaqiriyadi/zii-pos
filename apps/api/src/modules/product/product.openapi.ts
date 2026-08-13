import { z } from "zod";
import { ErrorResponseSchema, registry } from "../../config/openapi-registry";

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
  summary: "Mengambil Katalog Produk & Jasa Merchant",
  tags: ["Products"],
  security: [{ TenantHeader: [] }],
  responses: {
    200: {
      description: "200 OK — Katalog produk berhasil diambil",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Berhasil mengambil katalog produk" }),
            data: z.array(ProductSchema),
          }),
        },
      },
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
