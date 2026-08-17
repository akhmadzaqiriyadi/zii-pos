"use client";

import type React from "react";
import { DashboardLayout } from "../../../../components/layout/dashboard-layout";
import { RoleManagement } from "../../../../features/roles/components/RoleManagement";

export default function RolesSettingsPage() {
  return (
    <DashboardLayout requiredPermission="roles:manage">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Role & Hak Akses (Dynamic RBAC)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Atur wewenang dan izin akses staf mulai dari diskon, void nota,
              edit produk, hingga laporan keuangan.
            </p>
          </div>
        </header>

        <RoleManagement />
      </main>
    </DashboardLayout>
  );
}
