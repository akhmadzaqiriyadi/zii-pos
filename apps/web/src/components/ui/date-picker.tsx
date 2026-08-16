"use client";

import { Calendar as CalendarIcon, X } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Calendar } from "./calendar";

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

function toYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export interface DatePickerProps {
  value?: string;
  onChange?: (val: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value = "",
  onChange,
  label,
  placeholder = "Pilih Tanggal...",
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedDateObj = React.useMemo(() => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }, [value]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (d: Date) => {
    if (onChange) onChange(toYMD(d));
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) onChange("");
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-700 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-xs",
          className,
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
          <span
            className={value ? "text-slate-800 font-bold" : "text-slate-400"}
          >
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>
        {value && (
          <span
            onClick={handleClear}
            className="p-0.5 text-slate-400 hover:text-slate-600 rounded-md transition cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 animate-in fade-in-50 zoom-in-95">
          <Calendar
            selectedDate={selectedDateObj}
            onSelectDate={handleSelect}
          />
        </div>
      )}
    </div>
  );
}

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
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const startDateObj = React.useMemo(
    () => (startDate ? new Date(startDate) : null),
    [startDate],
  );
  const endDateObj = React.useMemo(
    () => (endDate ? new Date(endDate) : null),
    [endDate],
  );

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedDates = React.useMemo(() => {
    if (!startDate && !endDate) return { start: "", end: "" };
    if (startDate && endDate && startDate > endDate) {
      return { start: endDate, end: startDate };
    }
    return { start: startDate, end: endDate };
  }, [startDate, endDate]);

  const handleRangeSelect = (start: Date | null, end: Date | null) => {
    if (start && end) {
      const sortedStart = start <= end ? start : end;
      const sortedEnd = start <= end ? end : start;
      onStartDateChange(toYMD(sortedStart));
      onEndDateChange(toYMD(sortedEnd));
      setIsOpen(false);
    } else if (start) {
      onStartDateChange(toYMD(start));
      onEndDateChange("");
    }
  };

  const handleClearRange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartDateChange("");
    onEndDateChange("");
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-xs",
          className,
        )}
      >
        <CalendarIcon className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>
          {sortedDates.start
            ? formatDisplayDate(sortedDates.start)
            : "Pilih Tanggal Mulai"}
        </span>
        <span className="text-slate-400 font-bold">-</span>
        <span>
          {sortedDates.end
            ? formatDisplayDate(sortedDates.end)
            : "Pilih Tanggal Akhir"}
        </span>
        {(startDate || endDate) && (
          <span
            onClick={handleClearRange}
            className="ml-1 p-0.5 text-slate-400 hover:text-slate-600 rounded-md transition cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 animate-in fade-in-50 zoom-in-95">
          <Calendar
            startDate={startDateObj}
            endDate={endDateObj}
            isRangeMode={true}
            onSelectRange={handleRangeSelect}
          />
        </div>
      )}
    </div>
  );
}
