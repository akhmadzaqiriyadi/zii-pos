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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
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
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <Calendar className="h-4 w-4 text-slate-400 ml-2" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 focus:outline-none"
                  title="Tanggal Mulai"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 focus:outline-none"
                  title="Tanggal Akhir"
                />
              </div>

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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID Transaksi</th>
                  <th className="px-4 py-3">Pelanggan</th>
                  <th className="px-4 py-3">Metode Bayar</th>
                  <th className="px-4 py-3">Total Belanja</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Memuat riwayat transaksi...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada riwayat transaksi yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  transactions.map((trx) => (
                    <tr
                      key={trx.id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold text-slate-900">
                        {trx.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {trx.customerName || "Umum"}
                      </td>
                      <td className="px-4 py-3">
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
                      </td>
                      <td className="px-4 py-3 font-extrabold text-emerald-600">
                        {formatRupiah(Number(trx.totalAmount))}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {new Date(trx.createdAt).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTransaction(trx)}
                          className="text-xs text-slate-600 hover:text-emerald-600 gap-1 rounded-lg"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Lihat Item</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {meta.totalPages > 1 && (
            <footer className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Halaman {meta.page} dari {meta.totalPages} ({meta.totalItems}{" "}
                total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasPrevPage}
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Sebelumnya</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasNextPage}
                  onClick={() => setPage(page + 1)}
                  className="gap-1 text-xs"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </footer>
          )}
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
