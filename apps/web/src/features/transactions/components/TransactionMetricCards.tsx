"use client";

import { Banknote, CreditCard, QrCode, Receipt } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { formatRupiah } from "../../../lib/utils";

interface TransactionSummary {
  totalRevenue: number;
  transactionCount: number;
  cashTotal: number;
  qrisTotal: number;
  transferTotal: number;
}

interface TransactionMetricCardsProps {
  summary: TransactionSummary;
}

export function TransactionMetricCards({ summary }: TransactionMetricCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="p-5 border-emerald-200 bg-emerald-50/50">
        <CardContent className="p-0 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>TOTAL OMSET PENJUALAN</span>
            <Receipt className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">
            {formatRupiah(summary.totalRevenue)}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            {summary.transactionCount} Transaksi Berhasil
          </p>
        </CardContent>
      </Card>

      <Card className="p-5 border-slate-200">
        <CardContent className="p-0 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>PEMBAYARAN TUNAI</span>
            <Banknote className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">
            {formatRupiah(summary.cashTotal)}
          </p>
        </CardContent>
      </Card>

      <Card className="p-5 border-slate-200">
        <CardContent className="p-0 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>PEMBAYARAN QRIS</span>
            <QrCode className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">
            {formatRupiah(summary.qrisTotal)}
          </p>
        </CardContent>
      </Card>

      <Card className="p-5 border-slate-200">
        <CardContent className="p-0 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>PEMBAYARAN TRANSFER</span>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">
            {formatRupiah(summary.transferTotal)}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
