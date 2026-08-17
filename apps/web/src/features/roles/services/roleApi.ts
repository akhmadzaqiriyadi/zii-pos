import { fetchApi } from "../../../lib/api-client";
import type {
  CreateRoleInput,
  PermissionItem,
  Role,
  UpdateRoleInput,
} from "../types/role.types";

export class RoleApiService {
  static async getPermissionsCatalog(): Promise<PermissionItem[]> {
    return await fetchApi<PermissionItem[]>(
      "/api/v1/roles/permissions-catalog",
    );
  }

  static async getRoles(): Promise<Role[]> {
    return await fetchApi<Role[]>("/api/v1/roles");
  }

  static async getRoleById(id: string): Promise<Role> {
    return await fetchApi<Role>(`/api/v1/roles/${id}`);
  }

  static async createRole(data: CreateRoleInput): Promise<Role> {
    return await fetchApi<Role>("/api/v1/roles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateRole(id: string, data: UpdateRoleInput): Promise<Role> {
    return await fetchApi<Role>(`/api/v1/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteRole(id: string): Promise<{ message: string }> {
    return await fetchApi<{ message: string }>(`/api/v1/roles/${id}`, {
      method: "DELETE",
    });
  }
}
