import {
  ExternalLink,
  Eye,
  Globe,
  Package,
  Settings2,
  ShoppingCart,
  Users,
} from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { TableCell, TableRow } from "../../../components/ui/table";
import type { MerchantTenant } from "../services/saasAdminApi";
import { TenantStatusBadge } from "./TenantStatusBadge";

interface TenantTableRowProps {
  tenant: MerchantTenant;
  onOpenStatusModal: (tenant: MerchantTenant) => void;
  onOpenDetailModal: (tenant: MerchantTenant) => void;
}

export function TenantTableRow({
  tenant,
  onOpenStatusModal,
  onOpenDetailModal,
}: TenantTableRowProps) {
  const storeSubdomain = tenant.subdomain
    ? `${tenant.subdomain}.ziipos.id`
    : null;

  return (
    <TableRow className="hover:bg-slate-50/80 transition-colors duration-150 border-b border-slate-100">
      {/* 1. Merchant / Store Brand & Subdomain */}
      <TableCell className="py-3.5">
        <div className="flex items-center gap-3">
          {tenant.logoUrl ? (
            <img
              src={tenant.logoUrl}
              alt={tenant.name}
              className="h-10 w-10 shrink-0 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-black text-slate-700 text-xs border border-slate-200">
              {tenant.name.substring(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <div className="font-extrabold text-slate-900 text-sm truncate max-w-[200px]">
              {tenant.name}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-0.5">
              <Globe className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate">
                {storeSubdomain || "Belum diatur"}
              </span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* 2. Subscription Plan */}
      <TableCell className="py-3.5">
        {tenant.subscription ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Badge
                variant={
                  tenant.subscription.planCode === "pro"
                    ? "emerald"
                    : tenant.subscription.planCode === "enterprise"
                      ? "purple"
                      : "blue"
                }
                className="text-[10px] uppercase font-black px-2 py-0.5"
              >
                {tenant.subscription.planCode}
              </Badge>
              <span className="text-xs font-bold text-slate-800 truncate">
                {tenant.subscription.planName}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Exp:{" "}
              {new Date(tenant.subscription.expiresAt).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )}
            </p>
          </div>
        ) : (
          <span className="text-xs font-medium text-slate-400 italic">
            Belum ada paket
          </span>
        )}
      </TableCell>

      {/* 3. Status Badge */}
      <TableCell className="py-3.5">
        <TenantStatusBadge status={tenant.status} />
      </TableCell>

      {/* 4. Usage Metrics */}
      <TableCell className="py-3.5">
        <div className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
          <div
            className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"
            title={`Total Kasir: ${tenant.totalUsers}`}
          >
            <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{tenant.totalUsers}</span>
          </div>
          <div
            className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"
            title={`Total Produk: ${tenant.totalProducts}`}
          >
            <Package className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{tenant.totalProducts}</span>
          </div>
          <div
            className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"
            title={`Total Transaksi: ${tenant.totalTransactions}`}
          >
            <ShoppingCart className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{tenant.totalTransactions}</span>
          </div>
        </div>
      </TableCell>

      {/* 5. Registered Date */}
      <TableCell className="py-3.5 text-xs font-medium text-slate-500">
        {new Date(tenant.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </TableCell>

      {/* 6. Action Buttons */}
      <TableCell className="py-3.5 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenDetailModal(tenant)}
            className="h-8 px-2.5 rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 gap-1.5 text-xs font-bold cursor-pointer shadow-2xs transition"
            title="Lihat Detail Lengkap Merchant"
          >
            <Eye className="h-3.5 w-3.5 text-slate-500" />
            <span>Detail</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenStatusModal(tenant)}
            className="h-8 px-2.5 rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 gap-1.5 text-xs font-bold cursor-pointer shadow-2xs transition"
            title="Ubah Status Lisensi Toko"
          >
            <Settings2 className="h-3.5 w-3.5 text-slate-500" />
            <span>Status</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
