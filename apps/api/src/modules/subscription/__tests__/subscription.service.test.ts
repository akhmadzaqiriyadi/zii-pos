import { describe, expect, it, mock } from "bun:test";
import crypto from "node:crypto";
import { SubscriptionService } from "@/modules/subscription/subscription.service";

const serverKey = "SB-Mid-server-test-key";

const mockTenant = {
  id: "t-01",
  name: "ZII Distro",
  status: "trial",
  subscriptions: [
    {
      id: "sub-01",
      tenantId: "t-01",
      planId: "plan-pro",
      status: "trial",
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 86400000), // 10 days remaining
      autoRenew: true,
      plan: {
        id: "plan-pro",
        code: "pro",
        name: "Pro Merchant White-Label",
        price: 99000,
        billingCycle: "monthly",
        maxCashiers: 5,
        allowWhiteLabel: true,
        allowExportExcel: true,
        featuresJson: JSON.stringify(["Multi-kasir", "White-Label"]),
      },
    },
  ],
};

const mockInvoice = {
  id: "inv-999",
  subscriptionId: "sub-01",
  amount: 99000,
  status: "unpaid",
  createdAt: new Date(),
  subscription: {
    ...mockTenant.subscriptions[0],
    tenant: mockTenant,
  },
};

mock.module("@zii/db", () => ({
  db: {
    tenant: {
      findUnique: async () => mockTenant,
      update: async (args: { data: Record<string, unknown> }) => ({
        ...mockTenant,
        ...args.data,
      }),
    },
    plan: {
      findUnique: async () => mockTenant.subscriptions[0].plan,
      create: async () => mockTenant.subscriptions[0].plan,
    },
    subscription: {
      findFirst: async () => mockTenant.subscriptions[0],
      create: async (args: { data: Record<string, unknown> }) => ({
        id: "sub-new",
        ...args.data,
        plan: mockTenant.subscriptions[0].plan,
      }),
      update: async (args: { data: Record<string, unknown> }) => ({
        ...mockTenant.subscriptions[0],
        ...args.data,
      }),
    },
    subscriptionInvoice: {
      findUnique: async (args: { where: { id: string } }) => {
        if (args.where.id === "inv-999") {
          return mockInvoice;
        }
        return null;
      },
      findMany: async () => [mockInvoice],
      create: async (args: { data: Record<string, unknown> }) => ({
        id: "inv-new",
        ...args.data,
        createdAt: new Date(),
      }),
      update: async (args: { data: Record<string, unknown> }) => ({
        ...mockInvoice,
        ...args.data,
      }),
    },
    user: {
      count: async () => 2,
      findFirst: async () => ({
        id: "u-01",
        name: "Zaqi Owner",
        email: "zaqi@zii.id",
        role: "owner",
      }),
    },
    product: {
      count: async () => 15,
    },
    transaction: {
      count: async () => 48,
    },
    $transaction: async (queries: unknown[]) => queries,
  },
}));

describe("SubscriptionService Unit Tests", () => {
  it("should calculate and verify Midtrans SHA512 signature correctly", () => {
    const orderId = "inv-999";
    const statusCode = "200";
    const grossAmount = "99000.00";

    const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    const validSignature = crypto
      .createHash("sha512")
      .update(payload)
      .digest("hex");

    const isVerified = SubscriptionService.verifySignature(
      orderId,
      statusCode,
      grossAmount,
      validSignature,
      serverKey,
    );
    expect(isVerified).toBe(true);

    const isFalseOnTampered = SubscriptionService.verifySignature(
      orderId,
      statusCode,
      "50000.00",
      validSignature,
      serverKey,
    );
    expect(isFalseOnTampered).toBe(false);
  });

  it("should get current subscription and license status with usage & urgency metrics", async () => {
    const current = await SubscriptionService.getCurrentSubscription("t-01");

    expect(current.subscriptionId).toBe("sub-01");
    expect(current.plan.code).toBe("pro");
    expect(current.daysRemaining).toBeGreaterThan(0);
    expect(current.isExpired).toBe(false);
    expect(Array.isArray(current.plan.features)).toBe(true);
    expect(current.usage.activeCashiers).toBe(2);
    expect(current.usage.maxCashiers).toBe(5);
    expect(current.usage.cashierUsagePercent).toBe(40);
    expect(current.urgency.urgencyLevel).toBe("safe");
  });

  it("should get merchant invoice history with PDF download url", async () => {
    const invoices = await SubscriptionService.getInvoices("t-01");

    expect(Array.isArray(invoices)).toBe(true);
    expect(invoices.length).toBe(1);
    expect(invoices[0].id).toBe("inv-999");
    expect(invoices[0].amount).toBe(99000);
    expect(invoices[0].planName).toBe("Pro Merchant White-Label");
    expect(invoices[0].pdfUrl).toBe(
      "/api/v1/subscriptions/invoice/inv-999/pdf",
    );
  });

  it("should toggle auto-renewal status for subscription", async () => {
    const result = await SubscriptionService.toggleAutoRenew("t-01", false);

    expect(result.subscriptionId).toBe("sub-01");
    expect(result.autoRenew).toBe(false);
    expect(result.message).toContain("dinonaktifkan");
  });

  it("should generate checkout invoice and payment details", async () => {
    const checkout = await SubscriptionService.checkoutSubscription("t-01", {
      planId: "plan-pro",
      billingCycle: "monthly",
    });

    expect(checkout).toHaveProperty("invoiceId");
    expect(checkout.amount).toBe(99000);
    expect(checkout.paymentUrl).toContain("midtrans.com");
    expect(checkout.qrisString).toContain("00020101021226");
  });

  it("should reject checking out free trial plan for registered merchant", async () => {
    mockTenant.subscriptions[0].plan.price = 0;
    mockTenant.subscriptions[0].plan.code = "starter";

    expect(
      SubscriptionService.checkoutSubscription("t-01", {
        planId: "plan-starter",
        billingCycle: "monthly",
      }),
    ).rejects.toThrow("Paket Uji Coba (Trial) hanya berlaku untuk toko baru");

    // Restore mock
    mockTenant.subscriptions[0].plan.price = 99000;
    mockTenant.subscriptions[0].plan.code = "pro";
  });

  it("should handle automated payment settlement webhook and activate license", async () => {
    const orderId = "inv-999";
    const statusCode = "200";
    const grossAmount = "99000.00";

    const payloadString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    const signatureKey = crypto
      .createHash("sha512")
      .update(payloadString)
      .digest("hex");

    const result = await SubscriptionService.handlePaymentWebhook({
      orderId,
      transactionStatus: "settlement",
      grossAmount,
      signatureKey,
      paymentType: "qris",
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("paid");
    expect(result.message).toContain("Lisensi SaaS berhasil diaktifkan");
  });

  it("should handle payment expiration/cancellation webhook", async () => {
    const result = await SubscriptionService.handlePaymentWebhook({
      orderId: "inv-999",
      transactionStatus: "expire",
      grossAmount: "99000.00",
      signatureKey: "mock-sig",
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("failed");
  });
});
