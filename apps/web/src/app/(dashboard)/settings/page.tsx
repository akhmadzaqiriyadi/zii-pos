"use client";

import { CreditCard, Shield, Store, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { Button } from "../../../components/ui/button";
import { RoleManagement } from "../../../features/roles/components/RoleManagement";
import { CashierManagement } from "../../../features/tenant/components/CashierManagement";
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

function SettingsContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "branding";

  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      <Suspense fallback={null}>
        <LicenseExpiredAlertBanner />
      </Suspense>

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {currentTab === "cashiers"
              ? "Kelola Staf & Kasir Toko"
              : currentTab === "roles"
                ? "Role & Hak Akses (Dynamic RBAC)"
                : "Pengaturan White-Label Merchant"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {currentTab === "cashiers"
              ? "Kelola akun kasir multi-user dan kapasitas staf toko sesuai paket langganan."
              : currentTab === "roles"
                ? "Atur wewenang dan izin akses staf mulai dari diskon, void nota, edit produk, hingga laporan."
                : "Atur logo toko, nama merchant, kontak, dan footer struk cetak / WhatsApp secara real-time."}
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
          <Link href="/settings">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                currentTab === "branding"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              <span>Branding</span>
            </Button>
          </Link>

          <Link href="/settings?tab=roles">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                currentTab === "roles"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Role & Akses</span>
            </Button>
          </Link>

          <Link href="/settings?tab=cashiers">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                currentTab === "cashiers"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Kelola Staf</span>
            </Button>
          </Link>

          <Link href="/settings/billing">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold text-xs transition cursor-pointer"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Billing</span>
            </Button>
          </Link>
        </nav>
      </header>

      {currentTab === "roles" ? (
        <RoleManagement />
      ) : currentTab === "cashiers" ? (
        <CashierManagement />
      ) : (
        <TenantSettingsForm />
      )}
    </main>
  );
}

export default function SettingsPage() {
  return (
    <DashboardLayout requiredRole="owner">
      <Suspense
        fallback={
          <div className="p-8 text-center text-slate-400">
            Memuat pengaturan...
          </div>
        }
      >
        <SettingsContent />
      </Suspense>
    </DashboardLayout>
  );
}
