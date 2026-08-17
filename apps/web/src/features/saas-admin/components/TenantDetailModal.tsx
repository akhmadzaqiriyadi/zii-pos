"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  MapPin,
  Package,
  Phone,
  Receipt,
  Shield,
  ShoppingCart,
  Store,
  Users,
  X,
  Zap,
} from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { formatRupiah } from "../../../lib/utils";
import {
  type MerchantTenant,
  SaaSAdminApiService,
} from "../services/saasAdminApi";
import { TenantStatusBadge } from "./TenantStatusBadge";

interface TenantDetailModalProps {
  tenant: MerchantTenant | null;
  onClose: () => void;
  onOpenStatusModal?: (tenant: MerchantTenant) => void;
}

export function TenantDetailModal({
  tenant,
  onClose,
  onOpenStatusModal,
}: TenantDetailModalProps) {
  const { data: detail, isLoading } = useQuery({
    queryKey: ["saas-admin", "tenant-detail", tenant?.id],
    queryFn: () =>
      tenant ? SaaSAdminApiService.getTenantDetail(tenant.id) : null,
    enabled: !!tenant?.id,
  });

  if (!tenant) return null;

  return (
    <Dialog open={!!tenant} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {detail?.logoUrl ? (
                <img
                  src={detail.logoUrl}
                  alt={detail.name}
                  className="h-12 w-12 shrink-0 object-contain"
                />
              ) : (
                <img
                  src="/logo-zii-pos.png"
                  alt={tenant.name}
                  className="h-12 w-12 shrink-0 object-contain"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl font-extrabold text-slate-900">
                    {detail?.name || tenant.name}
                  </DialogTitle>
                  <TenantStatusBadge status={detail?.status || tenant.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <div className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                    <Globe className="h-3 w-3" />
                    <span>
                      {detail?.subdomain
                        ? `${detail.subdomain}.ziipos.id`
                        : "Root Domain"}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Daftar:{" "}
                      {new Date(
                        detail?.createdAt || tenant.createdAt,
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {onOpenStatusModal && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenStatusModal(tenant);
                }}
                className="rounded-xl border-slate-200 text-xs font-bold gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Shield className="h-3.5 w-3.5 text-slate-500" />
                <span>Ubah Status Toko</span>
              </Button>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="text-xs font-medium">
              Memuat detail lengkap merchant...
            </span>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {/* 1. Metric Summary Grid */}
            <section
              aria-label="Merchant Stats"
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Total Omset GMV</span>
                </div>
                <p className="text-base font-black text-slate-900 truncate">
                  {formatRupiah(detail?.totalRevenue || 0)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                  <ShoppingCart className="h-3.5 w-3.5 text-blue-600" />
                  <span>Total Transaksi</span>
                </div>
                <p className="text-base font-black text-slate-900">
                  {detail?.totalTransactions || 0}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                  <Package className="h-3.5 w-3.5 text-purple-600" />
                  <span>Produk & Jasa</span>
                </div>
                <p className="text-base font-black text-slate-900">
                  {detail?.totalProducts || 0}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                  <Users className="h-3.5 w-3.5 text-amber-600" />
                  <span>Akun Kasir / Staf</span>
                </div>
                <p className="text-base font-black text-slate-900">
                  {detail?.totalUsers || 0}
                </p>
              </div>
            </section>

            {/* 2. Profil Toko & Kontak */}
            <section
              aria-label="Informasi Toko"
              className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Store className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Informasi Profil & Kontak Merchant
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block">
                    No. Telepon / WhatsApp:
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{detail?.phone || "Tidak dicantumkan"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block">
                    Alamat Fisik Toko:
                  </span>
                  <div className="flex items-start gap-1.5 text-slate-800 font-bold">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{detail?.address || "Tidak dicantumkan"}</span>
                  </div>
                </div>

                {detail?.receiptFooter && (
                  <div className="sm:col-span-2 space-y-1 pt-1 border-t border-slate-100">
                    <span className="text-slate-400 font-semibold block">
                      Catatan Footer Nota / Struk:
                    </span>
                    <div className="flex items-start gap-1.5 text-slate-600 bg-slate-50 p-2.5 rounded-lg text-[11px] italic">
                      <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>"{detail.receiptFooter}"</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 3. Paket Langganan & Invoices */}
            <section
              aria-label="Paket & Billing"
              className="p-4 rounded-xl border border-slate-200 bg-white space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Langganan SaaS & Riwayat Pembayaran
                  </h3>
                </div>
              </div>

              {detail?.subscriptions && detail.subscriptions.length > 0 ? (
                <div className="space-y-4">
                  {/* Current Active Plan Card */}
                  {(() => {
                    const activeSub = detail.subscriptions[0];
                    return (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                              Paket {activeSub.plan.code}
                            </span>
                            <span className="text-sm font-bold">
                              {activeSub.plan.name}
                            </span>
                          </div>
                          <Badge
                            variant={
                              activeSub.status === "active"
                                ? "emerald"
                                : "amber"
                            }
                            className="uppercase text-[10px]"
                          >
                            {activeSub.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1 border-t border-slate-700/60">
                          <div>
                            <span className="text-slate-400 text-[10px] block">
                              Biaya Langganan
                            </span>
                            <span className="font-extrabold">
                              {activeSub.plan.price === 0
                                ? "Gratis (Trial)"
                                : `${formatRupiah(activeSub.plan.price)} / ${activeSub.plan.billingCycle}`}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">
                              Masa Berlaku Sampai
                            </span>
                            <span className="font-extrabold text-amber-300">
                              {new Date(activeSub.expiresAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">
                              Batas Kasir
                            </span>
                            <span className="font-extrabold">
                              Maks {activeSub.plan.maxCashiers} User
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">
                              Fitur White-Label
                            </span>
                            <span className="font-extrabold text-emerald-400">
                              {activeSub.plan.allowWhiteLabel
                                ? "Aktif"
                                : "Tidak"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Midtrans Invoice History */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700">
                      Riwayat Invoice Midtrans:
                    </h4>
                    {detail.subscriptions[0].invoices &&
                    detail.subscriptions[0].invoices.length > 0 ? (
                      <div className="rounded-xl border border-slate-100 overflow-hidden">
                        <Table>
                          <TableHeader className="bg-slate-50">
                            <TableRow>
                              <TableHead className="text-[11px] font-bold">
                                Invoice ID
                              </TableHead>
                              <TableHead className="text-[11px] font-bold">
                                Nominal
                              </TableHead>
                              <TableHead className="text-[11px] font-bold">
                                Metode Bayar
                              </TableHead>
                              <TableHead className="text-[11px] font-bold">
                                Tanggal Lunas
                              </TableHead>
                              <TableHead className="text-[11px] font-bold text-right">
                                Status
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {detail.subscriptions[0].invoices.map((inv) => (
                              <TableRow key={inv.id}>
                                <TableCell className="font-mono text-xs font-bold text-slate-800 py-2.5">
                                  {inv.id}
                                </TableCell>
                                <TableCell className="text-xs font-bold text-slate-900">
                                  {formatRupiah(inv.amount)}
                                </TableCell>
                                <TableCell className="text-xs text-slate-500 uppercase font-semibold">
                                  {inv.paymentMethod || "QRIS"}
                                </TableCell>
                                <TableCell className="text-xs text-slate-500">
                                  {inv.paidAt
                                    ? new Date(inv.paidAt).toLocaleDateString(
                                        "id-ID",
                                        {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        },
                                      )
                                    : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Badge
                                    variant={
                                      inv.status === "paid"
                                        ? "emerald"
                                        : "amber"
                                    }
                                    className="text-[10px] uppercase font-bold"
                                  >
                                    {inv.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Belum ada invoice berbayar tercatat.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Merchant belum memiliki data langganan.
                </p>
              )}
            </section>

            {/* 4. Daftar Akun Pengguna / Staf Toko */}
            <section
              aria-label="Pengguna Toko"
              className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Users className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Daftar Akun Pengguna & Kasir ({detail?.users.length || 0})
                </h3>
              </div>

              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="text-[11px] font-bold">
                        Nama Lengkap
                      </TableHead>
                      <TableHead className="text-[11px] font-bold">
                        Email Login
                      </TableHead>
                      <TableHead className="text-[11px] font-bold">
                        Role & Wewenang
                      </TableHead>
                      <TableHead className="text-[11px] font-bold text-right">
                        Terdaftar
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detail?.users && detail.users.length > 0 ? (
                      detail.users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-bold text-xs text-slate-900 py-2.5">
                            {u.name}
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            {u.email}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                u.role === "owner"
                                  ? "emerald"
                                  : u.role === "superadmin"
                                    ? "purple"
                                    : "blue"
                              }
                              className="text-[10px] font-bold uppercase"
                            >
                              {u.customRole?.name || u.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-400 text-right">
                            {new Date(u.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="py-6 text-center text-xs text-slate-400"
                        >
                          Tidak ada pengguna ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </section>
          </div>
        )}

        <div className="flex items-center justify-end pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-slate-200 text-slate-600 cursor-pointer"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
