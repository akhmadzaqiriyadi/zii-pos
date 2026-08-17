"use client";

import { Check } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/cn";

export interface CheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  id,
  name,
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
}: CheckboxProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center h-5 w-5 shrink-0 rounded-md border-2 transition-all duration-150 cursor-pointer select-none",
        checked
          ? "bg-emerald-600 border-emerald-600 text-white shadow-xs shadow-emerald-600/30"
          : "bg-white border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40",
        "focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:ring-offset-1",
        disabled &&
          "cursor-not-allowed opacity-50 bg-slate-100 border-slate-200",
        className,
      )}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          onCheckedChange?.(e.target.checked);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        disabled={disabled}
        className="sr-only"
      />
      <Check
        className={cn(
          "h-3.5 w-3.5 text-white transition-all duration-150 ease-out pointer-events-none",
          checked ? "opacity-100 scale-100" : "opacity-0 scale-50",
        )}
        strokeWidth={3.5}
      />
    </span>
  );
}
