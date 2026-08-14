"use client";

import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { TenantSettingsForm } from "../../../features/tenant/components/TenantSettingsForm";

export default function SettingsPage() {
  return (
    <DashboardLayout requiredRole="owner">
      <main className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Pengaturan White-Label Merchant
          </h1>
          <p className="text-sm text-slate-500">
            Atur nama toko, alamat, nomor telepon, dan pesan footer struk cetak
            / WhatsApp merchant kamu secara real-time.
          </p>
        </header>

        <TenantSettingsForm />
      </main>
    </DashboardLayout>
  );
}
