import type { Tenant } from "@zii/types";
import { fetchApi } from "../../../lib/api-client";

export interface UpdateTenantPayload {
  name?: string;
  phone?: string;
  address?: string;
  receiptFooter?: string;
  logoUrl?: string;
}

export interface CashierUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface CashiersResponse {
  users: CashierUser[];
  currentCount: number;
  maxCashiers: number;
  planName: string;
  isQuotaExceeded: boolean;
}

export interface CreateCashierPayload {
  name: string;
  email: string;
  password: string;
}

export class TenantApiService {
  static async getProfile(): Promise<Tenant> {
    return await fetchApi<Tenant>("/api/v1/tenants/profile");
  }

  static async updateProfile(data: UpdateTenantPayload): Promise<Tenant> {
    return await fetchApi<Tenant>("/api/v1/tenants/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async getCashiers(): Promise<CashiersResponse> {
    return await fetchApi<CashiersResponse>("/api/v1/tenants/cashiers");
  }

  static async createCashier(data: CreateCashierPayload): Promise<CashierUser> {
    return await fetchApi<CashierUser>("/api/v1/tenants/cashiers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async deleteCashier(id: string): Promise<{ message: string }> {
    return await fetchApi<{ message: string }>(
      `/api/v1/tenants/cashiers/${id}`,
      {
        method: "DELETE",
      },
    );
  }
}
