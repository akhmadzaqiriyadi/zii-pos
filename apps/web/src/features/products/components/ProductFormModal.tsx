"use client";

import { Package, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { useProductMutations } from "../hooks/useProductMutations";

interface ProductFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProductFormModal({
  isOpen,
  onOpenChange,
  onSuccess,
}: ProductFormModalProps) {
  const [name, setName] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [stockInput, setStockInput] = useState("10");
  const [isService, setIsService] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { createMutation } = useProductMutations();

  useEffect(() => {
    if (isOpen) {
      setName("");
      setPriceInput("");
      setStockInput("10");
      setIsService(false);
      setErrorMsg("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg("Nama produk wajib diisi.");
      return;
    }

    const price = Number(priceInput);
    if (Number.isNaN(price) || price < 0) {
      setErrorMsg("Harga produk tidak valid.");
      return;
    }

    const stock = isService ? 999 : Number(stockInput) || 0;

    const payload = {
      name: name.trim(),
      price,
      stock,
      isService,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
        if (onSuccess) onSuccess();
      },
    });
  };

  const isPending = createMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600" />
            <span>Tambah Produk Baru</span>
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Isi formulir data produk atau jasa untuk dimasukkan ke sistem POS.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Tipe Produk Selector */}
          <div>
            <span className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Tipe Katalog
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsService(false)}
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
                onClick={() => setIsService(true)}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              required
            />
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
                value={stockInput}
                onChange={(e) => setStockInput(e.target.value)}
                required
              />
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
              <span>{isPending ? "Menyimpan..." : "Simpan Produk Baru"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
