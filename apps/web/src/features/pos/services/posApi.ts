import type { CreateTransactionInput, Product, Transaction } from "@zii/types";
import { fetchApi } from "../../../lib/api-client";

export class PosApiService {
  static async getProducts(): Promise<Product[]> {
    return await fetchApi<Product[]>("/api/v1/products");
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
