import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { env } from "./env";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// Security Schemes
registry.registerComponent("securitySchemes", "TenantHeader", {
  type: "apiKey",
  in: "header",
  name: "x-tenant-id",
  description: "ID Tenant / Toko Merchant (Default: demo-tenant-01)",
});

registry.registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "JWT Auth Token",
});

// Standard Error Response Schema
export const ErrorResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({ example: "Terjadi kesalahan pada request." }),
    error: z.unknown().optional().openapi({ example: null }),
  })
  .openapi("ErrorResponse");

// Helper to create typed Success Response Schemas for Scalar UI
export function createSuccessResponseSchema<T extends z.ZodTypeAny>(
  dataSchema: T,
  messageExample = "Operasi berhasil!",
) {
  return z.object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: messageExample }),
    data: dataSchema,
  });
}

// Helper to create typed Error Response Schemas for Scalar UI
export function createErrorResponseSchema(messageExample: string) {
  return z.object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({ example: messageExample }),
    error: z.unknown().optional().openapi({ example: null }),
  });
}

export function getOpenApiDocumentation() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "ZII POS Express REST API",
      version: "1.0.0-mvp",
      description:
        "Dokumentasi Resmi ZII POS REST API (Multi-Tenant & White-Label). Setiap status code (200, 201, 400, 401, 403, 404, 500) memiliki skema JSON response lengkap.",
      contact: {
        name: "ZII Engineering Team (Zaqi, Isyadi, Ilham)",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development Server",
      },
    ],
  });
}
