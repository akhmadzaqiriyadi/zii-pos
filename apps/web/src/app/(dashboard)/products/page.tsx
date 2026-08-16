"use client";

import {
  AlertCircle,
  Edit2,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
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
import { ProductDeleteModal } from "../../../features/products/components/ProductDeleteModal";
import { ProductFormModal } from "../../../features/products/components/ProductFormModal";
import { useProductsDashboard } from "../../../features/products/hooks/useProductsDashboard";
import { formatRupiah } from "../../../lib/utils";

export default function ProductsPage() {
  const {
    search,
    setSearch,
    filterType,
    setFilterType,
    page,
    setPage,
    totalPages,
    isFormModalOpen,
    setIsFormModalOpen,
    selectedProduct,
    productToDelete,
    setProductToDelete,
    products,
    totalCount,
    isLoading,
    deleteMutation,
    handleOpenAddModal,
    handleOpenEditModal,
    handleDeleteProduct,
    confirmDelete,
    refetch,
  } = useProductsDashboard();

  return (
    <DashboardLayout requiredRole="owner">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-5 rounded-xl shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Produk Baru</span>
          </Button>
        </header>

        <Card className="p-4 sm:p-6 rounded-2xl border border-slate-200">
          <CardContent className="p-0 space-y-5">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari nama produk / jasa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 rounded-xl"
                />
              </div>

              {/* Filter Buttons including Low Stock Filter */}
              <fieldset className="flex flex-wrap items-center gap-1.5 border-0 p-0 m-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterType("all")}
                  className={`px-3.5 py-1.5 h-auto rounded-xl text-xs font-semibold transition cursor-pointer ${
                    filterType === "all"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Semua ({totalCount})
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterType("retail")}
                  className={`px-3.5 py-1.5 h-auto rounded-xl text-xs font-semibold transition cursor-pointer ${
                    filterType === "retail"
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Retail
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterType("service")}
                  className={`px-3.5 py-1.5 h-auto rounded-xl text-xs font-semibold transition cursor-pointer ${
                    filterType === "service"
                      ? "bg-amber-600 text-white hover:bg-amber-700 shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Jasa
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterType("lowStock")}
                  className={`px-3.5 py-1.5 h-auto rounded-xl text-xs font-semibold transition cursor-pointer ${
                    filterType === "lowStock"
                      ? "bg-rose-600 text-white hover:bg-rose-700 shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Stok Menipis
                </Button>
              </fieldset>
            </header>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Produk</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-slate-400"
                    >
                      Memuat data produk...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-slate-400"
                    >
                      Tidak ada produk yang sesuai.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((item) => {
                    const isLowStock = !item.isService && item.stock <= 5;
                    return (
                      <TableRow
                        key={item.id}
                        className={
                          isLowStock ? "bg-rose-50/40 hover:bg-rose-50/70" : ""
                        }
                      >
                        <TableCell className="font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            <span>{item.name}</span>
                            {isLowStock && (
                              <span className="flex items-center gap-1 text-[10px] bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full border border-rose-200">
                                <AlertCircle className="h-3 w-3 text-rose-600" />
                                Stok Menipis
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.isService ? "amber" : "blue"}>
                            {item.isService ? "JASA" : "RETAIL"}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`font-bold ${
                            isLowStock ? "text-rose-700" : "text-slate-900"
                          }`}
                        >
                          {formatRupiah(item.price)}
                        </TableCell>
                        <TableCell className="text-xs">
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
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalCount}
              onPageChange={setPage}
              itemLabel="produk"
            />
          </CardContent>
        </Card>

        {/* Modal Form Tambah & Edit Produk */}
        <ProductFormModal
          isOpen={isFormModalOpen}
          onOpenChange={setIsFormModalOpen}
          productToEdit={selectedProduct}
          onSuccess={() => refetch()}
        />

        {/* Modal Konfirmasi Hapus Produk */}
        <ProductDeleteModal
          productToDelete={productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirmDelete={confirmDelete}
          isPending={deleteMutation.isPending}
        />
      </main>
    </DashboardLayout>
  );
}
