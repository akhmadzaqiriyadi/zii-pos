"use client";

import React from "react";
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
    <div className="space-y-4">
      {Object.entries(groupedCatalog).map(([category, items]) => {
        const allSelected = items.every((i) =>
          selectedPermissions.includes(i.code),
        );

        return (
          <fieldset
            key={category}
            className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 m-0"
          >
            <legend className="sr-only">{category}</legend>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
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
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                {allSelected ? "Batalkan Semua" : "Pilih Semua"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {items.map((item) => {
                const isChecked = selectedPermissions.includes(item.code);
                return (
                  <label
                    key={item.code}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all select-none ${
                      isChecked
                        ? "bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-500/20"
                        : "bg-white/80 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onTogglePermission(item.code)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
