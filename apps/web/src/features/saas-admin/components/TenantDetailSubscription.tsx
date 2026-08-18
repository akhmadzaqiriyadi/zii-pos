import { CreditCard } from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { formatRupiah } from "../../../lib/utils";
import type { MerchantTenantDetail } from "../services/saasAdminApi";

interface TenantDetailSubscriptionProps {
  detail: MerchantTenantDetail;
}

export function TenantDetailSubscription({
  detail,
}: TenantDetailSubscriptionProps) {
  const activeSub = detail.subscriptions?.[0] || null;

  return (
    <section
      aria-label="Langganan SaaS"
      className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-5 shadow-xs"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-purple-600" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
            Paket Langganan SaaS & Riwayat Invoice Pembayaran
          </h2>
        </div>
      </div>

      {activeSub ? (
        <div className="space-y-5">
          {/* Clean Light Emerald Active Subscription Card (NO PURE BLACK) */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/90 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black uppercase tracking-wider bg-emerald-600 text-white px-3 py-1 rounded-full shadow-2xs">
                  Paket {activeSub.plan.code}
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  {activeSub.plan.name}
                </span>
              </div>
              <Badge
                variant={activeSub.status === "active" ? "emerald" : "amber"}
                className="uppercase text-[11px] font-black px-3 py-0.5 self-start sm:self-auto"
              >
                {activeSub.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-3 border-t border-emerald-200/60">
              <div>
                <span className="text-slate-500 text-[11px] font-semibold block">
                  Biaya Langganan
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {activeSub.plan.price === 0
                    ? "Gratis (Trial 14 Hari)"
                    : `${formatRupiah(activeSub.plan.price)} / ${activeSub.plan.billingCycle}`}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] font-semibold block">
                  Masa Berlaku Sampai
                </span>
                <span className="font-black text-amber-700 text-sm">
                  {new Date(activeSub.expiresAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] font-semibold block">
                  Batas Kuota Kasir
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  Maks {activeSub.plan.maxCashiers} Kasir
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] font-semibold block">
                  Fitur White-Label
                </span>
                <span className="font-extrabold text-emerald-700 text-sm">
                  {activeSub.plan.allowWhiteLabel ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
            </div>
          </div>

          {/* Midtrans Invoices Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Riwayat Invoice Pembayaran Midtrans:
            </h3>

            {activeSub.invoices && activeSub.invoices.length > 0 ? (
              <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-white">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="text-xs font-bold text-slate-700">
                        Invoice ID
                      </TableHead>
                      <TableHead className="text-xs font-bold text-slate-700">
                        Nominal
                      </TableHead>
                      <TableHead className="text-xs font-bold text-slate-700">
                        Metode Bayar
                      </TableHead>
                      <TableHead className="text-xs font-bold text-slate-700">
                        Tanggal Lunas
                      </TableHead>
                      <TableHead className="text-xs font-bold text-slate-700 text-right">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeSub.invoices.map((inv) => (
                      <TableRow
                        key={inv.id}
                        className="border-b border-slate-100"
                      >
                        <TableCell className="font-mono text-xs font-bold text-slate-800 py-3">
                          {inv.id}
                        </TableCell>
                        <TableCell className="text-xs font-extrabold text-slate-900">
                          {formatRupiah(inv.amount)}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 uppercase font-semibold">
                          {inv.paymentMethod || "QRIS"}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 font-medium">
                          {inv.paidAt
                            ? new Date(inv.paidAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              inv.status === "paid" ? "emerald" : "amber"
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
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                Belum ada invoice berbayar tercatat untuk merchant ini.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
          Merchant belum memiliki data langganan paket.
        </p>
      )}
    </section>
  );
}
