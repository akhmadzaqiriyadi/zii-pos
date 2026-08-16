import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { PlanFormData } from "../schemas/planForm.schema";

interface PlanFormFieldsProps {
  register: UseFormRegister<PlanFormData>;
  errors: FieldErrors<PlanFormData>;
  isEditing: boolean;
}

export function PlanFormFields({
  register,
  errors,
  isEditing,
}: PlanFormFieldsProps) {
  return (
    <div className="space-y-4 py-2">
      {/* Kode & Nama Paket */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 block">
            Kode Paket (Slug) *
          </label>
          <input
            type="text"
            placeholder="starter / pro / enterprise"
            disabled={isEditing}
            {...register("code")}
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
          />
          {errors.code && (
            <p className="text-[11px] text-red-500 font-medium">
              {errors.code.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 block">
            Nama Paket *
          </label>
          <input
            type="text"
            placeholder="Contoh: Pro White-Label"
            {...register("name")}
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.name && (
            <p className="text-[11px] text-red-500 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>
      </div>

      {/* Harga, Siklus Penagihan, dan Batas Kasir */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 block">
            Harga (Rp) *
          </label>
          <input
            type="number"
            placeholder="99000"
            {...register("price", { valueAsNumber: true })}
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.price && (
            <p className="text-[11px] text-red-500 font-medium">
              {errors.price.message}
            </p>
          )}
        </div>

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

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 block">
            Batas Kasir (User) *
          </label>
          <input
            type="number"
            placeholder="5"
            {...register("maxCashiers", { valueAsNumber: true })}
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.maxCashiers && (
            <p className="text-[11px] text-red-500 font-medium">
              {errors.maxCashiers.message}
            </p>
          )}
        </div>
      </div>

      {/* Toggles / Checkboxes */}
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

      {/* Daftar Fitur */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 block">
          Daftar Fitur Penawaran (1 Fitur Per Baris) *
        </label>
        <textarea
          rows={4}
          placeholder="Multi-kasir hingga 5 user&#10;Custom Logo & Header Struk&#10;Ekspor Laporan Excel / CSV"
          {...register("featuresText")}
          className="flex w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
        {errors.featuresText && (
          <p className="text-[11px] text-red-500 font-medium">
            {errors.featuresText.message}
          </p>
        )}
      </div>
    </div>
  );
}
