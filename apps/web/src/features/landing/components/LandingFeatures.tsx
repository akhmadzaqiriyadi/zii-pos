"use client";

import {
  FileSpreadsheet,
  Globe,
  Layers,
  MessageSquare,
  Package,
  Printer,
  QrCode,
  Shield,
  ShoppingBag,
  Store,
  Users,
  Zap,
} from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";

export function LandingFeatures() {
  const features = [
    {
      icon: ShoppingBag,
      title: "Mesin Kasir POS Cepat & Responsif",
      description:
        "Input transaksi dalam hitungan detik. Mendukung pencarian barcode, kategori retail & jasa, serta kalkulator kembalian tunai otomatis.",
      badge: "Utama",
    },
    {
      icon: Users,
      title: "Multi-Kasir & Dynamic RBAC Roles",
      description:
        "Buat akun staf kasir tanpa batas kuota sesuai paket. Atur hak akses granular mulai dari diskon penjualan, void nota, hingga laporan keuangan.",
      badge: "Enterprise",
    },
    {
      icon: Globe,
      title: "Subdomain Toko Terisolasi Mandiri",
      description:
        "Setiap merchant mendapatkan URL subdomain toko sendiri (contoh: tokoanda.ziipos.com) dengan sesi data yang terisolasi 100% aman.",
      badge: "SaaS",
    },
    {
      icon: Printer,
      title: "Cetak Printer Thermal 58mm POS",
      description:
        "Terhubung langsung ke printer thermal via Web Bluetooth & USB Serial. Cetak nota berlogo toko kamu tanpa software driver pihak ketiga.",
      badge: "Hardware",
    },
    {
      icon: MessageSquare,
      title: "Struk Belanja Otomatis via WhatsApp",
      description:
        "Hemat kertas nota dengan mengirimkan struk digital berformat rapi langsung ke nomor WhatsApp pelanggan hanya dengan satu klik.",
      badge: "Paperless",
    },
    {
      icon: QrCode,
      title: "Pembayaran QRIS & Gateway Otomatis",
      description:
        "Terima pembayaran QRIS dinamis dan perpanjang lisensi toko secara instan 24/7 dengan verifikasi pembayaran Midtrans.",
      badge: "Auto Pay",
    },
  ];

  return (
    <section
      id="fitur"
      className="py-20 lg:py-28 bg-white border-t border-slate-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <Badge
            variant="emerald"
            className="text-xs font-bold uppercase py-1 px-3"
          >
            Fitur Canggih & Komprehensif
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Dirancang Khusus untuk Mempercepat Operasional & Scale-Up Toko
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
            Semua kebutuhan bisnis mulai dari meja kasir, manajemen stok,
            wewenang staf, hingga laporan pembukuan hadir dalam satu platform
            cloud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-2xs">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {f.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {f.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                  <span>Pelajari lebih lanjut &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
