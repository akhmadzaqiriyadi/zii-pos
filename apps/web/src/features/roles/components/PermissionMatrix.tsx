"use client";

import React from "react";
import { Checkbox } from "../../../components/ui/checkbox";
import type { PermissionItem } from "../types/role.types";

interface PermissionMatrixProps {
  catalog: PermissionItem[];
  selectedPermissions: string[];
  onTogglePermission: (code: string) => void;
  onSelectAllInCategory: (items: PermissionItem[]) => void;
  onDeselectAllInCategory: (items: PermissionItem[]) => void;
  isLoading?: boolean;
}

export function PermissionMatrix({
  catalog,
  selectedPermissions,
  onTogglePermission,
  onSelectAllInCategory,
  onDeselectAllInCategory,
  isLoading = false,
}: PermissionMatrixProps) {
  if (isLoading) {
    return (
      <div className="py-8 text-center text-xs text-slate-400">
        Memuat katalog hak akses...
      </div>
    );
  }

  // Group catalog items by category
  const groupedCatalog = catalog.reduce<Record<string, PermissionItem[]>>(
    (acc, item) => {
      const cat = item.category || "Lainnya";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-5">
      {Object.entries(groupedCatalog).map(([category, items]) => {
        const allSelected = items.every((i) =>
          selectedPermissions.includes(i.code),
        );

        return (
          <fieldset
            key={category}
            className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 space-y-3.5 m-0"
          >
            <legend className="sr-only">{category}</legend>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                {category}
              </span>
              <button
                type="button"
                onClick={() =>
                  allSelected
                    ? onDeselectAllInCategory(items)
                    : onSelectAllInCategory(items)
                }
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                {allSelected ? "Batalkan Semua" : "Pilih Semua"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((item) => {
                const isChecked = selectedPermissions.includes(item.code);
                return (
                  <div
                    key={item.code}
                    onClick={() => onTogglePermission(item.code)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-150 select-none ${
                      isChecked
                        ? "bg-emerald-50/50 border-emerald-500 shadow-xs ring-1 ring-emerald-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => onTogglePermission(item.code)}
                      />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
