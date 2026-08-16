import { getCookie } from "../../../lib/cookies";

export interface SaaSMetrics {
  totalMerchants: number;
  activeTrials: number;
  activePaidMerchants: number;
  expiredMerchants: number;
  suspendedMerchants: number;
  mrr: number;
  churnRate: number;
}

export interface TenantSubscriptionInfo {
  id: string;
  status: string;
  planCode: string;
  planName: string;
  startsAt: string;
  expiresAt: string;
  autoRenew: boolean;
}

export interface MerchantTenant {
  id: string;
  name: string;
  subdomain: string | null;
  status: "active" | "trial" | "expired" | "suspended";
  logoUrl: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  totalUsers: number;
  totalProducts: number;
  totalTransactions: number;
  subscription: TenantSubscriptionInfo | null;
}

export interface GetTenantsResponse {
  data: MerchantTenant[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getAuthHeaders() {
  const token = getCookie("zii_auth_token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export interface SaaSPlanAdmin {
  id: string;
  code: string;
  name: string;
  price: number;
  billingCycle: string;
  maxCashiers: number;
  allowWhiteLabel: boolean;
  allowExportExcel: boolean;
  featuresJson: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePlanPayload {
  code: string;
  name: string;
  price: number;
  billingCycle?: "monthly" | "yearly";
  maxCashiers: number;
  allowWhiteLabel?: boolean;
  allowExportExcel?: boolean;
  featuresJson: string;
  isActive?: boolean;
}

export interface UpdatePlanPayload {
  name?: string;
  price?: number;
  billingCycle?: "monthly" | "yearly";
  maxCashiers?: number;
  allowWhiteLabel?: boolean;
  allowExportExcel?: boolean;
  featuresJson?: string;
  isActive?: boolean;
}

export class SaaSAdminApiService {
  static async getMetrics(): Promise<SaaSMetrics> {
    const res = await fetch(`${API_BASE_URL}/api/v1/saas-admin/metrics`, {
      headers: getAuthHeaders(),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Gagal memuat metrik SaaS Admin.");
    }
    return body.data;
  }

  static async getTenants(
    page = 1,
    limit = 10,
    search = "",
    status = "",
  ): Promise<GetTenantsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);

    const res = await fetch(
      `${API_BASE_URL}/api/v1/saas-admin/tenants?${params.toString()}`,
      {
        headers: getAuthHeaders(),
      },
    );
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Gagal memuat daftar merchant.");
    }
    return {
      data: body.data,
      meta: body.meta,
    };
  }

  static async updateTenantStatus(
    tenantId: string,
    status: "active" | "trial" | "expired" | "suspended",
  ): Promise<MerchantTenant> {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/saas-admin/tenants/${tenantId}/status`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      },
    );
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Gagal mengubah status merchant.");
    }
    return body.data;
  }

  // --- SaaS Plan CRUD APIs ---
  static async getAllPlans(): Promise<SaaSPlanAdmin[]> {
    const res = await fetch(`${API_BASE_URL}/api/v1/saas-admin/plans`, {
      headers: getAuthHeaders(),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Gagal memuat daftar paket SaaS.");
    }
    return body.data || [];
  }

  static async createPlan(data: CreatePlanPayload): Promise<SaaSPlanAdmin> {
    const res = await fetch(`${API_BASE_URL}/api/v1/saas-admin/plans`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Gagal membuat paket langganan baru.");
    }
    return body.data;
  }

  static async updatePlan(
    id: string,
    data: UpdatePlanPayload,
  ): Promise<SaaSPlanAdmin> {
    const res = await fetch(`${API_BASE_URL}/api/v1/saas-admin/plans/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Gagal memperbarui paket langganan.");
    }
    return body.data;
  }

  static async deletePlan(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/v1/saas-admin/plans/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Gagal menonaktifkan paket.");
    }
  }
}
