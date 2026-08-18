"use client";

import { RefreshCw } from "lucide-react";
import React from "react";
import { Switch } from "../../../components/ui/switch";

interface AutoRenewSwitchCardProps {
  autoRenew: boolean;
  onToggleAutoRenew?: (autoRenew: boolean) => void;
  isTogglingAutoRenew?: boolean;
}

/**
 * Subkomponen: Kartu Pengaturan Perpanjangan Otomatis (Auto-Renew Switch)
 */
export function AutoRenewSwitchCard({
  autoRenew,
  onToggleAutoRenew,
  isTogglingAutoRenew,
}: AutoRenewSwitchCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <RefreshCw className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-slate-900">
            Perpanjangan Lisensi Otomatis (Auto-Renew)
          </h4>
          <p className="text-[11px] text-slate-500">
            Otomatis membuat tagihan baru saat lisensi mendekati tanggal
            kadaluarsa agar kasir tetap aktif tanpa jeda.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <Switch
          checked={Boolean(autoRenew)}
          onCheckedChange={(checked) => onToggleAutoRenew?.(checked)}
          disabled={isTogglingAutoRenew}
          aria-label="Toggle Auto Renew"
        />
        <span className="text-xs font-bold text-slate-700 min-w-[50px]">
          {autoRenew ? "Aktif" : "Mati"}
        </span>
      </div>
    </div>
  );
}
