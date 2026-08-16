"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import { SaaSAdminApiService } from "../../saas-admin/services/saasAdminApi";
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

  // 1. Fetch Current Merchant Subscription
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
      // Use public plans or admin plans
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/plans`,
      );
      const body = await res.json();
      return body.success ? body.data : [];
    },
  });

  // 3. Checkout Mutation
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

  return {
    currentSubscription,
    isLoadingSubscription,
    availablePlans,
    isLoadingPlans,
    selectedBillingCycle,
    setSelectedBillingCycle,
    checkoutData,
    setCheckoutData,
    handleCheckout,
    isCheckoutPending: checkoutMutation.isPending,
    refetchSubscription,
  };
}
