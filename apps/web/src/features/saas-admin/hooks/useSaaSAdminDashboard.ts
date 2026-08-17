"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import {
  type MerchantTenant,
  SaaSAdminApiService,
} from "../services/saasAdminApi";

export function useSaaSAdminDashboard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedTenantForStatus, setSelectedTenantForStatus] =
    useState<MerchantTenant | null>(null);
  const [selectedTenantForDetail, setSelectedTenantForDetail] =
    useState<MerchantTenant | null>(null);

  // 1. Query Metrics (MRR, Total Merchants, Active Trials, Churn Rate)
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["saasMetrics"],
    queryFn: () => SaaSAdminApiService.getMetrics(),
  });

  // 2. Query Tenants List
  const { data: tenantsResponse, isLoading: isLoadingTenants } = useQuery({
    queryKey: ["saasTenants", page, search, statusFilter],
    queryFn: () =>
      SaaSAdminApiService.getTenants(page, 10, search, statusFilter),
  });

  // 3. Mutation Update Tenant Status
  const statusMutation = useMutation({
    mutationFn: ({
      tenantId,
      status,
    }: {
      tenantId: string;
      status: "active" | "trial" | "expired" | "suspended";
    }) => SaaSAdminApiService.updateTenantStatus(tenantId, status),
    onSuccess: (updatedTenant) => {
      queryClient.invalidateQueries({ queryKey: ["saasMetrics"] });
      queryClient.invalidateQueries({ queryKey: ["saasTenants"] });
      toast.success(
        `Status merchant "${updatedTenant.name}" berhasil diubah menjadi ${updatedTenant.status.toUpperCase()}!`,
      );
      setSelectedTenantForStatus(null);
    },
    onError: (err: unknown) => {
      toast.error(
        parseApiErrorMessage(err, "Gagal mengupdate status merchant."),
      );
    },
  });

  const handleOpenStatusModal = (tenant: MerchantTenant) => {
    setSelectedTenantForStatus(tenant);
  };

  const handleOpenDetailModal = (tenant: MerchantTenant) => {
    setSelectedTenantForDetail(tenant);
  };

  const confirmStatusChange = (
    newStatus: "active" | "trial" | "expired" | "suspended",
  ) => {
    if (!selectedTenantForStatus) return;
    statusMutation.mutate({
      tenantId: selectedTenantForStatus.id,
      status: newStatus,
    });
  };

  return {
    search,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    statusFilter,
    setStatusFilter: (val: string) => {
      setStatusFilter(val);
      setPage(1);
    },
    page,
    setPage,
    metrics,
    isLoadingMetrics,
    tenants: tenantsResponse?.data || [],
    meta: tenantsResponse?.meta || {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
    isLoadingTenants,
    selectedTenantForStatus,
    setSelectedTenantForStatus,
    selectedTenantForDetail,
    setSelectedTenantForDetail,
    handleOpenStatusModal,
    handleOpenDetailModal,
    confirmStatusChange,
    isStatusUpdating: statusMutation.isPending,
  };
}
