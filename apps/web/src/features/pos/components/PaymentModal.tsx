"use client";

import type { TransactionItem } from "@zii/types";
import { CheckCircle } from "lucide-react";
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
import { PaymentCashCalculator } from "./PaymentCashCalculator";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

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
        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          onPaymentMethodChange={onPaymentMethodChange}
        />

        {/* Area Pembayaran Tunai & Real-Time Kalkulator Kembalian */}
        {paymentMethod === "cash" && (
          <PaymentCashCalculator
            totalAmount={totalAmount}
            cashReceivedInput={cashReceivedInput}
            onCashReceivedChange={setCashReceivedInput}
            onPresetCash={handlePresetCash}
            changeAmount={changeAmount}
            isCashValid={isCashValid}
          />
        )}

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
