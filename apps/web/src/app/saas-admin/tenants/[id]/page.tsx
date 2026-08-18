"use client";

import { useParams } from "next/navigation";
import React from "react";
import { DashboardLayout } from "../../../../components/layout/dashboard-layout";
import { TenantDetailView } from "../../../../features/saas-admin/components/TenantDetailView";

export default function SaaSAdminTenantDetailPage() {
  const params = useParams();
  const tenantId = (
    Array.isArray(params?.id) ? params.id[0] : params?.id
  ) as string;

  return (
    <DashboardLayout requiredPermission="saas:admin">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <TenantDetailView tenantId={tenantId} />
      </main>
    </DashboardLayout>
  );
}
