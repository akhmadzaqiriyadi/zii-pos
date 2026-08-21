"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import {
  type CheckoutResult,
  SubscriptionApiService,
} from "../services/subscriptionApi";

export function useMerchantBilling() {
  const queryClient = useQueryClient();
  const [checkoutData, setCheckoutData] = useState<CheckoutResult | null>(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<
    "monthly" | "yearly"
  >("monthly");

  // 1. Fetch Current Merchant Subscription (Includes Usage & Urgency)
  const {
    data: currentSubscription,
    isLoading: isLoadingSubscription,
    refetch: refetchSubscription,
  } = useQuery({
    queryKey: ["currentSubscription"],
    queryFn: () => SubscriptionApiService.getCurrentSubscription(),
  });

  // 2. Fetch Available Plans (for upgrade options)
  const { data: availablePlans = [], isLoading: isLoadingPlans } = useQuery({
    queryKey: ["activePlans"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/plans`,
      );
      const body = await res.json();
      return body.success ? body.data : [];
    },
  });

  // 3. Fetch Merchant Invoices History
  const {
    data: invoices = [],
    isLoading: isLoadingInvoices,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ["merchantInvoices"],
    queryFn: () => SubscriptionApiService.getInvoices(),
  });

  // 4. Auto-Renew Mutation
  const autoRenewMutation = useMutation({
    mutationFn: (autoRenew: boolean) =>
      SubscriptionApiService.toggleAutoRenew(autoRenew),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["currentSubscription"] });
      if (res.autoRenew) {
        toast.success(
          res.message || "Perpanjangan otomatis berhasil diaktifkan.",
        );
      } else {
        toast.error(
          res.message || "Perpanjangan otomatis berhasil dinonaktifkan.",
        );
      }
    },
    onError: (err: unknown) => {
      toast.error(
        parseApiErrorMessage(
          err,
          "Gagal mengubah pengaturan perpanjangan otomatis.",
        ),
      );
    },
  });

  // 5. Checkout Mutation
  const checkoutMutation = useMutation({
    mutationFn: ({
      planId,
      billingCycle,
    }: {
      planId: string;
      billingCycle: "monthly" | "yearly";
    }) => SubscriptionApiService.checkoutSubscription(planId, billingCycle),
    onSuccess: (result) => {
      setCheckoutData(result);
      toast.success(
        "Checkout berhasil! Silakan selesaikan pembayaran lisensi.",
      );
    },
    onError: (err: unknown) => {
      toast.error(parseApiErrorMessage(err, "Gagal memproses checkout paket."));
    },
  });

  const handleCheckout = (planId: string) => {
    checkoutMutation.mutate({
      planId,
      billingCycle: selectedBillingCycle,
    });
  };

  const handleToggleAutoRenew = (autoRenew: boolean) => {
    autoRenewMutation.mutate(autoRenew);
  };

  return {
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
    isCheckoutPending: checkoutMutation.isPending,
    handleToggleAutoRenew,
    isTogglingAutoRenew: autoRenewMutation.isPending,
    refetchSubscription,
  };
}
