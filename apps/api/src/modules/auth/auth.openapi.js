import { createErrorResponseSchema, createSuccessResponseSchema, registry, } from "@/config/openapi-registry";
import { z } from "zod";
export const AuthUserSchema = z.object({
    id: z.string().openapi({ example: "u123-uuid" }),
    name: z.string().openapi({ example: "Zaqi" }),
    email: z.string().email().openapi({ example: "zaqi@zii.id" }),
    role: z.string().openapi({ example: "owner" }),
});
export const AuthTenantSchema = z.object({
    id: z.string().openapi({ example: "t123-uuid" }),
    name: z.string().openapi({ example: "ZII Distro & Laundry Studio" }),
    phone: z.string().nullable().openapi({ example: "081299887766" }),
    address: z
        .string()
        .nullable()
        .openapi({ example: "Jl. Merdeka No. 45, Jakarta" }),
});
export const AuthResponseSchema = z.object({
    token: z.string().openapi({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1MTIzIn0...",
    }),
    tenant: AuthTenantSchema,
    user: AuthUserSchema,
});
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
                    schema: createSuccessResponseSchema(AuthResponseSchema, "Pendaftaran Merchant ZII POS berhasil!"),
                },
            },
        },
        400: {
            description: "400 Bad Request — Input validasi gagal atau email sudah terdaftar",
            content: {
                "application/json": {
                    schema: createErrorResponseSchema("Email sudah terdaftar. Silakan gunakan email lain."),
                },
            },
        },
        500: {
            description: "500 Internal Server Error — Kesalahan server/database",
            content: {
                "application/json": {
                    schema: createErrorResponseSchema("Gagal mendaftarkan merchant."),
                },
            },
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
                    schema: createSuccessResponseSchema(AuthResponseSchema, "Login berhasil!"),
                },
            },
        },
        401: {
            description: "401 Unauthorized — Email atau password salah",
            content: {
                "application/json": {
                    schema: createErrorResponseSchema("Email atau password tidak valid."),
                },
            },
        },
        500: {
            description: "500 Internal Server Error — Kesalahan server",
            content: {
                "application/json": {
                    schema: createErrorResponseSchema("Login gagal."),
                },
            },
        },
    },
});
