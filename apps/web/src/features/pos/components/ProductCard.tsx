"use client";

import type { Product } from "@zii/types";
import { AlertCircle, Plus } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { formatRupiah } from "../../../lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isLowStock = !product.isService && product.stock <= 5;

  return (
    <button
      type="button"
      onClick={() => onAddToCart(product)}
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-98 cursor-pointer min-h-[160px] min-w-0 ${
        isLowStock
          ? "border-2 border-rose-300 bg-rose-50/20 hover:border-rose-500 hover:shadow-rose-100/60"
          : "border-slate-200/90 bg-white hover:border-emerald-500"
      }`}
    >
      <article className="w-full h-full flex flex-col justify-between">
        <div>
          <div className="mb-3.5 flex items-center justify-between gap-1.5 flex-wrap">
            <Badge
              variant={product.isService ? "amber" : "blue"}
              className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider"
            >
              {product.isService ? "JASA" : "RETAIL"}
            </Badge>
            {!product.isService && (
              <span
                className={`text-xs font-bold flex items-center gap-1 shrink-0 ${
                  isLowStock
                    ? "bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200"
                    : "bg-slate-100/80 text-slate-500 px-2.5 py-1 rounded-full"
                }`}
              >
                {isLowStock && (
                  <AlertCircle className="h-3.5 w-3.5 inline text-rose-600 animate-pulse" />
                )}
                Stok: {product.stock}
              </span>
            )}
          </div>
          <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition text-sm sm:text-base leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100/80">
          <span
            className={`font-extrabold text-base ${
              isLowStock ? "text-rose-700" : "text-slate-900 font-sans"
            }`}
          >
            {formatRupiah(product.price)}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-emerald-600 group-hover:text-white shadow-2xs">
            <Plus className="h-4 w-4" />
          </span>
        </div>
      </article>
    </button>
  );
}
