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
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
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
                          ? "bg-slate-900 text-white shadow-xs"
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
                  <TableCell colSpan={6} className="py-8 text-center text-slate-400">
                    Memuat riwayat transaksi...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-slate-400">
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
        <Dialog
          open={!!selectedTransaction}
          onOpenChange={(open) => !open && setSelectedTransaction(null)}
        >
          <DialogContent className="max-w-md p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-emerald-600" />
                <span>Detail Transaksi #{selectedTransaction?.id}</span>
              </DialogTitle>
            </DialogHeader>

            {selectedTransaction && (
              <div className="space-y-4 text-xs text-slate-700 font-sans">
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pelanggan:</span>
                    <span className="font-bold text-slate-800">
                      {selectedTransaction.customerName || "Umum"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Metode Bayar:</span>
                    <span className="font-bold uppercase text-emerald-600">
                      {selectedTransaction.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Waktu:</span>
                    <span>
                      {new Date(selectedTransaction.createdAt).toLocaleString(
                        "id-ID",
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block text-xs">
                    Daftar Item Belanja:
                  </span>
                  <div className="divide-y divide-slate-100 border rounded-xl p-3 bg-white">
                    {selectedTransaction.items?.map((item) => (
                      <div
                        key={item.id || item.productId}
                        className="py-1.5 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-slate-800">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {item.qty}x @ {formatRupiah(Number(item.price))}
                          </p>
                        </div>
                        <span className="font-extrabold text-slate-900">
                          {formatRupiah(Number(item.subtotal))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-700">
                    TOTAL BELANJA
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    {formatRupiah(Number(selectedTransaction.totalAmount))}
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </DashboardLayout>
  );
}
