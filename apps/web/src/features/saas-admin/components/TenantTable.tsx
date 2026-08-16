"use client";

import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Loader2,
  Package,
  Search,
  Settings2,
  ShieldAlert,
  ShoppingCart,
  Users,
} from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Pagination } from "../../../components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import type { MerchantTenant } from "../services/saasAdminApi";

interface TenantTableProps {
  tenants: MerchantTenant[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  isLoading: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onPageChange: (page: number) => void;
  onOpenStatusModal: (tenant: MerchantTenant) => void;
}

export function TenantTable({
  tenants,
  meta,
  isLoading,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onPageChange,
  onOpenStatusModal,
}: TenantTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ACTIVE
          </span>
        );
      case "trial":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
            TRIAL
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
            SUSPENDED
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            EXPIRED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            {status.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <Card className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-white">
      <CardContent className="p-0 space-y-5">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama toko / subdomain..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
          </div>

          {/* Filter Status Pills */}
          <fieldset className="flex flex-wrap items-center gap-1.5 border-0 p-0 m-0">
            {[
              { id: "all", label: "Semua Status" },
              { id: "active", label: "Active" },
              { id: "trial", label: "Trial" },
              { id: "suspended", label: "Suspended" },
              { id: "expired", label: "Expired" },
            ].map((f) => {
              const isActive = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onStatusFilterChange(f.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </fieldset>
        </header>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Toko / Merchant</TableHead>
              <TableHead>Subdomain Usaha</TableHead>
              <TableHead>Paket SaaS</TableHead>
              <TableHead>Statistik Toko</TableHead>
              <TableHead>Status Lisensi</TableHead>
              <TableHead className="text-right">Kontrol Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    <span>Memuat data merchant SaaS...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : tenants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-slate-400"
                >
                  Tidak ada merchant yang sesuai dengan kriteria pencarian.
                </TableCell>
              </TableRow>
            ) : (
              tenants.map((t) => (
                <TableRow key={t.id} className="hover:bg-slate-50/60">
                  <TableCell className="font-semibold text-slate-900">
                    <div className="space-y-0.5">
                      <p className="text-sm font-extrabold text-slate-900">
                        {t.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-normal">
                        {t.phone || "No HP tidak diatur"} • {t.address || "Alamat tidak diatur"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-flex">
                      <Globe className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{t.subdomain ? `${t.subdomain}.ziipos.com` : "ziipos.com"}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {t.subscription ? (
                      <div className="space-y-1">
                        <Badge variant="emerald" className="capitalize text-[11px]">
                          {t.subscription.planName}
                        </Badge>
                        <p className="text-[10px] text-slate-400">
                          s/d {new Date(t.subscription.expiresAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    ) : (
                      <Badge variant="slate" className="text-[10px]">
                        Gratis Trial
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1" title="Jumlah User Kasir">
                        <Users className="h-3.5 w-3.5 text-slate-400" /> {t.totalUsers}
                      </span>
                      <span className="flex items-center gap-1" title="Jumlah Produk">
                        <Package className="h-3.5 w-3.5 text-slate-400" /> {t.totalProducts}
                      </span>
                      <span className="flex items-center gap-1" title="Jumlah Transaksi">
                        <ShoppingCart className="h-3.5 w-3.5 text-slate-400" /> {t.totalTransactions}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{getStatusBadge(t.status)}</TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenStatusModal(t)}
                      className="text-xs font-semibold border-slate-200 hover:bg-slate-100 gap-1.5 rounded-xl cursor-pointer"
                    >
                      <Settings2 className="h-3.5 w-3.5 text-slate-500" />
                      <span>Ubah Status</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.totalItems}
          onPageChange={onPageChange}
          itemLabel="merchant"
        />
      </CardContent>
    </Card>
  );
}
