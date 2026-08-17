import React from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Checkbox } from "../../../components/ui/checkbox";
import { FormError, FormGroup, FormLabel } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import type { PlanFormData } from "../schemas/planForm.schema";

interface PlanFormFieldsProps {
  register: UseFormRegister<PlanFormData>;
  watch: UseFormWatch<PlanFormData>;
  setValue: UseFormSetValue<PlanFormData>;
  errors: FieldErrors<PlanFormData>;
  isEditing: boolean;
}

export function PlanFormFields({
  register,
  watch,
  setValue,
  errors,
  isEditing,
}: PlanFormFieldsProps) {
  const allowWhiteLabel = watch("allowWhiteLabel");
  const allowExportExcel = watch("allowExportExcel");
  const isActive = watch("isActive");

  return (
    <div className="space-y-4 py-2">
      {/* Kode & Nama Paket */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormGroup>
          <FormLabel htmlFor="plan-code" required>
            Kode Paket (Slug)
          </FormLabel>
          <Input
            id="plan-code"
            type="text"
            placeholder="starter / pro / enterprise"
            disabled={isEditing}
            {...register("code")}
            className="bg-slate-50 disabled:opacity-60"
          />
          <FormError message={errors.code?.message} />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="plan-name" required>
            Nama Paket
          </FormLabel>
          <Input
            id="plan-name"
            type="text"
            placeholder="Contoh: Pro White-Label"
            {...register("name")}
            className="bg-slate-50"
          />
          <FormError message={errors.name?.message} />
        </FormGroup>
      </div>

      {/* Harga, Siklus Penagihan, dan Batas Kasir */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FormGroup>
          <FormLabel htmlFor="plan-price" required>
            Harga (Rp)
          </FormLabel>
          <Input
            id="plan-price"
            type="number"
            placeholder="99000"
            {...register("price", { valueAsNumber: true })}
            className="bg-slate-50"
          />
          <FormError message={errors.price?.message} />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="plan-billing-cycle" required>
            Siklus Penagihan
          </FormLabel>
          <select
            id="plan-billing-cycle"
            {...register("billingCycle")}
            className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="monthly">Bulanan (Monthly)</option>
            <option value="yearly">Tahunan (Yearly)</option>
          </select>
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="plan-max-cashiers" required>
            Batas Kasir (User)
          </FormLabel>
          <Input
            id="plan-max-cashiers"
            type="number"
            placeholder="5"
            {...register("maxCashiers", { valueAsNumber: true })}
            className="bg-slate-50"
          />
          <FormError message={errors.maxCashiers?.message} />
        </FormGroup>
      </div>

      {/* Toggles / Checkboxes dengan Komponen Checkbox Hijau */}
      <div className="flex flex-wrap items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
        <label
          htmlFor="plan-whitelabel"
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <Checkbox
            id="plan-whitelabel"
            checked={Boolean(allowWhiteLabel)}
            onCheckedChange={(val) => setValue("allowWhiteLabel", val)}
          />
          <span className="text-xs font-semibold text-slate-700">
            Dukung White-Label Domain
          </span>
        </label>

        <label
          htmlFor="plan-export-excel"
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <Checkbox
            id="plan-export-excel"
            checked={Boolean(allowExportExcel)}
            onCheckedChange={(val) => setValue("allowExportExcel", val)}
          />
          <span className="text-xs font-semibold text-slate-700">
            Dukung Ekspor Laporan Excel
          </span>
        </label>

        <label
          htmlFor="plan-is-active"
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <Checkbox
            id="plan-is-active"
            checked={Boolean(isActive)}
            onCheckedChange={(val) => setValue("isActive", val)}
          />
          <span className="text-xs font-semibold text-slate-700">
            Paket Aktif (Tampil di Onboarding)
          </span>
        </label>
      </div>

      {/* Daftar Fitur */}
      <FormGroup>
        <FormLabel htmlFor="plan-features" required>
          Daftar Fitur Penawaran (1 Fitur Per Baris)
        </FormLabel>
        <Textarea
          id="plan-features"
          rows={4}
          placeholder="Multi-kasir hingga 5 user&#10;Custom Logo & Header Struk&#10;Ekspor Laporan Excel / CSV"
          {...register("featuresText")}
          className="bg-slate-50 text-xs"
        />
        <FormError message={errors.featuresText?.message} />
      </FormGroup>
    </div>
  );
}
