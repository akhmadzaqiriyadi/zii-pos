"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Crown,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import type { CurrentSubscriptionData } from "../services/subscriptionApi";
import { AutoRenewSwitchCard } from "./AutoRenewSwitchCard";
import { LicenseFeatureBadges } from "./LicenseFeatureBadges";
import { LicenseUrgencyBanner } from "./LicenseUrgencyBanner";
import { LicenseUsageProgressBar } from "./LicenseUsageProgressBar";

interface CurrentLicenseCardProps {
  subscription?: CurrentSubscriptionData;
  isLoading: boolean;
  onToggleAutoRenew?: (autoRenew: boolean) => void;
  isTogglingAutoRenew?: boolean;
}

export function CurrentLicenseCard({
  subscription,
  isLoading,
  onToggleAutoRenew,
  isTogglingAutoRenew,
}: CurrentLicenseCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6 rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-center py-10 space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span className="text-sm font-semibold text-slate-500">
            Memuat status lisensi toko...
          </span>
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="p-6 rounded-2xl border border-amber-200 bg-amber-50/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Lisensi Tidak Ditemukan
            </h3>
            <p className="text-xs text-amber-700">
              Sistem tidak menemukan lisensi aktif untuk toko ini. Silakan pilih
              paket langganan di bawah.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const { plan, daysRemaining, status, urgency } = subscription;
  const isExpiringSoon =
    urgency?.urgencyLevel === "expiring_soon" ||
    (daysRemaining <= 3 && status !== "expired" && status !== "suspended");
  const isLocked =
    urgency?.urgencyLevel === "locked" ||
    status === "expired" ||
    status === "suspended";

  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="emerald"
            className="gap-1.5 px-3 py-1 text-xs font-extrabold shadow-2xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            LISENSI AKTIF
          </Badge>
        );
      case "trial":
        return (
          <Badge
            variant="amber"
            className="gap-1.5 px-3 py-1 text-xs font-extrabold shadow-2xs"
          >
            <Clock className="h-3.5 w-3.5" />
            MASA TRIAL (UJI COBA)
          </Badge>
        );
      case "suspended":
        return (
          <Badge
            variant="rose"
            className="gap-1.5 px-3 py-1 text-xs font-extrabold shadow-2xs"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            DIBEKUKAN (SUSPENDED)
          </Badge>
        );
      case "expired":
        return (
          <Badge
            variant="rose"
            className="gap-1.5 px-3 py-1 text-xs font-extrabold shadow-2xs"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            LISENSI HABIS (EXPIRED)
          </Badge>
        );
      default:
        return (
          <Badge variant="slate" className="px-3 py-1 text-xs font-extrabold">
            {(status as string).toUpperCase()}
          </Badge>
        );
    }
  };

  return (
    <Card className="p-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30 shadow-xs relative overflow-hidden space-y-5">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Crown className="h-48 w-48 text-emerald-900" />
      </div>

      <CardContent className="p-0 space-y-5">
        {/* 1. Urgency Alert Banner Subcomponent */}
        <LicenseUrgencyBanner
          isExpiringSoon={isExpiringSoon}
          isLocked={isLocked}
          daysRemaining={daysRemaining}
        />

        {/* 2. Header Title & Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-xs shadow-xs">
                ZII
              </span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Status Berlangganan Toko
              </p>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {plan?.name || "Paket Standard Merchant"}
            </h2>
          </div>

          <div>{getStatusBadge()}</div>
        </div>

        {/* 3. Progress Bars (Days Remaining & Cashier Usage) Subcomponent */}
        <LicenseUsageProgressBar subscription={subscription} />

        {/* 4. Auto-Renew Interactive Switch Subcomponent */}
        <AutoRenewSwitchCard
          autoRenew={subscription.autoRenew}
          onToggleAutoRenew={onToggleAutoRenew}
          isTogglingAutoRenew={isTogglingAutoRenew}
        />

        {/* 5. Feature Allowance Badges Subcomponent */}
        {plan && <LicenseFeatureBadges plan={plan} />}
      </CardContent>
    </Card>
  );
}
