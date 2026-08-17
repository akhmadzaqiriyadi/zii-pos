"use client";

import type React from "react";
import { DashboardLayout } from "../../../../../components/layout/dashboard-layout";
import { RoleForm } from "../../../../../features/roles/components/RoleForm";

export default function CreateRolePage() {
  return (
    <DashboardLayout requiredPermission="roles:manage">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <RoleForm isEditMode={false} />
      </main>
    </DashboardLayout>
  );
}
