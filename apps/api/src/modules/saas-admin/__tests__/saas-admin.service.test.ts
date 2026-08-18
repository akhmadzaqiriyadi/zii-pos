import { describe, expect, it, mock } from "bun:test";
import { SaaSAdminService } from "@/modules/saas-admin/saas-admin.service";

const mockTenants = [
  {
    id: "t-1",
    name: "ZII Distro",
    subdomain: "ziidistro",
    status: "active",
    logoUrl: null,
    phone: "081299887766",
    address: "Jakarta",
    createdAt: new Date(),
    receiptFooter: "Nota Distro",
    users: [
      {
        id: "u-1",
        name: "Owner Distro",
        email: "owner@zii.id",
        role: "owner",
        createdAt: new Date(),
        customRole: null,
      },
    ],
    _count: { users: 3, products: 15, transactions: 40 },
    subscriptions: [
      {
        id: "sub-1",
        status: "active",
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 86400000),
        autoRenew: true,
        plan: {
          id: "p-1",
          code: "pro",
          name: "Pro Plan",
          price: 99000,
          billingCycle: "monthly",
          maxCashiers: 5,
          allowWhiteLabel: true,
          allowExportExcel: true,
        },
        invoices: [
          {
            id: "inv-1",
            amount: 99000,
            status: "paid",
            paidAt: new Date(),
            paymentGatewayTxId: "midtrans-tx-1",
            createdAt: new Date(),
          },
        ],
      },
    ],
  },
  {
    id: "t-2",
    name: "ZII Barber",
    subdomain: "ziibarber",
    status: "trial",
    logoUrl: null,
    phone: "081987654321",
    address: "Bandung",
    receiptFooter: null,
    createdAt: new Date(),
    users: [],
    _count: { users: 1, products: 5, transactions: 10 },
    subscriptions: [
      {
        id: "sub-2",
        status: "trial",
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 86400000),
        autoRenew: true,
        plan: {
          id: "p-2",
          code: "starter",
          name: "Starter Trial",
          price: 0,
          billingCycle: "monthly",
          maxCashiers: 2,
          allowWhiteLabel: false,
          allowExportExcel: false,
        },
        invoices: [],
      },
    ],
  },
  {
    id: "t-3",
    name: "Expired Store",
    subdomain: "expiredstore",
    status: "expired",
    logoUrl: null,
    phone: "08111222333",
    address: "Surabaya",
    receiptFooter: null,
    createdAt: new Date(),
    users: [],
    _count: { users: 1, products: 2, transactions: 1 },
    subscriptions: [],
  },
];

mock.module("@zii/db", () => ({
  db: {
    tenant: {
      count: async (args?: { where?: { status?: string } }) => {
        if (!args?.where?.status) return mockTenants.length;
        return mockTenants.filter((t) => t.status === args.where?.status)
          .length;
      },
      findMany: async () => mockTenants,
      findUnique: async (args: { where: { id: string } }) => {
        return mockTenants.find((t) => t.id === args.where.id) || null;
      },
      update: async (args: {
        where: { id: string };
        data: { status: string };
      }) => {
        const tenant = mockTenants.find((t) => t.id === args.where.id);
        return { ...tenant, status: args.data.status };
      },
    },
    subscription: {
      findMany: async (args?: { where?: { status?: string } }) => {
        if (args?.where?.status === "active") {
          return [
            {
              id: "sub-1",
              status: "active",
              plan: { price: 99000, billingCycle: "monthly" },
            },
          ];
        }
        return [];
      },
    },
    transaction: {
      aggregate: async () => ({
        _sum: { totalAmount: 1500000 },
      }),
    },
  },
}));

describe("SaaSAdminService Unit Tests", () => {
  it("should calculate metrics accurately including MRR and Churn Rate", async () => {
    const metrics = await SaaSAdminService.getMetrics();

    expect(metrics.totalMerchants).toBe(3);
    expect(metrics.activePaidMerchants).toBe(1);
    expect(metrics.activeTrials).toBe(1);
    expect(metrics.expiredMerchants).toBe(1);
    expect(metrics.suspendedMerchants).toBe(0);
    expect(metrics.mrr).toBe(99000);
    expect(metrics.churnRate).toBeGreaterThan(0);
  });

  it("should return paginated tenant list with subscription details", async () => {
    const result = await SaaSAdminService.getTenants({ page: 1, limit: 10 });

    expect(result.tenants.length).toBe(3);
    expect(result.meta.page).toBe(1);
    expect(result.meta.totalItems).toBe(3);
    expect(result.tenants[0].subscription?.planCode).toBe("pro");
  });

  it("should update tenant status successfully", async () => {
    const updated = await SaaSAdminService.updateTenantStatus(
      "t-1",
      "suspended",
    );
    expect(updated.status).toBe("suspended");
  });

  it("should throw error for invalid status update", async () => {
    try {
      // @ts-expect-error test invalid status
      await SaaSAdminService.updateTenantStatus("t-1", "random-invalid-status");
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toContain("tidak valid");
      }
    }
  });

  it("should return detailed merchant information with users and subscriptions", async () => {
    const detail = await SaaSAdminService.getTenantDetail("t-1");

    expect(detail.id).toBe("t-1");
    expect(detail.name).toBe("ZII Distro");
    expect(detail.subdomain).toBe("ziidistro");
    expect(detail.totalUsers).toBe(3);
    expect(detail.totalProducts).toBe(15);
    expect(detail.totalTransactions).toBe(40);
  });

  it("should throw error if merchant is not found for detail", async () => {
    try {
      await SaaSAdminService.getTenantDetail("non-existent-tenant");
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toContain("tidak ditemukan");
      }
    }
  });
});
