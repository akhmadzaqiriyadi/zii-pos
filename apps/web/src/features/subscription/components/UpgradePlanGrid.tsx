"use client";

import { Check, CreditCard, Loader2, Sparkles, Zap } from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { formatRupiah } from "../../../lib/utils";
import type { SaaSPlanAdmin } from "../../saas-admin/services/saasAdminApi";

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
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Pilihan Paket Upgrade & Perpanjangan Lisensi
          </h3>
          <p className="text-xs text-slate-500">
            Tingkatkan batas kasir dan aktifkan fitur white-label untuk
            mengoptimalkan operasional bisnismu.
          </p>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => onCycleChange("monthly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedCycle === "monthly"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bulanan (Monthly)
          </button>
          <button
            type="button"
            onClick={() => onCycleChange("yearly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedCycle === "yearly"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Tahunan (Yearly)</span>
            <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded-full font-black">
              HEMAT
            </span>
          </button>
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
          {activePlans.map((plan) => {
            const isCurrent = currentPlanCode === plan.code;
            let features: string[] = [];
            try {
              features = JSON.parse(plan.featuresJson || "[]");
            } catch {
              features = [];
            }

            // Price calculation based on cycle
            const displayPrice =
              selectedCycle === "yearly" && plan.price > 0
                ? plan.price * 10 // 2 months discount
                : plan.price;

            return (
              <Card
                key={plan.id}
                className={`relative p-6 rounded-2xl border transition duration-200 flex flex-col justify-between ${
                  isCurrent
                    ? "border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/20 shadow-md"
                    : "border-slate-200 bg-white shadow-xs hover:shadow-md"
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-xs">
                      Paket Kamu Saat Ini
                    </span>
                  </div>
                )}

                <CardContent className="p-0 space-y-5">
                  <header className="space-y-2 border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="blue"
                        className="text-[10px] uppercase font-bold"
                      >
                        {plan.code}
                      </Badge>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Maks {plan.maxCashiers} Kasir
                      </span>
                    </div>

                    <h4 className="text-lg font-extrabold text-slate-900 leading-tight">
                      {plan.name}
                    </h4>

                    <div>
                      <span className="text-3xl font-black text-slate-900">
                        {displayPrice === 0
                          ? "Gratis"
                          : formatRupiah(displayPrice)}
                      </span>
                      {displayPrice > 0 && (
                        <span className="text-xs text-slate-400">
                          {" "}
                          / {selectedCycle === "yearly" ? "tahun" : "bulan"}
                        </span>
                      )}
                    </div>
                  </header>

                  <ul className="space-y-2 text-xs text-slate-600">
                    {features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <div className="pt-5 mt-5 border-t border-slate-100">
                  <Button
                    onClick={() => onCheckout(plan.id)}
                    disabled={isPending}
                    className={`w-full py-5 rounded-xl font-bold gap-2 cursor-pointer ${
                      isCurrent
                        ? "bg-slate-900 hover:bg-slate-800 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                    }`}
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memproses...
                      </span>
                    ) : isCurrent ? (
                      <>
                        <Zap className="h-4 w-4" />
                        <span>Perpanjang Lisensi</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span>Upgrade ke {plan.name}</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
