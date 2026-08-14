import type { Tenant } from "@zii/types";
import { fetchApi } from "../../../lib/api-client";

export interface UpdateTenantPayload {
  name?: string;
  phone?: string;
  address?: string;
  receiptFooter?: string;
  logoUrl?: string;
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
}
