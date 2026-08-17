"use client";

import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Crown,
  Layers,
  LogOut,
  MessageSquare,
  Package,
  Receipt,
  Settings,
  Shield,
  ShoppingCart,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useHasPermission } from "../../features/auth/hooks/useHasPermission";
import { useTenant } from "../../features/tenant/hooks/useTenant";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface MenuItem {
  title: string;
  href: string;
  icon: typeof ShoppingCart;
  permissions: string[];
  badge?: string | null;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export function AppSidebar({
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { tenant } = useTenant();

  const isSuperAdmin = useHasPermission("saas:admin", "*");
  const userRole = user?.role || "cashier";

  const tenantInitials =
    tenant?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 3)
      .toUpperCase() || "ZII";

  const menuGroups: MenuGroup[] = [
    {
      label: "Operasional Kasir",
      items: [
        {
          title: "Kasir POS",
          href: "/pos",
          icon: ShoppingCart,
          permissions: ["pos:access"],
          badge: "Utama",
        },
        {
          title: "Kelola Produk & Jasa",
          href: "/products",
          icon: Package,
          permissions: ["products:read", "products:create"],
          badge: null,
        },
        {
          title: "Riwayat Transaksi",
          href: "/transactions",
          icon: Receipt,
          permissions: ["transactions:read"],
          badge: null,
        },
      ],
    },
    {
      label: "Manajemen & Toko",
      items: [
        {
          title: "Kelola Staf & Kasir",
          href: "/settings/cashiers",
          icon: Users,
          permissions: ["cashiers:manage"],
          badge: null,
        },
        {
          title: "Role & Hak Akses",
          href: "/settings/roles",
          icon: Shield,
          permissions: ["roles:manage"],
          badge: null,
        },
        {
          title: "Pengaturan Toko",
          href: "/settings",
          icon: Settings,
          permissions: ["settings:manage"],
          badge: null,
        },
        {
          title: "Lisensi & Billing",
          href: "/settings/billing",
          icon: CreditCard,
          permissions: ["billing:manage"],
          badge: null,
        },
      ],
    },
    {
      label: "Super Admin Portal",
      items: [
        {
          title: "Monitoring Merchant",
          href: "/saas-admin",
          icon: Crown,
          permissions: ["saas:admin"],
          badge: "SaaS",
        },
        {
          title: "Kelola Paket SaaS",
          href: "/saas-admin/plans",
          icon: Layers,
          permissions: ["saas:admin"],
          badge: "SaaS",
        },
      ],
    },
  ];

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
        {/* Dynamic White-Label Brand Header */}
        <header className="flex items-center justify-between border-b border-slate-200 p-4 h-16 bg-white">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 overflow-hidden">
              {tenant?.logoUrl ? (
                <div className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-white p-0.5 shadow-xs overflow-hidden flex items-center justify-center">
                  <img
                    src={tenant.logoUrl}
                    alt={tenant.name || "Logo Toko"}
                    className="h-full w-full object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 font-extrabold text-white shadow-md text-xs tracking-wider">
                  {tenantInitials}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-sm font-extrabold text-slate-900 truncate">
                  {tenant?.name || "ZII POS Store"}
                </h2>
                <p className="text-[10px] font-semibold text-slate-400 truncate">
                  {tenant?.subdomain
                    ? `${tenant.subdomain}.ziipos.id`
                    : "Point of Sale Merchant"}
                </p>
              </div>
            </div>
          ) : tenant?.logoUrl ? (
            <div className="mx-auto h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-white p-0.5 shadow-xs overflow-hidden flex items-center justify-center">
              <img
                src={tenant.logoUrl}
                alt={tenant.name || "Logo"}
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-extrabold text-white shadow-md text-xs tracking-wider">
              {tenantInitials}
            </div>
          )}

          {onToggleCollapse && !isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer sm:hidden h-8 w-8"
              title="Tutup Sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
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
                variant={
                  isSuperAdmin
                    ? "purple"
                    : userRole === "owner"
                      ? "emerald"
                      : "blue"
                }
                className="text-[10px] py-0.5 px-2 font-bold uppercase"
              >
                {isSuperAdmin
                  ? "SUPERADMIN"
                  : userRole === "owner"
                    ? "PEMILIK"
                    : "STAF"}
              </Badge>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <Badge
                variant={
                  isSuperAdmin
                    ? "purple"
                    : userRole === "owner"
                      ? "emerald"
                      : "blue"
                }
                className="text-[9px] px-1.5 py-0.5"
              >
                {isSuperAdmin ? "SUP" : userRole === "owner" ? "OWN" : "STF"}
              </Badge>
            </div>
          )}
        </section>

        {/* Grouped Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {menuGroups.map((group, groupIdx) => {
            // Check if user has permission for at least one item in Super Admin group
            if (group.label === "Super Admin Portal" && !isSuperAdmin) {
              return null;
            }

            return (
              <div key={group.label} className="space-y-1">
                {!isCollapsed ? (
                  <div className="px-3 pb-1 pt-1.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {group.label}
                    </p>
                  </div>
                ) : (
                  groupIdx > 0 && (
                    <div className="my-2 border-t border-slate-100" />
                  )
                )}

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const isAllowed = useHasPermission(...item.permissions);
                    const Icon = item.icon;

                    if (
                      !isAllowed &&
                      (item.href === "/saas-admin" ||
                        item.href === "/saas-admin/plans")
                    ) {
                      return null;
                    }

                    return (
                      <Link
                        key={item.href}
                        href={isAllowed ? item.href : "#"}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                            : isAllowed
                              ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                              : "text-slate-300 cursor-not-allowed opacity-60"
                        }`}
                        title={
                          !isAllowed
                            ? "Akses Dibatasi — Memerlukan izin role khusus"
                            : item.title
                        }
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
                </div>
              </div>
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
                <MessageSquare className="h-3.5 w-3.5" />
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
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer h-9"
              title="Buka Sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="outline"
            onClick={logout}
            className={`w-full flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer ${
              isCollapsed ? "px-0" : "px-3 justify-start space-x-2.5"
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-rose-600" />
            {!isCollapsed && <span>Keluar Akun</span>}
          </Button>
        </footer>
      </aside>
    </>
  );
}
