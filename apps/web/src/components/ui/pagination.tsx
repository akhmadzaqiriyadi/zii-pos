"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  className?: string;
  itemLabel?: string;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  className,
  itemLabel = "data",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canPrev = hasPrevPage !== undefined ? hasPrevPage : page > 1;
  const canNext = hasNextPage !== undefined ? hasNextPage : page < totalPages;

  return (
    <nav
      aria-label="Pagination Navigation"
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500",
        className,
      )}
    >
      <div>
        <span>
          Halaman <strong className="text-slate-800">{page}</strong> dari{" "}
          <strong className="text-slate-800">{totalPages}</strong>
          {totalItems !== undefined && (
            <span className="text-slate-400 font-normal ml-1">
              ({totalItems} {itemLabel})
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center space-x-1.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          className="h-8 text-xs font-bold gap-1 rounded-lg disabled:opacity-40 cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Sebelumnya</span>
        </Button>

        {/* Page Number Pills */}
        <div className="hidden sm:flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              // Show current page, first, last, and adjacent pages
              return (
                p === 1 ||
                p === totalPages ||
                Math.abs(p - page) <= 1
              );
            })
            .map((p, idx, arr) => {
              const prevPage = arr[idx - 1];
              const showEllipsis = prevPage && p - prevPage > 1;

              return (
                <div key={p} className="flex items-center space-x-1">
                  {showEllipsis && (
                    <span className="px-1 text-slate-400">...</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center",
                      p === page
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200",
                    )}
                  >
                    {p}
                  </button>
                </div>
              );
            })}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          className="h-8 text-xs font-bold gap-1 rounded-lg disabled:opacity-40 cursor-pointer"
        >
          <span>Selanjutnya</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </nav>
  );
}
