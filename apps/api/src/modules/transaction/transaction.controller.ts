import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/tenant.middleware";
import { ApiResponse } from "../../utils/api-response";
import { TransactionService } from "./transaction.service";

export class TransactionController {
  static async createTransaction(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "demo-tenant-01";
      const { customerName, customerPhone, paymentMethod, items } = req.body;

      if (!paymentMethod || !items) {
        return ApiResponse.error(
          res,
          "Metode pembayaran dan items wajib diisi.",
          null,
          400,
        );
      }

      const result = await TransactionService.createTransaction(tenantId, {
        customerName,
        customerPhone,
        paymentMethod,
        items,
      });

      return ApiResponse.success(
        res,
        "Transaksi berhasil disimpan!",
        result,
        201,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal memproses transaksi.";
      return ApiResponse.error(res, message, error, 400);
    }
  }

  static async getTransactions(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "demo-tenant-01";
      const transactions = await TransactionService.getTransactions(tenantId);
      return ApiResponse.success(
        res,
        "Berhasil mengambil riwayat transaksi",
        transactions,
      );
    } catch (error: unknown) {
      return ApiResponse.error(
        res,
        "Gagal mengambil riwayat transaksi",
        error,
        500,
      );
    }
  }
}
