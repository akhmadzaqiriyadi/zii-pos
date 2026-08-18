"use client";

import { AlertTriangle, Check, Loader2, ShieldAlert } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import type { MerchantTenant } from "../services/saasAdminApi";

interface TenantStatusModalProps {
  isOpen?: boolean;
  tenant: MerchantTenant | null;
  onClose: () => void;
  onConfirm: (status: "active" | "trial" | "expired" | "suspended") => void;
  isPending: boolean;
}

export function TenantStatusModal({
  isOpen,
  tenant,
  onClose,
  onConfirm,
  isPending,
}: TenantStatusModalProps) {
  const isModalOpen = isOpen !== undefined ? isOpen : !!tenant;
  const [selectedStatus, setSelectedStatus] = useState<
    "active" | "trial" | "expired" | "suspended"
  >(tenant?.status || "active");

  React.useEffect(() => {
    if (tenant) {
      setSelectedStatus(tenant.status);
    }
  }, [tenant]);

  if (!tenant && !isOpen) return null;

  const statusOptions: Array<{
    value: "active" | "trial" | "expired" | "suspended";
    label: string;
    description: string;
    color: string;
  }> = [
    {
      value: "active",
      label: "ACTIVE (Berlangganan Aktif)",
      description:
        "Toko memiliki akses penuh ke kasir POS dan fitur white-label.",
      color: "border-emerald-500 bg-emerald-50/50 text-emerald-800",
    },
    {
      value: "trial",
      label: "TRIAL (Masa Uji Coba)",
      description: "Toko dalam masa percobaan gratis 14 hari.",
      color: "border-amber-500 bg-amber-50/50 text-amber-800",
    },
    {
      value: "suspended",
      label: "SUSPENDED (Dibekukan)",
      description:
        "Akses kasir toko diblokir sementara karena pelanggaran/alasan khusus.",
      color: "border-rose-500 bg-rose-50/50 text-rose-800",
    },
    {
      value: "expired",
      label: "EXPIRED (Lisensi Habis)",
      description:
        "Masa berlangganan toko habis dan belum melakukan perpanjangan.",
      color: "border-slate-400 bg-slate-100 text-slate-700",
    },
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-xs">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Kelola Status Lisensi Merchant
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Ubah status operasional toko{" "}
            <span className="font-extrabold text-slate-800">{tenant.name}</span>{" "}
            ({tenant.subdomain || "tanpa subdomain"}).
          </p>
        </DialogHeader>

        <div className="space-y-3 py-3">
          {statusOptions.map((opt) => {
            const isSelected = selectedStatus === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => setSelectedStatus(opt.value)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                  isSelected
                    ? `${opt.color} ring-2 ring-emerald-500/20 font-medium`
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="space-y-1">
                  <p className="text-xs font-extrabold">{opt.label}</p>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {opt.description}
                  </p>
                </div>
                {isSelected && (
                  <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
            onClick={() => onConfirm(selectedStatus)}
            disabled={isPending || selectedStatus === tenant.status}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 gap-2 cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </span>
            ) : (
              "Simpan Status Toko"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
