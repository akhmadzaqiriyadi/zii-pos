"use client";

import { Loader2 } from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import type { SaaSPlanAdmin } from "../../saas-admin/services/saasAdminApi";
import { UpgradePlanCard } from "./UpgradePlanCard";

interface UpgradePlanGridProps {
  plans: SaaSPlanAdmin[];
  currentPlanCode?: string;
  selectedCycle: "monthly" | "yearly";
  onCycleChange: (cycle: "monthly" | "yearly") => void;
  onCheckout: (planId: string) => void;
  isPending: boolean;
  isLoadingPlans: boolean;
}

export function UpgradePlanGrid({
  plans,
  currentPlanCode,
  selectedCycle,
  onCycleChange,
  onCheckout,
  isPending,
  isLoadingPlans,
}: UpgradePlanGridProps) {
  const activePlans = plans.filter((p) => p.isActive);

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Pilihan Paket Upgrade & Perpanjangan Lisensi
          </h3>
          <p className="text-xs text-slate-500">
            Tingkatkan batas kasir dan aktifkan fitur white-label untuk
            mengoptimalkan operasional bisnismu.
          </p>
        </div>

        {/* Billing Cycle Switcher with Discount Badge */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onCycleChange("monthly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedCycle === "monthly"
                ? "bg-white text-emerald-700 shadow-xs hover:bg-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bulanan (Monthly)
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onCycleChange("yearly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedCycle === "yearly"
                ? "bg-white text-emerald-700 shadow-xs hover:bg-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Tahunan (Yearly)</span>
            <Badge
              variant="emerald"
              className="text-[9px] px-2 py-0.5 font-black"
            >
              HEMAT 2 BULAN
            </Badge>
          </Button>
        </div>
      </header>

      {isLoadingPlans ? (
        <div className="flex items-center justify-center py-12 space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span className="text-sm text-slate-500">
            Memuat opsi paket SaaS...
          </span>
        </div>
      ) : activePlans.length === 0 ? (
        <Card className="p-6 text-center text-slate-400">
          Belum ada paket langganan aktif yang dapat dipilih.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activePlans.map((plan) => (
            <UpgradePlanCard
              key={plan.id}
              plan={plan}
              isCurrent={currentPlanCode === plan.code}
              selectedCycle={selectedCycle}
              onCheckout={onCheckout}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
