"use client";

import { CreditCard, Store } from "lucide-react";
import Link from "next/link";
import React from "react";
import { DashboardLayout } from "../../../../components/layout/dashboard-layout";
import { Button } from "../../../../components/ui/button";
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
    <DashboardLayout requiredRole="owner">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Lisensi & Berlangganan SaaS Toko
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Pantau sisa masa trial, perpanjang lisensi aktif, atau upgrade paket SaaS merchant kamu.
            </p>
          </div>

          {/* Sub-Navigation Tabs */}
          <nav className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
            <Link href="/settings">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold text-xs transition cursor-pointer"
              >
                <Store className="h-3.5 w-3.5" />
                <span>Branding Toko</span>
              </Button>
            </Link>

            <Link href="/settings/billing">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-lg bg-white text-emerald-700 font-bold shadow-xs text-xs cursor-pointer"
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>Lisensi & Billing</span>
              </Button>
            </Link>
          </nav>
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
