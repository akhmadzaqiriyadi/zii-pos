"use client";

import type { Product } from "@zii/types";
import { AlertCircle, Package, Plus, Search } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Pagination } from "../../../components/ui/pagination";
import { formatRupiah } from "../../../lib/utils";
import { ProductCard } from "./ProductCard";

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
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
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
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
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
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
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
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={onAddToCart}
            />
          ))}
        </section>
      )}

      {/* Pagination Controls */}
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
