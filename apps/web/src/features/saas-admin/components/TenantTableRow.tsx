import {
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
  return (
    <TableRow className="hover:bg-slate-50/70 transition">
      {/* Merchant / Store */}
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-extrabold text-slate-700 border border-slate-200">
            {tenant.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">
              {tenant.name}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
              <Globe className="h-3 w-3 text-slate-400" />
              <span>
                {tenant.subdomain
                  ? `${tenant.subdomain}.ziipos.id`
                  : "Belum set subdomain"}
              </span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* Subscription Plan */}
      <TableCell>
        {tenant.subscription ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Badge variant="blue" className="text-[10px] uppercase font-bold">
                {tenant.subscription.planCode}
              </Badge>
              <span className="text-xs font-semibold text-slate-800">
                {tenant.subscription.planName}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Expired:{" "}
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
          <span className="text-xs text-slate-400 italic">Belum ada paket</span>
        )}
      </TableCell>

      {/* Status */}
      <TableCell>
        <TenantStatusBadge status={tenant.status} />
      </TableCell>

      {/* Usage Metrics */}
      <TableCell>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <div
            className="flex items-center gap-1"
            title={`Total Kasir: ${tenant.totalUsers}`}
          >
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>{tenant.totalUsers}</span>
          </div>
          <div
            className="flex items-center gap-1"
            title={`Total Produk: ${tenant.totalProducts}`}
          >
            <Package className="h-3.5 w-3.5 text-slate-400" />
            <span>{tenant.totalProducts}</span>
          </div>
          <div
            className="flex items-center gap-1"
            title={`Total Transaksi: ${tenant.totalTransactions}`}
          >
            <ShoppingCart className="h-3.5 w-3.5 text-slate-400" />
            <span>{tenant.totalTransactions}</span>
          </div>
        </div>
      </TableCell>

      {/* Registered Date */}
      <TableCell className="text-xs text-slate-500">
        {new Date(tenant.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenDetailModal(tenant)}
            className="rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs"
            title="Lihat Detail Lengkap Merchant"
          >
            <Eye className="h-3.5 w-3.5 text-slate-500" />
            <span>Detail</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenStatusModal(tenant)}
            className="rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs"
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
