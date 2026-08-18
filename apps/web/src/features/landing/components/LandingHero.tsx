"use client";

import {
  ArrowRight,
  CheckCircle2,
  Play,
  QrCode,
  ShieldCheck,
  Sparkles,
  Store,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-linear-to-b from-emerald-50/40 via-slate-50/60 to-white">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-300/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 shadow-2xs backdrop-blur-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold text-emerald-800 tracking-wide flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Aplikasi Kasir Praktis & Modern • Coba Gratis 14 Hari Tanpa Biaya
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Kelola Kasir Jadi Cepat,{" "}
            <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Laporan Rapi
            </span>
            , dan Toko Bebas Bocor Uang
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-normal">
            Aplikasi kasir online yang bikin transaksi belanja kilat, cetak nota
            mudah, kirim struk ke WhatsApp pembeli, dan pantau penjualan toko
            dari mana saja lewat HP atau laptop.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/onboarding" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/25 gap-3 cursor-pointer">
                <span>Daftar & Coba Gratis 14 Hari</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#fitur" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-base shadow-xs gap-2 cursor-pointer"
              >
                <Play className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                <span>Pelajari Manfaat</span>
              </Button>
            </a>
          </div>

          {/* Value Props Bullet Points */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs sm:text-sm font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Tanpa Kartu Kredit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Bisa Pakai HP, Tablet, & Laptop</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Uang & Data Toko 100% Aman</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Bantuan WhatsApp 24 Jam</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive App Preview Mockup */}
        <div className="mt-14 relative mx-auto max-w-5xl rounded-3xl border border-slate-200/80 bg-white p-3 sm:p-5 shadow-2xl shadow-slate-200/60">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-xs text-slate-500 font-bold bg-white px-3 py-1 rounded-lg border border-slate-200">
                  ziidistro.ziipos.com/pos
                </span>
              </div>
              <Badge
                variant="emerald"
                className="text-[10px] font-extrabold uppercase"
              >
                Kasir POS Aktif • Lisensi Pro
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Omset Penjualan Hari Ini
                </span>
                <p className="text-2xl font-black text-slate-900">
                  Rp 4.850.000
                </p>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  +24% dari kemarin
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Staf & Kasir Bertugas
                </span>
                <p className="text-2xl font-black text-slate-900">
                  3 Kasir Aktif
                </p>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                  Kuota 3/5 Akun (60%)
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Metode Pembayaran
                </span>
                <p className="text-2xl font-black text-emerald-600">
                  QRIS & Tunai
                </p>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                  Auto Settlement Midtrans
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
