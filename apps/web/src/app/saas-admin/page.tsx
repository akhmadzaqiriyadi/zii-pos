"use client";

import { Crown, Layers, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import React from "react";
import { DashboardLayout } from "../../components/layout/dashboard-layout";
import { Button } from "../../components/ui/button";
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
    <DashboardLayout requiredRole="owner">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-2xs">
                <Crown className="h-4 w-4" />
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Super Admin SaaS Portal
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Pemantauan performa bisnis SaaS komersial, pendapatan MRR, dan
              kontrol status lisensi seluruh merchant toko.
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <nav className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
            <Link href="/saas-admin">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-lg bg-white text-emerald-700 font-bold shadow-xs text-xs cursor-pointer"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Monitoring Merchant</span>
              </Button>
            </Link>

            <Link href="/saas-admin/plans">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold text-xs transition cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Kelola Paket SaaS</span>
              </Button>
            </Link>
          </nav>
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
