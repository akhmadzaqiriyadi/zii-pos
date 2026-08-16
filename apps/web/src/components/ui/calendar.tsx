"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export interface CalendarProps {
  selectedDate?: Date | null;
  onSelectDate?: (date: Date) => void;
  startDate?: Date | null;
  endDate?: Date | null;
  onSelectRange?: (start: Date | null, end: Date | null) => void;
  isRangeMode?: boolean;
  className?: string;
}

export function Calendar({
  selectedDate,
  onSelectDate,
  startDate,
  endDate,
  onSelectRange,
  isRangeMode = false,
  className,
}: CalendarProps) {
  const initialDate = selectedDate || startDate || new Date();
  const [currentMonth, setCurrentMonth] = React.useState<number>(
    initialDate.getMonth(),
  );
  const [currentYear, setCurrentYear] = React.useState<number>(
    initialDate.getFullYear(),
  );

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const calendarCells = React.useMemo(() => {
    const cells: { date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      cells.push({ date, isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      cells.push({ date, isCurrentMonth: true });
    }

    // Next month leading days to complete 42 cells (6 rows)
    const remaining = 42 - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      cells.push({ date, isCurrentMonth: false });
    }

    return cells;
  }, [currentYear, currentMonth, firstDayOfWeek, daysInMonth, prevMonthDays]);

  const isSameDay = (d1?: Date | null, d2?: Date | null) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const time = date.getTime();
    const startTime = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    ).getTime();
    const endTime = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
    ).getTime();
    return time >= startTime && time <= endTime;
  };

  const handleCellClick = (cellDate: Date) => {
    if (isRangeMode && onSelectRange) {
      if (!startDate || (startDate && endDate)) {
        onSelectRange(cellDate, null);
      } else if (startDate && !endDate) {
        if (cellDate < startDate) {
          // Auto-swap if clicked date is earlier than start date
          onSelectRange(cellDate, startDate);
        } else {
          onSelectRange(startDate, cellDate);
        }
      }
    } else if (onSelectDate) {
      onSelectDate(cellDate);
    }
  };

  return (
    <div
      className={cn(
        "w-[280px] p-3 rounded-2xl bg-white border border-slate-200 shadow-xl select-none font-sans",
        className,
      )}
    >
      {/* Range Mode Instruction Banner */}
      {isRangeMode && (
        <div className="mb-2.5 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold text-emerald-700 text-center">
          {!startDate
            ? "Pilih Tanggal Mulai"
            : !endDate
              ? "Pilih Tanggal Akhir"
              : "Rentang Tanggal Terpilih"}
        </div>
      )}

      {/* Month & Year Navigation Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-extrabold text-slate-800">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </span>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 mb-1 text-center">
        {DAY_NAMES.map((day) => (
          <span
            key={day}
            className="text-[10px] font-bold uppercase text-slate-400 py-1"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarCells.map(({ date, isCurrentMonth }, idx) => {
          const isSelected =
            isSameDay(date, selectedDate) ||
            isSameDay(date, startDate) ||
            isSameDay(date, endDate);
          const inRange = isInRange(date);
          const today = isToday(date);

          return (
            <button
              type="button"
              key={idx}
              onClick={() => handleCellClick(date)}
              className={cn(
                "h-8 w-8 rounded-xl text-xs font-semibold flex items-center justify-center transition cursor-pointer mx-auto",
                !isCurrentMonth && "text-slate-300",
                isCurrentMonth &&
                  !isSelected &&
                  "text-slate-700 hover:bg-slate-100",
                today &&
                  !isSelected &&
                  "text-emerald-600 font-extrabold ring-1 ring-emerald-500/40 bg-emerald-50/50",
                inRange &&
                  !isSelected &&
                  "bg-emerald-50 text-emerald-700 font-bold rounded-none first:rounded-l-xl last:rounded-r-xl",
                isSelected &&
                  "bg-emerald-600 text-white font-extrabold shadow-sm hover:bg-emerald-700",
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
