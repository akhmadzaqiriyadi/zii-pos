"use client";

import { ChevronRight, PanelRightOpen, ShoppingCart } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { CartSidebar } from "../../../features/pos/components/CartSidebar";
import { PaymentModal } from "../../../features/pos/components/PaymentModal";
import { ProductGrid } from "../../../features/pos/components/ProductGrid";
import { ReceiptModal } from "../../../features/pos/components/ReceiptModal";
import { usePosDashboard } from "../../../features/pos/hooks/usePosDashboard";
import { formatRupiah } from "../../../lib/utils";

export default function POSDashboardPage() {
  const {
    search,
    setSearch,
    filterType,
    setFilterType,
    page,
    setPage,
    totalPages,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    paymentMethod,
    setPaymentMethod,
    isCartOpen,
    setIsCartOpen,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    products,
    totalCount,
    isLoading,
    cart,
    updateQty,
    removeFromCart,
    totalAmount,
    totalQty,
    handleAddToCart,
    merchant,
    lastCompletedReceipt,
    handleOpenPaymentModal,
    handleSuccessTransaction,
    handleResetCart,
  } = usePosDashboard();

  return (
    <DashboardLayout>
      <div className="flex h-full w-full overflow-hidden relative">
        {/* Catalog Area (Left Side) — Dynamically expands when cart is collapsed */}
        <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden transition-all duration-300">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
              </div>
            </header>

            <ProductGrid
              products={products}
              totalCount={totalCount}
              search={search}
              filterType={filterType}
              page={page}
              totalPages={totalPages}
              isLoading={isLoading}
              onSearchChange={setSearch}
              onFilterTypeChange={setFilterType}
              onPageChange={setPage}
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
        {!isCartOpen && (
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl bg-emerald-600 px-5 py-3.5 text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition cursor-pointer active:scale-95"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm font-extrabold">
              Keranjang ({totalQty})
              {totalAmount > 0 ? ` • ${formatRupiah(totalAmount)}` : ""}
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
          onOpenChange={(open) => {
            setIsSuccessModalOpen(open);
            if (!open) handleResetCart();
          }}
          merchant={merchant}
          cart={lastCompletedReceipt?.cart || cart}
          paymentMethod={lastCompletedReceipt?.paymentMethod || paymentMethod}
          totalAmount={lastCompletedReceipt?.totalAmount || totalAmount}
          customerPhone={lastCompletedReceipt?.customerPhone || customerPhone}
          onReset={handleResetCart}
        />
      </div>
    </DashboardLayout>
  );
}
