"use client";

import { AlertTriangle, ShieldAlert } from "lucide-react";
import React from "react";

export interface LicenseUrgencyBannerProps {
  isExpiringSoon: boolean;
  isLocked: boolean;
  daysRemaining: number;
}

/**
 * Komponen Terpisah: Banner Peringatan Urgensi Masa Aktif Lisensi
 */
export function LicenseUrgencyBanner({
  isExpiringSoon,
  isLocked,
  daysRemaining,
}: LicenseUrgencyBannerProps) {
  if (isExpiringSoon) {
    return (
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-2xs animate-pulse">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
            Peringatan: Masa Aktif Lisensi Segera Berakhir!
          </h4>
          <p className="text-xs text-amber-700">
            Masa aktif paket Anda tersisa{" "}
            <span className="font-bold">{daysRemaining} hari lagi</span>.
            Segera lakukan perpanjangan agar operasional kasir toko tidak
            terganggu.
          </p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 shadow-2xs">
        <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider">
            Akses Kasir Dibekukan (Lisensi Kadaluarsa)
          </h4>
          <p className="text-xs text-rose-700">
            Lisensi toko Anda telah habis. Akses transaksi kasir dibekukan
            sementara hingga perpanjangan lisensi dilakukan di bawah.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
