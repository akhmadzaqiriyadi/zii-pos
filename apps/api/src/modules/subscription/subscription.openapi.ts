import {
  ErrorResponseSchema,
  createErrorResponseSchema,
  createSuccessResponseSchema,
  registry,
} from "@/config/openapi-registry";
import { z } from "zod";

export const CurrentSubscriptionSchema = z
  .object({
    subscriptionId: z.string().openapi({ example: "sub-123" }),
    tenantId: z.string().openapi({ example: "demo-tenant-01" }),
    status: z.string().openapi({ example: "active" }),
    tenantStatus: z.string().openapi({ example: "active" }),
    startsAt: z.string().openapi({ example: "2026-08-13T00:00:00.000Z" }),
    expiresAt: z.string().openapi({ example: "2026-09-13T00:00:00.000Z" }),
    daysRemaining: z.number().int().openapi({ example: 28 }),
    isExpired: z.boolean().openapi({ example: false }),
    autoRenew: z.boolean().openapi({ example: true }),
    plan: z.object({
      id: z.string().openapi({ example: "plan-pro-01" }),
      code: z.string().openapi({ example: "pro" }),
      name: z.string().openapi({ example: "Pro Merchant White-Label" }),
      price: z.number().openapi({ example: 99000 }),
      billingCycle: z.string().openapi({ example: "monthly" }),
      maxCashiers: z.number().int().openapi({ example: 5 }),
      allowWhiteLabel: z.boolean().openapi({ example: true }),
      allowExportExcel: z.boolean().openapi({ example: true }),
      features: z.array(z.string()).openapi({
        example: ["Multi-kasir 5 user", "Custom Logo Struk", "Ekspor Excel"],
      }),
    }),
  })
  .openapi("CurrentSubscription");

export const CheckoutInputSchema = z
  .object({
    planId: z.string().openapi({ example: "plan-pro-01" }),
    billingCycle: z
      .enum(["monthly", "yearly"])
      .optional()
      .openapi({ example: "monthly" }),
  })
  .openapi("CheckoutInput");

export const CheckoutResponseSchema = z
  .object({
    invoiceId: z.string().openapi({ example: "inv-123" }),
    subscriptionId: z.string().openapi({ example: "sub-123" }),
    tenantId: z.string().openapi({ example: "demo-tenant-01" }),
    planName: z.string().openapi({ example: "Pro Merchant White-Label" }),
    billingCycle: z.string().openapi({ example: "monthly" }),
    amount: z.number().openapi({ example: 99000 }),
    status: z.string().openapi({ example: "unpaid" }),
    paymentUrl: z.string().openapi({
      example: "https://app.sandbox.midtrans.com/snap/v2/vtweb/inv-123",
    }),
    qrisString: z.string().openapi({ example: "00020101021226590014ID..." }),
    createdAt: z.string().openapi({ example: "2026-08-16T12:00:00.000Z" }),
  })
  .openapi("CheckoutResponse");

export const WebhookPayloadSchema = z
  .object({
    order_id: z.string().openapi({ example: "inv-123" }),
    transaction_status: z
      .enum(["settlement", "capture", "pending", "expire", "cancel", "deny"])
      .openapi({ example: "settlement" }),
    fraud_status: z.string().optional().openapi({ example: "accept" }),
    gross_amount: z
      .union([z.string(), z.number()])
      .openapi({ example: "99000.00" }),
    signature_key: z.string().openapi({ example: "abcdef1234567890..." }),
    payment_type: z.string().optional().openapi({ example: "qris" }),
    transaction_time: z
      .string()
      .optional()
      .openapi({ example: "2026-08-16 12:05:00" }),
  })
  .openapi("PaymentWebhookPayload");

// GET /api/v1/subscriptions/current
registry.registerPath({
  method: "get",
  path: "/api/v1/subscriptions/current",
  summary: "Ambil Detail Lisensi & Sisa Masa Trial/Aktif Toko",
  tags: ["Subscription & Billing"],
  security: [{ TenantHeader: [] }],
  responses: {
    200: {
      description: "200 OK — Detail lisensi berhasil diambil",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            CurrentSubscriptionSchema,
            "Berhasil mengambil detail lisensi langganan",
          ),
        },
      },
    },
    401: {
      description: "401 Unauthorized — x-tenant-id hilang",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Tenant ID is required."),
        },
      },
    },
    500: {
      description: "500 Internal Server Error",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// POST /api/v1/subscriptions/checkout
registry.registerPath({
  method: "post",
  path: "/api/v1/subscriptions/checkout",
  summary: "Generate QRIS / Invoice Payment Gateway Lisensi",
  tags: ["Subscription & Billing"],
  security: [{ TenantHeader: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CheckoutInputSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "201 Created — Checkout berhasil dibuat",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            CheckoutResponseSchema,
            "Checkout berhasil, silakan lakukan pembayaran via payment gateway",
          ),
        },
      },
    },
    400: {
      description: "400 Bad Request — Input tidak valid",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Kolom planId wajib diisi."),
        },
      },
    },
  },
});

// POST /api/v1/subscriptions/webhook
registry.registerPath({
  method: "post",
  path: "/api/v1/subscriptions/webhook",
  summary: "Receive Automated Payment Success Callback (Midtrans/Xendit)",
  tags: ["Subscription & Billing"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: WebhookPayloadSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "200 OK — Webhook diproses & lisensi toko diaktifkan",
      content: {
        "application/json": {
          schema: createSuccessResponseSchema(
            z.object({
              success: z.boolean(),
              orderId: z.string(),
              status: z.string(),
              expiresAt: z.string().optional(),
              message: z.string(),
            }),
            "Webhook payment gateway berhasil diproses",
          ),
        },
      },
    },
    400: {
      description: "400 Bad Request — Invalid signature atau format",
      content: {
        "application/json": {
          schema: createErrorResponseSchema("Invalid payment signature key."),
        },
      },
    },
  },
});
