import { describe, expect, it, mock } from "bun:test";
import { PlanService } from "@/modules/plan/plan.service";

const mockPlans = [
  {
    id: "plan-1",
    code: "starter",
    name: "Starter Trial",
    price: 0,
    billingCycle: "monthly",
    maxCashiers: 1,
    allowWhiteLabel: false,
    allowExportExcel: false,
    featuresJson: JSON.stringify(["1 Cashier", "Basic Reports"]),
    isActive: true,
    createdAt: new Date(),
    _count: { subscriptions: 5 },
  },
  {
    id: "plan-2",
    code: "pro",
    name: "Pro Merchant",
    price: 99000,
    billingCycle: "monthly",
    maxCashiers: 5,
    allowWhiteLabel: true,
    allowExportExcel: true,
    featuresJson: JSON.stringify(["5 Cashiers", "White Label", "Excel Export"]),
    isActive: true,
    createdAt: new Date(),
    _count: { subscriptions: 10 },
  },
  {
    id: "plan-3",
    code: "legacy",
    name: "Legacy Plan",
    price: 39000,
    billingCycle: "monthly",
    maxCashiers: 2,
    allowWhiteLabel: false,
    allowExportExcel: false,
    featuresJson: JSON.stringify(["Legacy"]),
    isActive: false,
    createdAt: new Date(),
    _count: { subscriptions: 0 },
  },
];

mock.module("@zii/db", () => ({
  db: {
    plan: {
      findMany: async (args?: { where?: { isActive?: boolean } }) => {
        if (args?.where?.isActive === true) {
          return mockPlans.filter((p) => p.isActive);
        }
        return mockPlans;
      },
      findUnique: async (args: { where: { id?: string; code?: string } }) => {
        if (args.where.id) {
          return mockPlans.find((p) => p.id === args.where.id) || null;
        }
        if (args.where.code) {
          return mockPlans.find((p) => p.code === args.where.code) || null;
        }
        return null;
      },
      create: async (args: { data: Record<string, unknown> }) => ({
        id: "plan-new",
        ...args.data,
        createdAt: new Date(),
      }),
      update: async (args: {
        where: { id: string };
        data: Record<string, unknown>;
      }) => {
        const existing = mockPlans.find((p) => p.id === args.where.id);
        return {
          ...existing,
          ...args.data,
        };
      },
      delete: async (args: { where: { id: string } }) => {
        return mockPlans.find((p) => p.id === args.where.id);
      },
    },
  },
}));

describe("PlanService Unit Tests", () => {
  it("should get only active plans for public onboarding", async () => {
    const activePlans = await PlanService.getActivePlans();
    expect(activePlans.length).toBe(2);
    expect(activePlans.every((p) => p.isActive)).toBe(true);
  });

  it("should get all plans for Super Admin", async () => {
    const allPlans = await PlanService.getAllPlans();
    expect(allPlans.length).toBe(3);
  });

  it("should get plan by id and code", async () => {
    const planById = await PlanService.getPlanById("plan-2");
    expect(planById.code).toBe("pro");

    const planByCode = await PlanService.getPlanByCode("starter");
    expect(planByCode.id).toBe("plan-1");
  });

  it("should throw error if plan code already exists", async () => {
    try {
      await PlanService.createPlan({
        code: "starter",
        name: "Duplicate Starter",
        price: 0,
        featuresJson: [],
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toContain("sudah ada");
      }
    }
  });

  it("should create a new plan successfully", async () => {
    const newPlan = await PlanService.createPlan({
      code: "enterprise-custom",
      name: "Enterprise Custom",
      price: 299000,
      maxCashiers: 20,
      allowWhiteLabel: true,
      allowExportExcel: true,
      featuresJson: ["Unlimited Cashiers", "Custom Domain"],
    });

    expect(newPlan).toHaveProperty("id");
    expect(newPlan.code).toBe("enterprise-custom");
    expect(Number(newPlan.price)).toBe(299000);
  });

  it("should update an existing plan", async () => {
    const updated = await PlanService.updatePlan("plan-2", {
      name: "Pro Merchant 2026 Edition",
      price: 109000,
    });

    expect(updated.name).toBe("Pro Merchant 2026 Edition");
    expect(Number(updated.price)).toBe(109000);
  });

  it("should soft delete / deactivate plan if it has subscriptions", async () => {
    const deleted = await PlanService.deletePlan("plan-2");
    expect(deleted.isActive).toBe(false);
  });
});
