"use client";

import {
  ArrowLeft,
  HelpCircle,
  Lock,
  MessageCircle,
  ShieldAlert,
  ShoppingCart,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface RestrictedAccessViewProps {
  requiredRole?: "owner" | "cashier";
  requiredPermission?: string | string[];
}

export function RestrictedAccessView({
  requiredRole,
  requiredPermission,
}: RestrictedAccessViewProps) {
  const { user } = useAuth();
  const userRole = user?.role || "kasir";

  const permissionList = Array.isArray(requiredPermission)
    ? requiredPermission
    : requiredPermission
      ? [requiredPermission]
      : [];

  return (
    <main className="flex h-full min-h-[80vh] w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-lg rounded-3xl border border-rose-200/80 bg-white shadow-xl shadow-rose-500/5 overflow-hidden">
        {/* Top Decorative Banner */}
        <header className="relative bg-linear-to-b from-rose-50 to-white p-8 text-center border-b border-rose-100/60 space-y-4">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-100/80 border border-rose-200 shadow-inner">
            <ShieldAlert className="h-10 w-10 text-rose-600 animate-in zoom-in-50 duration-300" />
            <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm">
              <Lock className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Badge
              variant="rose"
              className="font-extrabold uppercase text-[10px] tracking-wider px-3 py-0.5"
            >
              Akses Dibatasi
            </Badge>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Wewenang Tidak Mencukupi
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Akun Anda tidak memiliki izin hak akses yang diperlukan untuk
              membuka halaman ini.
            </p>
          </div>
        </header>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* User Role & Current Status Card */}
          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                Akun Anda Saat Ini:
              </span>
              <Badge
                variant={userRole === "owner" ? "emerald" : "blue"}
                className="text-[10.5px] font-bold uppercase"
              >
                {userRole === "owner" ? "PEMILIK TOKO" : "STAF KASIR"}
              </Badge>
            </div>

            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <UserCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {user?.name || "Staf Toko"}
                </p>
                <p className="text-[11px] text-slate-500 font-mono truncate">
                  {user?.email || "-"}
                </p>
              </div>
            </div>

            {/* Required Permission Requirement */}
            {permissionList.length > 0 && (
              <div className="pt-2 border-t border-slate-200/60 space-y-1">
                <p className="text-[11px] font-semibold text-slate-500">
                  Izin yang dibutuhkan:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {permissionList.map((perm) => (
                    <span
                      key={perm}
                      className="text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/pos" className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl shadow-md shadow-emerald-600/20 gap-2 cursor-pointer transition">
                <ShoppingCart className="h-4 w-4" />
                <span>Kembali ke Kasir POS</span>
              </Button>
            </Link>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link href="/transactions" className="block">
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl py-4 cursor-pointer gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Riwayat Transaksi</span>
                </Button>
              </Link>

              <a
                href="https://wa.me/6285292677431?text=Halo%20Admin%20Toko%2C%20saya%20memerlukan%20tambahan%20wewenang%20akses%20di%20ZII%20POS..."
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full border-slate-200 text-emerald-700 hover:bg-emerald-50 font-bold text-xs rounded-xl py-4 cursor-pointer gap-1.5"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Minta Izin Pemilik</span>
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
