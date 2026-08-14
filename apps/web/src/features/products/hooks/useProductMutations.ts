"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@zii/types";
import { fetchApi } from "../../../lib/api-client";

export interface ProductFormInput {
  name: string;
  price: number;
  stock: number;
  isService: boolean;
}

export function useProductMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation<Product, Error, ProductFormInput>({
    mutationFn: async (data: ProductFormInput) => {
      return await fetchApi<Product>("/api/v1/products", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateMutation = useMutation<
    Product,
    Error,
    { id: string; data: ProductFormInput }
  >({
    mutationFn: async ({ id, data }) => {
      return await fetchApi<Product>(`/api/v1/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteMutation = useMutation<{ id: string }, Error, string>({
    mutationFn: async (id: string) => {
      return await fetchApi<{ id: string }>(`/api/v1/products/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
