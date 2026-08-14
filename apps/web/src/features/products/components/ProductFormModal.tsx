"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Product } from "@zii/types";
import { Package, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { useProductMutations } from "../hooks/useProductMutations";

const productSchema = z.object({
  name: z.string().min(2, { message: "Nama produk minimal 2 karakter." }),
  price: z
    .number({ message: "Harga harus berupa angka." })
    .min(0, { message: "Harga produk tidak boleh negatif." }),
  stock: z
    .number({ message: "Stok harus berupa angka." })
    .min(0, { message: "Stok tidak boleh negatif." }),
  isService: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

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
  const isEditing = !!productToEdit;
  const { createMutation, updateMutation } = useProductMutations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 10,
      isService: false,
    },
  });

  const isService = watch("isService");

  useEffect(() => {
    if (productToEdit) {
      reset({
        name: productToEdit.name,
        price: Number(productToEdit.price),
        stock: productToEdit.stock,
        isService: productToEdit.isService,
      });
    } else {
      reset({
        name: "",
        price: 0,
        stock: 10,
        isService: false,
      });
    }
  }, [productToEdit, reset]);

  const onSubmit = (data: ProductFormData) => {
    const payload = {
      name: data.name.trim(),
      price: data.price,
      stock: data.isService ? 999 : data.stock,
      isService: data.isService,
    };

    if (isEditing && productToEdit) {
      updateMutation.mutate(
        { id: productToEdit.id, data: payload },
        {
          onSuccess: () => {
            onOpenChange(false);
            if (onSuccess) onSuccess();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tipe Produk Selector */}
          <div>
            <span className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Tipe Katalog
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue("isService", false)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  !isService
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                📦 Barang Retail
              </button>
              <button
                type="button"
                onClick={() => setValue("isService", true)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  isService
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                ✂️ Jasa / Service
              </button>
            </div>
          </div>

          {/* Nama Produk */}
          <div>
            <label
              htmlFor="product-name"
              className="text-xs font-semibold text-slate-700 mb-1 block"
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
          <div>
            <label
              htmlFor="product-price"
              className="text-xs font-semibold text-slate-700 mb-1 block"
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
            <div>
              <label
                htmlFor="product-stock"
                className="text-xs font-semibold text-slate-700 mb-1 block"
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
