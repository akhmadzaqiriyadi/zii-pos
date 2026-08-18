"use client";

import { ArrowLeft, Calendar, Globe, Loader2, Shield } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useTenantDetail } from "../hooks/useTenantDetail";
import { TenantDetailProfile } from "./TenantDetailProfile";
import { TenantDetailStats } from "./TenantDetailStats";
import { TenantDetailSubscription } from "./TenantDetailSubscription";
import { TenantDetailUsersTable } from "./TenantDetailUsersTable";
import { TenantStatusBadge } from "./TenantStatusBadge";
import { TenantStatusModal } from "./TenantStatusModal";

interface TenantDetailViewProps {
  tenantId: string;
}

export function TenantDetailView({ tenantId }: TenantDetailViewProps) {
  const {
    detail,
    isLoading,
    error,
    isStatusModalOpen,
    setIsStatusModalOpen,
    tenantForModal,
    handleStatusChange,
    isUpdatingStatus,
  } = useTenantDetail(tenantId);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb / Action Header */}
      <header className="flex flex-col gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs gap-1.5 cursor-pointer shadow-2xs"
          >
            <Link href="/saas-admin">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Monitoring</span>
            </Link>
          </Button>

          <Badge
            variant="purple"
            className="text-[10px] font-black uppercase px-2.5 py-0.5"
          >
            SUPER ADMIN PORTAL
          </Badge>
        </div>

        {/* Store Brand Banner */}
        {detail && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              {detail.logoUrl ? (
                <img
                  src={detail.logoUrl}
                  alt={detail.name}
                  className="h-16 w-16 shrink-0 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 font-black text-white text-xl shadow-md shadow-emerald-600/20">
                  {detail.name.substring(0, 2).toUpperCase()}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                    {detail.name}
                  </h1>
                  <TenantStatusBadge status={detail.status} />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/80">
                    <Globe className="h-3.5 w-3.5" />
                    {detail.subdomain
                      ? `${detail.subdomain}.ziipos.id`
                      : "Root Domain"}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Terdaftar:{" "}
                    {new Date(detail.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsStatusModalOpen(true)}
                className="rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs gap-1.5 h-10 px-4 cursor-pointer shadow-2xs"
              >
                <Shield className="h-4 w-4 text-slate-500" />
                <span>Ubah Status Lisensi</span>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Content Rendering */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
          <span className="text-sm font-semibold text-slate-600">
            Memuat detail lengkap merchant toko...
          </span>
        </div>
      ) : error || !detail ? (
        <Card className="p-12 text-center rounded-2xl border-slate-200">
          <p className="text-base font-bold text-slate-800">
            Merchant Tidak Ditemukan
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Data toko tidak ditemukan atau ID tidak valid.
          </p>
          <Button
            asChild
            className="mt-4 rounded-xl bg-emerald-600 text-white font-bold"
          >
            <Link href="/saas-admin">Kembali ke Daftar Merchant</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* 1. Metric Summary Cards */}
          <TenantDetailStats detail={detail} />

          {/* 2. Informasi Kontak & Operasional Toko */}
          <TenantDetailProfile detail={detail} />

          {/* 3. Langganan SaaS & Riwayat Pembayaran Midtrans */}
          <TenantDetailSubscription detail={detail} />

          {/* 4. Daftar Akun Pengguna & Kasir Toko */}
          <TenantDetailUsersTable detail={detail} />
        </div>
      )}

      {/* Status Modification Modal */}
      <TenantStatusModal
        isOpen={isStatusModalOpen}
        tenant={tenantForModal}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={(newStatus) => handleStatusChange(newStatus)}
        isPending={isUpdatingStatus}
      />
    </div>
  );
}
