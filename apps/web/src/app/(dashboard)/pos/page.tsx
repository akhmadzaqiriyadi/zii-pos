"use client";

import type { Product } from "@zii/types";
import { useEffect, useState } from "react";
import { Navbar } from "../../../components/layout/navbar";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { CartSidebar } from "../../../features/pos/components/CartSidebar";
import { ProductGrid } from "../../../features/pos/components/ProductGrid";
import { ReceiptModal } from "../../../features/pos/components/ReceiptModal";
import { useCart } from "../../../features/pos/hooks/useCart";
import { PosApiService } from "../../../features/pos/services/posApi";

export default function POSDashboardPage() {
  const { user, tenant } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "qris" | "transfer"
  >("cash");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const {
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    totalAmount,
    totalQty,
  } = useCart();

  const merchant = {
    name: tenant?.name || "ZII Distro & Laundry Studio",
    phone: tenant?.phone || "0812-9988-7766",
    address: tenant?.address || "Jl. Merdeka Raya No. 45, Jakarta",
    receiptFooter: tenant?.phone
      ? `Hubungi kami: ${tenant.phone}`
      : "Terima kasih telah berbelanja di ZII Store! Simpan nota ini sebagai bukti garansi.",
  };

  useEffect(() => {
    PosApiService.getProducts().then(setProducts);
  }, []);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsSuccessModalOpen(true);
  };

  const handleReset = () => {
    clearCart();
    setCustomerName("");
    setCustomerPhone("");
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans">
      <div className="flex flex-1 flex-col overflow-y-auto border-r border-slate-200">
        <Navbar
          merchantName={merchant.name}
          cashierName={user?.name || "Kasir"}
        />
        <main className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-md font-bold text-slate-700">
              Katalog Produk & Jasa
            </h2>
            <span className="text-xs text-slate-500">
              {products.length} item tersedia
            </span>
          </div>
          <ProductGrid products={products} onAddToCart={addToCart} />
        </main>
      </div>

      <CartSidebar
        cart={cart}
        customerName={customerName}
        customerPhone={customerPhone}
        paymentMethod={paymentMethod}
        totalAmount={totalAmount}
        totalQty={totalQty}
        onCustomerNameChange={setCustomerName}
        onCustomerPhoneChange={setCustomerPhone}
        onPaymentMethodChange={setPaymentMethod}
        onUpdateQty={updateQty}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <ReceiptModal
        isOpen={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        merchant={merchant}
        cart={cart}
        paymentMethod={paymentMethod}
        totalAmount={totalAmount}
        customerPhone={customerPhone}
        onReset={handleReset}
      />
    </div>
  );
}
