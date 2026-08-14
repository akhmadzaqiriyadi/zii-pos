"use client";

import type { Product } from "@zii/types";
import { useState } from "react";
import { usePosProducts } from "../../pos/hooks/usePosProducts";
import { useProductMutations } from "./useProductMutations";

export function useProductsDashboard() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { products, totalCount, isLoading, refetch } = usePosProducts(
    search,
    filterType,
  );

  const { deleteMutation } = useProductMutations();

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    deleteMutation.mutate(productToDelete.id, {
      onSuccess: () => {
        setProductToDelete(null);
        refetch();
      },
    });
  };

  return {
    search,
    setSearch,
    filterType,
    setFilterType,
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
  };
}
