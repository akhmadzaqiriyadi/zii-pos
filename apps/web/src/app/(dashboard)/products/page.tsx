"use client";

import type { Product } from "@zii/types";
import { AlertCircle, Edit2, Plus, Search } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { usePosProducts } from "../../../features/pos/hooks/usePosProducts";
import { ProductFormModal } from "../../../features/products/components/ProductFormModal";
import { formatRupiah } from "../../../lib/utils";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { products, totalCount, isLoading, refetch } = usePosProducts(
    search,
    filterType,
  );

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout requiredRole="owner">
      <main className="p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Manajemen Produk & Jasa
            </h1>
            <p className="text-sm text-slate-500">
              Kelola katalog barang, jasa, stok, dan harga toko kamu.
            </p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Produk Baru</span>
          </Button>
        </div>

        <Card className="p-6 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nama produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filter Buttons including Low Stock Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filterType === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Semua ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("retail")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filterType === "retail"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Retail
              </button>
              <button
                type="button"
                onClick={() => setFilterType("service")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filterType === "service"
                    ? "bg-amber-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Jasa
              </button>
              <button
                type="button"
                onClick={() => setFilterType("lowStock")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filterType === "lowStock"
                    ? "bg-rose-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Stok Menipis
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama Produk</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Stok</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Memuat data produk...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Tidak ada produk yang sesuai.
                    </td>
                  </tr>
                ) : (
                  products.map((item) => {
                    const isLowStock = !item.isService && item.stock <= 5;
                    return (
                      <tr
                        key={item.id}
                        className={`transition ${
                          isLowStock
                            ? "bg-rose-50/40 hover:bg-rose-50/70"
                            : "hover:bg-slate-50/50"
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            <span>{item.name}</span>
                            {isLowStock && (
                              <span className="flex items-center gap-1 text-[10px] bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full border border-rose-200">
                                <AlertCircle className="h-3 w-3 text-rose-600" />
                                Stok Menipis
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={item.isService ? "amber" : "blue"}>
                            {item.isService ? "JASA" : "RETAIL"}
                          </Badge>
                        </td>
                        <td
                          className={`px-4 py-3 font-bold ${
                            isLowStock ? "text-rose-700" : "text-slate-900"
                          }`}
                        >
                          {formatRupiah(item.price)}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {item.isService ? (
                            <span className="text-slate-400">-</span>
                          ) : (
                            <span
                              className={
                                isLowStock
                                  ? "font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200 inline-block"
                                  : "text-slate-600 font-semibold"
                              }
                            >
                              {item.stock}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(item)}
                            className="text-xs text-slate-600 hover:text-emerald-600 gap-1"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal Form Tambah & Edit Produk */}
        <ProductFormModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          productToEdit={selectedProduct}
          onSuccess={() => refetch()}
        />
      </main>
    </DashboardLayout>
  );
}
