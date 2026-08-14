import type { Product } from "@zii/types";
import { fetchApi } from "../../../lib/api-client";

export interface CreateProductPayload {
  name: string;
  price: number;
  stock: number;
  isService?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  price?: number;
  stock?: number;
  isService?: boolean;
}

export class ProductApiService {
  static async createProduct(data: CreateProductPayload): Promise<Product> {
    return await fetchApi<Product>("/api/v1/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateProduct(
    id: string,
    data: UpdateProductPayload,
  ): Promise<Product> {
    return await fetchApi<Product>(`/api/v1/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteProduct(id: string): Promise<{ success: boolean }> {
    return await fetchApi<{ success: boolean }>(`/api/v1/products/${id}`, {
      method: "DELETE",
    });
  }
}
