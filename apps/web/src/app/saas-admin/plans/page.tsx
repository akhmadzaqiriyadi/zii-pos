"use client";

import type React from "react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { PlanManagement } from "../../../features/saas-admin/components/PlanManagement";

export default function SaaSPlansAdminPage() {
  return (
    <DashboardLayout requiredPermission="saas:admin">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Pengelolaan Paket SaaS Dinamis
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Super Admin Portal — Tambah, edit harga promo, atur batas kasir (
              <code>maxCashiers</code>), dan kelola penawaran paket SaaS secara
              real-time.
            </p>
          </div>
        </header>

        <PlanManagement />
      </main>
    </DashboardLayout>
  );
}
