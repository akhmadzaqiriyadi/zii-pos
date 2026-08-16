"use client";

import { Check, Edit2, Loader2, Plus, Sparkles, Trash2, Users } from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { formatRupiah } from "../../../lib/utils";
import type { SaaSPlanAdmin } from "../services/saasAdminApi";

interface PlanGridTableProps {
  plans: SaaSPlanAdmin[];
  isLoading: boolean;
  onOpenAddModal: () => void;
  onOpenEditModal: (plan: SaaSPlanAdmin) => void;
  onOpenDeleteModal: (plan: SaaSPlanAdmin) => void;
}

export function PlanGridTable({
  plans,
  isLoading,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal,
}: PlanGridTableProps) {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Daftar Paket Langganan SaaS
          </h2>
          <p className="text-xs text-slate-500">
            Kelola harga, batas kasir, dan penawaran fitur paket yang tersedia untuk merchant ZII POS.
          </p>
        </div>

        <Button
          onClick={onOpenAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 gap-2 cursor-pointer py-5 px-5"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Paket Baru</span>
        </Button>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-xs font-semibold text-slate-500">
            Memuat daftar paket SaaS...
          </p>
        </div>
      ) : plans.length === 0 ? (
        <Card className="p-8 text-center rounded-2xl border border-slate-200 bg-white">
          <p className="text-sm font-semibold text-slate-500">
            Belum ada paket langganan SaaS yang terdaftar.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            let features: string[] = [];
            try {
              features = JSON.parse(plan.featuresJson || "[]");
            } catch {
              features = [];
            }

            return (
              <Card
                key={plan.id}
                className={`relative p-6 rounded-2xl border transition duration-200 flex flex-col justify-between ${
                  plan.isActive
                    ? "border-slate-200 bg-white shadow-xs hover:shadow-md"
                    : "border-slate-200 bg-slate-50/70 opacity-75"
                }`}
              >
                <CardContent className="p-0 space-y-5">
                  <header className="space-y-2 border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="blue" className="text-[10px] uppercase font-bold">
                        {plan.code}
                      </Badge>

                      <Badge
                        variant={plan.isActive ? "emerald" : "slate"}
                        className="text-[10px]"
                      >
                        {plan.isActive ? "AKTIF" : "NONAKTIF"}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                      {plan.name}
                    </h3>

                    <div className="pt-1">
                      <span className="text-3xl font-black text-slate-900">
                        {plan.price === 0 ? "Gratis" : formatRupiah(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-xs text-slate-400 font-normal">
                          {" "}
                          / {plan.billingCycle === "yearly" ? "tahun" : "bulan"}
                        </span>
                      )}
                    </div>
                  </header>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="emerald" className="gap-1 text-[11px]">
                      <Users className="h-3 w-3" />
                      <span>Maks {plan.maxCashiers} Kasir</span>
                    </Badge>
                    {plan.allowWhiteLabel && (
                      <Badge variant="amber" className="text-[10px]">
                        White-Label
                      </Badge>
                    )}
                    {plan.allowExportExcel && (
                      <Badge variant="blue" className="text-[10px]">
                        Ekspor Excel
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Fitur Termasuk:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                {/* Footer Action Buttons */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenEditModal(plan)}
                    className="text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-100 gap-1.5 rounded-xl cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Edit Paket</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenDeleteModal(plan)}
                    className="text-xs font-semibold text-rose-600 hover:bg-rose-50 gap-1.5 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                    <span>Hapus</span>
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
