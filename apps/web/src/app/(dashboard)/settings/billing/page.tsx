"use client";

import type React from "react";
import { DashboardLayout } from "../../../../components/layout/dashboard-layout";
import { CurrentLicenseCard } from "../../../../features/subscription/components/CurrentLicenseCard";
import { MerchantInvoiceHistory } from "../../../../features/subscription/components/MerchantInvoiceHistory";
import { PaymentCheckoutModal } from "../../../../features/subscription/components/PaymentCheckoutModal";
import { UpgradePlanGrid } from "../../../../features/subscription/components/UpgradePlanGrid";
import { useMerchantBilling } from "../../../../features/subscription/hooks/useMerchantBilling";

export default function MerchantBillingPage() {
  const {
    currentSubscription,
    isLoadingSubscription,
    availablePlans,
    isLoadingPlans,
    invoices,
    isLoadingInvoices,
    refetchInvoices,
    selectedBillingCycle,
    setSelectedBillingCycle,
    checkoutData,
    setCheckoutData,
    handleCheckout,
    isCheckoutPending,
    handleToggleAutoRenew,
    isTogglingAutoRenew,
    refetchSubscription,
  } = useMerchantBilling();

  const handlePaymentSuccess = () => {
    refetchSubscription();
    refetchInvoices();
  };

  return (
    <DashboardLayout requiredPermission="billing:manage">
      <main className="p-4 sm:p-6 lg:p-8 w-full space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Lisensi & Berlangganan SaaS Toko
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Pantau sisa masa aktif lisensi, kuota penggunaan kasir, perpanjang
              paket, atau unduh dokumen faktur resmi toko Anda.
            </p>
          </div>
        </header>

        {/* 1. Current Active License Card (with Urgency Banner, Usage Progress Bar & Auto-Renew Switch) */}
        <section aria-label="Current License Status">
          <CurrentLicenseCard
            subscription={currentSubscription}
            isLoading={isLoadingSubscription}
            onToggleAutoRenew={handleToggleAutoRenew}
            isTogglingAutoRenew={isTogglingAutoRenew}
          />
        </section>

        {/* 2. Upgrade & Extension Plan Grid (with Anti-Trial Guardrail) */}
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

        {/* 3. Merchant Invoices History Table & Official PDF Download */}
        <section aria-label="Payment Invoice History">
          <MerchantInvoiceHistory
            invoices={invoices}
            isLoading={isLoadingInvoices}
          />
        </section>

        {/* 4. Payment Gateway QRIS Checkout Modal */}
        <PaymentCheckoutModal
          checkoutData={checkoutData}
          onClose={() => setCheckoutData(null)}
          onSimulateSuccess={handlePaymentSuccess}
        />
      </main>
    </DashboardLayout>
  );
}
