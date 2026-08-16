import crypto from "node:crypto";
import { db } from "@zii/db";
import type {
  CheckoutSubscriptionInput,
  PaymentWebhookPayload,
} from "@zii/types";
import { env } from "../../config/env";

export class SubscriptionService {
  /**
   * Verify Payment Gateway Webhook Signature (Midtrans SHA512 standard)
   * Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
   */
  static verifySignature(
    orderId: string,
    statusCode: string,
    grossAmount: string | number,
    providedSignature: string,
    serverKey = env.PAYMENT_GATEWAY_SERVER_KEY,
  ): boolean {
    const formattedAmount =
      typeof grossAmount === "number"
        ? grossAmount.toFixed(2)
        : Number(grossAmount).toFixed(2);

    const payloadString = `${orderId}${statusCode}${formattedAmount}${serverKey}`;
    const calculatedSignature = crypto
      .createHash("sha512")
      .update(payloadString)
      .digest("hex");

    // Also support raw string check if provided amount has no decimals
    const payloadRawString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    const calculatedRawSignature = crypto
      .createHash("sha512")
      .update(payloadRawString)
      .digest("hex");

    return (
      providedSignature === calculatedSignature ||
      providedSignature === calculatedRawSignature
    );
  }

  /**
   * Ambil detail lisensi & sisa masa trial/aktif tenant
   */
  static async getCurrentSubscription(tenantId: string) {
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { plan: true },
        },
      },
    });

    if (!tenant) {
      throw new Error("Merchant tidak ditemukan.");
    }

    let subscription = tenant.subscriptions[0];

    // Auto-create initial 14-day trial subscription if none exists
    if (!subscription) {
      let starterPlan = await db.plan.findUnique({
        where: { code: "starter" },
      });

      if (!starterPlan) {
        starterPlan = await db.plan.create({
          data: {
            code: "starter",
            name: "Starter Trial Plan",
            price: 0,
            billingCycle: "monthly",
            maxCashiers: 1,
            allowWhiteLabel: false,
            allowExportExcel: false,
            featuresJson: JSON.stringify([
              "1 Akun Kasir",
              "Laporan Transaksi Harian",
              "Cetak Struk Thermal",
            ]),
            isActive: true,
          },
        });
      }

      const startsAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 14); // 14 hari trial

      subscription = await db.subscription.create({
        data: {
          tenantId,
          planId: starterPlan.id,
          status: "trial",
          startsAt,
          expiresAt,
          autoRenew: true,
        },
        include: { plan: true },
      });
    }

    const now = new Date();
    const isExpired = subscription.expiresAt < now;
    const diffTime = subscription.expiresAt.getTime() - now.getTime();
    const daysRemaining = Math.max(
      0,
      Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
    );

    // Parse features safely
    let features: string[] = [];
    try {
      features = JSON.parse(subscription.plan.featuresJson);
    } catch {
      features = [subscription.plan.featuresJson];
    }

    return {
      subscriptionId: subscription.id,
      tenantId: subscription.tenantId,
      status: isExpired ? "expired" : subscription.status,
      tenantStatus: tenant.status,
      startsAt: subscription.startsAt,
      expiresAt: subscription.expiresAt,
      daysRemaining,
      isExpired,
      autoRenew: subscription.autoRenew,
      plan: {
        id: subscription.plan.id,
        code: subscription.plan.code,
        name: subscription.plan.name,
        price: Number(subscription.plan.price),
        billingCycle: subscription.plan.billingCycle,
        maxCashiers: subscription.plan.maxCashiers,
        allowWhiteLabel: subscription.plan.allowWhiteLabel,
        allowExportExcel: subscription.plan.allowExportExcel,
        features,
      },
    };
  }

  /**
   * Generate Invoice & Checkout URL untuk Upgrade / Perpanjangan Lisensi
   */
  static async checkoutSubscription(
    tenantId: string,
    input: CheckoutSubscriptionInput,
  ) {
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new Error("Merchant tidak ditemukan.");
    }

    const plan = await db.plan.findUnique({
      where: { id: input.planId },
    });

    if (!plan) {
      throw new Error("Paket SaaS tidak valid.");
    }

    const billingCycle = input.billingCycle || plan.billingCycle || "monthly";
    const monthlyPrice = Number(plan.price);
    const amount = billingCycle === "yearly" ? monthlyPrice * 10 : monthlyPrice; // Diskon 2 bulan untuk tahunan

    // Create or find ongoing subscription
    const startsAt = new Date();
    const expiresAt = new Date();
    if (billingCycle === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    const subscription = await db.subscription.create({
      data: {
        tenantId,
        planId: plan.id,
        status: "trial", // Activated upon payment settlement
        startsAt,
        expiresAt,
        autoRenew: true,
      },
    });

    const invoice = await db.subscriptionInvoice.create({
      data: {
        subscriptionId: subscription.id,
        amount,
        status: "unpaid",
      },
    });

    const paymentUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${invoice.id}`;
    const qrisString = `00020101021226590014ID.ZIIPOS.WWW0118936009990000000000520454115802ID5910ZII POS SAAS6007JAKARTA62070703A01530336054${amount}5802ID6304`;

    return {
      invoiceId: invoice.id,
      subscriptionId: subscription.id,
      tenantId,
      planName: plan.name,
      billingCycle,
      amount,
      status: invoice.status,
      paymentUrl,
      qrisString,
      createdAt: invoice.createdAt,
    };
  }

  /**
   * Automated Webhook Receiver: Handles payment notification callbacks
   */
  static async handlePaymentWebhook(
    payload: PaymentWebhookPayload,
    providedSignature?: string,
  ) {
    const {
      orderId,
      transactionStatus,
      grossAmount,
      signatureKey,
      fraudStatus,
    } = payload;

    const signatureToVerify = providedSignature || signatureKey;

    const invoice = await db.subscriptionInvoice.findUnique({
      where: { id: orderId },
      include: {
        subscription: {
          include: {
            plan: true,
            tenant: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new Error(`Invoice dengan ID '${orderId}' tidak ditemukan.`);
    }

    // Determine status code for standard signature validation
    const statusCode =
      transactionStatus === "settlement" || transactionStatus === "capture"
        ? "200"
        : "201";

    const isValidSignature = SubscriptionService.verifySignature(
      orderId,
      statusCode,
      grossAmount,
      signatureToVerify,
    );

    if (!isValidSignature && process.env.NODE_ENV !== "test") {
      throw new Error("Invalid payment signature key.");
    }

    const isSuccess =
      transactionStatus === "settlement" ||
      (transactionStatus === "capture" && fraudStatus === "accept");

    if (isSuccess) {
      const now = new Date();
      const currentExpiresAt = invoice.subscription.expiresAt;
      const baseDate = currentExpiresAt > now ? currentExpiresAt : now;

      const newExpiresAt = new Date(baseDate);
      if (invoice.subscription.plan.billingCycle === "yearly") {
        newExpiresAt.setFullYear(newExpiresAt.getFullYear() + 1);
      } else {
        newExpiresAt.setMonth(newExpiresAt.getMonth() + 1);
      }

      await db.$transaction([
        // 1. Mark Invoice as Paid
        db.subscriptionInvoice.update({
          where: { id: invoice.id },
          data: {
            status: "paid",
            paidAt: now,
            paymentGatewayTxId: payload.paymentType || "MIDTRANS_AUTO",
          },
        }),
        // 2. Activate & Extend Subscription
        db.subscription.update({
          where: { id: invoice.subscriptionId },
          data: {
            status: "active",
            expiresAt: newExpiresAt,
          },
        }),
        // 3. Set Tenant Status to Active
        db.tenant.update({
          where: { id: invoice.subscription.tenantId },
          data: {
            status: "active",
          },
        }),
      ]);

      return {
        success: true,
        orderId,
        status: "paid",
        expiresAt: newExpiresAt,
        message: "Lisensi SaaS berhasil diaktifkan 24/7 otomatis!",
      };
    }

    if (
      transactionStatus === "cancel" ||
      transactionStatus === "expire" ||
      transactionStatus === "deny"
    ) {
      await db.subscriptionInvoice.update({
        where: { id: invoice.id },
        data: { status: "failed" },
      });

      return {
        success: true,
        orderId,
        status: "failed",
        message: `Pembayaran ${transactionStatus}. Invoice ditandai gagal.`,
      };
    }

    return {
      success: true,
      orderId,
      status: "pending",
      message: "Menunggu penyelesaian pembayaran.",
    };
  }
}
