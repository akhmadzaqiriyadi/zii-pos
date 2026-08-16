"use client";

import { Bluetooth, Laptop, Usb } from "lucide-react";
import { Label } from "../../../components/ui/label";
import type { PrinterConnectionType } from "../hooks/useThermalPrinter";

interface PrinterModeSelectorProps {
  connectionType: PrinterConnectionType;
  onSetMode: (type: PrinterConnectionType) => void;
}

export function PrinterModeSelector({
  connectionType,
  onSetMode,
}: PrinterModeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-800 font-bold">
        Pilih Arsitektur Koneksi Printer:
      </Label>

      <div className="grid grid-cols-1 gap-2.5">
        {/* Option 1: Direct USB WebSerial */}
        <button
          type="button"
          onClick={() => onSetMode("web_usb")}
          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition cursor-pointer ${
            connectionType === "web_usb"
              ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <Usb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block text-xs">
              Direct USB WebSerial (Bypass Driver macOS)
            </span>
            <span className="text-[11px] text-slate-500 block leading-normal mt-0.5">
              Chrome langsung mengirim byte ESC/POS ke kabel USB. 100% Bebas
              driver Mac & Bebas kodingan XML!
            </span>
          </div>
        </button>

        {/* Option 2: Browser System Driver */}
        <button
          type="button"
          onClick={() => onSetMode("browser_driver")}
          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition cursor-pointer ${
            connectionType === "browser_driver"
              ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <Laptop className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block text-xs">
              Browser System Driver (CUPS 58mm)
            </span>
            <span className="text-[11px] text-slate-500 block leading-normal mt-0.5">
              Mencetak via dialog sistem Mac OS jika driver CUPS thermal sudah
              terpasang.
            </span>
          </div>
        </button>

        {/* Option 3: Web Bluetooth Direct */}
        <button
          type="button"
          onClick={() => onSetMode("web_bluetooth")}
          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition cursor-pointer ${
            connectionType === "web_bluetooth"
              ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <Bluetooth className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block text-xs">
              Direct Bluetooth ESC/POS (POS-V29DD)
            </span>
            <span className="text-[11px] text-slate-500 block leading-normal mt-0.5">
              Koneksi Bluetooth nirkabel langsung dari Chrome untuk pengiriman
              byte ESC/POS tanpa kabel.
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
