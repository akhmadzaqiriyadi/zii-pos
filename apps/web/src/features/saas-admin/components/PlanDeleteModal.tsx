"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import React from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import type { SaaSPlanAdmin } from "../services/saasAdminApi";

interface PlanDeleteModalProps {
  planToDelete: SaaSPlanAdmin | null;
  onClose: () => void;
  onConfirmDelete: () => void;
  isPending: boolean;
}

export function PlanDeleteModal({
  planToDelete,
  onClose,
  onConfirmDelete,
  isPending,
}: PlanDeleteModalProps) {
  if (!planToDelete) return null;

  return (
    <Dialog open={!!planToDelete} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 shadow-xs">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Nonaktifkan Paket Langganan?
          </DialogTitle>
          <p className="text-xs text-slate-500 leading-relaxed">
            Apakah Anda yakin ingin menonaktifkan/menghapus paket{" "}
            <span className="font-extrabold text-slate-900">
              "{planToDelete.name}"
            </span>{" "}
            ({planToDelete.code})? Paket ini tidak akan lagi tampil di halaman pendaftaran merchant baru.
          </p>
        </DialogHeader>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl border-slate-200 text-slate-600"
          >
            Batal
          </Button>

          <Button
            type="button"
            onClick={onConfirmDelete}
            disabled={isPending}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-600/20 gap-2 cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Menghapus...
              </span>
            ) : (
              "Ya, Nonaktifkan Paket"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
