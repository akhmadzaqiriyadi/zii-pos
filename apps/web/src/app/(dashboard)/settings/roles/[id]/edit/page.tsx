"use client";

import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { DashboardLayout } from "../../../../../../components/layout/dashboard-layout";
import { RoleForm } from "../../../../../../features/roles/components/RoleForm";
import { useRole } from "../../../../../../features/roles/hooks/useRoles";

export default function EditRolePage() {
  const params = useParams();
  const roleId = params?.id as string;
  const { data: role, isLoading, error } = useRole(roleId);

  return (
    <DashboardLayout requiredPermission="roles:manage">
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-slate-500 gap-2 text-sm">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <span>Memuat data role...</span>
          </div>
        ) : error || !role ? (
          <div className="p-8 text-center text-rose-600 bg-rose-50 rounded-2xl border border-rose-200">
            <p className="font-bold">
              Role tidak ditemukan atau telah dihapus.
            </p>
          </div>
        ) : (
          <RoleForm initialRole={role} isEditMode={true} />
        )}
      </main>
    </DashboardLayout>
  );
}
