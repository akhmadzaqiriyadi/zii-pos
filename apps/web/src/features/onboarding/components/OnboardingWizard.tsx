"use client";

import { Check, CreditCard, Store, User } from "lucide-react";
import React from "react";
import { Card } from "../../../components/ui/card";
import { useOnboardingForm } from "../hooks/useOnboardingForm";
import { StepOwnerAccount } from "./StepOwnerAccount";
import { StepPlanSelection } from "./StepPlanSelection";
import { StepStoreInfo } from "./StepStoreInfo";

export function OnboardingWizard() {
  const {
    currentStep,
    storeData,
    ownerData,
    plans,
    isLoadingPlans,
    isSubmitting,
    goToPrevStep,
    submitStoreInfo,
    submitOwnerAccount,
    completeOnboarding,
  } = useOnboardingForm();

  const steps = [
    { number: 1, label: "Identitas Toko", icon: Store },
    { number: 2, label: "Akun Owner", icon: User },
    { number: 3, label: "Paket Langganan", icon: CreditCard },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto space-y-8 py-6">
      {/* Header Branding */}
      <header className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Daftarkan Merchant Toko Anda
        </h1>
        <p className="text-sm text-slate-500 max-w-lg">
          Transformasi operasional kasir toko Anda dengan sistem POS White-Label modern dalam 3 langkah mudah.
        </p>
      </header>

      {/* Stepper Progress Bar */}
      <nav aria-label="Progress Stepper" className="relative flex items-center justify-between max-w-xl mx-auto px-4">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 -z-0" />
        <div
          className="absolute top-1/2 left-8 h-1 bg-emerald-500 -translate-y-1/2 transition-all duration-300 -z-0"
          style={{
            width:
              currentStep === 1
                ? "0%"
                : currentStep === 2
                  ? "50%"
                  : "100%",
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const Icon = step.icon;

          return (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center space-y-2"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full font-bold text-sm transition-all duration-300 shadow-xs ${
                  isCompleted
                    ? "bg-emerald-600 text-white border-2 border-emerald-600"
                    : isCurrent
                      ? "bg-white text-emerald-600 border-2 border-emerald-600 ring-4 ring-emerald-50"
                      : "bg-white text-slate-400 border-2 border-slate-200"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`text-xs font-semibold ${
                  isCurrent || isCompleted ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Form Step Container Card */}
      <Card className="border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 rounded-2xl">
        {currentStep === 1 && (
          <StepStoreInfo
            initialData={storeData}
            onSubmit={submitStoreInfo}
          />
        )}

        {currentStep === 2 && (
          <StepOwnerAccount
            initialData={ownerData}
            onSubmit={submitOwnerAccount}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 3 && (
          <StepPlanSelection
            plans={plans}
            isLoadingPlans={isLoadingPlans}
            isSubmitting={isSubmitting}
            onBack={goToPrevStep}
            onComplete={completeOnboarding}
          />
        )}
      </Card>
    </section>
  );
}
