"use client";

import {
  CheckCircle2,
  Copy,
  ExternalLink,
  QrCode,
  Receipt,
  ShieldCheck,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { formatRupiah } from "../../../lib/utils";
import {
  type CheckoutResult,
  SubscriptionApiService,
} from "../services/subscriptionApi";

interface PaymentCheckoutModalProps {
  checkoutData: CheckoutResult | null;
  onClose: () => void;
  onSimulateSuccess: () => void;
}

export function PaymentCheckoutModal({
  checkoutData,
  onClose,
  onSimulateSuccess,
}: PaymentCheckoutModalProps) {
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!checkoutData) return null;

  const handleCopyQRIS = () => {
    if (checkoutData.qrisString) {
      navigator.clipboard.writeText(checkoutData.qrisString);
      setCopied(true);
      toast.success("String QRIS berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    try {
      await SubscriptionApiService.simulatePaymentWebhook(
        checkoutData.invoiceId,
        checkoutData.amount,
      );
      toast.success(
        "Webhook Midtrans Sukses! Lisensi toko berhasil di-upgrade ke ACTIVE!",
      );
      onSimulateSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Gagal memproses webhook simulasi.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Dialog open={!!checkoutData} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
            <Receipt className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Invoice Pembayaran Lisensi SaaS
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Selesaikan pembayaran untuk mengaktifkan paket langganan tokomu
            secara instan.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Invoice Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">No. Invoice</span>
              <span className="font-mono font-bold text-slate-900">
                {checkoutData.invoiceId}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Paket SaaS</span>
              <span className="font-extrabold text-slate-900">
                {checkoutData.planName}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Tagihan</span>
              <span className="text-lg font-black text-emerald-600">
                {formatRupiah(checkoutData.amount)}
              </span>
            </div>
          </div>

          {/* QRIS Code Preview Simulation */}
          <div className="p-5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/30 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200">
              <QrCode className="h-32 w-32 text-slate-900" />
            </div>
            <div className="space-y-1">
              <Badge
                variant="emerald"
                className="text-[10px] font-extrabold uppercase"
              >
                QRIS Pembayaran Instant
              </Badge>
              <p className="text-[11px] text-slate-500">
                Scan menggunakan BCA, Mandiri, GoPay, OVO, ShopeePay, atau DANA.
              </p>
            </div>

            {checkoutData.qrisString && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyQRIS}
                className="text-[11px] font-bold border-slate-200 text-slate-700 rounded-xl gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copied ? "Tersalin!" : "Salin String QRIS"}</span>
              </Button>
            )}
          </div>

          {/* Development Webhook Trigger & Midtrans Snap Link */}
          <div className="space-y-2">
            <Button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isSimulating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 py-5 gap-2 cursor-pointer"
            >
              <Zap className="h-4 w-4" />
              <span>
                {isSimulating
                  ? "Mengirim Webhook Pembayaran..."
                  : "Simulasi Pembayaran QRIS Sukses (Tembak Webhook)"}
              </span>
            </Button>

            {checkoutData.paymentUrl && (
              <a
                href={checkoutData.paymentUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-center"
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl py-4 gap-1.5"
                >
                  <span>Buka Page Sandbox Midtrans</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Transaksi 100% Aman & Terenkripsi</span>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-xs font-semibold text-slate-600"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
