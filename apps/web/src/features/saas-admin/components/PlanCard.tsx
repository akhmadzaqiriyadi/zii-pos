"use client";

import {
  Check,
  Edit2,
  FileSpreadsheet,
  Package,
  Sparkles,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { formatRupiah } from "../../../lib/utils";
import type { SaaSPlanAdmin } from "../services/saasAdminApi";

interface PlanCardProps {
  plan: SaaSPlanAdmin;
  onEdit: (plan: SaaSPlanAdmin) => void;
  onDelete: (plan: SaaSPlanAdmin) => void;
}

export function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
  let features: string[] = [];
  try {
    features = JSON.parse(plan.featuresJson || "[]");
  } catch {
    features = [];
  }

  const isPro = plan.code.toLowerCase().includes("pro");
  const isEnterprise = plan.code.toLowerCase().includes("enterprise");

  return (
    <Card
      className={`relative p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
        plan.isActive
          ? isEnterprise
            ? "border-purple-200/80 bg-white shadow-xs"
            : isPro
              ? "border-emerald-200/80 bg-white shadow-xs"
              : "border-slate-200 bg-white shadow-xs"
          : "border-slate-200 bg-slate-50/70 opacity-75"
      }`}
    >
      <CardHeader className="p-0 pb-4 border-b border-slate-100/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant={isEnterprise ? "purple" : isPro ? "emerald" : "blue"}
              className="text-[10px] uppercase font-extrabold px-2.5 py-0.5"
            >
              {plan.code}
            </Badge>
            {isEnterprise && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                <Sparkles className="h-2.5 w-2.5" />
                <span>Unggulan</span>
              </span>
            )}
          </div>

          <Badge
            variant={plan.isActive ? "emerald" : "slate"}
            className="text-[10px] font-bold"
          >
            {plan.isActive ? "AKTIF" : "NONAKTIF"}
          </Badge>
        </div>

        <div>
          <CardTitle className="text-xl font-extrabold text-slate-900 leading-tight">
            {plan.name}
          </CardTitle>
          <div className="pt-2">
            <span className="text-3xl font-black text-slate-900">
              {plan.price === 0 ? "Gratis" : formatRupiah(plan.price)}
            </span>
            {plan.price > 0 && (
              <span className="text-xs text-slate-400 font-semibold">
                {" "}
                / {plan.billingCycle === "yearly" ? "tahun" : "bulan"}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-4 space-y-4 flex-1">
        {/* Capability Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="emerald"
            className="gap-1 text-[11px] font-bold py-1 px-2.5"
          >
            <Users className="h-3 w-3" />
            <span>Maks {plan.maxCashiers} Kasir</span>
          </Badge>
          {plan.allowWhiteLabel && (
            <Badge
              variant="amber"
              className="text-[10.5px] font-semibold py-1 px-2 gap-1"
            >
              <Tag className="h-3 w-3" />
              <span>White-Label</span>
            </Badge>
          )}
          {plan.allowExportExcel && (
            <Badge
              variant="blue"
              className="text-[10.5px] font-semibold py-1 px-2 gap-1"
            >
              <FileSpreadsheet className="h-3 w-3" />
              <span>Ekspor Excel</span>
            </Badge>
          )}
        </div>

        {/* Feature Bullets */}
        <div className="space-y-2 pt-1">
          <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
            Fitur Paket Termasuk:
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </div>
                <span className="font-medium text-slate-700 leading-tight">
                  {feat}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      {/* Footer Action Buttons */}
      <footer className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(plan)}
          className="text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-emerald-700 gap-1.5 rounded-xl cursor-pointer shadow-2xs"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>Edit Paket</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(plan)}
          className="text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-1.5 rounded-xl cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Hapus</span>
        </Button>
      </footer>
    </Card>
  );
}
