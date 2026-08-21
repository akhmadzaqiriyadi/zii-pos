"use client";

import { Download, FileCheck2, Clock } from "lucide-react";
import React from "react";
import { Button } from "../../../components/ui/button";
import { TableCell, TableRow } from "../../../components/ui/table";
import { formatRupiah } from "../../../lib/utils";
import type { MerchantSubscriptionInvoice } from "../services/subscriptionApi";

interface InvoiceTableRowProps {
  invoice: MerchantSubscriptionInvoice;
}

/**
 * Subkomponen: Satu Baris Riwayat Faktur Invoice & Tombol Unduh PDF
 */
export function InvoiceTableRow({ invoice }: InvoiceTableRowProps) {
  const isPaid = invoice.status === "paid";
  const shortInvoiceId = `INV-${invoice.id.slice(0, 8).toUpperCase()}`;

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const downloadUrl = invoice.pdfUrl.startsWith("http")
    ? invoice.pdfUrl
    : `${apiBaseUrl}${invoice.pdfUrl.startsWith("/") ? "" : "/"}${invoice.pdfUrl}`;

  return (
    <TableRow className="hover:bg-slate-50/60 transition-colors">
      {/* No Faktur */}
      <TableCell className="font-mono font-bold text-xs text-slate-900 pl-6 py-4">
        {shortInvoiceId}
      </TableCell>

      {/* Paket SaaS */}
      <TableCell className="py-4">
        <div className="space-y-0.5">
          <span className="font-extrabold text-xs text-slate-900 block">
            {invoice.planName}
          </span>
          <span className="text-[11px] text-slate-400 capitalize">
            Siklus {invoice.billingCycle === "yearly" ? "Tahunan" : "Bulanan"}
          </span>
        </div>
      </TableCell>

      {/* Nominal */}
      <TableCell className="font-extrabold text-xs text-slate-900 py-4">
        {formatRupiah(invoice.amount)}
      </TableCell>

      {/* Metode Bayar */}
      <TableCell className="text-xs font-medium text-slate-600 py-4 uppercase">
        {invoice.paymentMethod || "QRIS / Snap"}
      </TableCell>

      {/* Tanggal Lunas */}
      <TableCell className="text-xs text-slate-600 py-4">
        {invoice.paidAt
          ? new Date(invoice.paidAt).toLocaleDateString("id-ID", {
              dateStyle: "medium",
            })
          : new Date(invoice.createdAt).toLocaleDateString("id-ID", {
              dateStyle: "medium",
            })}
      </TableCell>

      {/* Status Badge */}
      <TableCell className="py-4">
        {isPaid ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FileCheck2 className="h-3 w-3" />
            LUNAS
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" />
            MENUNGGU
          </span>
        )}
      </TableCell>

      {/* Tombol Unduh PDF */}
      <TableCell className="py-4 text-right pr-6">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-1.5 rounded-lg text-xs font-bold border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 shadow-2xs cursor-pointer"
        >
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            <Download className="h-3.5 w-3.5" />
            <span>Unduh PDF</span>
          </a>
        </Button>
      </TableCell>
    </TableRow>
  );
}
