import type { Transaction } from "@zii/types";
import { fetchApi } from "../../../lib/api-client";

export interface TransactionFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  status?: string;
}

export interface PaginatedTransactionsResponse {
  data: Transaction[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class TransactionApiService {
  static async getTransactions(
    params: TransactionFilterParams = {},
  ): Promise<PaginatedTransactionsResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.search) query.append("search", params.search);
    if (params.startDate) query.append("startDate", params.startDate);
    if (params.endDate) query.append("endDate", params.endDate);
    if (params.paymentMethod && params.paymentMethod !== "all") {
      query.append("paymentMethod", params.paymentMethod);
    }
    if (params.status && params.status !== "all") {
      query.append("status", params.status);
    }

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return await fetchApi<PaginatedTransactionsResponse>(
      `/api/v1/transactions${queryString}`,
    );
  }
}
