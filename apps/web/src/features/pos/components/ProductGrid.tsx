"use client";

import type { Product } from "@zii/types";
import { AlertCircle, Package, Plus, Search } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Pagination } from "../../../components/ui/pagination";
import { formatRupiah } from "../../../lib/utils";

interface ProductGridProps {
  products: Product[];
  totalCount: number;
  search: string;
  filterType: string;
  page: number;
  totalPages: number;
  isLoading?: boolean;
  onSearchChange: (val: string) => void;
  onFilterTypeChange: (type: string) => void;
  onPageChange: (page: number) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({
  products,
  totalCount,
  search,
  filterType,
  page,
  totalPages,
  isLoading,
  onSearchChange,
  onFilterTypeChange,
  onPageChange,
  onAddToCart,
}: ProductGridProps) {
  return (
    <Card className="p-4 sm:p-6 lg:p-8 space-y-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs min-w-0">
      {/* Search Bar & Filter Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama produk / jasa..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 rounded-xl"
          />
        </div>

        {/* Filter Pills */}
        <fieldset className="flex flex-wrap items-center gap-2 border-0 p-0 m-0">
          <button
            type="button"
            onClick={() => onFilterTypeChange("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              filterType === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => onFilterTypeChange("retail")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              filterType === "retail"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Retail
          </button>
          <button
            type="button"
            onClick={() => onFilterTypeChange("service")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              filterType === "service"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Jasa
          </button>
          <button
            type="button"
            onClick={() => onFilterTypeChange("lowStock")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              filterType === "lowStock"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Stok Menipis
          </button>
        </fieldset>
      </header>

      {/* Grid Content / Loading */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-center text-slate-400 text-sm">
          <span>Memuat katalog produk kasir...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col h-64 items-center justify-center border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-8 text-center text-slate-500 space-y-2">
          <Package className="h-10 w-10 text-slate-300" />
          <p className="font-semibold text-slate-700">Produk Tidak Ditemukan</p>
          <p className="text-xs text-slate-400">
            Coba sesuaikan kata kunci pencarian atau filter kategori.
          </p>
        </div>
      ) : (
        /* Dynamic Container-based Grid: Min 210px per card */
        <section className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4 sm:gap-5">
          {products.map((prod) => {
            const isLowStock = !prod.isService && prod.stock <= 5;
            return (
              <button
                type="button"
                key={prod.id}
                onClick={() => onAddToCart(prod)}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-98 cursor-pointer min-h-[160px] min-w-0 ${
                  isLowStock
                    ? "border-2 border-rose-300 bg-rose-50/20 hover:border-rose-500 hover:shadow-rose-100/60"
                    : "border-slate-200/90 bg-white hover:border-emerald-500"
                }`}
              >
                <article className="w-full h-full flex flex-col justify-between">
                  <div>
                    <div className="mb-3.5 flex items-center justify-between gap-1.5 flex-wrap">
                      <Badge
                        variant={prod.isService ? "amber" : "blue"}
                        className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider"
                      >
                        {prod.isService ? "JASA" : "RETAIL"}
                      </Badge>
                      {!prod.isService && (
                        <span
                          className={`text-xs font-bold flex items-center gap-1 shrink-0 ${
                            isLowStock
                              ? "bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200"
                              : "bg-slate-100/80 text-slate-500 px-2.5 py-1 rounded-full"
                          }`}
                        >
                          {isLowStock && (
                            <AlertCircle className="h-3.5 w-3.5 inline text-rose-600 animate-pulse" />
                          )}
                          Stok: {prod.stock}
                        </span>
                      )}
                    </div>
                    <h3
                      className={`font-bold text-sm sm:text-base leading-snug tracking-tight mb-3.5 min-h-[40px] flex items-center transition ${
                        isLowStock
                          ? "text-slate-900 group-hover:text-rose-600"
                          : "text-slate-800 group-hover:text-emerald-600"
                      }`}
                    >
                      {prod.name}
                    </h3>
                  </div>
                  <footer className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span
                      className={`whitespace-nowrap shrink-0 text-sm sm:text-base font-extrabold ${
                        isLowStock ? "text-rose-700" : "text-slate-900"
                      }`}
                    >
                      {formatRupiah(prod.price)}
                    </span>
                    <span
                      className={`flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl transition shadow-xs ${
                        isLowStock
                          ? "bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white"
                          : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </footer>
                </article>
              </button>
            );
          })}
        </section>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalCount}
        onPageChange={onPageChange}
        itemLabel="produk"
      />
    </Card>
  );
}
