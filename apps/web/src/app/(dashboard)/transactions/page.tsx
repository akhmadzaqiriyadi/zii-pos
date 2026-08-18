"use client";

import React from "react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { TransactionHistoryView } from "../../../features/transactions/components/TransactionHistoryView";

export default function TransactionsPage() {
  return (
    <DashboardLayout requiredPermission="transactions:read">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <TransactionHistoryView />
      </main>
    </DashboardLayout>
  );
}
