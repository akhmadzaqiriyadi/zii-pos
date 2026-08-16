"use client";

import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { TenantSettingsForm } from "../../../features/tenant/components/TenantSettingsForm";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const alert = searchParams.get("alert");

  return (
    <DashboardLayout requiredRole="owner">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        {alert === "license_expired" && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-md flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-2 bg-red-500 text-white rounded-lg text-lg font-bold leading-none">
              ⚠️
            </div>
            <div>
              <h3 className="text-base font-bold text-red-900">
                Masa Lisensi / Trial Toko Anda Telah Berakhir
              </h3>
              <p className="text-xs text-red-700 mt-0.5">
                Akses kasir POS dan katalog produk dinonaktifkan sementara.
                Silakan lakukan perpanjangan paket langganan untuk mengaktifkan
                kembali operasional kasir.
              </p>
            </div>
          </div>
        )}

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
