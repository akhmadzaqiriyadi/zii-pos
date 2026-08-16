"use client";

import type { Product } from "@zii/types";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

interface ProductDeleteModalProps {
  productToDelete: Product | null;
  onClose: () => void;
  onConfirmDelete: () => void;
  isPending: boolean;
}

export function ProductDeleteModal({
  productToDelete,
  onClose,
  onConfirmDelete,
  isPending,
}: ProductDeleteModalProps) {
  return (
    <Dialog
      open={!!productToDelete}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-rose-600" />
            <span>Hapus Produk</span>
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-slate-600">
          Apakah Anda yakin ingin menghapus produk{" "}
          <strong className="text-slate-900">{productToDelete?.name}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="text-xs">
            Batal
          </Button>
          <Button
            onClick={onConfirmDelete}
            disabled={isPending}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <span>Ya, Hapus Produk</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
