import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/tenant.middleware";
import { ApiResponse } from "../../utils/api-response";
import { SubscriptionService } from "./subscription.service";

export class SubscriptionController {
  static async getCurrentSubscription(
    req: AuthenticatedRequest,
    res: Response,
  ) {
    try {
      const tenantId = req.tenantId || "demo-tenant-01";
      const subscription =
        await SubscriptionService.getCurrentSubscription(tenantId);
      return ApiResponse.success(
        res,
        "Berhasil mengambil detail lisensi langganan",
        subscription,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal mengambil data lisensi";
      return ApiResponse.error(res, message, error, 500);
    }
  }

  static async checkout(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "demo-tenant-01";
      const { planId, billingCycle } = req.body;

      if (!planId) {
        return ApiResponse.error(res, "Kolom planId wajib diisi.", null, 400);
      }

      const checkoutData = await SubscriptionService.checkoutSubscription(
        tenantId,
        {
          planId,
          billingCycle,
        },
      );

      return ApiResponse.success(
        res,
        "Checkout berhasil, silakan lakukan pembayaran via payment gateway",
        checkoutData,
        201,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memproses checkout lisensi";
      return ApiResponse.error(res, message, error, 400);
    }
  }

  static async webhook(req: Request, res: Response) {
    try {
      const payload = {
        orderId: req.body.order_id || req.body.orderId,
        transactionStatus:
          req.body.transaction_status || req.body.transactionStatus,
        fraudStatus: req.body.fraud_status || req.body.fraudStatus,
        grossAmount: req.body.gross_amount || req.body.grossAmount,
        signatureKey: req.body.signature_key || req.body.signatureKey,
        paymentType: req.body.payment_type || req.body.paymentType,
        transactionTime: req.body.transaction_time || req.body.transactionTime,
      };

      if (!payload.orderId || !payload.transactionStatus) {
        return ApiResponse.error(
          res,
          "Format payload webhook tidak lengkap (order_id & transaction_status required).",
          null,
          400,
        );
      }

      const signatureHeader = req.headers["x-callback-signature"] as
        | string
        | undefined;

      const result = await SubscriptionService.handlePaymentWebhook(
        payload,
        signatureHeader,
      );

      return ApiResponse.success(
        res,
        "Webhook payment gateway berhasil diproses",
        result,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memproses webhook payment gateway";
      return ApiResponse.error(res, message, error, 400);
    }
  }

  static async downloadInvoicePdf(req: Request, res: Response) {
    try {
      const invoiceId = req.params.invoiceId as string;
      if (!invoiceId) {
        return ApiResponse.error(res, "Invoice ID wajib disertakan", null, 400);
      }

      const invoiceData =
        await SubscriptionService.getInvoicePdfBuffer(invoiceId);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="Invoice_ZII_${invoiceId.slice(0, 8)}.pdf"`,
      );
      return res.send(invoiceData);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal generate PDF invoice";
      return ApiResponse.error(res, message, error, 404);
    }
  }

  static async getInvoices(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "demo-tenant-01";
      const invoices = await SubscriptionService.getInvoices(tenantId);
      return ApiResponse.success(
        res,
        "Berhasil mengambil riwayat invoice langganan toko",
        invoices,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil riwayat invoice";
      return ApiResponse.error(res, message, error, 500);
    }
  }

  static async toggleAutoRenew(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "demo-tenant-01";
      const { autoRenew } = req.body;

      if (typeof autoRenew !== "boolean") {
        return ApiResponse.error(
          res,
          "Kolom autoRenew (boolean) wajib disertakan.",
          null,
          400,
        );
      }

      const result = await SubscriptionService.toggleAutoRenew(
        tenantId,
        autoRenew,
      );
      return ApiResponse.success(res, result.message, result);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengubah status perpanjangan otomatis";
      return ApiResponse.error(res, message, error, 400);
    }
  }
}
