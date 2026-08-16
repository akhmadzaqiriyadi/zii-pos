"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import type { SaaSPlanAdmin } from "../services/saasAdminApi";

const planFormSchema = z.object({
  code: z
    .string()
    .min(2, "Kode paket minimal 2 karakter.")
    .regex(/^[a-z0-9-]+$/, "Kode hanya boleh huruf kecil, angka, dan minus."),
  name: z.string().min(3, "Nama paket minimal 3 karakter."),
  price: z.number().min(0, "Harga tidak boleh negatif."),
  billingCycle: z.enum(["monthly", "yearly"]),
  maxCashiers: z.number().min(1, "Batas kasir minimal 1 user."),
  allowWhiteLabel: z.boolean(),
  allowExportExcel: z.boolean(),
  featuresText: z.string().min(3, "Daftar fitur minimal 1 baris."),
  isActive: z.boolean(),
});

type PlanFormData = z.infer<typeof planFormSchema>;

interface PlanFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  planToEdit: SaaSPlanAdmin | null;
  onSubmitCreate: (data: any) => void;
  onSubmitUpdate: (id: string, data: any) => void;
  isPending: boolean;
}

export function PlanFormModal({
  isOpen,
  onOpenChange,
  planToEdit,
  onSubmitCreate,
  onSubmitUpdate,
  isPending,
}: PlanFormModalProps) {
  const isEditing = !!planToEdit;

  const getInitialFeaturesText = (jsonStr?: string) => {
    if (!jsonStr) return "";
    try {
      const arr = JSON.parse(jsonStr);
      if (Array.isArray(arr)) return arr.join("\n");
      return jsonStr;
    } catch {
      return jsonStr;
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      code: "",
      name: "",
      price: 0,
      billingCycle: "monthly",
      maxCashiers: 1,
      allowWhiteLabel: false,
      allowExportExcel: false,
      featuresText: "1 Akun Kasir\nLaporan Transaksi Harian\nCetak Struk Thermal",
      isActive: true,
    },
  });

  useEffect(() => {
    if (planToEdit) {
      reset({
        code: planToEdit.code,
        name: planToEdit.name,
        price: Number(planToEdit.price),
        billingCycle: planToEdit.billingCycle as "monthly" | "yearly",
        maxCashiers: planToEdit.maxCashiers,
        allowWhiteLabel: planToEdit.allowWhiteLabel,
        allowExportExcel: planToEdit.allowExportExcel,
        featuresText: getInitialFeaturesText(planToEdit.featuresJson),
        isActive: planToEdit.isActive,
      });
    } else {
      reset({
        code: "",
        name: "",
        price: 0,
        billingCycle: "monthly",
        maxCashiers: 1,
        allowWhiteLabel: false,
        allowExportExcel: false,
        featuresText: "1 Akun Kasir\nLaporan Transaksi Harian\nCetak Struk Thermal",
        isActive: true,
      });
    }
  }, [planToEdit, reset]);

  const onFormSubmit = (data: PlanFormData) => {
    const featuresList = data.featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      code: data.code,
      name: data.name,
      price: Number(data.price),
      billingCycle: data.billingCycle,
      maxCashiers: Number(data.maxCashiers),
      allowWhiteLabel: data.allowWhiteLabel,
      allowExportExcel: data.allowExportExcel,
      featuresJson: JSON.stringify(featuresList),
      isActive: data.isActive,
    };

    if (isEditing && planToEdit) {
      onSubmitUpdate(planToEdit.id, payload);
    } else {
      onSubmitCreate(payload);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {isEditing ? "Edit Paket Langganan SaaS" : "Tambah Paket Langganan Baru"}
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Atur harga, batas kasir, dan fitur penawaran paket SaaS secara dinamis.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Kode Paket (Slug) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Kode Paket (Slug) *
              </label>
              <Input
                type="text"
                placeholder="starter / pro / enterprise"
                disabled={isEditing}
                {...register("code")}
                className="bg-slate-50 disabled:opacity-60"
              />
              {errors.code && (
                <p className="text-[11px] text-red-500 font-medium">{errors.code.message}</p>
              )}
            </div>

            {/* Nama Paket */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Nama Paket *
              </label>
              <Input
                type="text"
                placeholder="Contoh: Pro White-Label"
                {...register("name")}
                className="bg-slate-50"
              />
              {errors.name && (
                <p className="text-[11px] text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Harga Paket */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Harga (Rp) *
              </label>
              <Input
                type="number"
                placeholder="99000"
                {...register("price", { valueAsNumber: true })}
                className="bg-slate-50"
              />
              {errors.price && (
                <p className="text-[11px] text-red-500 font-medium">{errors.price.message}</p>
              )}
            </div>

            {/* Siklus Penagihan */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Siklus Penagihan *
              </label>
              <select
                {...register("billingCycle")}
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="monthly">Bulanan (Monthly)</option>
                <option value="yearly">Tahunan (Yearly)</option>
              </select>
            </div>

            {/* Batas Kasir (maxCashiers) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Batas Kasir (User) *
              </label>
              <Input
                type="number"
                placeholder="5"
                {...register("maxCashiers", { valueAsNumber: true })}
                className="bg-slate-50"
              />
              {errors.maxCashiers && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.maxCashiers.message}
                </p>
              )}
            </div>
          </div>

          {/* Checkboxes Allowances */}
          <div className="flex flex-wrap items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                {...register("allowWhiteLabel")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Dukung White-Label Domain</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                {...register("allowExportExcel")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Dukung Ekspor Laporan Excel</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Paket Aktif (Tampil di Onboarding)</span>
            </label>
          </div>

          {/* Daftar Fitur (featuresText) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Daftar Fitur Penawaran (1 Fitur Per Baris) *
            </label>
            <Textarea
              rows={4}
              placeholder="Multi-kasir hingga 5 user&#10;Custom Logo & Header Struk&#10;Ekspor Laporan Excel / CSV"
              {...register("featuresText")}
              className="bg-slate-50 text-xs"
            />
            {errors.featuresText && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.featuresText.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-xl border-slate-200 text-slate-600"
            >
              Batal
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 gap-2 cursor-pointer"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan Paket...
                </span>
              ) : isEditing ? (
                "Simpan Perubahan Paket"
              ) : (
                "Buat Paket Baru"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
