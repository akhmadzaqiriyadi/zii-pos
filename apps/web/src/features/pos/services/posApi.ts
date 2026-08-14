import type { CreateTransactionInput, Product, Transaction } from "@zii/types";
import { fetchApi } from "../../../lib/api-client";

export class PosApiService {
  static async getProducts(
    search?: string,
    filterType?: string,
  ): Promise<Product[]> {
    const query = new URLSearchParams();
    if (search) query.append("search", search);
    if (filterType && filterType !== "all") {
      if (filterType === "retail") query.append("isService", "false");
      if (filterType === "service") query.append("isService", "true");
      if (filterType === "lowStock") query.append("lowStock", "true");
    }
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return await fetchApi<Product[]>(`/api/v1/products${queryString}`);
  }

  static async createTransaction(
    input: CreateTransactionInput,
  ): Promise<Transaction> {
    return await fetchApi<Transaction>("/api/v1/transactions", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }
}
