"use client";

import { Check } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/cn";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, checked, onChange, onCheckedChange, disabled, ...props },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className="relative flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "h-4.5 w-4.5 shrink-0 appearance-none rounded-md border transition-all duration-200",
            checked
              ? "bg-emerald-600 border-emerald-600 text-white shadow-xs shadow-emerald-600/30"
              : "bg-white border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "cursor-pointer",
            className,
          )}
          {...props}
        />
        <Check
          className={cn(
            "pointer-events-none absolute h-3.5 w-3.5 text-white transition-transform duration-150 ease-out",
            checked ? "opacity-100 scale-100" : "opacity-0 scale-75",
          )}
          strokeWidth={3}
        />
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";
