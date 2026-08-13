import { ErrorResponseSchema, registry } from "@/config/openapi-registry";
import { z } from "zod";

export const RegisterTenantBodySchema = z
  .object({
    tenantName: z.string().openapi({ example: "ZII Distro & Laundry Studio" }),
    ownerName: z.string().openapi({ example: "Zaqi" }),
    email: z.string().email().openapi({ example: "zaqi@zii.id" }),
    password: z.string().min(6).openapi({ example: "password123" }),
    phone: z.string().optional().openapi({ example: "081299887766" }),
    address: z
      .string()
      .optional()
      .openapi({ example: "Jl. Merdeka No. 45, Jakarta" }),
  })
  .openapi("RegisterTenantInput");

export const LoginBodySchema = z
  .object({
    email: z.string().email().openapi({ example: "zaqi@zii.id" }),
    password: z.string().openapi({ example: "password123" }),
  })
  .openapi("LoginInput");

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/register-tenant",
  summary: "Register Tenant / Merchant Baru & Account Owner",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterTenantBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "201 Created — Pendaftaran merchant berhasil",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Pendaftaran Merchant ZII POS berhasil!" }),
            data: z.object({
              token: z
                .string()
                .openapi({
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                }),
              tenant: z.object({ id: z.string(), name: z.string() }),
              user: z.object({
                id: z.string(),
                email: z.string(),
                role: z.string(),
              }),
            }),
          }),
        },
      },
    },
    400: {
      description:
        "400 Bad Request — Input validasi gagal atau email sudah terdaftar",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    500: {
      description: "500 Internal Server Error — Kesalahan server/database",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/login",
  summary: "Login User Kasir / Owner",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "200 OK — Login berhasil, mengembalikan JWT Token",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: "Login berhasil!" }),
            data: z.object({
              token: z
                .string()
                .openapi({
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                }),
            }),
          }),
        },
      },
    },
    401: {
      description: "401 Unauthorized — Email atau password salah",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    500: {
      description: "500 Internal Server Error — Kesalahan server",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
});
