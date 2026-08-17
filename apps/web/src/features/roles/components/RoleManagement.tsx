"use client";

import { Loader2, Plus, Shield } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useRoles } from "../hooks/useRoles";
import type { Role } from "../types/role.types";
import { RoleCard } from "./RoleCard";
import { RoleModal } from "./RoleModal";

export function RoleManagement() {
  const {
    roles,
    isLoadingRoles,
    catalog,
    isLoadingCatalog,
    createRole,
    isCreating,
    updateRole,
    isUpdating,
    deleteRole,
    isDeleting,
  } = useRoles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleOpenCreateModal = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (role: Role) => {
    if (role.isSystem) return;
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleSubmitRole = async (data: {
    name: string;
    code: string;
    description: string;
    permissions: string[];
  }) => {
    if (editingRole) {
      await updateRole({
        id: editingRole.id,
        data: {
          name: data.name,
          description: data.description,
          permissions: data.permissions,
        },
      });
    } else {
      await createRole({
        name: data.name,
        code: data.code,
        description: data.description || undefined,
        permissions: data.permissions,
      });
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.isSystem) return;
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus role '${role.name}'? Pastikan tidak ada staf yang menggunakan role ini.`,
      )
    ) {
      await deleteRole(role.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="rounded-2xl border border-slate-200 bg-linear-to-r from-emerald-50/60 via-white to-slate-50 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="emerald"
                className="font-bold uppercase text-[11px]"
              >
                Enterprise RBAC
              </Badge>
              <span className="text-xs font-semibold text-slate-500">
                Manajemen Role Dinamis & Hak Akses
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Role & Hak Akses Staf Toko
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl">
              Buat role kustom (contoh: <em>Supervisor</em>,{" "}
              <em>Admin Gudang</em>, <em>Kasir Senior</em>) dan atur izin
              granular mulai dari diskon penjualan, void struk, edit harga,
              hingga rekap transaksi.
            </p>
          </div>

          <Button
            onClick={handleOpenCreateModal}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-5 rounded-xl cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Role Baru</span>
          </Button>
        </div>
      </Card>

      {/* Role Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span>Daftar Role Aktif ({roles.length})</span>
          </h4>
        </div>

        {isLoadingRoles ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2 text-sm">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span>Memuat daftar role & hak akses...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteRole}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Buat / Edit Role */}
      <RoleModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingRole={editingRole}
        catalog={catalog}
        isLoadingCatalog={isLoadingCatalog}
        onSubmit={handleSubmitRole}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
