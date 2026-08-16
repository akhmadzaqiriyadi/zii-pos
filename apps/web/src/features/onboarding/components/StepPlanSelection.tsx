"use client";

import { ArrowLeft, Check, Crown, Loader2, Sparkles, Store, Users } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { formatRupiah } from "../../../lib/utils";
import type { Plan } from "../hooks/useOnboardingForm";

interface StepPlanSelectionProps {
  plans: Plan[];
  isLoadingPlans: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onComplete: (planId: string) => void;
}

export function StepPlanSelection({
  plans,
  isLoadingPlans,
  isSubmitting,
  onBack,
  onComplete,
}: StepPlanSelectionProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plans.length > 0 ? plans[0].id : "",
  );

  // Auto select starter plan if none selected initially
  React.useEffect(() => {
    if (!selectedPlanId && plans.length > 0) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans, selectedPlanId]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900">
          Langkah 3: Pilih Paket Langganan & Aktivasi Usaha
        </h2>
        <p className="text-xs text-slate-500">
          Pilih paket langganan yang sesuai dengan kapasitas operasional toko dan jumlah kasir Anda.
        </p>
      </header>

      {isLoadingPlans ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-xs text-slate-500 font-medium">
            Memuat daftar paket langganan SaaS...
          </p>
        </div>
      ) : plans.length === 0 ? (
        <div className="p-6 text-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          Tidak ada paket aktif saat ini. Pendaftaran akan menggunakan paket default trial.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isPro = plan.code === "pro";
            let features: string[] = [];
            try {
              features = JSON.parse(plan.featuresJson || "[]");
            } catch {
              features = [];
            }

            return (
              <Card
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-2 border-emerald-500 bg-emerald-50/30 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20"
                    : "border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {isPro && (
                  <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Paling Populer
                  </span>
                )}

                <CardContent className="p-0 space-y-4">
                  <header className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                        {plan.code === "enterprise" && (
                          <Crown className="h-4 w-4 text-amber-500" />
                        )}
                        <span>{plan.name}</span>
                      </h3>
                      {isSelected && (
                        <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="pt-2">
                      <span className="text-2xl font-black text-slate-900">
                        {plan.price === 0 ? "Gratis" : formatRupiah(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-xs text-slate-400 font-normal">
                          {" "}
                          / bulan
                        </span>
                      )}
                    </div>
                  </header>

                  <div className="flex items-center gap-2 pt-1 pb-2">
                    <Badge variant="emerald" className="gap-1 text-[11px] py-0.5">
                      <Users className="h-3 w-3" />
                      <span>
                        Hingga {plan.maxCashiers}{" "}
                        {plan.maxCashiers === 1 ? "Kasir" : "Kasir"}
                      </span>
                    </Badge>
                    {plan.allowWhiteLabel && (
                      <Badge variant="blue" className="text-[10px] py-0.5">
                        White-Label
                      </Badge>
                    )}
                  </div>

                  <ul className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    {features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmation Summary Footer */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          disabled={isSubmitting}
          className="w-full sm:w-auto h-11 px-5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 gap-2 cursor-pointer transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Button>

        <Button
          type="button"
          onClick={() => onComplete(selectedPlanId)}
          disabled={isSubmitting || !selectedPlanId}
          className="w-full sm:w-auto h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-lg shadow-emerald-600/20 gap-2 cursor-pointer transition justify-center"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Mendaftarkan Merchant & Menyiapkan Kasir...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Selesaikan Pendaftaran & Masuk Kasir
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
