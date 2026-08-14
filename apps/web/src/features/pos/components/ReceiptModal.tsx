"use client";

import type { TransactionItem } from "@zii/types";
import { CheckCircle2, Printer, Send } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { formatRupiah } from "../../../lib/utils";

interface MerchantInfo {
  name: string;
  phone: string;
  address: string;
  receiptFooter: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: MerchantInfo;
  cart: TransactionItem[];
  paymentMethod: string;
  totalAmount: number;
  customerPhone: string;
  onReset: () => void;
  onPrintThermal?: () => void;
  onSendWhatsApp?: () => void;
}

export function ReceiptModal({
  isOpen,
  onOpenChange,
  merchant,
  cart,
  paymentMethod,
  totalAmount,
  customerPhone,
  onReset,
  onPrintThermal,
  onSendWhatsApp,
}: ReceiptModalProps) {
  const handlePrint = () => {
    if (onPrintThermal) {
      onPrintThermal();
    } else {
      window.print();
    }
  };

  const handleSendWA = () => {
    if (onSendWhatsApp) {
      onSendWhatsApp();
    } else if (customerPhone) {
      const text = encodeURIComponent(
        `Struk Belanja ${merchant.name}\nTotal: ${formatRupiah(totalAmount)}\nTerima Kasih!`,
      );
      window.open(`https://wa.me/${customerPhone}?text=${text}`, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
          <DialogTitle className="mt-2 text-center text-lg font-bold text-slate-800">
            Transaksi Berhasil!
          </DialogTitle>
          <p className="text-center text-xs text-slate-500">
            ZII POS Radix UI White-Label Receipt Preview
          </p>
        </DialogHeader>

        <section className="rounded-xl border border-dashed border-slate-300 bg-amber-50/50 p-4 font-mono text-[11px] text-slate-700 space-y-2 my-2">
          <header className="text-center border-b border-dashed border-slate-300 pb-2">
            <h4 className="font-bold text-slate-900">{merchant.name}</h4>
            <p className="text-[10px] text-slate-500">{merchant.address}</p>
            <p className="text-[10px] text-slate-500">Tel: {merchant.phone}</p>
          </header>

          <div className="space-y-1">
            {cart.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>
                  {item.qty}x {item.productName}
                </span>
                <span>{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <footer className="border-t border-dashed border-slate-300 pt-2 flex justify-between font-bold text-slate-900">
            <span>TOTAL ({paymentMethod.toUpperCase()})</span>
            <span>{formatRupiah(totalAmount)}</span>
          </footer>

          <div className="text-center text-[9px] text-slate-500 pt-2 border-t border-dashed border-slate-300">
            {merchant.receiptFooter}
          </div>
        </section>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex-1 text-xs"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Struk</span>
          </Button>
          <Button
            variant="primary"
            onClick={handleSendWA}
            className="flex-1 text-xs"
          >
            <Send className="h-4 w-4" />
            <span>Kirim WA</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={onReset}
          className="w-full text-xs text-slate-400 hover:text-slate-600"
        >
          Tutup & Transaksi Baru
        </Button>
      </DialogContent>
    </Dialog>
  );
}
