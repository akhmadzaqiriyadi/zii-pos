"use client";

import type { TransactionItem } from "@zii/types";
import { CheckCircle, DollarSign, Loader2 } from "lucide-react";
import React from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { FormGroup, FormLabel } from "../../../components/ui/form";
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
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            <span>Konfirmasi Pembayaran POS</span>
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
          <FormGroup>
            <FormLabel htmlFor="customer-name">
              Nama Pelanggan (Opsional)
            </FormLabel>
            <Input
              id="customer-name"
              placeholder="Contoh: Budi / Umum"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="customer-phone">
              No. WhatsApp / HP (Opsional)
            </FormLabel>
            <Input
              id="customer-phone"
              placeholder="Contoh: 081234567890"
              value={customerPhone}
              onChange={(e) => onCustomerPhoneChange(e.target.value)}
            />
          </FormGroup>
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
          className="w-full gap-2 py-6 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Memproses Transaksi...
            </span>
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
