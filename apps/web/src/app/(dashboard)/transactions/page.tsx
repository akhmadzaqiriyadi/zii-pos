"use client";

import {
  Banknote,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  Eye,
  FileSpreadsheet,
  QrCode,
  Receipt,
  Search,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { DateRangePicker } from "../../../components/ui/date-picker";
import { Input } from "../../../components/ui/input";
import { Pagination } from "../../../components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { TransactionDetailModal } from "../../../features/transactions/components/TransactionDetailModal";
import { TransactionMetricCards } from "../../../features/transactions/components/TransactionMetricCards";
import { useTransactionsDashboard } from "../../../features/transactions/hooks/useTransactionsDashboard";
import { formatRupiah } from "../../../lib/utils";

export default function TransactionsPage() {
  const {
    search,
    setSearch,
    paymentMethod,
    setPaymentMethod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    page,
    setPage,
    selectedTransaction,
    setSelectedTransaction,
    transactions,
    meta,
    summary,
    isLoading,
  } = useTransactionsDashboard();

  const handleExportCsv = () => {
    if (!transactions || transactions.length === 0) {
      toast.error("Tidak ada data transaksi untuk diekspor.");
      return;
    }

    const headers = [
      "ID Transaksi",
      "Tanggal",
      "Nama Pelanggan",
      "No WhatsApp",
      "Metode Pembayaran",
      "Total Belanja (Rp)",
      "Status",
    ];

    const rows = transactions.map((t) => [
      t.id,
      new Date(t.createdAt).toLocaleString("id-ID"),
      `"${(t.customerName || "Umum").replace(/"/g, '""')}"`,
      `"${t.customerPhone || "-"}"`,
      (t.paymentMethod || "CASH").toUpperCase(),
      t.totalAmount,
      (t.status || "completed").toUpperCase(),
    ]);

    const csvContent = `\uFEFF${[
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n")}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Laporan_Transaksi_ZII_POS_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Laporan Excel / CSV berhasil diunduh!");
  };

  return (
    <DashboardLayout requiredRole="owner">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Riwayat Transaksi & Laporan Omset POS
            </h1>
            <p className="text-sm text-slate-500">
              Pantau laporan penjualan, metode pembayaran, dan detail nota
              belanja secara real-time.
            </p>
          </div>

          <Button
            onClick={handleExportCsv}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-4 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Ekspor Laporan Excel / CSV</span>
          </Button>
        </header>

        {/* Metric Summary Cards */}
        <TransactionMetricCards summary={summary} />

        {/* Transactions Table & Filters */}
        <Card className="p-4 sm:p-6 space-y-5 rounded-2xl border border-slate-200">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5">
            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari transaksi / pelanggan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl"
              />
            </div>

            {/* Date Range Inputs & Payment Method Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />

              <fieldset className="flex items-center gap-1.5 border-0 p-0 m-0">
                {(["all", "cash", "qris", "transfer"] as const).map(
                  (method) => (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`px-3 py-1.5 h-auto rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                        paymentMethod === method
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {method}
                    </Button>
                  ),
                )}
              </fieldset>
            </div>
          </header>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Metode Bayar</TableHead>
                <TableHead>Total Belanja</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center text-slate-400 font-medium"
                  >
                    Memuat data riwayat transaksi...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center text-slate-400 font-medium"
                  >
                    Belum ada riwayat transaksi kasir yang tercatat.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-slate-50/70">
                    <TableCell className="font-mono text-xs font-bold text-slate-800">
                      {tx.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-slate-800 text-xs block">
                        {tx.customerName || "Umum"}
                      </span>
                      {tx.customerPhone && (
                        <span className="text-[10px] text-slate-400 block">
                          {tx.customerPhone}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.paymentMethod === "cash"
                            ? "emerald"
                            : tx.paymentMethod === "qris"
                              ? "blue"
                              : "amber"
                        }
                        className="text-[10px] font-extrabold uppercase flex items-center gap-1 w-fit"
                      >
                        {tx.paymentMethod === "cash" && (
                          <Banknote className="h-3 w-3" />
                        )}
                        {tx.paymentMethod === "qris" && (
                          <QrCode className="h-3 w-3" />
                        )}
                        {tx.paymentMethod === "transfer" && (
                          <CreditCard className="h-3 w-3" />
                        )}
                        <span>{tx.paymentMethod}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600 text-xs">
                      {formatRupiah(tx.totalAmount)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(tx.createdAt))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTransaction(tx)}
                        className="gap-1.5 text-xs text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Lihat Nota</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={meta.totalPages}
            totalItems={meta.totalCount}
            onPageChange={setPage}
            hasNextPage={meta.hasNextPage}
            hasPrevPage={meta.hasPrevPage}
            itemLabel="transaksi"
          />
        </Card>

        {/* Modal Detail Item Transaksi */}
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      </main>
    </DashboardLayout>
  );
}
