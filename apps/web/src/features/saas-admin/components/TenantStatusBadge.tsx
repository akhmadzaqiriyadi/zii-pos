import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import React from "react";

interface TenantStatusBadgeProps {
  status: string;
}

export function TenantStatusBadge({ status }: TenantStatusBadgeProps) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          ACTIVE
        </span>
      );
    case "trial":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
          TRIAL
        </span>
      );
    case "suspended":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
          SUSPENDED
        </span>
      );
    case "expired":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
          EXPIRED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
          {status.toUpperCase()}
        </span>
      );
  }
}
