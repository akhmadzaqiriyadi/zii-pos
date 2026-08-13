import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ZII POS Express REST API",
      version: "1.0.0",
      description:
        "Dokumentasi Resmi OpenAPI / Swagger REST API ZII POS (White-Label General Retail & Service POS)",
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
    components: {
      securitySchemes: {
        TenantHeader: {
          type: "apiKey",
          in: "header",
          name: "x-tenant-id",
          description: "ID Tenant / Toko Merchant (Default: demo-tenant-01)",
        },
      },
    },
    security: [
      {
        TenantHeader: [],
      },
    ],
  },
  apis: [
    "./apps/api/src/modules/**/*.routes.ts",
    "./src/modules/**/*.routes.ts",
    "./apps/api/src/app.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
