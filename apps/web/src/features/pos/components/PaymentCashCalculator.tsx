"use client";

import { CheckCircle } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { formatRupiah } from "../../../lib/utils";

interface PaymentCashCalculatorProps {
  totalAmount: number;
  cashReceivedInput: string;
  onCashReceivedChange: (val: string) => void;
  onPresetCash: (amount: number) => void;
  changeAmount: number;
  isCashValid: boolean;
}

export function PaymentCashCalculator({
  totalAmount,
  cashReceivedInput,
  onCashReceivedChange,
  onPresetCash,
  changeAmount,
  isCashValid,
}: PaymentCashCalculatorProps) {
  return (
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
          onChange={(e) => onCashReceivedChange(e.target.value)}
          className="text-lg font-bold"
        />
      </div>

      {/* Uang Presets */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onPresetCash(totalAmount)}
          className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          Uang Pas ({formatRupiah(totalAmount)})
        </button>
        <button
          type="button"
          onClick={() => onPresetCash(50000)}
          className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          50.000
        </button>
        <button
          type="button"
          onClick={() => onPresetCash(100000)}
          className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          100.000
        </button>
      </div>

      {/* Kembalian Real-Time Output */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600">Uang Kembalian:</span>
        <span
          className={`font-extrabold text-sm flex items-center gap-1 ${
            isCashValid ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          {isCashValid && <CheckCircle className="h-4 w-4" />}
          {isCashValid ? formatRupiah(changeAmount) : "Uang Kurang"}
        </span>
      </div>
    </fieldset>
  );
}
