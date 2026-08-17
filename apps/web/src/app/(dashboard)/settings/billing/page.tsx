"use client";

import type React from "react";
import { DashboardLayout } from "../../../../components/layout/dashboard-layout";
import { CurrentLicenseCard } from "../../../../features/subscription/components/CurrentLicenseCard";
import { PaymentCheckoutModal } from "../../../../features/subscription/components/PaymentCheckoutModal";
import { UpgradePlanGrid } from "../../../../features/subscription/components/UpgradePlanGrid";
import { useMerchantBilling } from "../../../../features/subscription/hooks/useMerchantBilling";

export default function MerchantBillingPage() {
  const {
    currentSubscription,
    isLoadingSubscription,
    availablePlans,
    isLoadingPlans,
    selectedBillingCycle,
    setSelectedBillingCycle,
    checkoutData,
    setCheckoutData,
    handleCheckout,
    isCheckoutPending,
    refetchSubscription,
  } = useMerchantBilling();

  return (
    <DashboardLayout requiredPermission="billing:manage">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Lisensi & Berlangganan SaaS Toko
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Pantau sisa masa trial, perpanjang lisensi aktif, atau upgrade
              paket SaaS merchant kamu.
            </p>
          </div>
        </header>

        {/* 1. Current Active License Card */}
        <section aria-label="Current License Status">
          <CurrentLicenseCard
            subscription={currentSubscription}
            isLoading={isLoadingSubscription}
          />
        </section>

        {/* 2. Upgrade & Extension Plan Grid */}
        <section aria-label="Upgrade Plan Options">
          <UpgradePlanGrid
            plans={availablePlans}
            currentPlanCode={currentSubscription?.plan?.code}
            selectedCycle={selectedBillingCycle}
            onCycleChange={setSelectedBillingCycle}
            onCheckout={handleCheckout}
            isPending={isCheckoutPending}
            isLoadingPlans={isLoadingPlans}
          />
        </section>

        {/* 3. Payment Gateway QRIS Checkout Modal */}
        <PaymentCheckoutModal
          checkoutData={checkoutData}
          onClose={() => setCheckoutData(null)}
          onSimulateSuccess={refetchSubscription}
        />
      </main>
    </DashboardLayout>
  );
}
