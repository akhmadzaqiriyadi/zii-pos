"use client";

import type { TransactionItem } from "@zii/types";
import { useState } from "react";
import { useCheckoutMutation } from "./useCheckoutMutation";

export function usePaymentForm(
  cart: TransactionItem[],
  totalAmount: number,
  customerName: string,
  customerPhone: string,
  paymentMethod: "cash" | "qris" | "transfer",
  onSuccessTransaction: (data: unknown) => void,
) {
  const [cashReceivedInput, setCashReceivedInput] = useState<string>("");
  const checkoutMutation = useCheckoutMutation();

  const cashReceived = Number(cashReceivedInput) || 0;
  const changeAmount = cashReceived - totalAmount;
  const isCashValid = paymentMethod !== "cash" || cashReceived >= totalAmount;

  const handlePresetCash = (amount: number) => {
    setCashReceivedInput(amount.toString());
  };

  const handleProcessPayment = () => {
    if (!isCashValid || cart.length === 0) return;

    checkoutMutation.mutate(
      {
        customerName: customerName.trim() || "Umum",
        customerPhone: customerPhone.trim() || undefined,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.productId,
          qty: item.qty,
        })),
      },
      {
        onSuccess: (data) => {
          onSuccessTransaction(data);
        },
      },
    );
  };

  return {
    cashReceivedInput,
    setCashReceivedInput,
    cashReceived,
    changeAmount,
    isCashValid,
    handlePresetCash,
    handleProcessPayment,
    isPending: checkoutMutation.isPending,
  };
}
