"use client";

import { Crown } from "lucide-react";
import React from "react";
import { DashboardLayout } from "../../components/layout/dashboard-layout";
import { SaaSAdminMetricsCards } from "../../features/saas-admin/components/SaaSAdminMetricsCards";
import { TenantStatusModal } from "../../features/saas-admin/components/TenantStatusModal";
import { TenantTable } from "../../features/saas-admin/components/TenantTable";
import { useSaaSAdminDashboard } from "../../features/saas-admin/hooks/useSaaSAdminDashboard";

export default function SaaSAdminPage() {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    metrics,
    isLoadingMetrics,
    tenants,
    meta,
    isLoadingTenants,
    selectedTenantForStatus,
    setSelectedTenantForStatus,
    handleOpenStatusModal,
    confirmStatusChange,
    isStatusUpdating,
  } = useSaaSAdminDashboard();

  return (
    <DashboardLayout requiredPermission="saas:admin">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-2xs">
                <Crown className="h-4 w-4" />
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Monitoring Merchant & MRR
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Super Admin Portal — Pemantauan performa bisnis SaaS komersial,
              pendapatan MRR, dan kontrol status lisensi seluruh merchant toko.
            </p>
          </div>
        </header>

        {/* 1. SaaS KPI Metrics Cards */}
        <section aria-label="SaaS KPI Metrics">
          <SaaSAdminMetricsCards
            metrics={metrics}
            isLoading={isLoadingMetrics}
          />
        </section>

        {/* 2. Merchant Monitoring Table */}
        <section aria-label="Merchant Monitoring Table">
          <TenantTable
            tenants={tenants}
            meta={meta}
            isLoading={isLoadingTenants}
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onPageChange={setPage}
            onOpenStatusModal={handleOpenStatusModal}
          />
        </section>

        {/* 3. Status Modification Modal */}
        <TenantStatusModal
          tenant={selectedTenantForStatus}
          onClose={() => setSelectedTenantForStatus(null)}
          onConfirm={confirmStatusChange}
          isPending={isStatusUpdating}
        />
      </main>
    </DashboardLayout>
  );
}
