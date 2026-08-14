"use client";

import { useQuery } from "@tanstack/react-query";
import type { Transaction } from "@zii/types";
import {
  type PaginatedTransactionsResponse,
  TransactionApiService,
  type TransactionFilterParams,
} from "../services/transactionApi";

export function useTransactions(params: TransactionFilterParams = {}) {
  const query = useQuery<PaginatedTransactionsResponse>({
    queryKey: ["transactions", params],
    queryFn: () => TransactionApiService.getTransactions(params),
  });

  const rawData = query.data;
  const transactions: Transaction[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray((rawData as any)?.data)
      ? (rawData as any).data
      : [];

  const meta = (rawData as any)?.meta ?? {
    page: 1,
    limit: 10,
    totalItems: transactions.length,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  // Calculate summary metrics
  const totalRevenue = transactions.reduce(
    (sum, t) => sum + Number(t.totalAmount || 0),
    0,
  );
  const cashTotal = transactions
    .filter((t) => t.paymentMethod === "cash")
    .reduce((sum, t) => sum + Number(t.totalAmount || 0), 0);
  const qrisTotal = transactions
    .filter((t) => t.paymentMethod === "qris")
    .reduce((sum, t) => sum + Number(t.totalAmount || 0), 0);
  const transferTotal = transactions
    .filter((t) => t.paymentMethod === "transfer")
    .reduce((sum, t) => sum + Number(t.totalAmount || 0), 0);

  return {
    ...query,
    transactions,
    meta,
    summary: {
      totalRevenue,
      cashTotal,
      qrisTotal,
      transferTotal,
      transactionCount: meta.totalItems,
    },
  };
}
