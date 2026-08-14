"use client";

import type { Transaction } from "@zii/types";
import { useState } from "react";
import { useTransactions } from "./useTransactions";

export function useTransactionsDashboard() {
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { transactions, meta, summary, isLoading } = useTransactions({
    page,
    limit: 10,
    search,
    paymentMethod,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  return {
    search,
    setSearch,
    paymentMethod,
    setPaymentMethod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    page,
    setPage,
    selectedTransaction,
    setSelectedTransaction,
    transactions,
    meta,
    summary,
    isLoading,
  };
}
