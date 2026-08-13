import type { Product } from "@zii/types";
import { Plus } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { formatRupiah } from "../../../lib/utils";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
      {products.map((prod) => (
        <button
          type="button"
          key={prod.id}
          onClick={() => onAddToCart(prod)}
          className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs transition hover:border-emerald-500 hover:shadow-md active:scale-98 cursor-pointer"
        >
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Badge variant={prod.isService ? "amber" : "blue"}>
                {prod.isService ? "JASA" : "RETAIL"}
              </Badge>
              {!prod.isService && (
                <span className="text-[11px] text-slate-400">
                  Stok: {prod.stock}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition">
              {prod.name}
            </h3>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">
              {formatRupiah(prod.price)}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Plus className="h-4 w-4" />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
