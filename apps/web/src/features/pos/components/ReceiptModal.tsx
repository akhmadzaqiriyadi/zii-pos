"use client";

import type { TransactionItem } from "@zii/types";
import { CheckCircle2, Printer, Send } from "lucide-react";
import { toast } from "sonner";
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
    toast.info("Mencetak struk 58mm (POS-V29DD)...");
    if (onPrintThermal) {
      onPrintThermal();
    } else {
      window.print();
    }
  };

  const handleBluetoothPrint = async () => {
    try {
      if (typeof window === "undefined" || !("bluetooth" in navigator)) {
        toast.error(
          "Browser tidak mendukung Web Bluetooth API. Gunakan Chrome di Laptop / Android!",
        );
        return;
      }
      toast.info("Mencari Printer Bluetooth (POS-V29DD)...");
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "000018f0-0000-1000-8000-00805f9b34fb",
          "0000e025-0000-1000-8000-00805f9b34fb",
          "0000ff00-0000-1000-8000-00805f9b34fb",
        ],
      });
      toast.success(`Terhubung dengan ${device.name || "MiNi Thermal Printer POS-V29DD"}`);
    } catch (err: any) {
      if (err.name !== "NotFoundError") {
        toast.error(`Koneksi Printer Bluetooth: ${err.message || "Gagal terhubung"}`);
      }
    }
  };

  const handleSendWA = () => {
    if (onSendWhatsApp) {
      onSendWhatsApp();
    } else if (customerPhone) {
      const text = encodeURIComponent(
        `Struk Belanja ${merchant.name}\nTotal: ${formatRupiah(totalAmount)}\nTerima Kasih!`,
      );
      toast.success(`Membuka WhatsApp untuk nomor ${customerPhone}`);
      window.open(`https://wa.me/${customerPhone}?text=${text}`, "_blank");
    } else {
      toast.warning("Nomor WhatsApp pelanggan belum diisi saat transaksi.");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <DialogTitle className="mt-2 text-center text-lg font-bold text-slate-800">
              Transaksi Berhasil!
            </DialogTitle>
            <p className="text-center text-xs text-slate-500">
              ZII POS White-Label Receipt (POS-V29DD 58mm)
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

          <div className="flex flex-col gap-2">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex-1 text-xs gap-1.5 font-bold"
              >
                <Printer className="h-4 w-4 text-slate-600" />
                <span>Cetak 58mm</span>
              </Button>
              <Button
                variant="primary"
                onClick={handleSendWA}
                className="flex-1 text-xs gap-1.5 font-bold"
              >
                <Send className="h-4 w-4" />
                <span>Kirim WA</span>
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleBluetoothPrint}
              className="w-full text-xs gap-1.5 text-slate-600 border-slate-300 hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5 text-emerald-600" />
              <span>Connect Bluetooth POS-V29DD</span>
            </Button>

            <Button
              variant="ghost"
              onClick={onReset}
              className="w-full text-xs text-slate-400 hover:text-slate-600"
            >
              Tutup & Transaksi Baru
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden 58mm Thermal Print Layout for POS-V29DD Printer */}
      <div id="thermal-receipt-print">
        <div style={{ textAlign: "center", marginBottom: "4px" }}>
          <strong style={{ fontSize: "13px", display: "block" }}>
            {merchant.name}
          </strong>
          <div>{merchant.address}</div>
          <div>Telp: {merchant.phone}</div>
          <div>--------------------------------</div>
        </div>

        <div style={{ marginBottom: "4px" }}>
          {cart.map((item) => (
            <div
              key={item.productId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "2px",
              }}
            >
              <span>
                {item.qty}x {item.productName}
              </span>
              <span>{formatRupiah(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px dashed #000",
            paddingTop: "4px",
            marginTop: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            <span>TOTAL ({paymentMethod.toUpperCase()})</span>
            <span>{formatRupiah(totalAmount)}</span>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "8px",
            paddingTop: "4px",
            borderTop: "1px dashed #000",
          }}
        >
          <div>{merchant.receiptFooter}</div>
          <div style={{ fontSize: "8px", marginTop: "4px", opacity: 0.8 }}>
            Powered by ZII POS SaaS
          </div>
        </div>
      </div>
    </>
  );
}
