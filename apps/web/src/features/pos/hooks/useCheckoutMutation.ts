"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTransactionInput, Transaction } from "@zii/types";
import { PosApiService } from "../services/posApi";

export function useCheckoutMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<Transaction, Error, CreateTransactionInput>({
    mutationFn: (input: CreateTransactionInput) =>
      PosApiService.createTransaction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
  });
}
