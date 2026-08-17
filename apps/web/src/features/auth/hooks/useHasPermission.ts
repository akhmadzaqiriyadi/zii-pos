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

  // 2. Direct dynamic permissions array from backend response / token
  if (
    user.permissions &&
    Array.isArray(user.permissions) &&
    user.permissions.length > 0
  ) {
    if (user.permissions.includes("*")) return true;
    return requiredPermissions.some((perm) => user.permissions?.includes(perm));
  }

  // 3. Built-in owner fallback
  if (user.role === "owner") {
    const ownerPerms = DEFAULT_ROLE_PERMISSIONS.owner;
    return requiredPermissions.some((perm) => ownerPerms.includes(perm));
  }

  // 4. Built-in cashier fallback
  if (user.role === "cashier") {
    const cashierPerms = DEFAULT_ROLE_PERMISSIONS.cashier;
    return requiredPermissions.some((perm) => cashierPerms.includes(perm));
  }

  return false;
}
