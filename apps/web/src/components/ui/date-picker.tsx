"use client";

import { Calendar } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface DatePickerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, value, onChange, ...props }, ref) => {
    return (
      <div className="relative flex flex-col gap-1">
        {label && (
          <label className="text-xs font-bold text-slate-700">{label}</label>
        )}
        <div className="relative flex items-center">
          <Calendar className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none z-10" />
          <input
            type="date"
            ref={ref}
            value={value}
            onChange={onChange}
            className={cn(
              "h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:light]",
              "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
              className,
            )}
            {...props}
          />
        </div>
        {error && <span className="text-[10px] font-bold text-rose-500">{error}</span>}
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: DateRangePickerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20",
        className,
      )}
    >
      <div className="relative flex items-center">
        <Calendar className="absolute left-2.5 h-4 w-4 text-slate-400 pointer-events-none z-10" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="h-8 w-32 bg-transparent pl-8 pr-1 text-xs font-semibold text-slate-800 focus:outline-none [color-scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-40 hover:[&::-webkit-calendar-picker-indicator]:opacity-90"
          title="Tanggal Mulai"
        />
      </div>
      <span className="text-xs font-extrabold text-slate-400">-</span>
      <div className="relative flex items-center">
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="h-8 w-32 bg-transparent pl-2 pr-1 text-xs font-semibold text-slate-800 focus:outline-none [color-scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-40 hover:[&::-webkit-calendar-picker-indicator]:opacity-90"
          title="Tanggal Akhir"
        />
      </div>
    </div>
  );
}
