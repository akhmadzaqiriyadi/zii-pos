"use client";

import {
  ChevronLeft,
  ChevronRight,
  Crown,
  LogOut,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  UserCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Badge } from "../ui/badge";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AppSidebar({
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, tenant, logout } = useAuth();

  const userRole = (user?.role as string) || "cashier";
  const isOwner = userRole === "owner" || !user?.role;
  const isSuperAdmin =
    userRole === "superadmin" ||
    user?.email?.includes("superadmin") ||
    user?.email === "admin@zii.id" ||
    user?.email === "zaqi@zii.id";

  const allMenuItems = [
    {
      title: "Kasir POS",
      href: "/pos",
      icon: ShoppingCart,
      roles: ["owner", "cashier", "superadmin"],
      badge: "Utama",
    },
    {
      title: "Kelola Produk & Jasa",
      href: "/products",
      icon: Package,
      roles: ["owner", "superadmin"],
      badge: null,
    },
    {
      title: "Riwayat Transaksi",
      href: "/transactions",
      icon: Receipt,
      roles: ["owner", "superadmin"],
      badge: null,
    },
    {
      title: "Pengaturan Toko",
      href: "/settings",
      icon: Settings,
      roles: ["owner", "superadmin"],
      badge: null,
    },
    {
      title: "Super Admin Portal",
      href: "/saas-admin",
      icon: Crown,
      roles: ["superadmin"],
      badge: "SaaS",
    },
  ];

  const menuItems = allMenuItems.filter((item) => {
    if (item.href === "/saas-admin") {
      return isSuperAdmin;
    }
    return true;
  });

  return (
    <>
      {/* Backdrop overlay on mobile phones (< sm) when sidebar is expanded */}
      {!isCollapsed && onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs sm:hidden transition-opacity border-0 cursor-default"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`flex flex-col bg-white border-r border-slate-200 transition-all duration-300 h-full shrink-0 z-20 ${
          isCollapsed
            ? "relative w-20"
            : "fixed sm:relative inset-y-0 left-0 z-50 sm:z-20 w-64 shadow-2xl sm:shadow-none"
        }`}
      >
        {/* Sidebar Header / Brand */}
        <header className="flex items-center justify-between border-b border-slate-200 p-4 h-16 bg-white">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 font-extrabold text-white shadow-md">
                ZII
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-extrabold text-slate-900 truncate">
                  {tenant?.name || "ZII POS Store"}
                </h2>
                <p className="text-[10px] font-semibold text-slate-400 truncate">
                  Enterprise Modular POS
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-extrabold text-white shadow-md">
              ZII
            </div>
          )}

          {onToggleCollapse && !isCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer sm:hidden"
              title="Tutup Sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </header>

        {/* User Role Card */}
        <section className="p-3 border-b border-slate-100 bg-slate-50/70">
          {!isCollapsed ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <UserCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {user?.name || "Kasir"}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize truncate">
                    {user?.role || "kasir"}
                  </p>
                </div>
              </div>
              <Badge
                variant={isOwner ? "emerald" : "blue"}
                className="text-[10px] py-0.5 px-2 font-bold uppercase"
              >
                {isOwner ? "PEMILIK" : "KASIR"}
              </Badge>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <Badge
                variant={isOwner ? "emerald" : "blue"}
                className="text-[9px] px-1.5 py-0.5"
              >
                {isOwner ? "OWN" : "KAS"}
              </Badge>
            </div>
          )}
        </section>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const isAllowed =
              isOwner || item.roles.includes(user?.role || "cashier");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={isAllowed ? item.href : "#"}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : isAllowed
                      ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      : "text-slate-300 cursor-not-allowed opacity-60"
                }`}
                title={!isAllowed ? "Akses khusus Pemilik Toko" : item.title}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </div>

                {!isCollapsed && (
                  <div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {!isAllowed && (
                      <span className="text-[9px] text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-200">
                        Restricted
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Support Prioritas WA 24/7 (Paket Pro / Merchant) */}
        {!isCollapsed && (
          <div className="p-3">
            <a
              href="https://wa.me/6285292677431?text=Halo%20ZII%20POS%20Support%2C%20saya%20merchant%20ingin%20konsultasi%20fitur..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition shadow-2xs group"
            >
              <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                💬
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-[11px] block leading-tight text-emerald-900 group-hover:text-emerald-950">
                  Support Prioritas WA
                </span>
                <span className="text-[9px] text-emerald-700 font-semibold block">
                  Online 24/7 CS Toko
                </span>
              </div>
            </a>
          </div>
        )}

        {/* Sidebar Footer / Toggle & Logout */}
        <footer className="border-t border-slate-200 p-3 space-y-2 bg-white">
          {isCollapsed && onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Buka Sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          <button
            type="button"
            onClick={logout}
            className={`w-full flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer ${
              isCollapsed ? "px-0" : "px-3 justify-start space-x-2.5"
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-rose-600" />
            {!isCollapsed && <span>Keluar Akun</span>}
          </button>
        </footer>
      </aside>
    </>
  );
}
