import type { Metadata } from "next";
import React from "react";
import { OnboardingWizard } from "../../features/onboarding/components/OnboardingWizard";

export const metadata: Metadata = {
  title: "Pendaftaran Merchant — ZII POS SaaS",
  description: "Daftarkan usaha Anda dan atur toko kasir Anda dalam 3 langkah mudah",
};

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 font-sans flex items-center justify-center">
      <OnboardingWizard />
    </main>
  );
}
