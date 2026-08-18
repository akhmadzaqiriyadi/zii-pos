"use client";

import {
  AlertCircle,
  Edit2,
  Eye,
  Loader2,
  Package,
  Plus,
  Search,
  Trash2,
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
import { formatRupiah } from "../../../lib/utils";
import { useHasPermission } from "../../auth/hooks/useHasPermission";
import { useProductsDashboard } from "../hooks/useProductsDashboard";
import { ProductDeleteModal } from "./ProductDeleteModal";
import { ProductFormModal } from "./ProductFormModal";

export function ProductManagement() {
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

  // Dynamic RBAC Permission Checks
  const canCreate = useHasPermission("products:create");
  const canUpdate = useHasPermission("products:update");
  const canDelete = useHasPermission("products:delete");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Manajemen Produk & Jasa
            </h1>
            <Badge variant="blue" className="text-[10px] font-bold uppercase">
              Katalog Toko
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola katalog barang, jasa, stok, dan harga toko kamu.
          </p>
        </div>

        {canCreate && (
          <Button
            onClick={handleOpenAddModal}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-5 rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Produk Baru</span>
          </Button>
        )}
      </header>

      {/* Main Table Card */}
      <Card className="p-4 sm:p-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <CardContent className="p-0 space-y-5">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nama produk / jasa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 text-sm focus:bg-white"
              />
            </div>

            {/* Filter Pills */}
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

          <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="font-extrabold text-slate-700 text-xs py-3.5">
                    Nama Produk / Jasa
                  </TableHead>
                  <TableHead className="font-extrabold text-slate-700 text-xs py-3.5">
                    Tipe
                  </TableHead>
                  <TableHead className="font-extrabold text-slate-700 text-xs py-3.5">
                    Harga Jual
                  </TableHead>
                  <TableHead className="font-extrabold text-slate-700 text-xs py-3.5">
                    Stok
                  </TableHead>
                  {(canUpdate || canDelete) && (
                    <TableHead className="font-extrabold text-slate-700 text-xs py-3.5 text-right">
                      Aksi
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={canUpdate || canDelete ? 5 : 4}
                      className="py-12 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                        <span className="text-xs font-medium">
                          Memuat data produk...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={canUpdate || canDelete ? 5 : 4}
                      className="py-12 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                        <Package className="h-8 w-8 text-slate-300" />
                        <p className="text-sm font-bold text-slate-700">
                          Tidak ada produk yang sesuai filter.
                        </p>
                        <p className="text-xs text-slate-400">
                          Coba ubah kata kunci pencarian atau kategori filter di
                          atas.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((item) => {
                    const isLowStock = !item.isService && item.stock <= 5;
                    return (
                      <TableRow
                        key={item.id}
                        className={`hover:bg-slate-50/80 transition-colors border-b border-slate-100 ${
                          isLowStock ? "bg-rose-50/30" : ""
                        }`}
                      >
                        <TableCell className="font-bold text-slate-900 text-sm py-3.5">
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

                        <TableCell className="py-3.5">
                          <Badge variant={item.isService ? "amber" : "blue"}>
                            {item.isService ? "JASA" : "RETAIL"}
                          </Badge>
                        </TableCell>

                        <TableCell
                          className={`font-extrabold text-sm py-3.5 ${
                            isLowStock ? "text-rose-700" : "text-slate-900"
                          }`}
                        >
                          {formatRupiah(item.price)}
                        </TableCell>

                        <TableCell className="text-xs py-3.5">
                          {item.isService ? (
                            <span className="text-slate-400 font-medium">
                              -
                            </span>
                          ) : (
                            <span
                              className={
                                isLowStock
                                  ? "font-extrabold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 inline-block text-xs"
                                  : "text-slate-700 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 inline-block text-xs"
                              }
                            >
                              {item.stock} unit
                            </span>
                          )}
                        </TableCell>

                        {(canUpdate || canDelete) && (
                          <TableCell className="text-right py-3.5">
                            <div className="flex items-center justify-end gap-1.5">
                              {canUpdate && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenEditModal(item)}
                                  className="h-8 px-2.5 rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 gap-1.5 text-xs font-bold cursor-pointer shadow-2xs transition"
                                  title="Edit Detail & Harga Produk"
                                >
                                  <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                                  <span>Edit</span>
                                </Button>
                              )}

                              {canDelete && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteProduct(item)}
                                  className="h-8 px-2.5 rounded-xl border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-rose-600 gap-1.5 text-xs font-bold cursor-pointer shadow-2xs transition"
                                  title="Hapus Produk dari Katalog"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Hapus</span>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          <footer className="pt-2">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalCount}
              onPageChange={setPage}
              itemLabel="produk"
            />
          </footer>
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
    </div>
  );
}
