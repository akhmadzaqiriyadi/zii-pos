"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { formatEscPosReceipt } from "../utils/escPosFormatter";

export type PrinterConnectionType = "browser_driver" | "web_bluetooth" | "web_usb";
export type PrinterStatus = "connected" | "disconnected" | "connecting";

export interface ThermalPrinterState {
  status: PrinterStatus;
  connectionType: PrinterConnectionType;
  deviceName: string;
  isSettingsOpen: boolean;
}

export function useThermalPrinter() {
  const [connectionType, setConnectionType] = useState<PrinterConnectionType>(
    "browser_driver",
  );
  const [status, setStatus] = useState<PrinterStatus>("connected");
  const [deviceName, setDeviceName] = useState<string>("Printer 58mm (System Driver)");
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedType = localStorage.getItem("zii_printer_type") as PrinterConnectionType;
      const savedName = localStorage.getItem("zii_printer_name");

      if (savedType) setConnectionType(savedType);
      if (savedName) setDeviceName(savedName);
    }
  }, []);

  const setPrinterMode = (type: PrinterConnectionType) => {
    setConnectionType(type);
    if (typeof window !== "undefined") {
      localStorage.setItem("zii_printer_type", type);
    }

    if (type === "browser_driver") {
      setStatus("connected");
      setDeviceName("Printer 58mm (System Driver)");
      if (typeof window !== "undefined") {
        localStorage.setItem("zii_printer_name", "Printer 58mm (System Driver)");
      }
      toast.success("Mode Printer diubah ke Browser System Driver 58mm");
    } else if (type === "web_usb") {
      setStatus("disconnected");
      setDeviceName("STMicroelectronics USB Printer");
      toast.info("Mode Printer diubah ke Direct USB ESC/POS (POS-V29DD)");
    } else {
      setStatus("disconnected");
      setDeviceName("POS-V29DD Bluetooth");
      toast.info("Mode Printer diubah ke Bluetooth Direct (POS-V29DD)");
    }
  };

  const connectBluetooth = async () => {
    if (typeof window === "undefined" || !("bluetooth" in navigator)) {
      toast.error(
        "Browser ini tidak mendukung Web Bluetooth API. Gunakan Google Chrome di Laptop / Android!",
      );
      return;
    }

    try {
      setStatus("connecting");
      toast.info("Mencari perangkat printer Bluetooth (POS-V29DD)...");

      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "000018f0-0000-1000-8000-00805f9b34fb",
          "0000e025-0000-1000-8000-00805f9b34fb",
          "0000ff00-0000-1000-8000-00805f9b34fb",
        ],
      });

      const connectedName = device.name || "POS-V29DD Bluetooth";
      setDeviceName(connectedName);
      setStatus("connected");

      if (typeof window !== "undefined") {
        localStorage.setItem("zii_printer_name", connectedName);
        localStorage.setItem("zii_printer_type", "web_bluetooth");
      }

      toast.success(`Berhasil terhubung dengan ${connectedName}!`);
    } catch (err: any) {
      setStatus("disconnected");
      if (err.name !== "NotFoundError") {
        toast.error(`Koneksi Bluetooth gagal: ${err.message || "Perangkat tidak merespons"}`);
      }
    }
  };

  const connectUsb = async (rawReceiptData?: any) => {
    if (typeof window === "undefined" || !("usb" in navigator)) {
      toast.info("Menggunakan Mode System Driver 58mm...");
      window.print();
      return;
    }

    let payloadBytes: Uint8Array | undefined = undefined;
    if (rawReceiptData instanceof Uint8Array) {
      payloadBytes = rawReceiptData;
    } else if (typeof rawReceiptData === "string") {
      const encoder = new TextEncoder();
      payloadBytes = new Uint8Array([
        0x1b, 0x40,
        ...Array.from(encoder.encode(rawReceiptData)),
        0x0a, 0x0a, 0x0a, 0x0a,
        0x1d, 0x56, 0x00,
      ]);
    }

    try {
      setStatus("connecting");
      let device = (window as any)._zii_usb_device;

      if (!device) {
        toast.info("Mencari perangkat USB (POS-V29DD)...");
        device = await (navigator as any).usb.requestDevice({ filters: [] });
        (window as any)._zii_usb_device = device;
      }

      if (device) {
        const connectedName = device.productName || "USB Portable Printer";
        setDeviceName(connectedName);
        setConnectionType("web_usb");
        setStatus("connected");

        if (typeof window !== "undefined") {
          localStorage.setItem("zii_printer_name", connectedName);
          localStorage.setItem("zii_printer_type", "web_usb");
        }

        if (payloadBytes) {
          try {
            if (!device.opened) await device.open();
            if (device.configuration === null) await device.selectConfiguration(1);

            const iface = device.configuration.interfaces[0];
            const altIface = iface?.alternates?.[0] || iface?.alternate;
            await device.claimInterface(iface?.interfaceNumber || 0);

            const outEndpoint =
              altIface?.endpoints?.find((e: any) => e.direction === "out")?.endpointNumber || 1;

            await device.transferOut(outEndpoint, payloadBytes);
            toast.success("Struk terkirim langsung ke printer thermal 58mm!");
          } catch (transferErr: any) {
            console.warn("Direct USB Transfer Fallback:", transferErr);
            toast.info("Mencetak via Mode 58mm...");
            window.print();
          }
        } else {
          toast.success(`Berhasil terhubung dengan ${connectedName}!`);
        }
      }
    } catch (err: any) {
      setStatus("disconnected");
      if (err.name !== "NotFoundError") {
        toast.info("Mencetak via Mode 58mm...");
        window.print();
      }
    }
  };

  const disconnectPrinter = () => {
    setStatus("disconnected");
    toast.info("Koneksi printer dilepas.");
  };

  const printReceiptDirect = async (receiptData: Uint8Array | string) => {
    if (connectionType === "web_usb") {
      await connectUsb(receiptData);
    } else {
      window.print();
    }
  };

  const testPrint = async () => {
    toast.info("Menjalankan test print 58mm...");
    const sampleData = {
      merchant: {
        name: "ZII POS STORE",
        address: "Jl. Merdeka Raya No. 45",
        phone: "0812-9988-7766",
        receiptFooter: "Terima kasih telah berbelanja!",
      },
      cart: [
        { productName: "Kaos Polos Combed 30s", qty: 1, subtotal: 65000 },
      ],
      totalAmount: 65000,
      paymentMethod: "CASH",
    };

    if (connectionType === "web_usb") {
      const bytes = formatEscPosReceipt(sampleData);
      await connectUsb(bytes);
    } else {
      window.print();
    }
  };

  return {
    status,
    connectionType,
    deviceName,
    isSettingsOpen,
    setIsSettingsOpen,
    setPrinterMode,
    connectBluetooth,
    connectUsb,
    disconnectPrinter,
    testPrint,
    printReceiptDirect,
  };
}
