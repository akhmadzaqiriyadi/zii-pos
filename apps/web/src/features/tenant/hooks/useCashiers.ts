"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import {
  type CashiersResponse,
  type CreateCashierPayload,
  TenantApiService,
} from "../services/tenantApi";

export function useCashiers() {
  const queryClient = useQueryClient();

  const cashiersQuery = useQuery<CashiersResponse>({
    queryKey: ["cashiers"],
    queryFn: () => TenantApiService.getCashiers(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCashierPayload) =>
      TenantApiService.createCashier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashiers"] });
      toast.success("Akun kasir baru berhasil ditambahkan!");
    },
    onError: (err: unknown) => {
      const msg = parseApiErrorMessage(err, "Gagal menambahkan kasir.");
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => TenantApiService.deleteCashier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashiers"] });
      toast.success("Akun kasir berhasil dihapus.");
    },
    onError: (err: unknown) => {
      const msg = parseApiErrorMessage(err, "Gagal menghapus kasir.");
      toast.error(msg);
    },
  });

  return {
    cashiersData: cashiersQuery.data,
    isLoading: cashiersQuery.isLoading,
    error: cashiersQuery.error,
    createCashier: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteCashier: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
