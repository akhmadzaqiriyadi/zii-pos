"use client";

import type { Product } from "@zii/types";
import { Package, Save } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { useProductForm } from "../hooks/useProductForm";

import { ProductTypeSelector } from "./ProductTypeSelector";

interface ProductFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productToEdit?: Product | null;
  onSuccess?: () => void;
}

export function ProductFormModal({
  isOpen,
  onOpenChange,
  productToEdit,
  onSuccess,
}: ProductFormModalProps) {
  const {
    onSubmit,
    isEditing,
    isService,
    isPending,
    setValue,
    register,
    errors,
  } = useProductForm(productToEdit, onSuccess, onOpenChange);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600" />
            <span>
              {isEditing ? "Edit Detail Produk" : "Tambah Produk Baru"}
            </span>
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Isi formulir data produk atau jasa untuk dimasukkan ke sistem POS.
          </p>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Tipe Produk Selector */}
          <ProductTypeSelector
            isService={isService}
            onSelectType={(val) => setValue("isService", val)}
          />

          {/* Nama Produk */}
          <div className="space-y-1">
            <label
              htmlFor="product-name"
              className="text-xs font-semibold text-slate-700 block"
            >
              Nama Produk / Jasa
            </label>
            <Input
              id="product-name"
              placeholder="Contoh: Kaos Polos / Jasa Cuci Sepatu"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[11px] text-red-500 font-medium mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Harga */}
          <div className="space-y-1">
            <label
              htmlFor="product-price"
              className="text-xs font-semibold text-slate-700 block"
            >
              Harga Jual (Rp)
            </label>
            <Input
              id="product-price"
              type="number"
              placeholder="50000"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-[11px] text-red-500 font-medium mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Stok Barang (jika bukan Jasa) */}
          {!isService && (
            <div className="space-y-1">
              <label
                htmlFor="product-stock"
                className="text-xs font-semibold text-slate-700 block"
              >
                Jumlah Stok Barang
              </label>
              <Input
                id="product-stock"
                type="number"
                placeholder="10"
                {...register("stock", { valueAsNumber: true })}
              />
              {errors.stock && (
                <p className="text-[11px] text-red-500 font-medium mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>
          )}

          {/* Tombol Simpan */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full gap-2 py-5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Save className="h-4 w-4" />
              <span>
                {isPending
                  ? "Menyimpan..."
                  : isEditing
                    ? "Update Produk"
                    : "Simpan Produk Baru"}
              </span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
