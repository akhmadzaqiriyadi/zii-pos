"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { Button } from "../../../components/ui/button";
import { TenantSettingsForm } from "../../../features/tenant/components/TenantSettingsForm";

function LicenseExpiredAlertBanner() {
  const searchParams = useSearchParams();
  const alert = searchParams.get("alert");

  if (alert !== "license_expired") return null;

  return (
    <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-md flex items-start justify-between gap-3 text-red-700 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-500 text-white rounded-lg text-lg font-bold leading-none">
          ⚠️
        </div>
        <div>
          <h3 className="text-base font-bold text-red-900">
            Masa Lisensi / Trial Toko Anda Telah Berakhir
          </h3>
          <p className="text-xs text-red-700 mt-0.5">
            Akses kasir POS dan katalog produk dinonaktifkan sementara. Silakan
            lakukan perpanjangan paket langganan untuk mengaktifkan kembali
            operasional kasir.
          </p>
        </div>
      </div>
      <Link href="/settings/billing">
        <Button
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0 cursor-pointer"
        >
          Perpanjang Sekarang
        </Button>
      </Link>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <DashboardLayout requiredPermission="settings:manage">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <Suspense fallback={null}>
          <LicenseExpiredAlertBanner />
        </Suspense>

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Pengaturan White-Label Merchant
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Atur logo toko, nama merchant, kontak, dan footer struk cetak /
              WhatsApp secara real-time.
            </p>
          </div>
        </header>

        <TenantSettingsForm />
      </main>
    </DashboardLayout>
  );
}
