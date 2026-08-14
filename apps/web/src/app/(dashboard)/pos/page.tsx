"use client";

import { ChevronRight, PanelRightOpen, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { CartSidebar } from "../../../features/pos/components/CartSidebar";
import { PaymentModal } from "../../../features/pos/components/PaymentModal";
import { ProductGrid } from "../../../features/pos/components/ProductGrid";
import { ReceiptModal } from "../../../features/pos/components/ReceiptModal";
import { useCart } from "../../../features/pos/hooks/useCart";
import { usePosProducts } from "../../../features/pos/hooks/usePosProducts";
import { formatRupiah } from "../../../lib/utils";

export default function POSDashboardPage() {
  const { tenant } = useAuth();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "qris" | "transfer"
  >("cash");

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { products, totalCount, isLoading } = usePosProducts(
    search,
    filterType,
  );

  const {
    cart,
    addToCart: rawAddToCart,
    updateQty,
    removeFromCart,
    clearCart,
    totalAmount,
    totalQty,
  } = useCart();

  const handleAddToCart = (product: Parameters<typeof rawAddToCart>[0]) => {
    rawAddToCart(product);
    if (!isCartOpen) {
      setIsCartOpen(true);
    }
  };

  const merchant = {
    name: tenant?.name || "ZII Distro & Laundry Studio",
    phone: tenant?.phone || "0812-9988-7766",
    address: tenant?.address || "Jl. Merdeka Raya No. 45, Jakarta",
    receiptFooter: tenant?.phone
      ? `Hubungi kami: ${tenant.phone}`
      : "Terima kasih telah berbelanja di ZII Store! Simpan nota ini sebagai bukti garansi.",
  };

  const handleOpenPaymentModal = () => {
    if (cart.length === 0) return;
    setIsPaymentModalOpen(true);
  };

  const handleSuccessTransaction = () => {
    setIsPaymentModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleResetCart = () => {
    clearCart();
    setCustomerName("");
    setCustomerPhone("");
    setIsSuccessModalOpen(false);
    setIsCartOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex h-full w-full overflow-hidden relative">
        {/* Catalog Area (Left Side) — Dynamically expands when cart is collapsed */}
        <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden transition-all duration-300">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  Katalog Produk & Jasa Kasir
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Pilih barang atau jasa toko untuk ditambahkan langsung ke
                  transaksi kasir.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
                  {products.length} dari {totalCount} Item Ditampilkan
                </span>

                {!isCartOpen && (
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition cursor-pointer shrink-0"
                  >
                    <PanelRightOpen className="h-4 w-4" />
                    <span>Buka Keranjang ({totalQty})</span>
                  </button>
                )}
              </div>
            </div>

            <ProductGrid
              products={products}
              totalCount={totalCount}
              search={search}
              filterType={filterType}
              isLoading={isLoading}
              onSearchChange={setSearch}
              onFilterTypeChange={setFilterType}
              onAddToCart={handleAddToCart}
            />
          </main>
        </div>

        {/* Cart Sidebar (Right Side — Dynamic Panel & Mobile Overlay) */}
        <CartSidebar
          isOpen={isCartOpen}
          onToggleOpen={() => setIsCartOpen(!isCartOpen)}
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
          onCheckout={handleOpenPaymentModal}
        />

        {/* Floating Cart Button when collapsed */}
        {!isCartOpen && totalQty > 0 && (
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl bg-emerald-600 px-5 py-3.5 text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition cursor-pointer active:scale-95 animate-bounce"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm font-extrabold">
              Keranjang ({totalQty}) • {formatRupiah(totalAmount)}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          cart={cart}
          totalAmount={totalAmount}
          customerName={customerName}
          customerPhone={customerPhone}
          paymentMethod={paymentMethod}
          onCustomerNameChange={setCustomerName}
          onCustomerPhoneChange={setCustomerPhone}
          onPaymentMethodChange={setPaymentMethod}
          onSuccessTransaction={handleSuccessTransaction}
        />

        <ReceiptModal
          isOpen={isSuccessModalOpen}
          onOpenChange={setIsSuccessModalOpen}
          merchant={merchant}
          cart={cart}
          paymentMethod={paymentMethod}
          totalAmount={totalAmount}
          customerPhone={customerPhone}
          onReset={handleResetCart}
        />
      </div>
    </DashboardLayout>
  );
}
