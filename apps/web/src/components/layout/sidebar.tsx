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
import { LogoutConfirmModal } from "../auth/LogoutConfirmModal";
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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const isSuperAdmin = useHasPermission("saas:admin", "*");
  const userRole = user?.role || "cashier";

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
        {/* Dynamic Brand Header */}
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 h-20 bg-white">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3.5 overflow-hidden">
              {isSuperAdmin ? (
                <img
                  src="/logo-zii-pos.png"
                  alt="ZII POS Global"
                  className="h-14 w-14 shrink-0 object-contain"
                />
              ) : tenant?.logoUrl ? (
                <img
                  src={tenant.logoUrl}
                  alt={tenant.name || "Logo Toko"}
                  className="h-14 w-14 shrink-0 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <img
                  src="/logo-zii-pos.png"
                  alt="ZII POS"
                  className="h-14 w-14 shrink-0 object-contain"
                />
              )}
              <div className="min-w-0">
                <h2 className="text-sm font-black text-slate-900 truncate tracking-tight">
                  {isSuperAdmin
                    ? "ZII POS Platform Global"
                    : tenant?.name || "ZII POS Store"}
                </h2>
                <p className="text-[11px] font-semibold text-slate-400 truncate">
                  {isSuperAdmin
                    ? "Platform Super Admin Portal"
                    : tenant?.subdomain
                      ? `${tenant.subdomain}.ziipos.id`
                      : "Point of Sale Merchant"}
                </p>
              </div>
            </div>
          ) : isSuperAdmin ? (
            <img
              src="/logo-zii-pos.png"
              alt="ZII POS"
              className="mx-auto h-12 w-12 object-contain"
            />
          ) : tenant?.logoUrl ? (
            <img
              src={tenant.logoUrl}
              alt={tenant.name || "Logo"}
              className="mx-auto h-12 w-12 object-contain"
            />
          ) : (
            <img
              src="/logo-zii-pos.png"
              alt="ZII POS"
              className="mx-auto h-12 w-12 object-contain"
            />
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

        {/* Clean Segregated Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {menuGroups.map((group, groupIdx) => {
            // Super Admin only sees Super Admin Portal (no store operational clutter)
            if (isSuperAdmin && group.label !== "Super Admin Portal") {
              return null;
            }

            // Merchants only see store operational menus (no Super Admin Portal)
            if (!isSuperAdmin && group.label === "Super Admin Portal") {
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

                    if (isCollapsed) {
                      return (
                        <div key={item.href} className="flex justify-center">
                          <Link
                            href={isAllowed ? item.href : "#"}
                            className={`flex items-center justify-center h-10 w-10 rounded-xl transition ${
                              isActive
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                : isAllowed
                                  ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                  : "text-slate-300 cursor-not-allowed opacity-60"
                            }`}
                            title={
                              !isAllowed
                                ? `${item.title} (Akses Dibatasi)`
                                : item.title
                            }
                          >
                            <Icon
                              className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-slate-600"}`}
                            />
                          </Link>
                        </div>
                      );
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
                          <span className="truncate">{item.title}</span>
                        </div>

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
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Support Prioritas WA 24/7 (Only for Merchants) */}
        {!isCollapsed && !isSuperAdmin && (
          <div className="p-3">
            <a
              href="https://wa.me/6285292677431?text=Halo%20ZII%20POS%20Support%2C%20saya%20merchant%20ingin%20konsultasi%20fitur..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition shadow-2xs group"
            >
              <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg
                  className="h-4 w-4 fill-current text-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
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

        {/* Sidebar Footer / Logout */}
        <footer className="border-t border-slate-200 p-3 space-y-2 bg-white">
          <Button
            variant="outline"
            onClick={() => setIsLogoutModalOpen(true)}
            className={`flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer ${
              isCollapsed
                ? "h-10 w-10 p-0 mx-auto"
                : "w-full py-2.5 px-3 justify-start space-x-2.5"
            }`}
            title="Keluar Akun"
          >
            <LogOut className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-rose-600" />
            {!isCollapsed && <span>Keluar Akun</span>}
          </Button>
        </footer>
      </aside>

      {/* Confirmation Modal Sebelum Keluar Akun */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirmLogout={logout}
      />
    </>
  );
}
