"use client";

import { CheckCircle2, Bluetooth, Laptop, Printer, RefreshCw, XCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import type { PrinterConnectionType, PrinterStatus } from "../hooks/useThermalPrinter";

interface PrinterSettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  status: PrinterStatus;
  connectionType: PrinterConnectionType;
  deviceName: string;
  onSetMode: (type: PrinterConnectionType) => void;
  onConnectBluetooth: () => void;
  onDisconnect: () => void;
  onTestPrint: () => void;
}

export function PrinterSettingsModal({
  isOpen,
  onOpenChange,
  status,
  connectionType,
  deviceName,
  onSetMode,
  onConnectBluetooth,
  onDisconnect,
  onTestPrint,
}: PrinterSettingsModalProps) {
  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Printer className="h-5 w-5 text-emerald-600" />
            <span>Pengaturan Printer Thermal 58mm</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 text-xs text-slate-700 font-sans">
          {/* Connection Status Card */}
          <div
            className={`rounded-2xl p-4 border flex items-center justify-between ${
              isConnected
                ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                : isConnecting
                  ? "bg-amber-50/60 border-amber-200 text-amber-900"
                  : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isConnected
                      ? "bg-emerald-500"
                      : isConnecting
                        ? "bg-amber-500 animate-pulse"
                        : "bg-slate-400"
                  }`}
                />
              </div>

              <div>
                <p className="font-extrabold text-sm leading-tight">
                  {isConnected
                    ? "Printer Terhubung & Siap"
                    : isConnecting
                      ? "Menghubungkan Printer..."
                      : "Printer Terputus"}
                </p>
                <p className="text-[11px] opacity-75 mt-0.5 font-medium">
                  {deviceName}
                </p>
              </div>
            </div>

            {isConnected ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="h-6 w-6 text-slate-400 shrink-0" />
            )}
          </div>

          {/* Printer Mode Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Pilih Arsitektur Koneksi Printer:
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option 1: Browser System Driver (Recommended) */}
              <button
                type="button"
                onClick={() => onSetMode("browser_driver")}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  connectionType === "browser_driver"
                    ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <Laptop className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-xs">
                    Browser System Driver 58mm (Rekomendasi)
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-normal mt-0.5">
                    Mencetak langsung via dialog sistem OS/Browser dengan layout CSS 58mm yang otomatis terpasang.
                  </span>
                </div>
              </button>

              {/* Option 2: Web Bluetooth Direct ESC/POS */}
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
                    Koneksi Bluetooth nirkabel langsung dari Chrome untuk pengiriman byte ESC/POS tanpa dialog browser.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {connectionType === "web_bluetooth" && (
              <Button
                variant="outline"
                onClick={onConnectBluetooth}
                disabled={isConnecting}
                className="w-full gap-2 text-xs font-bold py-2.5 border-slate-300"
              >
                {isConnecting ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-amber-600" />
                ) : (
                  <Bluetooth className="h-4 w-4 text-blue-600" />
                )}
                <span>
                  {isConnected ? "Sambungkan Ulang Bluetooth" : "Pairing Bluetooth POS-V29DD"}
                </span>
              </Button>
            )}

            <div className="flex space-x-2">
              <Button
                variant="primary"
                onClick={onTestPrint}
                className="flex-1 gap-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Printer className="h-4 w-4" />
                <span>Test Print Struk 58mm</span>
              </Button>

              {isConnected && connectionType === "web_bluetooth" && (
                <Button
                  variant="ghost"
                  onClick={onDisconnect}
                  className="text-xs text-rose-600 hover:bg-rose-50 font-semibold"
                >
                  Putuskan
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
