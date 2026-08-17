export interface PermissionItem {
  code: string;
  name: string;
  category: string;
  description: string;
}

export interface Role {
  id: string;
  tenantId: string | null;
  name: string;
  code: string;
  description: string | null;
  isSystem: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt?: string;
  _count?: {
    users: number;
  };
}

export interface CreateRoleInput {
  name: string;
  code: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissions?: string[];
}
