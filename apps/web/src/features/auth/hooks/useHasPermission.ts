"use client";

import { useAuth } from "./useAuth";

const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  superadmin: ["*"],
  owner: [
    "pos:access",
    "pos:discount",
    "pos:void_tx",
    "products:read",
    "products:create",
    "products:update",
    "products:delete",
    "transactions:read",
    "transactions:export",
    "cashiers:manage",
    "roles:manage",
    "settings:manage",
    "billing:manage",
  ],
  cashier: ["pos:access", "products:read", "transactions:read"],
};

export function useHasPermission(...requiredPermissions: string[]): boolean {
  const { user } = useAuth();

  if (!user) return false;

  // 1. Super Admin universal access bypass
  if (
    user.role === "superadmin" ||
    user.email === "admin@zii.id" ||
    user.email === "zaqi@zii.id"
  ) {
    return true;
  }

  // 2. Owner has full tenant owner permissions
  if (user.role === "owner") {
    const ownerPerms = DEFAULT_ROLE_PERMISSIONS.owner;
    return requiredPermissions.some((perm) => ownerPerms.includes(perm));
  }

  // 3. Built-in cashier default permissions
  if (user.role === "cashier") {
    const cashierPerms = DEFAULT_ROLE_PERMISSIONS.cashier;
    return requiredPermissions.some((perm) => cashierPerms.includes(perm));
  }

  // 4. Custom dynamic role permissions (if stored on user or passed)
  const userPerms =
    (user as unknown as { permissions?: string[] }).permissions || [];
  if (userPerms.includes("*")) return true;

  return requiredPermissions.some((perm) => userPerms.includes(perm));
}
