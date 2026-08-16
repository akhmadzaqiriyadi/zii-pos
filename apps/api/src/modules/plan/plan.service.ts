import { db } from "@zii/db";
import type { CreatePlanInput, UpdatePlanInput } from "@zii/types";

export class PlanService {
  static async getActivePlans() {
    return await db.plan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
  }

  static async getAllPlans() {
    return await db.plan.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    });
  }

  static async getPlanById(id: string) {
    const plan = await db.plan.findUnique({
      where: { id },
    });
    if (!plan) {
      throw new Error("Paket SaaS tidak ditemukan.");
    }
    return plan;
  }

  static async getPlanByCode(code: string) {
    const plan = await db.plan.findUnique({
      where: { code },
    });
    if (!plan) {
      throw new Error(`Paket dengan kode '${code}' tidak ditemukan.`);
    }
    return plan;
  }

  static async createPlan(input: CreatePlanInput) {
    const existing = await db.plan.findUnique({
      where: { code: input.code },
    });
    if (existing) {
      throw new Error(`Paket dengan kode '${input.code}' sudah ada.`);
    }

    const featuresJson = Array.isArray(input.featuresJson)
      ? JSON.stringify(input.featuresJson)
      : input.featuresJson;

    return await db.plan.create({
      data: {
        code: input.code,
        name: input.name,
        price: input.price,
        billingCycle: input.billingCycle || "monthly",
        maxCashiers: input.maxCashiers ?? 1,
        allowWhiteLabel: input.allowWhiteLabel ?? false,
        allowExportExcel: input.allowExportExcel ?? false,
        featuresJson,
        isActive: input.isActive ?? true,
      },
    });
  }

  static async updatePlan(id: string, input: UpdatePlanInput) {
    const plan = await db.plan.findUnique({
      where: { id },
    });
    if (!plan) {
      throw new Error("Paket SaaS tidak ditemukan.");
    }

    const featuresJson =
      input.featuresJson !== undefined
        ? Array.isArray(input.featuresJson)
          ? JSON.stringify(input.featuresJson)
          : input.featuresJson
        : undefined;

    return await db.plan.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.price !== undefined && { price: input.price }),
        ...(input.billingCycle !== undefined && {
          billingCycle: input.billingCycle,
        }),
        ...(input.maxCashiers !== undefined && {
          maxCashiers: input.maxCashiers,
        }),
        ...(input.allowWhiteLabel !== undefined && {
          allowWhiteLabel: input.allowWhiteLabel,
        }),
        ...(input.allowExportExcel !== undefined && {
          allowExportExcel: input.allowExportExcel,
        }),
        ...(featuresJson !== undefined && { featuresJson }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
  }

  static async deletePlan(id: string) {
    const plan = await db.plan.findUnique({
      where: { id },
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    });

    if (!plan) {
      throw new Error("Paket SaaS tidak ditemukan.");
    }

    // If plan has associated subscriptions, soft delete (deactivate)
    if (plan._count.subscriptions > 0) {
      return await db.plan.update({
        where: { id },
        data: { isActive: false },
      });
    }

    return await db.plan.delete({
      where: { id },
    });
  }
}
