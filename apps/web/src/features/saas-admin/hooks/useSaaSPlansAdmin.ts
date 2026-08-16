"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import {
  type CreatePlanPayload,
  SaaSAdminApiService,
  type SaaSPlanAdmin,
  type UpdatePlanPayload,
} from "../services/saasAdminApi";

export function useSaaSPlansAdmin() {
  const queryClient = useQueryClient();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPlanToEdit, setSelectedPlanToEdit] =
    useState<SaaSPlanAdmin | null>(null);
  const [planToDelete, setPlanToDelete] = useState<SaaSPlanAdmin | null>(null);

  // 1. Query All Plans
  const {
    data: plans = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["saasAdminPlans"],
    queryFn: () => SaaSAdminApiService.getAllPlans(),
  });

  // 2. Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreatePlanPayload) =>
      SaaSAdminApiService.createPlan(data),
    onSuccess: (newPlan) => {
      queryClient.invalidateQueries({ queryKey: ["saasAdminPlans"] });
      queryClient.invalidateQueries({ queryKey: ["activePlans"] });
      toast.success(`Paket langganan "${newPlan.name}" berhasil dibuat!`);
      setIsFormModalOpen(false);
    },
    onError: (err: unknown) => {
      toast.error(parseApiErrorMessage(err, "Gagal membuat paket baru."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanPayload }) =>
      SaaSAdminApiService.updatePlan(id, data),
    onSuccess: (updatedPlan) => {
      queryClient.invalidateQueries({ queryKey: ["saasAdminPlans"] });
      queryClient.invalidateQueries({ queryKey: ["activePlans"] });
      toast.success(
        `Paket langganan "${updatedPlan.name}" berhasil diperbarui!`,
      );
      setIsFormModalOpen(false);
      setSelectedPlanToEdit(null);
    },
    onError: (err: unknown) => {
      toast.error(parseApiErrorMessage(err, "Gagal memperbarui paket."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SaaSAdminApiService.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saasAdminPlans"] });
      queryClient.invalidateQueries({ queryKey: ["activePlans"] });
      toast.success("Paket langganan berhasil dinonaktifkan/dihapus!");
      setPlanToDelete(null);
    },
    onError: (err: unknown) => {
      toast.error(parseApiErrorMessage(err, "Gagal menghapus paket."));
    },
  });

  const handleOpenAddModal = () => {
    setSelectedPlanToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (plan: SaaSPlanAdmin) => {
    setSelectedPlanToEdit(plan);
    setIsFormModalOpen(true);
  };

  const confirmDelete = () => {
    if (!planToDelete) return;
    deleteMutation.mutate(planToDelete.id);
  };

  return {
    plans,
    isLoading,
    isFormModalOpen,
    setIsFormModalOpen,
    selectedPlanToEdit,
    planToDelete,
    setPlanToDelete,
    handleOpenAddModal,
    handleOpenEditModal,
    confirmDelete,
    createMutation,
    updateMutation,
    deleteMutation,
    refetch,
  };
}
