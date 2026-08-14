"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTransactionInput } from "@zii/types";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import { PosApiService } from "../services/posApi";

export function useCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionInput) =>
      PosApiService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaksi POS berhasil diproses!");
    },
    onError: (err: unknown) => {
      toast.error(parseApiErrorMessage(err, "Gagal memproses transaksi POS."));
    },
  });
}
