"use client";

import type { TransactionItem } from "@zii/types";
import {
  ChevronRight,
  Minus,
  PanelRightClose,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { formatRupiah } from "../../../lib/utils";

interface CartSidebarProps {
  isOpen?: boolean;
  onToggleOpen?: () => void;
  cart: TransactionItem[];
  customerName: string;
  customerPhone: string;
  paymentMethod: "cash" | "qris" | "transfer";
  totalAmount: number;
  totalQty: number;
  onCustomerNameChange: (val: string) => void;
  onCustomerPhoneChange: (val: string) => void;
  onPaymentMethodChange: (val: "cash" | "qris" | "transfer") => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export function CartSidebar({
  isOpen = true,
  onToggleOpen,
  cart,
  customerName,
  customerPhone,
  paymentMethod,
  totalAmount,
  totalQty,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onPaymentMethodChange,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}: CartSidebarProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile/Tablet Backdrop Blur */}
      {isOpen && onToggleOpen && (
        <button
          type="button"
          onClick={onToggleOpen}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity border-0 cursor-default"
          aria-label="Close cart overlay"
        />
      )}

      <aside className="fixed lg:relative inset-y-0 right-0 z-50 lg:z-30 w-full sm:w-[380px] xl:w-[420px] h-full shrink-0 flex flex-col bg-white border-l border-slate-200 shadow-2xl lg:shadow-lg transition-all duration-300">
        {/* Sidebar Header */}
        <header className="shrink-0 flex items-center justify-between border-b border-slate-200 p-4 sm:p-5 bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Keranjang POS
              </h2>
              <p className="text-[11px] text-slate-500">Daftar pesanan kasir</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="emerald" className="font-bold">
              {totalQty} item
            </Badge>
            {onToggleOpen && (
              <button
                type="button"
                onClick={onToggleOpen}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer lg:hidden"
                title="Tutup Keranjang"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </header>

        {/* Cart Items List */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-400 p-6 space-y-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-300">
                <ShoppingCart className="h-7 w-7 stroke-1" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Keranjang Masih Kosong
              </p>
              <p className="text-xs text-slate-400">
                Klik item pada katalog produk untuk menambah ke kasir.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <article
                key={item.productId}
                className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 shadow-xs transition hover:border-slate-300 gap-2"
              >
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
                      className="p-1 text-slate-500 hover:bg-slate-100 hover:text-red-600 rounded-lg transition cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-extrabold text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.productId, 1)}
                      className="p-1 text-slate-500 hover:bg-slate-100 hover:text-emerald-600 rounded-lg transition cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.productId)}
                    className="p-1 text-slate-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        {/* Cart Summary & Action Area */}
        {cart.length > 0 && (
          <footer className="shrink-0 border-t border-slate-200 p-4 sm:p-5 bg-slate-50/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Total Tagihan
              </span>
              <span className="text-xl font-extrabold text-emerald-600">
                {formatRupiah(totalAmount)}
              </span>
            </div>

            <Button
              onClick={onCheckout}
              size="lg"
              className="w-full text-base font-extrabold py-6 shadow-lg shadow-emerald-600/20"
            >
              PROSES BAYAR ({formatRupiah(totalAmount)})
            </Button>
          </footer>
        )}
      </aside>
    </>
  );
}
