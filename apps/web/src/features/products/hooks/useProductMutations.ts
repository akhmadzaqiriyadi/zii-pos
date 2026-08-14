"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import {
  type CreateProductPayload,
  ProductApiService,
  type UpdateProductPayload,
} from "../services/productApi";

export function useProductMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateProductPayload) =>
      ProductApiService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk baru berhasil ditambahkan!");
    },
    onError: (err: unknown) => {
      toast.error(parseApiErrorMessage(err, "Gagal menambah produk baru."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductPayload }) =>
      ProductApiService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Detail produk berhasil diupdate!");
    },
    onError: (err: unknown) => {
      toast.error(parseApiErrorMessage(err, "Gagal memperbarui produk."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductApiService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil dihapus!");
    },
    onError: (err: unknown) => {
      toast.error(parseApiErrorMessage(err, "Gagal menghapus produk."));
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
