"use client";

import type { TransactionItem } from "@zii/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatRupiah } from "../../../lib/utils";

interface CartItemRowProps {
  item: TransactionItem;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
}

export function CartItemRow({
  item,
  onUpdateQty,
  onRemoveItem,
}: CartItemRowProps) {
  return (
    <article className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 shadow-xs transition hover:border-slate-300 gap-2">
      <div className="flex-1 min-w-0 pr-1">
        <h4 className="text-xs font-bold text-slate-800 leading-tight truncate">
          {item.productName}
        </h4>
        <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
          {formatRupiah(item.price)}
        </p>
      </div>
      <div className="flex items-center space-x-2 shrink-0">
        <div className="flex items-center space-x-1 rounded-xl bg-white border border-slate-200 p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => onUpdateQty(item.productId, -1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title="Kurangi Qty"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-7 text-center text-xs font-extrabold text-slate-900">
            {item.qty}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQty(item.productId, 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title="Tambah Qty"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => onRemoveItem(item.productId)}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
          title="Hapus Item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
