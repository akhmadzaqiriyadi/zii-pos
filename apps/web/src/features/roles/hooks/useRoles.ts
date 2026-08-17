"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import { RoleApiService } from "../services/roleApi";
import type {
  CreateRoleInput,
  PermissionItem,
  Role,
  UpdateRoleInput,
} from "../types/role.types";

export function useRoles() {
  const queryClient = useQueryClient();

  const rolesQuery = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: () => RoleApiService.getRoles(),
  });

  const catalogQuery = useQuery<PermissionItem[]>({
    queryKey: ["permissions-catalog"],
    queryFn: () => RoleApiService.getPermissionsCatalog(),
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateRoleInput) => RoleApiService.createRole(data),
    onSuccess: (newRole) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success(`Role kustom '${newRole.name}' berhasil dibuat!`);
    },
    onError: (err: unknown) => {
      const msg = parseApiErrorMessage(err, "Gagal membuat role kustom.");
      toast.error(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleInput }) =>
      RoleApiService.updateRole(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success(`Role '${updated.name}' berhasil diperbarui!`);
    },
    onError: (err: unknown) => {
      const msg = parseApiErrorMessage(err, "Gagal memperbarui role.");
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => RoleApiService.deleteRole(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success(res.message || "Role kustom berhasil dihapus.");
    },
    onError: (err: unknown) => {
      const msg = parseApiErrorMessage(err, "Gagal menghapus role.");
      toast.error(msg);
    },
  });

  return {
    roles: rolesQuery.data || [],
    isLoadingRoles: rolesQuery.isLoading,
    rolesError: rolesQuery.error,
    catalog: catalogQuery.data || [],
    isLoadingCatalog: catalogQuery.isLoading,
    createRole: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateRole: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteRole: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
