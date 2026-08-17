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
            "peer h-4 w-4 shrink-0 appearance-none rounded-md border border-slate-300 bg-white transition-all",
            "checked:border-emerald-600 checked:bg-emerald-600",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:border-emerald-500 cursor-pointer",
            className,
          )}
          {...props}
        />
        <Check
          className={cn(
            "pointer-events-none absolute h-3 w-3 text-white transition-opacity",
            checked ? "opacity-100" : "opacity-0",
          )}
          strokeWidth={3}
        />
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";
