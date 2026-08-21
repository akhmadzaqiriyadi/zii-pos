"use client";

import { Check, CreditCard, Loader2, Lock, Zap } from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { formatRupiah } from "../../../lib/utils";
import type { SaaSPlanAdmin } from "../../saas-admin/services/saasAdminApi";

export interface UpgradePlanCardProps {
  plan: SaaSPlanAdmin;
  isCurrent: boolean;
  selectedCycle: "monthly" | "yearly";
  onCheckout: (planId: string) => void;
  isPending: boolean;
}

/**
 * Komponen Terpisah: Kartu Rincian Harga & Fitur Paket Langganan SaaS
 */
export function UpgradePlanCard({
  plan,
  isCurrent,
  selectedCycle,
  onCheckout,
  isPending,
}: UpgradePlanCardProps) {
  const isStarterTrial = plan.price === 0 || plan.code === "starter";

  let features: string[] = [];
  try {
    features = JSON.parse(plan.featuresJson || "[]");
  } catch {
    features = [];
  }

  // Price calculation based on cycle (10x for yearly / 2 months free)
  const displayPrice =
    selectedCycle === "yearly" && plan.price > 0
      ? plan.price * 10
      : plan.price;

  return (
    <Card
      className={`relative p-6 rounded-2xl border transition duration-200 flex flex-col justify-between ${
        isCurrent
          ? "border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/20 shadow-md"
          : isStarterTrial
            ? "border-slate-200 bg-slate-50/50 opacity-90 shadow-2xs"
            : "border-slate-200 bg-white shadow-xs hover:shadow-md"
      }`}
    >
      {isCurrent && (
        <div className="absolute -top-3 left-6">
          <Badge
            variant="emerald"
            className="text-[10px] font-extrabold uppercase px-3 py-1 shadow-xs"
          >
            Paket Kamu Saat Ini
          </Badge>
        </div>
      )}

      <CardContent className="p-0 space-y-5">
        <header className="space-y-2 border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <Badge
              variant={
                isStarterTrial ? "slate" : isCurrent ? "emerald" : "blue"
              }
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
              {displayPrice === 0 ? "Gratis" : formatRupiah(displayPrice)}
            </span>
            {displayPrice > 0 ? (
              <span className="text-xs text-slate-400">
                {" "}
                / {selectedCycle === "yearly" ? "tahun" : "bulan"}
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-600 block mt-1">
                14 Hari (Khusus Toko Baru)
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

      {/* Bottom Action Button with Guardrail Anti-Trial */}
      <div className="pt-5 mt-5 border-t border-slate-100 space-y-2">
        {isStarterTrial ? (
          <div>
            <Button
              disabled
              variant="outline"
              className="w-full py-5 rounded-xl font-bold gap-2 cursor-not-allowed opacity-60 bg-slate-100 text-slate-500 border-slate-200"
            >
              <Lock className="h-4 w-4 text-slate-400" />
              <span>Khusus Toko Baru</span>
            </Button>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              Hanya berlaku 1x saat registrasi toko baru.
            </p>
          </div>
        ) : (
          <Button
            onClick={() => onCheckout(plan.id)}
            disabled={isPending}
            className={`w-full py-5 rounded-xl font-bold gap-2 cursor-pointer transition shadow-xs ${
              isCurrent
                ? "bg-slate-900 hover:bg-slate-800 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
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
        )}
      </div>
    </Card>
  );
}
