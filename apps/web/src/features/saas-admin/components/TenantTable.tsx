"use client";

import { Loader2, Search } from "lucide-react";
import React from "react";
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
}

const statusFilterOptions = [
  { id: "all", label: "Semua Status" },
  { id: "active", label: "Active" },
  { id: "trial", label: "Trial" },
  { id: "suspended", label: "Suspended" },
  { id: "expired", label: "Expired" },
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
}: TenantTableProps) {
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
            {statusFilterOptions.map((f) => {
              const isActive = statusFilter === f.id;
              return (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => onStatusFilterChange(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </fieldset>
        </header>

        {/* Merchant Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-slate-700">
                  Toko & Subdomain
                </TableHead>
                <TableHead className="font-bold text-slate-700">
                  Paket Langganan
                </TableHead>
                <TableHead className="font-bold text-slate-700">
                  Status
                </TableHead>
                <TableHead className="font-bold text-slate-700">
                  User / Produk / Trx
                </TableHead>
                <TableHead className="font-bold text-slate-700">
                  Terdaftar
                </TableHead>
                <TableHead className="font-bold text-slate-700 text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                      <span className="text-xs font-medium">
                        Memuat data merchant...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : tenants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-slate-400"
                  >
                    <p className="text-sm font-medium text-slate-600">
                      Tidak ada merchant yang sesuai filter.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map((tenant) => (
                  <TenantTableRow
                    key={tenant.id}
                    tenant={tenant}
                    onOpenStatusModal={onOpenStatusModal}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500">
            Menampilkan{" "}
            <span className="font-bold text-slate-700">
              {tenants.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0} -{" "}
              {Math.min(meta.page * meta.limit, meta.totalItems)}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-slate-700">{meta.totalItems}</span>{" "}
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
