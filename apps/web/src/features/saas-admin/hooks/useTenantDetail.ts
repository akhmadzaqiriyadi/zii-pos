"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import {
  type MerchantTenant,
  SaaSAdminApiService,
} from "../services/saasAdminApi";

export function useTenantDetail(tenantId: string) {
  const queryClient = useQueryClient();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // 1. Query Tenant Detail
  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["saas-admin", "tenant-detail", tenantId],
    queryFn: () => SaaSAdminApiService.getTenantDetail(tenantId),
    enabled: !!tenantId,
  });

  // 2. Mutation for Tenant Status
  const statusMutation = useMutation({
    mutationFn: (newStatus: "active" | "trial" | "expired" | "suspended") =>
      SaaSAdminApiService.updateTenantStatus(tenantId, newStatus),
    onSuccess: (updatedTenant) => {
      queryClient.invalidateQueries({
        queryKey: ["saas-admin", "tenant-detail", tenantId],
      });
      queryClient.invalidateQueries({ queryKey: ["saasMetrics"] });
      queryClient.invalidateQueries({ queryKey: ["saasTenants"] });
      toast.success(
        `Status toko "${updatedTenant.name}" berhasil diubah menjadi ${updatedTenant.status.toUpperCase()}!`,
      );
      setIsStatusModalOpen(false);
    },
    onError: (err: unknown) => {
      toast.error(parseApiErrorMessage(err, "Gagal mengupdate status toko."));
    },
  });

  const tenantForModal: MerchantTenant | null = detail
    ? {
        id: detail.id,
        name: detail.name,
        subdomain: detail.subdomain,
        status: detail.status,
        logoUrl: detail.logoUrl,
        phone: detail.phone,
        address: detail.address,
        createdAt: detail.createdAt,
        totalUsers: detail.totalUsers,
        totalProducts: detail.totalProducts,
        totalTransactions: detail.totalTransactions,
        subscription: detail.subscriptions?.[0]
          ? {
              id: detail.subscriptions[0].id,
              status: detail.subscriptions[0].status,
              startsAt: detail.subscriptions[0].startsAt,
              expiresAt: detail.subscriptions[0].expiresAt,
              autoRenew: false,
              planCode: detail.subscriptions[0].plan.code,
              planName: detail.subscriptions[0].plan.name,
            }
          : null,
      }
    : null;

  return {
    detail,
    isLoading,
    error,
    isStatusModalOpen,
    setIsStatusModalOpen,
    tenantForModal,
    handleStatusChange: statusMutation.mutate,
    isUpdatingStatus: statusMutation.isPending,
  };
}
