import type { TransactionItem } from "@zii/types";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { formatRupiah } from "../../../lib/utils";

interface CartSidebarProps {
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
  return (
    <div className="flex w-96 flex-col bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5 text-emerald-600" />
          <h2 className="font-bold text-slate-800">Keranjang Belanja</h2>
        </div>
        <Badge variant="slate">{totalQty} item</Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
            <ShoppingCart className="mb-2 h-12 w-12 stroke-1 text-slate-300" />
            <p className="text-sm font-medium">Keranjang masih kosong</p>
            <p className="text-xs">
              Klik produk di sebelah kiri untuk menambahkan
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex-1 pr-2">
                <h4 className="text-xs font-semibold text-slate-800">
                  {item.productName}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {formatRupiah(item.price)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 rounded-lg bg-white border border-slate-200">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.productId, -1)}
                    className="p-1 text-slate-500 hover:text-red-600 cursor-pointer"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-slate-700">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.productId, 1)}
                    className="p-1 text-slate-500 hover:text-emerald-600 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.productId)}
                  className="text-slate-300 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-3">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Nama Pelanggan (Opsional)"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
            />
            <Input
              type="tel"
              placeholder="No WhatsApp (untuk Struk WA)"
              value={customerPhone}
              onChange={(e) => onCustomerPhoneChange(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Metode Pembayaran:</span>
            <div className="flex space-x-1">
              {(["cash", "qris", "transfer"] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => onPaymentMethodChange(method)}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase transition cursor-pointer ${
                    paymentMethod === method
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-2">
            <span className="text-sm font-bold text-slate-700">TOTAL:</span>
            <span className="text-lg font-extrabold text-emerald-600">
              {formatRupiah(totalAmount)}
            </span>
          </div>

          <Button
            onClick={onCheckout}
            className="w-full text-sm font-bold py-6"
          >
            BAYAR SEKARANG
          </Button>
        </div>
      )}
    </div>
  );
}
