"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import { useAuth } from "../../auth/hooks/useAuth";
import type {
  StepOwnerAccountData,
  StepPlanSelectionData,
  StepStoreInfoData,
} from "../schemas/onboarding.schema";

export interface Plan {
  id: string;
  code: string;
  name: string;
  price: number;
  billingCycle: string;
  maxCashiers: number;
  allowWhiteLabel: boolean;
  allowExportExcel: boolean;
  featuresJson: string;
  isActive: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function useOnboardingForm() {
  const { register: registerAuth } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form States for 3 steps
  const [storeData, setStoreData] = useState<StepStoreInfoData>({
    tenantName: "",
    subdomain: "",
    phone: "",
    address: "",
  });

  const [ownerData, setOwnerData] = useState<StepOwnerAccountData>({
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch active plans from GET /api/v1/plans for Step 3
  const { data: plans = [], isLoading: isLoadingPlans } = useQuery<Plan[]>({
    queryKey: ["activePlans"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/plans`);
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.message || "Gagal memuat daftar paket langganan.");
      }
      return body.data || [];
    },
  });

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const submitStoreInfo = (data: StepStoreInfoData) => {
    setStoreData(data);
    goToNextStep();
  };

  const submitOwnerAccount = (data: StepOwnerAccountData) => {
    setOwnerData(data);
    goToNextStep();
  };

  const completeOnboarding = async (planId: string) => {
    if (!planId) {
      toast.error("Silakan pilih salah satu paket langganan.");
      return;
    }

    setSelectedPlanId(planId);
    setIsSubmitting(true);

    try {
      // 1. Register Tenant & Owner via AuthContext
      await registerAuth({
        tenantName: storeData.tenantName,
        ownerName: ownerData.ownerName,
        email: ownerData.email,
        password: ownerData.password,
        phone: storeData.phone,
        address: storeData.address,
      });

      toast.success(
        `Selamat! Toko ${storeData.tenantName} berhasil didaftarkan. Selamat datang di ZII POS!`,
      );

      // 2. Redirect to Kasir POS
      window.location.href = "/pos";
    } catch (err: unknown) {
      const msg = parseApiErrorMessage(
        err,
        "Gagal menyelesikan pendaftaran merchant.",
      );
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    storeData,
    ownerData,
    selectedPlanId,
    plans,
    isLoadingPlans,
    isSubmitting,
    goToNextStep,
    goToPrevStep,
    submitStoreInfo,
    submitOwnerAccount,
    completeOnboarding,
  };
}
