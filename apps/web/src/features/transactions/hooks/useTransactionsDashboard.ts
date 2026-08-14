"use client";

import type { Transaction } from "@zii/types";
import { useReducer } from "react";
import { useTransactions } from "./useTransactions";

interface TransactionsDashboardState {
  search: string;
  paymentMethod: string;
  startDate: string;
  endDate: string;
  page: number;
  selectedTransaction: Transaction | null;
}

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAYMENT_METHOD"; payload: string }
  | { type: "SET_START_DATE"; payload: string }
  | { type: "SET_END_DATE"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_SELECTED_TRANSACTION"; payload: Transaction | null };

const initialState: TransactionsDashboardState = {
  search: "",
  paymentMethod: "all",
  startDate: "",
  endDate: "",
  page: 1,
  selectedTransaction: null,
};

function transactionsReducer(
  state: TransactionsDashboardState,
  action: Action,
): TransactionsDashboardState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload, page: 1 };
    case "SET_START_DATE":
      return { ...state, startDate: action.payload, page: 1 };
    case "SET_END_DATE":
      return { ...state, endDate: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_SELECTED_TRANSACTION":
      return { ...state, selectedTransaction: action.payload };
    default:
      return state;
  }
}

export function useTransactionsDashboard() {
  const [state, dispatch] = useReducer(transactionsReducer, initialState);

  const { transactions, meta, summary, isLoading } = useTransactions({
    page: state.page,
    limit: 10,
    search: state.search,
    paymentMethod: state.paymentMethod,
    startDate: state.startDate || undefined,
    endDate: state.endDate || undefined,
  });

  return {
    search: state.search,
    setSearch: (search: string) => dispatch({ type: "SET_SEARCH", payload: search }),
    paymentMethod: state.paymentMethod,
    setPaymentMethod: (paymentMethod: string) =>
      dispatch({ type: "SET_PAYMENT_METHOD", payload: paymentMethod }),
    startDate: state.startDate,
    setStartDate: (startDate: string) =>
      dispatch({ type: "SET_START_DATE", payload: startDate }),
    endDate: state.endDate,
    setEndDate: (endDate: string) =>
      dispatch({ type: "SET_END_DATE", payload: endDate }),
    page: state.page,
    setPage: (page: number) => dispatch({ type: "SET_PAGE", payload: page }),
    selectedTransaction: state.selectedTransaction,
    setSelectedTransaction: (transaction: Transaction | null) =>
      dispatch({ type: "SET_SELECTED_TRANSACTION", payload: transaction }),
    transactions,
    meta,
    summary,
    isLoading,
  };
}
