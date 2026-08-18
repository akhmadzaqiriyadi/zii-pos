"use client";

import { PanelLeft, Printer, Store } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useHasPermission } from "../../features/auth/hooks/useHasPermission";
import { PrinterSettingsModal } from "../../features/pos/components/PrinterSettingsModal";
import { useThermalPrinter } from "../../features/pos/hooks/useThermalPrinter";
import { useTenant } from "../../features/tenant/hooks/useTenant";
import { RestrictedAccessView } from "../auth/RestrictedAccessView";
import { Badge } from "../ui/badge";
import { AppSidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: "owner" | "cashier";
  requiredPermission?: string | string[];
  defaultCollapsed?: boolean;
}

export function DashboardLayout({
  children,
  requiredRole,
  requiredPermission,
  defaultCollapsed = false,
}: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(defaultCollapsed);
  const { user } = useAuth();
  const { tenant } = useTenant();
  const printer = useThermalPrinter();

  const isSuperAdmin = useHasPermission("saas:admin", "*");
  const isOwner = useHasPermission("settings:manage", "roles:manage");
  const hasRequiredPermission = requiredPermission
    ? useHasPermission(
        ...(Array.isArray(requiredPermission)
          ? requiredPermission
          : [requiredPermission]),
      )
    : true;

  const isAuthorized =
    !requiredRole && !requiredPermission
      ? true
      : isSuperAdmin ||
        ((requiredRole === "owner" ? isOwner : true) && hasRequiredPermission);

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
                {tenant?.name || "ZII POS Store"}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">
                {tenant?.subdomain
                  ? `${tenant.subdomain}.ziipos.id`
                  : "Point of Sale White-Label CMS"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              type="button"
              onClick={() => printer.setIsSettingsOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition cursor-pointer"
              title="Klik untuk membuka Pengaturan Printer Thermal 58mm"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  printer.status === "connected"
                    ? "bg-emerald-500 animate-pulse"
                    : printer.status === "connecting"
                      ? "bg-amber-500 animate-pulse"
                      : "bg-slate-400"
                }`}
              />
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>
                {printer.status === "connected"
                  ? `Printer: ${printer.connectionType === "browser_driver" ? "58mm Ready" : "POS-V29DD"}`
                  : printer.status === "connecting"
                    ? "Connecting..."
                    : "Printer: Terputus"}
              </span>
            </button>

            <Badge
              variant="emerald"
              className="gap-1.5 py-1 text-xs font-semibold"
            >
              <Store className="h-3.5 w-3.5" />
              <span className="truncate max-w-[130px] sm:max-w-none">
                {user?.name || "Kasir Utama"} ({user?.role || "kasir"})
              </span>
            </Badge>
          </div>
        </header>

        {/* Content Body or Role Restricted View */}
        <div className="flex-1 overflow-y-auto min-w-0">
          {!isAuthorized ? (
            <RestrictedAccessView
              requiredRole={requiredRole}
              requiredPermission={requiredPermission}
            />
          ) : (
            children
          )}
        </div>

        {/* Real Thermal Printer Architecture Settings Modal */}
        <PrinterSettingsModal
          isOpen={printer.isSettingsOpen}
          onOpenChange={printer.setIsSettingsOpen}
          status={printer.status}
          connectionType={printer.connectionType}
          deviceName={printer.deviceName}
          onSetMode={printer.setPrinterMode}
          onConnectBluetooth={printer.connectBluetooth}
          onConnectUsb={printer.connectUsb}
          onDisconnect={printer.disconnectPrinter}
          onTestPrint={printer.testPrint}
        />
      </div>
    </div>
  );
}
