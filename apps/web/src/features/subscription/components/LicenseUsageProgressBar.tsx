"use client";

import { Calendar, Users } from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import type { CurrentSubscriptionData } from "../services/subscriptionApi";

interface LicenseUsageProgressBarProps {
  subscription: CurrentSubscriptionData;
}

/**
 * Subkomponen: Progress Bar Sisa Masa Aktif Lisensi & Penggunaan Kuota Kasir
 */
export function LicenseUsageProgressBar({
  subscription,
}: LicenseUsageProgressBarProps) {
  const { plan, daysRemaining, status, expiresAt, usage } = subscription;

  const daysTotal = status === "trial" ? 14 : 30;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((daysRemaining / daysTotal) * 100)),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Days Remaining Card */}
      <div className="space-y-2.5 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-emerald-600" />
            Sisa Masa Aktif Lisensi:
          </span>
          <span
            className={`font-extrabold text-sm ${
              daysRemaining <= 3 ? "text-rose-600" : "text-emerald-700"
            }`}
          >
            {daysRemaining} Hari Tersisa
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              daysRemaining <= 3
                ? "bg-rose-500"
                : daysRemaining <= 7
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>
            Mulai: {new Date(subscription.startsAt).toLocaleDateString("id-ID")}
          </span>
          <span>
            Kadaluarsa: {new Date(expiresAt).toLocaleDateString("id-ID")}
          </span>
        </div>
      </div>

      {/* 2. Cashier Usage Progress Bar Card */}
      <div className="space-y-2.5 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700 flex items-center gap-1.5">
            <Users className="h-4 w-4 text-emerald-600" />
            Penggunaan Kuota Kasir:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-slate-900">
              {usage?.activeCashiers ?? 1} /{" "}
              {usage?.maxCashiers ?? plan?.maxCashiers ?? 1} Akun
            </span>
            {usage?.isCashierLimitReached && (
              <Badge
                variant="rose"
                className="text-[9px] px-1.5 py-0 font-bold"
              >
                Penuh
              </Badge>
            )}
          </div>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              usage?.isCashierLimitReached
                ? "bg-rose-500"
                : (usage?.cashierUsagePercent ?? 20) >= 80
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
            style={{ width: `${usage?.cashierUsagePercent ?? 20}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>
            {usage?.isCashierLimitReached
              ? "Kuota kasir penuh. Upgrade paket untuk tambah kasir."
              : `Tersisa ${(usage?.maxCashiers ?? plan?.maxCashiers ?? 1) - (usage?.activeCashiers ?? 1)} slot kasir.`}
          </span>
          <span className="font-bold text-slate-600">
            {usage?.cashierUsagePercent ?? 20}% Terpakai
          </span>
        </div>
      </div>
    </div>
  );
}
