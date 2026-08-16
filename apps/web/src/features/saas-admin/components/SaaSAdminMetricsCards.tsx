"use client";

import { Activity, DollarSign, Loader2, Store, Users } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { formatRupiah } from "../../../lib/utils";
import type { SaaSMetrics } from "../services/saasAdminApi";

interface SaaSAdminMetricsCardsProps {
  metrics?: SaaSMetrics;
  isLoading: boolean;
}

export function SaaSAdminMetricsCards({
  metrics,
  isLoading,
}: SaaSAdminMetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-7 w-32 bg-slate-100 rounded-md animate-pulse" />
              </div>
              <div className="h-10 w-10 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const cardsData = [
    {
      title: "Monthly Recurring Revenue (MRR)",
      value: metrics ? formatRupiah(metrics.mrr) : "Rp 0",
      subtitle: `${metrics?.activePaidMerchants || 0} Merchant Berlangganan`,
      icon: DollarSign,
      color: "emerald",
      bgIcon: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      title: "Total Merchant Terdaftar",
      value: String(metrics?.totalMerchants || 0),
      subtitle: "Usaha Aktif di Platform ZII POS",
      icon: Store,
      color: "blue",
      bgIcon: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Trial Merchant Aktif",
      value: String(metrics?.activeTrials || 0),
      subtitle: "Merchant dalam Masa Uji Coba",
      icon: Users,
      color: "amber",
      bgIcon: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      title: "SaaS Churn Rate",
      value: `${metrics?.churnRate || 0}%`,
      subtitle: `${metrics?.expiredMerchants || 0} Toko Nonaktif / Expired`,
      icon: Activity,
      color: "rose",
      bgIcon: "bg-rose-50 text-rose-600 border-rose-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cardsData.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition duration-200"
          >
            <CardContent className="p-0 flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500">
                  {card.title}
                </p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </p>
                <p className="text-[11px] font-medium text-slate-400">
                  {card.subtitle}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-2xs ${card.bgIcon}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
