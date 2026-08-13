import type { CreateTransactionInput, Product, Transaction } from "@zii/types";
import { fetchApi } from "../../../lib/api-client";

export class PosApiService {
  static async getProducts(): Promise<Product[]> {
    try {
      return await fetchApi<Product[]>("/api/v1/products");
    } catch {
      // Graceful fallback for demo
      return [
        {
          id: "p1",
          tenantId: "t1",
          name: "Kaos Polos Cotton 30s",
          price: 65000,
          stock: 45,
          isService: false,
          createdAt: new Date(),
        },
        {
          id: "p2",
          tenantId: "t1",
          name: "Kemeja Flanel Premium",
          price: 145000,
          stock: 20,
          isService: false,
          createdAt: new Date(),
        },
        {
          id: "p3",
          tenantId: "t1",
          name: "Jasa Potong & Styling",
          price: 40000,
          stock: 999,
          isService: true,
          createdAt: new Date(),
        },
        {
          id: "p4",
          tenantId: "t1",
          name: "Parfum Sepatu Premium 100ml",
          price: 35000,
          stock: 15,
          isService: false,
          createdAt: new Date(),
        },
      ];
    }
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
