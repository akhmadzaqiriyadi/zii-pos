import { Bluetooth, Printer, RefreshCw, Usb } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import type { PrinterConnectionType, PrinterStatus } from "../hooks/useThermalPrinter";
import { PrinterModeSelector } from "./PrinterModeSelector";
import { PrinterStatusCard } from "./PrinterStatusCard";

interface PrinterSettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  status: PrinterStatus;
  connectionType: PrinterConnectionType;
  deviceName: string;
  onSetMode: (type: PrinterConnectionType) => void;
  onConnectBluetooth: () => void;
  onConnectUsb?: () => void;
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
  onConnectUsb,
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
          <PrinterStatusCard status={status} deviceName={deviceName} />

          {/* Printer Mode Selection */}
          <PrinterModeSelector
            connectionType={connectionType}
            onSetMode={onSetMode}
          />

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {connectionType === "web_usb" && onConnectUsb && (
              <Button
                variant="outline"
                onClick={onConnectUsb}
                disabled={isConnecting}
                className="w-full gap-2 text-xs font-bold py-2.5 border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-900"
              >
                <Usb className="h-4 w-4 text-emerald-600" />
                <span>Pilih Port USB Printer (POS-V29DD)</span>
              </Button>
            )}

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

              {isConnected && (connectionType === "web_bluetooth" || connectionType === "web_usb") && (
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
