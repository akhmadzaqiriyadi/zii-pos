"use client";

import type { Transaction } from "@zii/types";
import { Receipt } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { formatRupiah } from "../../../lib/utils";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionDetailModal({
  transaction,
  onClose,
}: TransactionDetailModalProps) {
  return (
    <Dialog open={!!transaction} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-emerald-600" />
            <span>Detail Transaksi #{transaction?.id}</span>
          </DialogTitle>
        </DialogHeader>

        {transaction && (
          <div className="space-y-4 text-xs text-slate-700 font-sans">
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Pelanggan:</span>
                <span className="font-bold text-slate-800">
                  {transaction.customerName || "Umum"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="font-bold uppercase text-emerald-600">
                  {transaction.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu:</span>
                <span>
                  {new Date(transaction.createdAt).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 block text-xs">
                Daftar Item Belanja:
              </span>
              <div className="divide-y divide-slate-100 border rounded-xl p-3 bg-white">
                {transaction.items?.map((item) => (
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
              <span className="font-bold text-slate-700">TOTAL BELANJA</span>
              <span className="text-lg font-extrabold text-emerald-600">
                {formatRupiah(Number(transaction.totalAmount))}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
