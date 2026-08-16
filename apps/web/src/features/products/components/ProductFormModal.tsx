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
import { FormError, FormGroup, FormLabel } from "../../../components/ui/form";
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
          <FormGroup>
            <FormLabel htmlFor="product-name" required>
              Nama Produk / Jasa
            </FormLabel>
            <Input
              id="product-name"
              placeholder="Contoh: Kaos Polos / Jasa Cuci Sepatu"
              {...register("name")}
            />
            <FormError message={errors.name?.message} />
          </FormGroup>

          {/* Harga */}
          <FormGroup>
            <FormLabel htmlFor="product-price" required>
              Harga Jual (Rp)
            </FormLabel>
            <Input
              id="product-price"
              type="number"
              placeholder="50000"
              {...register("price", { valueAsNumber: true })}
            />
            <FormError message={errors.price?.message} />
          </FormGroup>

          {/* Stok Barang (jika bukan Jasa) */}
          {!isService && (
            <FormGroup>
              <FormLabel htmlFor="product-stock" required>
                Jumlah Stok Barang
              </FormLabel>
              <Input
                id="product-stock"
                type="number"
                placeholder="10"
                {...register("stock", { valueAsNumber: true })}
              />
              <FormError message={errors.stock?.message} />
            </FormGroup>
          )}

          {/* Tombol Simpan */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full gap-2 py-5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
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
