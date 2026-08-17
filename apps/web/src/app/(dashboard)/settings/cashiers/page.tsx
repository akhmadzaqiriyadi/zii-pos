"use client";

import type React from "react";
import { DashboardLayout } from "../../../../components/layout/dashboard-layout";
import { CashierManagement } from "../../../../features/tenant/components/CashierManagement";

export default function CashiersSettingsPage() {
  return (
    <DashboardLayout requiredPermission="cashiers:manage">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Kelola Staf & Kasir Toko
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola akun staf multi-user dan kapasitas staf toko sesuai paket
              langganan aktif.
            </p>
          </div>
        </header>

        <CashierManagement />
      </main>
    </DashboardLayout>
  );
}
