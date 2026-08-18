"use client";

import React from "react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { ProductManagement } from "../../../features/products/components/ProductManagement";

export default function ProductsPage() {
  return (
    <DashboardLayout requiredPermission="products:read">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <ProductManagement />
      </main>
    </DashboardLayout>
  );
}
