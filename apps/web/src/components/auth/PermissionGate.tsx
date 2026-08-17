"use client";

import type React from "react";
import { useHasPermission } from "../../features/auth/hooks/useHasPermission";

interface PermissionGateProps {
  permission: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const perms = Array.isArray(permission) ? permission : [permission];
  const hasAccess = useHasPermission(...perms);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
