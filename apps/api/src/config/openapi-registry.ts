import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { env } from "./env";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// Register Security Scheme (Tenant Header & Bearer Auth)
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

// Standard Error Response Schemas (400, 401, 403, 404, 500)
export const ErrorResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({ example: "Terjadi kesalahan pada server." }),
    errors: z.unknown().optional().openapi({ example: null }),
  })
  .openapi("ErrorResponse");

// Helper function to generate standardized OpenAPI specs with full 200, 400, 401, 403, 404, 500 responses
export function getOpenApiDocumentation() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "ZII POS Express REST API (Auto OpenAPI)",
      version: "1.0.0-mvp",
      description:
        "Dokumentasi Resmi ZII POS REST API (Multi-Tenant & White-Label). Dilengkapi status code lengkap (200, 201, 400, 401, 403, 404, 500).",
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
