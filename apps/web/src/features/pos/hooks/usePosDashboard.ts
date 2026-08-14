"use client";

import type { Product } from "@zii/types";
import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCart } from "./useCart";
import { usePosProducts } from "./usePosProducts";

export function usePosDashboard() {
  const { tenant } = useAuth();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "qris" | "transfer"
  >("cash");

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { products, totalCount, isLoading } = usePosProducts(
    search,
    filterType,
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
    if (!isCartOpen) {
      setIsCartOpen(true);
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
    setIsPaymentModalOpen(true);
  };

  const handleSuccessTransaction = () => {
    setIsPaymentModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleResetCart = () => {
    clearCart();
    setCustomerName("");
    setCustomerPhone("");
    setIsSuccessModalOpen(false);
    setIsCartOpen(false);
  };

  return {
    search,
    setSearch,
    filterType,
    setFilterType,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    paymentMethod,
    setPaymentMethod,
    isCartOpen,
    setIsCartOpen,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
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
    handleOpenPaymentModal,
    handleSuccessTransaction,
    handleResetCart,
  };
}
