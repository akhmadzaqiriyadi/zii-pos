"use client";

import { Loader2, Sparkles } from "lucide-react";
import React from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { usePlanFormModal } from "../hooks/usePlanFormModal";
import type {
  CreatePlanPayload,
  SaaSPlanAdmin,
  UpdatePlanPayload,
} from "../services/saasAdminApi";
import { PlanFormFields } from "./PlanFormFields";

interface PlanFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  planToEdit: SaaSPlanAdmin | null;
  onSubmitCreate: (data: CreatePlanPayload) => void;
  onSubmitUpdate: (id: string, data: UpdatePlanPayload) => void;
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
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    onFormSubmit,
    errors,
    isEditing,
  } = usePlanFormModal({
    planToEdit,
    onSubmitCreate,
    onSubmitUpdate,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {isEditing
              ? "Edit Paket Langganan SaaS"
              : "Tambah Paket Langganan Baru"}
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Atur harga, batas kasir, dan fitur penawaran paket SaaS secara
            dinamis.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <PlanFormFields
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
            isEditing={isEditing}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-xl border-slate-200 text-slate-600 cursor-pointer"
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
