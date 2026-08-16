"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { FormGroup, FormLabel } from "../../../components/ui/form";
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
      <FormGroup>
        <FormLabel htmlFor="cash-received" required>
          Nominal Uang Diterima (Rp)
        </FormLabel>
        <Input
          id="cash-received"
          type="number"
          placeholder="0"
          value={cashReceivedInput}
          onChange={(e) => onCashReceivedChange(e.target.value)}
          className="text-lg font-bold"
        />
      </FormGroup>

      {/* Uang Presets */}
      <div className="flex flex-wrap gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPresetCash(totalAmount)}
          className="h-7 px-2.5 text-[11px] font-semibold bg-white border-slate-300 hover:bg-slate-100 rounded-lg"
        >
          Uang Pas ({formatRupiah(totalAmount)})
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPresetCash(50000)}
          className="h-7 px-2.5 text-[11px] font-semibold bg-white border-slate-300 hover:bg-slate-100 rounded-lg"
        >
          50.000
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPresetCash(100000)}
          className="h-7 px-2.5 text-[11px] font-semibold bg-white border-slate-300 hover:bg-slate-100 rounded-lg"
        >
          100.000
        </Button>
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
