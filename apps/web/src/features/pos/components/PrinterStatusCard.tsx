"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import type { PrinterStatus } from "../hooks/useThermalPrinter";

interface PrinterStatusCardProps {
  status: PrinterStatus;
  deviceName: string;
}

export function PrinterStatusCard({
  status,
  deviceName,
}: PrinterStatusCardProps) {
  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  return (
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
  );
}
