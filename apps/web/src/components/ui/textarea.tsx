"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative flex flex-col gap-1 w-full">
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-slate-400 shadow-xs",
            error && "border-rose-500 focus:ring-rose-500/20",
            className,
          )}
          {...props}
        />
        {error && (
          <span className="text-[10px] font-bold text-rose-500">{error}</span>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
