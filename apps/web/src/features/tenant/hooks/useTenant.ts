"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Tenant } from "@zii/types";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  TenantApiService,
  type UpdateTenantPayload,
} from "../services/tenantApi";

export function useTenant() {
  const queryClient = useQueryClient();
  const { tenant: authTenant } = useAuth();

  const profileQuery = useQuery<Tenant>({
    queryKey: ["tenant"],
    queryFn: () => TenantApiService.getProfile(),
    initialData: authTenant ? (authTenant as Tenant) : undefined,
  });

  const updateMutation = useMutation<Tenant, Error, UpdateTenantPayload>({
    mutationFn: (data: UpdateTenantPayload) =>
      TenantApiService.updateProfile(data),
    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(["tenant"], updatedTenant);
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
      localStorage.setItem("zii_tenant", JSON.stringify(updatedTenant));
    },
  });

  return {
    tenant: profileQuery.data ?? (authTenant as Tenant | null),
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateTenant: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
