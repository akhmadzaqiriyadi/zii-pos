"use client";

import { Layers, Loader2, Plus, Sparkles } from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useSaaSPlansAdmin } from "../hooks/useSaaSPlansAdmin";
import { PlanCard } from "./PlanCard";
import { PlanDeleteModal } from "./PlanDeleteModal";
import { PlanFormModal } from "./PlanFormModal";

export function PlanManagement() {
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
    <div className="space-y-6">
      {/* Super Admin Plan Banner */}
      <Card className="rounded-2xl border border-purple-200/60 bg-linear-to-r from-purple-50/70 via-white to-slate-50 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="purple"
                className="font-extrabold uppercase text-[10.5px] px-2.5 py-0.5"
              >
                SaaS Commercial Matrix
              </Badge>
              <span className="text-xs font-semibold text-slate-500">
                Pengelolaan Paket & Kuota Berlangganan
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Paket SaaS & Penawaran Komersial
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl">
              Tambah paket langganan baru, ubah harga promo bulanan/tahunan,
              atur kuota kasir (<code>maxCashiers</code>), dan kelola penawaran
              fitur yang tampil di portal onboarding dan billing merchant secara
              real-time.
            </p>
          </div>

          <Button
            onClick={handleOpenAddModal}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-5 rounded-xl cursor-pointer shrink-0 shadow-md shadow-emerald-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Paket Baru</span>
          </Button>
        </div>
      </Card>

      {/* Grid of Plan Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-600" />
            <span>Daftar Paket Langganan Aktif ({plans.length})</span>
          </h4>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <p className="text-xs font-semibold text-slate-500">
              Memuat katalog paket SaaS komersial...
            </p>
          </div>
        ) : plans.length === 0 ? (
          <Card className="p-12 text-center rounded-2xl border border-slate-200 bg-white">
            <p className="text-sm font-semibold text-slate-500">
              Belum ada paket langganan SaaS yang terdaftar.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleOpenEditModal}
                onDelete={(p) => setPlanToDelete(p)}
              />
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
}
