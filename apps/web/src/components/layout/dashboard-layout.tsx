"use client";

import {
  LogOut,
  PanelLeft,
  ShieldAlert,
  ShoppingCart,
  Store,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AppSidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: "owner" | "cashier";
  defaultCollapsed?: boolean;
}

export function DashboardLayout({
  children,
  requiredRole,
  defaultCollapsed = false,
}: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(defaultCollapsed);
  const { user, tenant, logout } = useAuth();

  const isOwner = user?.role === "owner" || !user?.role;
  const isAuthorized =
    !requiredRole || (requiredRole === "owner" ? isOwner : true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* Admin CMS Sidebar */}
      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between bg-white px-4 sm:px-6 shadow-xs border-b border-slate-200">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0"
              title="Toggle Sidebar"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 leading-none truncate">
                {tenant?.name || "ZII Distro & Apparel Studio"}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">
                Point of Sale White-Label CMS
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <Badge
              variant="emerald"
              className="gap-1.5 py-1 text-xs font-semibold"
            >
              <Store className="h-3.5 w-3.5" />
              <span className="truncate max-w-[130px] sm:max-w-none">
                {user?.name || "Isyadi"} ({user?.role || "kasir"})
              </span>
            </Badge>
            <button
              type="button"
              onClick={logout}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Content Body or Role Restricted View */}
        <div className="flex-1 overflow-y-auto min-w-0">
          {!isAuthorized ? (
            <div className="flex h-full flex-col items-center justify-center p-8">
              <Card className="max-w-md p-8 text-center space-y-4 border-rose-200 bg-rose-50/20 shadow-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Akses Dibatasi Khusus Pemilik Toko
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Halaman ini hanya dapat diakses oleh pengguna dengan role{" "}
                    <span className="font-bold text-slate-700">
                      Owner / Pemilik Toko
                    </span>
                    . Role kamu saat ini adalah{" "}
                    <span className="font-bold text-rose-600 capitalize">
                      {user?.role || "kasir"}
                    </span>
                    .
                  </p>
                </div>
                <Link href="/pos">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Kembali ke Kasir POS</span>
                  </Button>
                </Link>
              </Card>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
