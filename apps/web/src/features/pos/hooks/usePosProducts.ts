"use client";

import { useQuery } from "@tanstack/react-query";
import type { Product } from "@zii/types";
import { PosApiService } from "../services/posApi";

export function usePosProducts(search = "", filterType = "all") {
  const query = useQuery<Product[]>({
    queryKey: ["products", search, filterType],
    queryFn: () => PosApiService.getProducts(search, filterType),
  });

  const rawData = query.data;
  const rawProducts: Product[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray((rawData as any)?.data)
      ? (rawData as any).data
      : [];

  const filteredProducts = rawProducts.filter((product) => {
    // Search filter
    const matchesSearch =
      !search || product.name.toLowerCase().includes(search.toLowerCase());

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
    totalCount: filteredProducts.length,
  };
}
