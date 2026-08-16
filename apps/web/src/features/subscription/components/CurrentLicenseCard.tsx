"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  FileSpreadsheet,
  Globe,
  Loader2,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import { formatRupiah } from "../../../lib/utils";
import type { CurrentSubscriptionData } from "../services/subscriptionApi";

interface CurrentLicenseCardProps {
  subscription?: CurrentSubscriptionData;
  isLoading: boolean;
}

export function CurrentLicenseCard({
  subscription,
  isLoading,
}: CurrentLicenseCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6 rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-center py-10 space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span className="text-sm font-semibold text-slate-500">
            Memuat status lisensi toko...
          </span>
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="p-6 rounded-2xl border border-amber-200 bg-amber-50/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Lisensi Tidak Ditemukan
            </h3>
            <p className="text-xs text-amber-700">
              Sistem tidak menemukan lisensi aktif untuk toko ini. Silakan pilih
              paket langganan di bawah.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const { plan, daysRemaining, status, expiresAt } = subscription;
  const daysTotal = status === "trial" ? 14 : 30;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((daysRemaining / daysTotal) * 100)),
  );

  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            LISENSI AKTIF
          </span>
        );
      case "trial":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            MASA TRIAL (UJI COBA)
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
            DIBEKUKAN (SUSPENDED)
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
            LISENSI HABIS (EXPIRED)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-600">
            {(status as string).toUpperCase()}
          </span>
        );
    }
  };

  return (
    <Card className="p-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30 shadow-xs relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Crown className="h-48 w-48 text-emerald-900" />
      </div>

      <CardContent className="p-0 space-y-6">
        {/* Header Title & Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-xs shadow-xs">
                ZII
              </span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Status Berlangganan Toko
              </p>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {plan?.name || "Paket Standard Merchant"}
            </h2>
          </div>

          <div>{getStatusBadge()}</div>
        </div>

        {/* Days Remaining Progress Bar */}
        <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-emerald-600" />
              Sisa Masa Aktif Lisensi:
            </span>
            <span className="text-emerald-700 font-extrabold text-sm">
              {daysRemaining} Hari Tersisa
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
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
              Mulai:{" "}
              {new Date(subscription.startsAt).toLocaleDateString("id-ID")}
            </span>
            <span>
              Kadaluarsa: {new Date(expiresAt).toLocaleDateString("id-ID")}
            </span>
          </div>
        </div>

        {/* Feature Badges & Allowance */}
        {plan && (
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
        )}
      </CardContent>
    </Card>
  );
}
