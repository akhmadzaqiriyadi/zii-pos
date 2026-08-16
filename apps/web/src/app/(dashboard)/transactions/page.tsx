"use client";

import {
  Banknote,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  QrCode,
  Receipt,
  Search,
} from "lucide-react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { DateRangePicker } from "../../../components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
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
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                        paymentMethod === method
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {method}
                    </button>
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
                    className="py-8 text-center text-slate-400"
                  >
                    Memuat riwayat transaksi...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-slate-400"
                  >
                    Tidak ada riwayat transaksi yang sesuai filter.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell className="font-mono text-xs font-bold text-slate-900">
                      {trx.id}
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {trx.customerName || "Umum"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          trx.paymentMethod === "cash"
                            ? "emerald"
                            : trx.paymentMethod === "qris"
                              ? "blue"
                              : "amber"
                        }
                        className="uppercase text-[10px] font-bold"
                      >
                        {trx.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-extrabold text-emerald-600">
                      {formatRupiah(Number(trx.totalAmount))}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {new Date(trx.createdAt).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTransaction(trx)}
                        className="text-xs text-slate-600 hover:text-emerald-600 gap-1 rounded-lg"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Lihat Item</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Footer */}
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
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
