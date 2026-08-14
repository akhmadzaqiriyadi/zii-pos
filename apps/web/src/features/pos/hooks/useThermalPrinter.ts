"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  const connectUsb = async (rawReceiptText?: string) => {
    if (typeof window === "undefined" || (!("usb" in navigator) && !("serial" in navigator))) {
      toast.error("Browser ini tidak mendukung Direct USB. Gunakan Google Chrome!");
      return;
    }

    try {
      setStatus("connecting");
      toast.info("Mencari perangkat USB (POS-V29DD)...");

      if ("usb" in navigator) {
        const device = await (navigator as any).usb.requestDevice({ filters: [] });
        const connectedName = device.productName || "STMicroelectronics USB Printer";
        setDeviceName(connectedName);
        setConnectionType("web_usb");
        setStatus("connected");

        if (typeof window !== "undefined") {
          localStorage.setItem("zii_printer_name", connectedName);
          localStorage.setItem("zii_printer_type", "web_usb");
        }

        toast.success(`Berhasil terhubung dengan ${connectedName}!`);
        return;
      }

      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });
      const connectedName = "STMicroelectronics USB Printer";
      setDeviceName(connectedName);
      setConnectionType("web_usb");
      setStatus("connected");
      toast.success("Direct USB Printer POS-V29DD Terhubung!");
      await port.close();
    } catch (err: any) {
      setStatus("disconnected");
      if (err.name !== "NotFoundError") {
        toast.error(`Direct USB: ${err.message || "Gagal membuka port USB"}`);
      }
    }
  };

  const disconnectPrinter = () => {
    setStatus("disconnected");
    toast.info("Koneksi printer dilepas.");
  };

  const printReceiptDirect = async (receiptText: string) => {
    if (connectionType === "web_usb") {
      await connectUsb(receiptText);
    } else {
      window.print();
    }
  };

  const testPrint = async () => {
    toast.info("Menjalankan test print 58mm...");
    const sampleText = "ZII POS STORE\nJl. Merdeka Raya No. 45\nTelp: 0812-9988-7766\n--------------------------------\n1x Kaos Polos Combed 30s - Rp 65.000\n--------------------------------\nTOTAL (CASH): Rp 65.000\n--------------------------------\nTerima kasih telah berbelanja!\nPowered by ZII POS\n";
    if (connectionType === "web_usb") {
      await connectUsb(sampleText);
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
