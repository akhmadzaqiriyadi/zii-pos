"use client";

import { FileSpreadsheet, Globe, Users } from "lucide-react";
import React from "react";
import type { CurrentSubscriptionPlan } from "../services/subscriptionApi";

export interface LicenseFeatureBadgesProps {
  plan: CurrentSubscriptionPlan;
}

/**
 * Komponen Terpisah: Indikator Fitur & Limit Lisensi Toko (Batas Kasir, Domain, Ekspor)
 */
export function LicenseFeatureBadges({ plan }: LicenseFeatureBadgesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
      <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Users className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Batas Kasir
          </p>
          <p className="text-xs font-extrabold text-slate-800">
            Maksimal {plan.maxCashiers} User
          </p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Globe className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            White-Label Domain
          </p>
          <p className="text-xs font-extrabold text-slate-800">
            {plan.allowWhiteLabel ? "Aktif (Custom Logo)" : "Tidak Aktif"}
          </p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <FileSpreadsheet className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Ekspor Excel / CSV
          </p>
          <p className="text-xs font-extrabold text-slate-800">
            {plan.allowExportExcel ? "Didukung Full" : "Terbatas"}
          </p>
        </div>
      </div>
    </div>
  );
}
