"use client";

import { Layers } from "lucide-react";
import React from "react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { PlanDeleteModal } from "../../../features/saas-admin/components/PlanDeleteModal";
import { PlanFormModal } from "../../../features/saas-admin/components/PlanFormModal";
import { PlanGridTable } from "../../../features/saas-admin/components/PlanGridTable";
import { useSaaSPlansAdmin } from "../../../features/saas-admin/hooks/useSaaSPlansAdmin";

export default function SaaSPlansAdminPage() {
  const {
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
  } = useSaaSPlansAdmin();

  return (
    <DashboardLayout requiredPermission="saas:admin">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200 shadow-2xs">
                <Layers className="h-4 w-4" />
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Pengelolaan Paket SaaS Dinamis
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Super Admin Portal — Tambah, edit harga promo, atur batas kasir
              (`maxCashiers`), dan kelola penawaran paket SaaS secara real-time.
            </p>
          </div>
        </header>

        {/* 1. Plan Grid Table */}
        <section aria-label="SaaS Plans Grid">
          <PlanGridTable
            plans={plans}
            isLoading={isLoading}
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={handleOpenEditModal}
            onOpenDeleteModal={(plan) => setPlanToDelete(plan)}
          />
        </section>

        {/* 2. Create / Edit Form Modal */}
        <PlanFormModal
          isOpen={isFormModalOpen}
          onOpenChange={setIsFormModalOpen}
          planToEdit={selectedPlanToEdit}
          onSubmitCreate={(data) => createMutation.mutate(data)}
          onSubmitUpdate={(id, data) => updateMutation.mutate({ id, data })}
          isPending={createMutation.isPending || updateMutation.isPending}
        />

        {/* 3. Delete / Soft-Deactivate Modal */}
        <PlanDeleteModal
          planToDelete={planToDelete}
          onClose={() => setPlanToDelete(null)}
          onConfirmDelete={confirmDelete}
          isPending={deleteMutation.isPending}
        />
      </main>
    </DashboardLayout>
  );
}
