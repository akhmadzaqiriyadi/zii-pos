"use client";

import { useQuery } from "@tanstack/react-query";
import type { Product } from "@zii/types";
import { PosApiService } from "../services/posApi";

export function usePosProducts(search = "", filterType = "all") {
  const query = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => PosApiService.getProducts(),
  });

  const rawProducts = query.data ?? [];

  const filteredProducts = rawProducts.filter((product) => {
    // Search filter
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Type filter
    if (filterType === "retail") return !product.isService;
    if (filterType === "service") return product.isService;
    if (filterType === "lowStock")
      return !product.isService && product.stock <= 5;

    return true;
  });

  return {
    ...query,
    products: filteredProducts,
    totalCount: rawProducts.length,
  };
}
