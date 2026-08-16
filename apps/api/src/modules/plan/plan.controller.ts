import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/api-response";
import { PlanService } from "./plan.service";

export class PlanController {
  static async getActivePlans(_req: Request, res: Response) {
    try {
      const plans = await PlanService.getActivePlans();
      return ApiResponse.success(
        res,
        "Berhasil mengambil daftar paket langganan aktif",
        plans,
      );
    } catch (error: unknown) {
      return ApiResponse.error(
        res,
        "Gagal mengambil daftar paket langganan",
        error,
        500,
      );
    }
  }

  static async getAllPlans(_req: Request, res: Response) {
    try {
      const plans = await PlanService.getAllPlans();
      return ApiResponse.success(
        res,
        "Berhasil mengambil seluruh data paket SaaS",
        plans,
      );
    } catch (error: unknown) {
      return ApiResponse.error(
        res,
        "Gagal mengambil seluruh data paket SaaS",
        error,
        500,
      );
    }
  }

  static async getPlanById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const plan = await PlanService.getPlanById(id);
      return ApiResponse.success(res, "Berhasil mengambil detail paket", plan);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Paket tidak ditemukan";
      return ApiResponse.error(res, message, error, 404);
    }
  }

  static async createPlan(req: Request, res: Response) {
    try {
      const {
        code,
        name,
        price,
        billingCycle,
        maxCashiers,
        allowWhiteLabel,
        allowExportExcel,
        featuresJson,
        isActive,
      } = req.body;

      if (!code || !name || price === undefined || !featuresJson) {
        return ApiResponse.error(
          res,
          "Kolom code, name, price, dan featuresJson wajib diisi.",
          null,
          400,
        );
      }

      const plan = await PlanService.createPlan({
        code,
        name,
        price: Number(price),
        billingCycle,
        maxCashiers: maxCashiers !== undefined ? Number(maxCashiers) : 1,
        allowWhiteLabel: Boolean(allowWhiteLabel),
        allowExportExcel: Boolean(allowExportExcel),
        featuresJson,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      });

      return ApiResponse.success(
        res,
        "Paket langganan baru berhasil dibuat!",
        plan,
        201,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal membuat paket baru";
      return ApiResponse.error(res, message, error, 400);
    }
  }

  static async updatePlan(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const {
        name,
        price,
        billingCycle,
        maxCashiers,
        allowWhiteLabel,
        allowExportExcel,
        featuresJson,
        isActive,
      } = req.body;

      const plan = await PlanService.updatePlan(id, {
        name,
        price: price !== undefined ? Number(price) : undefined,
        billingCycle,
        maxCashiers:
          maxCashiers !== undefined ? Number(maxCashiers) : undefined,
        allowWhiteLabel:
          allowWhiteLabel !== undefined ? Boolean(allowWhiteLabel) : undefined,
        allowExportExcel:
          allowExportExcel !== undefined
            ? Boolean(allowExportExcel)
            : undefined,
        featuresJson,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      });

      return ApiResponse.success(res, "Paket SaaS berhasil diperbarui!", plan);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal memperbarui paket SaaS";
      return ApiResponse.error(res, message, error, 400);
    }
  }

  static async deletePlan(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const result = await PlanService.deletePlan(id);
      return ApiResponse.success(
        res,
        "Paket berhasil dinonaktifkan/dihapus!",
        result,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus paket SaaS";
      return ApiResponse.error(res, message, error, 400);
    }
  }
}
