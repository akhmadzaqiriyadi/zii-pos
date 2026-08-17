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
      <header className="flex flex-col items-center space-y-3 text-center">
        <img
          src="/logo-zii-pos.png"
          alt="ZII POS"
          className="h-20 w-auto object-contain"
        />
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Daftarkan Merchant Toko Anda
          </h1>
          <p className="text-sm text-slate-500 max-w-lg">
            Transformasi operasional kasir toko Anda dengan sistem POS
            White-Label modern dalam 3 langkah mudah.
          </p>
        </div>
      </header>

      {/* Stepper Progress Bar */}
      <nav
        aria-label="Progress Stepper"
        className="flex items-center justify-center max-w-xl mx-auto px-6 w-full"
      >
        <ol className="flex items-center w-full">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <li
                key={step.number}
                className={`flex items-center ${isLast ? "w-auto shrink-0" : "w-full"}`}
              >
                {/* Step Circle & Label */}
                <div className="flex flex-col items-center shrink-0">
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
                    className={`text-xs font-semibold mt-2 whitespace-nowrap ${
                      isCurrent || isCompleted
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connecting Line (Only between steps, NEVER after the last step) */}
                {!isLast && (
                  <div className="flex-1 h-0.5 mx-3 -mt-6 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-emerald-600 transition-all duration-300 ${
                        currentStep > step.number ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Form Step Container Card */}
      <Card className="border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 rounded-2xl">
        {currentStep === 1 && (
          <StepStoreInfo initialData={storeData} onSubmit={submitStoreInfo} />
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
