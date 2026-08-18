"use client";

import { Filter, Loader2, RefreshCw, Search, Store, X } from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Pagination } from "../../../components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import type { MerchantTenant } from "../services/saasAdminApi";
import { TenantTableRow } from "./TenantTableRow";

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
  onOpenDetailModal: (tenant: MerchantTenant) => void;
}

const statusFilterOptions = [
  { value: "all", label: "Semua Status Toko" },
  { value: "active", label: "Active (Berlangganan)" },
  { value: "trial", label: "Trial (Uji Coba 14 Hari)" },
  { value: "suspended", label: "Suspended (Dibekukan)" },
  { value: "expired", label: "Expired (Habis Masa)" },
];

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
  onOpenDetailModal,
}: TenantTableProps) {
  return (
    <Card className="p-4 sm:p-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <CardContent className="p-0 space-y-5">
        {/* Controls Bar: Search & Status Filter Dropdown */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nama toko / subdomain..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-8 h-10 rounded-xl bg-slate-50 border-slate-200 text-sm focus:bg-white"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                  title="Hapus pencarian"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Radix UI Standard Select Component for Status Filter */}
            <div className="w-full sm:w-56">
              <Select
                value={statusFilter}
                onValueChange={(val) => onStatusFilterChange(val)}
              >
                <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <SelectValue placeholder="Pilih Filter Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                  {statusFilterOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs font-medium text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="slate" className="text-xs font-bold px-3 py-1">
              Total {meta.totalItems} Merchant
            </Badge>
          </div>
        </header>

        {/* Merchant Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-b border-slate-200">
                <TableHead className="font-extrabold text-slate-700 text-xs py-3.5">
                  Toko & Subdomain
                </TableHead>
                <TableHead className="font-extrabold text-slate-700 text-xs py-3.5">
                  Paket Langganan
                </TableHead>
                <TableHead className="font-extrabold text-slate-700 text-xs py-3.5">
                  Status Lisensi
                </TableHead>
                <TableHead className="font-extrabold text-slate-700 text-xs py-3.5">
                  Pengguna / Produk / Trx
                </TableHead>
                <TableHead className="font-extrabold text-slate-700 text-xs py-3.5">
                  Terdaftar
                </TableHead>
                <TableHead className="font-extrabold text-slate-700 text-xs py-3.5 text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-16 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
                      <span className="text-xs font-semibold text-slate-600">
                        Memuat data merchant toko...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : tenants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-16 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Store className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        Tidak ada merchant yang ditemukan
                      </p>
                      <p className="text-xs text-slate-400">
                        Coba ubah kata kunci pencarian atau ganti filter status
                        di atas.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map((tenant) => (
                  <TenantTableRow
                    key={tenant.id}
                    tenant={tenant}
                    onOpenStatusModal={onOpenStatusModal}
                    onOpenDetailModal={onOpenDetailModal}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs font-medium text-slate-500">
            Menampilkan{" "}
            <span className="font-extrabold text-slate-800">
              {tenants.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0} -{" "}
              {Math.min(meta.page * meta.limit, meta.totalItems)}
            </span>{" "}
            dari{" "}
            <span className="font-extrabold text-slate-800">
              {meta.totalItems}
            </span>{" "}
            toko terdaftar
          </p>

          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={onPageChange}
          />
        </footer>
      </CardContent>
    </Card>
  );
}
