"use client";

import { Check, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export function LandingPricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const plans = [
    {
      code: "starter",
      name: "Starter Trial",
      tagline: "Cocok untuk toko baru yang ingin mencoba fitur kasir ZII POS.",
      priceMonthly: 0,
      priceYearly: 0,
      isPopular: false,
      badge: "Trial 14 Hari",
      notice: "Auto-lock jika tidak diperpanjang",
      features: [
        "Layar Kasir POS Multi-Item",
        "Katalog Produk & Jasa Terbatas",
        "Maksimal 1 Akun Kasir",
        "Cetak Printer Thermal 58mm",
        "Struk WhatsApp Otomatis",
        "Subdomain Toko Sendiri",
      ],
      buttonText: "Mulai Trial 14 Hari",
      buttonVariant: "outline" as const,
      href: "/onboarding",
    },
    {
      code: "pro",
      name: "Pro Merchant White-Label",
      tagline:
        "Paket terpopuler untuk merchant yang ingin brand mandiri & multi-kasir.",
      priceMonthly: 99000,
      priceYearly: 990000,
      isPopular: true,
      badge: "Paling Populer",
      notice: null,
      features: [
        "Semua Fitur Starter",
        "Multi-Kasir hingga 5 User Staf",
        "Dynamic Custom Roles (Supervisor/Kasir)",
        "White-Label Penuh (Logo Toko di Struk)",
        "Ekspor Rekap Laporan Excel & CSV",
        "Support Prioritas WhatsApp 24/7",
      ],
      buttonText: "Pilih Paket Pro",
      buttonVariant: "primary" as const,
      href: "/onboarding",
    },
    {
      code: "enterprise",
      name: "Enterprise Chain Store",
      tagline:
        "Solusi skala besar untuk jaringan cabang dan toko retail beromset tinggi.",
      priceMonthly: 249000,
      priceYearly: 2490000,
      isPopular: false,
      badge: "Skala Besar",
      notice: null,
      features: [
        "Semua Fitur Pro Merchant",
        "Multi-Kasir hingga 20 User Staf",
        "Hak Akses Granular Tanpa Batas",
        "Dedicated Account Manager",
        "Custom Integrasi API & Webhook",
        "SLA Uptime 99.9% & Backup Harian",
      ],
      buttonText: "Pilih Enterprise",
      buttonVariant: "outline" as const,
      href: "/onboarding",
    },
  ];

  return (
    <section
      id="harga"
      className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-14">
          <Badge
            variant="blue"
            className="text-xs font-bold uppercase py-1 px-3"
          >
            Pilihan Paket Transparan
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Investasi Terjangkau untuk Pertumbuhan Toko Anda
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
            Pilih paket yang paling sesuai dengan kebutuhan cabang dan kapasitas
            kasir toko kamu.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl mt-4">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Langganan Bulanan
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Langganan Tahunan</span>
              <span className="text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full font-black">
                Hemat 2 Bulan
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price =
              billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;

            return (
              <div
                key={plan.code}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.isPopular
                    ? "bg-white border-2 border-emerald-500 shadow-2xl shadow-emerald-600/15 lg:-translate-y-2"
                    : "bg-white border border-slate-200/80 shadow-xs hover:border-slate-300"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-black uppercase px-4 py-1 rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900">
                        {plan.name}
                      </h3>
                      {!plan.isPopular && (
                        <Badge
                          variant="slate"
                          className="text-[10px] font-bold uppercase"
                        >
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">
                        {price === 0
                          ? "GRATIS"
                          : `Rp ${price.toLocaleString("id-ID")}`}
                      </span>
                      {price > 0 && (
                        <span className="text-xs font-semibold text-slate-400">
                          / {billingCycle === "yearly" ? "tahun" : "bulan"}
                        </span>
                      )}
                    </div>

                    {plan.notice && (
                      <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded-lg px-2.5 py-1 mt-3">
                        {plan.notice}
                      </p>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-xs sm:text-sm text-slate-600"
                      >
                        <div className="flex h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100">
                  <Link href={plan.href} className="w-full block">
                    <Button
                      variant={plan.buttonVariant}
                      className={`w-full h-12 rounded-xl font-extrabold text-sm cursor-pointer ${
                        plan.isPopular
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
