"use client";

import type { TransactionItem } from "@zii/types";
import { Banknote, CheckCircle, CreditCard, QrCode } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { formatRupiah } from "../../../lib/utils";
import { usePaymentForm } from "../hooks/usePaymentForm";

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cart: TransactionItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: "cash" | "qris" | "transfer";
  onCustomerNameChange: (val: string) => void;
  onCustomerPhoneChange: (val: string) => void;
  onPaymentMethodChange: (val: "cash" | "qris" | "transfer") => void;
  onSuccessTransaction: (transactionData: unknown) => void;
}

export function PaymentModal({
  isOpen,
  onOpenChange,
  cart,
  totalAmount,
  customerName,
  customerPhone,
  paymentMethod,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onPaymentMethodChange,
  onSuccessTransaction,
}: PaymentModalProps) {
  const {
    cashReceivedInput,
    setCashReceivedInput,
    changeAmount,
    isCashValid,
    handlePresetCash,
    handleProcessPayment,
    isPending,
  } = usePaymentForm(
    cart,
    totalAmount,
    customerName,
    customerPhone,
    paymentMethod,
    onSuccessTransaction,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-slate-900">
            Konfirmasi Pembayaran POS
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Pilih metode pembayaran dan hitung kembalian secara real-time.
          </p>
        </DialogHeader>

        {/* Ringkasan Total */}
        <Card className="mb-5 bg-slate-50 border-slate-200 p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Total Tagihan</span>
              <span>{cart.length} Jenis Item</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">
              {formatRupiah(totalAmount)}
            </div>
          </CardContent>
        </Card>

        {/* Form Pelanggan */}
        <fieldset className="space-y-3 mb-5 border-0 p-0 m-0">
          <div>
            <label
              htmlFor="customer-name"
              className="text-xs font-semibold text-slate-600 mb-1 block"
            >
              Nama Pelanggan (Opsional)
            </label>
            <Input
              id="customer-name"
              placeholder="Contoh: Budi / Umum"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="customer-phone"
              className="text-xs font-semibold text-slate-600 mb-1 block"
            >
              No. WhatsApp / HP (Opsional)
            </label>
            <Input
              id="customer-phone"
              placeholder="Contoh: 081234567890"
              value={customerPhone}
              onChange={(e) => onCustomerPhoneChange(e.target.value)}
            />
          </div>
        </fieldset>

        {/* Metode Pembayaran Tabs */}
        <fieldset className="mb-5 border-0 p-0 m-0">
          <legend className="text-xs font-semibold text-slate-600 mb-2 block">
            Metode Pembayaran
          </legend>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onPaymentMethodChange("cash")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                paymentMethod === "cash"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Banknote className="h-5 w-5 mb-1 text-emerald-600" />
              <span>Tunai</span>
            </button>
            <button
              type="button"
              onClick={() => onPaymentMethodChange("qris")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                paymentMethod === "qris"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <QrCode className="h-5 w-5 mb-1 text-blue-600" />
              <span>QRIS</span>
            </button>
            <button
              type="button"
              onClick={() => onPaymentMethodChange("transfer")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                paymentMethod === "transfer"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <CreditCard className="h-5 w-5 mb-1 text-purple-600" />
              <span>Transfer</span>
            </button>
          </div>
        </fieldset>

        {/* Area Pembayaran Tunai & Real-Time Kalkulator Kembalian */}
        {paymentMethod === "cash" && (
          <fieldset className="mb-5 space-y-3 rounded-xl bg-slate-50 p-4 border border-slate-200 m-0">
            <div>
              <label
                htmlFor="cash-received"
                className="text-xs font-semibold text-slate-700 mb-1 block"
              >
                Nominal Uang Diterima (Rp)
              </label>
              <Input
                id="cash-received"
                type="number"
                placeholder="0"
                value={cashReceivedInput}
                onChange={(e) => setCashReceivedInput(e.target.value)}
                className="text-lg font-bold"
              />
            </div>

            {/* Uang Presets */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handlePresetCash(totalAmount)}
                className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
              >
                Uang Pas ({formatRupiah(totalAmount)})
              </button>
              <button
                type="button"
                onClick={() => handlePresetCash(50000)}
                className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
              >
                50.000
              </button>
              <button
                type="button"
                onClick={() => handlePresetCash(100000)}
                className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
              >
                100.000
              </button>
              <button
                type="button"
                onClick={() => handlePresetCash(200000)}
                className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
              >
                200.000
              </button>
            </div>

            {/* Display Real-Time Kembalian / Status */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Kembalian:
              </span>
              <span
                className={`text-lg font-extrabold ${
                  changeAmount >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {changeAmount >= 0
                  ? formatRupiah(changeAmount)
                  : `Kurang ${formatRupiah(Math.abs(changeAmount))}`}
              </span>
            </div>
          </fieldset>
        )}

        {/* Tombol Eksekusi Transaksi */}
        <Button
          onClick={handleProcessPayment}
          disabled={!isCashValid || isPending}
          className="w-full gap-2 py-6 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isPending ? (
            <span>Memproses Transaksi...</span>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>Selesaikan Pembayaran</span>
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
