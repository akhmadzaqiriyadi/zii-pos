"use client";

import { CreditCard, Store } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { Button } from "../../../components/ui/button";
import { TenantSettingsForm } from "../../../features/tenant/components/TenantSettingsForm";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const alert = searchParams.get("alert");

  return (
    <DashboardLayout requiredRole="owner">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        {alert === "license_expired" && (
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
                  Akses kasir POS dan katalog produk dinonaktifkan sementara.
                  Silakan lakukan perpanjangan paket langganan untuk
                  mengaktifkan kembali operasional kasir.
                </p>
              </div>
            </div>
            <Link href="/settings/billing">
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0"
              >
                Perpanjang Sekarang
              </Button>
            </Link>
          </div>
        )}

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Pengaturan White-Label Merchant
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Atur nama toko, alamat, nomor telepon, dan pesan footer struk
              cetak / WhatsApp merchant kamu secara real-time.
            </p>
          </div>

          {/* Sub-Navigation Tabs */}
          <nav className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
            <Link href="/settings">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-lg bg-white text-emerald-700 font-bold shadow-xs text-xs cursor-pointer"
              >
                <Store className="h-3.5 w-3.5" />
                <span>Branding Toko</span>
              </Button>
            </Link>

            <Link href="/settings/billing">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold text-xs transition cursor-pointer"
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>Lisensi & Billing</span>
              </Button>
            </Link>
          </nav>
        </header>

        <TenantSettingsForm />
      </main>
    </DashboardLayout>
  );
}
