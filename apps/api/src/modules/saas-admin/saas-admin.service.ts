import { db } from "@zii/db";
import type { SaaSMetrics } from "@zii/types";
import { createPaginationMeta } from "../../utils/pagination";

export interface GetTenantsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export class SaaSAdminService {
  static async getMetrics(): Promise<SaaSMetrics> {
    const totalMerchants = await db.tenant.count();
    const activeTrials = await db.tenant.count({
      where: { status: "trial" },
    });
    const activePaidMerchants = await db.tenant.count({
      where: { status: "active" },
    });
    const expiredMerchants = await db.tenant.count({
      where: { status: "expired" },
    });
    const suspendedMerchants = await db.tenant.count({
      where: { status: "suspended" },
    });

    // Calculate Monthly Recurring Revenue (MRR) from active subscriptions
    const activeSubscriptions = await db.subscription.findMany({
      where: { status: "active" },
      include: { plan: true },
    });

    const mrr = activeSubscriptions.reduce((acc, sub) => {
      const planPrice = Number(sub.plan.price);
      if (sub.plan.billingCycle === "yearly") {
        return acc + planPrice / 12;
      }
      return acc + planPrice;
    }, 0);

    const churnRate =
      totalMerchants > 0
        ? Number(((expiredMerchants / totalMerchants) * 100).toFixed(2))
        : 0;

    return {
      totalMerchants,
      activeTrials,
      activePaidMerchants,
      expiredMerchants,
      suspendedMerchants,
      mrr: Math.round(mrr),
      churnRate,
    };
  }

  static async getTenants(query: GetTenantsQuery) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { subdomain: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [totalItems, tenants] = await Promise.all([
      db.tenant.count({ where }),
      db.tenant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { users: true, products: true, transactions: true },
          },
          subscriptions: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: { plan: true },
          },
        },
      }),
    ]);

    const formattedTenants = tenants.map((tenant) => {
      const currentSubscription = tenant.subscriptions[0] || null;
      return {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        status: tenant.status,
        logoUrl: tenant.logoUrl,
        phone: tenant.phone,
        address: tenant.address,
        createdAt: tenant.createdAt,
        totalUsers: tenant._count.users,
        totalProducts: tenant._count.products,
        totalTransactions: tenant._count.transactions,
        subscription: currentSubscription
          ? {
              id: currentSubscription.id,
              status: currentSubscription.status,
              planCode: currentSubscription.plan.code,
              planName: currentSubscription.plan.name,
              startsAt: currentSubscription.startsAt,
              expiresAt: currentSubscription.expiresAt,
              autoRenew: currentSubscription.autoRenew,
            }
          : null,
      };
    });

    return {
      tenants: formattedTenants,
      meta: createPaginationMeta(page, limit, totalItems),
    };
  }

  static async updateTenantStatus(
    tenantId: string,
    status: "trial" | "active" | "expired" | "suspended",
  ) {
    const validStatuses = ["trial", "active", "expired", "suspended"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Status '${status}' tidak valid. Status yang diizinkan: ${validStatuses.join(", ")}`,
      );
    }

    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new Error("Merchant tidak ditemukan.");
    }

    return await db.tenant.update({
      where: { id: tenantId },
      data: { status },
    });
  }

  static async getTenantDetail(tenantId: string) {
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            customRole: {
              select: {
                name: true,
                code: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        subscriptions: {
          orderBy: { createdAt: "desc" },
          include: {
            plan: true,
            invoices: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
        _count: {
          select: {
            users: true,
            products: true,
            transactions: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new Error("Merchant tidak ditemukan.");
    }

    const totalRevenueResult = await db.transaction.aggregate({
      where: { tenantId },
      _sum: { total: true },
    });

    const totalRevenue = Number(totalRevenueResult._sum.total || 0);

    return {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      status: tenant.status,
      logoUrl: tenant.logoUrl,
      phone: tenant.phone,
      address: tenant.address,
      receiptFooter: tenant.receiptFooter,
      createdAt: tenant.createdAt,
      totalUsers: tenant._count.users,
      totalProducts: tenant._count.products,
      totalTransactions: tenant._count.transactions,
      totalRevenue,
      users: tenant.users,
      subscriptions: tenant.subscriptions.map((sub) => ({
        id: sub.id,
        status: sub.status,
        startsAt: sub.startsAt,
        expiresAt: sub.expiresAt,
        autoRenew: sub.autoRenew,
        plan: {
          id: sub.plan.id,
          code: sub.plan.code,
          name: sub.plan.name,
          price: Number(sub.plan.price),
          billingCycle: sub.plan.billingCycle,
          maxCashiers: sub.plan.maxCashiers,
          allowWhiteLabel: sub.plan.allowWhiteLabel,
          allowExportExcel: sub.plan.allowExportExcel,
        },
        invoices: sub.invoices.map((inv) => ({
          id: inv.id,
          amount: Number(inv.amount),
          status: inv.status,
          paidAt: inv.paidAt,
          paymentMethod: inv.paymentMethod,
          createdAt: inv.createdAt,
        })),
      })),
    };
  }
}
