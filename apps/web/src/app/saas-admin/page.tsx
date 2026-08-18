"use client";

import { Crown, Layers, ShieldCheck } from "lucide-react";
import Link from "next/link";
import React from "react";
import { DashboardLayout } from "../../components/layout/dashboard-layout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { SaaSAdminMetricsCards } from "../../features/saas-admin/components/SaaSAdminMetricsCards";
import { TenantDetailModal } from "../../features/saas-admin/components/TenantDetailModal";
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
    selectedTenantForDetail,
    setSelectedTenantForDetail,
    handleOpenStatusModal,
    handleOpenDetailModal,
    confirmStatusChange,
    isStatusUpdating,
  } = useSaaSAdminDashboard();

  return (
    <DashboardLayout requiredPermission="saas:admin">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-2xs">
                <Crown className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    Monitoring Merchant & MRR
                  </h1>
                  <Badge
                    variant="purple"
                    className="text-[10px] font-black uppercase px-2 py-0.5"
                  >
                    SUPER ADMIN
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Portal Kontrol Platform Global — Pemantauan pendapatan bulanan
              (MRR), performa usaha merchant, dan kendali status lisensi
              operasional.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-bold text-xs gap-2 shadow-2xs cursor-pointer h-10 px-4"
            >
              <Link href="/saas-admin/plans">
                <Layers className="h-4 w-4 text-slate-500" />
                <span>Kelola Paket SaaS</span>
              </Link>
            </Button>
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
            onOpenDetailModal={handleOpenDetailModal}
          />
        </section>

        {/* 3. Status Modification Modal */}
        <TenantStatusModal
          tenant={selectedTenantForStatus}
          onClose={() => setSelectedTenantForStatus(null)}
          onConfirm={confirmStatusChange}
          isPending={isStatusUpdating}
        />

        {/* 4. Merchant Detail Modal */}
        <TenantDetailModal
          tenant={selectedTenantForDetail}
          onClose={() => setSelectedTenantForDetail(null)}
          onOpenStatusModal={handleOpenStatusModal}
        />
      </main>
    </DashboardLayout>
  );
}
