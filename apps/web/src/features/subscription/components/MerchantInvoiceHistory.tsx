"use client";

import { FileText, Loader2, Receipt } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import type { MerchantSubscriptionInvoice } from "../services/subscriptionApi";
import { InvoiceTableRow } from "./InvoiceTableRow";

interface MerchantInvoiceHistoryProps {
  invoices: MerchantSubscriptionInvoice[];
  isLoading: boolean;
}

export function MerchantInvoiceHistory({
  invoices,
  isLoading,
}: MerchantInvoiceHistoryProps) {
  return (
    <div className="space-y-4 pt-6 border-t border-slate-200">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Receipt className="h-4 w-4" />
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Riwayat Pembayaran & Faktur Resmi
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Daftar seluruh transaksi perpanjangan lisensi toko dan unduh file PDF faktur resmi untuk bukti pembukuan pajak.
          </p>
        </div>
      </header>

      <Card className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-14 space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="text-sm font-semibold text-slate-500">
                Memuat riwayat faktur pembayaran...
              </span>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">
                  Belum Ada Riwayat Invoice
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Tagihan dan faktur resmi akan otomatis muncul di sini setelah Anda melakukan pembelian atau perpanjangan paket lisensi.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                  <TableRow>
                    <TableHead className="text-xs font-bold text-slate-700 py-3.5 pl-6">
                      No. Faktur / ID
                    </TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 py-3.5">
                      Paket SaaS
                    </TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 py-3.5">
                      Nominal
                    </TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 py-3.5">
                      Metode
                    </TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 py-3.5">
                      Tanggal Lunas
                    </TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 py-3.5">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 py-3.5 text-right pr-6">
                      Dokumen PDF
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <InvoiceTableRow key={inv.id} invoice={inv} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
