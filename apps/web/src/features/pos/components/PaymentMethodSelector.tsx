"use client";

import { Banknote, CreditCard, QrCode } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface PaymentMethodSelectorProps {
  paymentMethod: "cash" | "qris" | "transfer";
  onPaymentMethodChange: (val: "cash" | "qris" | "transfer") => void;
}

export function PaymentMethodSelector({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentMethodSelectorProps) {
  return (
    <fieldset className="mb-5 border-0 p-0 m-0">
      <legend className="text-xs font-semibold text-slate-600 mb-2 block">
        Metode Pembayaran
      </legend>
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPaymentMethodChange("cash")}
          className={`flex flex-col items-center justify-center p-3 h-auto rounded-xl border text-xs font-semibold transition cursor-pointer ${
            paymentMethod === "cash"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs hover:bg-emerald-100/60"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Banknote className="h-5 w-5 mb-1 text-emerald-600" />
          <span>Tunai</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onPaymentMethodChange("qris")}
          className={`flex flex-col items-center justify-center p-3 h-auto rounded-xl border text-xs font-semibold transition cursor-pointer ${
            paymentMethod === "qris"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs hover:bg-emerald-100/60"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <QrCode className="h-5 w-5 mb-1 text-blue-600" />
          <span>QRIS</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onPaymentMethodChange("transfer")}
          className={`flex flex-col items-center justify-center p-3 h-auto rounded-xl border text-xs font-semibold transition cursor-pointer ${
            paymentMethod === "transfer"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs hover:bg-emerald-100/60"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <CreditCard className="h-5 w-5 mb-1 text-purple-600" />
          <span>Transfer</span>
        </Button>
      </div>
    </fieldset>
  );
}
