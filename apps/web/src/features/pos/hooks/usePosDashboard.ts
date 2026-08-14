"use client";

import type { Product } from "@zii/types";
import { useReducer } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCart } from "./useCart";
import { usePosProducts } from "./usePosProducts";

interface PosDashboardState {
  search: string;
  filterType: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: "cash" | "qris" | "transfer";
  isCartOpen: boolean;
  isPaymentModalOpen: boolean;
  isSuccessModalOpen: boolean;
  lastCompletedReceipt: {
    cart: any[];
    totalAmount: number;
    paymentMethod: string;
    customerPhone: string;
  } | null;
}

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_FILTER_TYPE"; payload: string }
  | { type: "SET_CUSTOMER_NAME"; payload: string }
  | { type: "SET_CUSTOMER_PHONE"; payload: string }
  | { type: "SET_PAYMENT_METHOD"; payload: "cash" | "qris" | "transfer" }
  | { type: "SET_CART_OPEN"; payload: boolean }
  | { type: "SET_PAYMENT_MODAL_OPEN"; payload: boolean }
  | { type: "SET_SUCCESS_MODAL_OPEN"; payload: boolean }
  | { type: "SET_LAST_COMPLETED_RECEIPT"; payload: any }
  | { type: "RESET_TRANSACTION_STATE" };

const initialState: PosDashboardState = {
  search: "",
  filterType: "all",
  customerName: "",
  customerPhone: "",
  paymentMethod: "cash",
  isCartOpen: false,
  isPaymentModalOpen: false,
  isSuccessModalOpen: false,
  lastCompletedReceipt: null,
};

function posReducer(
  state: PosDashboardState,
  action: Action,
): PosDashboardState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_FILTER_TYPE":
      return { ...state, filterType: action.payload };
    case "SET_CUSTOMER_NAME":
      return { ...state, customerName: action.payload };
    case "SET_CUSTOMER_PHONE":
      return { ...state, customerPhone: action.payload };
    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };
    case "SET_CART_OPEN":
      return { ...state, isCartOpen: action.payload };
    case "SET_PAYMENT_MODAL_OPEN":
      return { ...state, isPaymentModalOpen: action.payload };
    case "SET_SUCCESS_MODAL_OPEN":
      return { ...state, isSuccessModalOpen: action.payload };
    case "SET_LAST_COMPLETED_RECEIPT":
      return { ...state, lastCompletedReceipt: action.payload };
    case "RESET_TRANSACTION_STATE":
      return {
        ...state,
        customerName: "",
        customerPhone: "",
        isCartOpen: false,
        isPaymentModalOpen: false,
        isSuccessModalOpen: false,
      };
    default:
      return state;
  }
}

export function usePosDashboard() {
  const { tenant } = useAuth();
  const [state, dispatch] = useReducer(posReducer, initialState);

  const { products, totalCount, isLoading } = usePosProducts(
    state.search,
    state.filterType,
  );

  const {
    cart,
    addToCart: rawAddToCart,
    updateQty,
    removeFromCart,
    clearCart,
    totalAmount,
    totalQty,
  } = useCart();

  const handleAddToCart = (product: Product) => {
    rawAddToCart(product);
    if (!state.isCartOpen) {
      dispatch({ type: "SET_CART_OPEN", payload: true });
    }
  };

  const merchant = {
    name: tenant?.name || "ZII POS Store",
    phone: tenant?.phone || "-",
    address: tenant?.address || "-",
    receiptFooter:
      tenant?.receiptFooter ||
      "Terima kasih telah berbelanja! Simpan nota ini sebagai bukti transaksi.",
  };

  const handleOpenPaymentModal = () => {
    if (cart.length === 0) return;
    dispatch({ type: "SET_PAYMENT_MODAL_OPEN", payload: true });
  };

  const handleSuccessTransaction = () => {
    dispatch({
      type: "SET_LAST_COMPLETED_RECEIPT",
      payload: {
        cart: [...cart],
        totalAmount,
        paymentMethod: state.paymentMethod,
        customerPhone: state.customerPhone,
      },
    });
    clearCart();
    dispatch({ type: "SET_PAYMENT_MODAL_OPEN", payload: false });
    dispatch({ type: "SET_SUCCESS_MODAL_OPEN", payload: true });
  };

  const handleResetCart = () => {
    clearCart();
    dispatch({ type: "RESET_TRANSACTION_STATE" });
  };

  return {
    search: state.search,
    setSearch: (search: string) => dispatch({ type: "SET_SEARCH", payload: search }),
    filterType: state.filterType,
    setFilterType: (filterType: string) =>
      dispatch({ type: "SET_FILTER_TYPE", payload: filterType }),
    customerName: state.customerName,
    setCustomerName: (customerName: string) =>
      dispatch({ type: "SET_CUSTOMER_NAME", payload: customerName }),
    customerPhone: state.customerPhone,
    setCustomerPhone: (customerPhone: string) =>
      dispatch({ type: "SET_CUSTOMER_PHONE", payload: customerPhone }),
    paymentMethod: state.paymentMethod,
    setPaymentMethod: (paymentMethod: "cash" | "qris" | "transfer") =>
      dispatch({ type: "SET_PAYMENT_METHOD", payload: paymentMethod }),
    isCartOpen: state.isCartOpen,
    setIsCartOpen: (isOpen: boolean) =>
      dispatch({ type: "SET_CART_OPEN", payload: isOpen }),
    isPaymentModalOpen: state.isPaymentModalOpen,
    setIsPaymentModalOpen: (isOpen: boolean) =>
      dispatch({ type: "SET_PAYMENT_MODAL_OPEN", payload: isOpen }),
    isSuccessModalOpen: state.isSuccessModalOpen,
    setIsSuccessModalOpen: (isOpen: boolean) =>
      dispatch({ type: "SET_SUCCESS_MODAL_OPEN", payload: isOpen }),
    products,
    totalCount,
    isLoading,
    cart,
    updateQty,
    removeFromCart,
    totalAmount,
    totalQty,
    handleAddToCart,
    merchant,
    lastCompletedReceipt: state.lastCompletedReceipt,
    handleOpenPaymentModal,
    handleSuccessTransaction,
    handleResetCart,
  };
}
