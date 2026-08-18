"use client";

import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Store,
  Users,
} from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
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
          <Card
            key={i}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3.5 w-24 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-8 w-32 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-3 w-28 bg-slate-100 rounded-md animate-pulse" />
              </div>
              <div className="h-12 w-12 bg-slate-100 rounded-2xl animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const cardsData = [
    {
      id: "mrr",
      title: "Monthly Recurring Revenue",
      value: metrics ? formatRupiah(metrics.mrr) : "Rp 0",
      subtitle: `${metrics?.activePaidMerchants || 0} Merchant Berbayar Aktif`,
      badge: "MRR",
      badgeVariant: "emerald" as const,
      icon: DollarSign,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
      cardBorder: "hover:border-emerald-300",
    },
    {
      id: "merchants",
      title: "Total Merchant Terdaftar",
      value: String(metrics?.totalMerchants || 0),
      subtitle: "Seluruh Toko di Platform ZII POS",
      badge: "Merchant",
      badgeVariant: "blue" as const,
      icon: Store,
      iconBg: "bg-blue-50 text-blue-600 border-blue-200/80",
      cardBorder: "hover:border-blue-300",
    },
    {
      id: "trials",
      title: "Trial Merchant Aktif",
      value: String(metrics?.activeTrials || 0),
      subtitle: "Toko dalam Masa Percobaan 14 Hari",
      badge: "Trial 14H",
      badgeVariant: "amber" as const,
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600 border-amber-200/80",
      cardBorder: "hover:border-amber-300",
    },
    {
      id: "churn",
      title: "SaaS Churn Rate",
      value: `${metrics?.churnRate || 0}%`,
      subtitle: `${metrics?.expiredMerchants || 0} Toko Expired / Nonaktif`,
      badge: "Kesehatan",
      badgeVariant: "purple" as const,
      icon: Activity,
      iconBg: "bg-purple-50 text-purple-600 border-purple-200/80",
      cardBorder: "hover:border-purple-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cardsData.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.id}
            className={`p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200 hover:shadow-md ${card.cardBorder}`}
          >
            <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between space-y-0">
              <span className="text-xs font-bold text-slate-500 truncate">
                {card.title}
              </span>
              <Badge
                variant={card.badgeVariant}
                className="text-[10px] uppercase font-extrabold px-2 py-0.5"
              >
                {card.badge}
              </Badge>
            </CardHeader>

            <CardContent className="p-0 flex items-end justify-between pt-1">
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </p>
                <p className="text-[11px] font-semibold text-slate-400 leading-tight">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-2xs ${card.iconBg}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
