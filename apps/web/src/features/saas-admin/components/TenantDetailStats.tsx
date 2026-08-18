import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { formatRupiah } from "../../../lib/utils";
import type { MerchantTenantDetail } from "../services/saasAdminApi";

interface TenantDetailStatsProps {
  detail: MerchantTenantDetail;
}

export function TenantDetailStats({ detail }: TenantDetailStatsProps) {
  const stats = [
    {
      label: "Total Omset (GMV Penjualan)",
      value: formatRupiah(detail.totalRevenue),
      desc: "Omset Transaksi Kasir POS",
      icon: DollarSign,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
    },
    {
      label: "Total Transaksi Kasir",
      value: String(detail.totalTransactions),
      desc: "Struk / Nota Terbit",
      icon: ShoppingCart,
      iconBg: "bg-blue-50 text-blue-600 border-blue-200/80",
    },
    {
      label: "Total Produk & Jasa",
      value: String(detail.totalProducts),
      desc: "Item Katalog Toko",
      icon: Package,
      iconBg: "bg-purple-50 text-purple-600 border-purple-200/80",
    },
    {
      label: "Total Kasir & Staf",
      value: String(detail.totalUsers),
      desc: "Akun Pengguna Terdaftar",
      icon: Users,
      iconBg: "bg-amber-50 text-amber-600 border-amber-200/80",
    },
  ];

  return (
    <section
      aria-label="Merchant KPI Metrics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card
            key={idx}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs"
          >
            <CardContent className="p-0 flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[11px] font-semibold text-slate-400">
                  {stat.desc}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-2xs ${stat.iconBg}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
