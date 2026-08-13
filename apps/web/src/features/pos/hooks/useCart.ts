import type { Product, TransactionItem } from "@zii/types";
import { useState } from "react";

export function useCart() {
  const [cart, setCart] = useState<TransactionItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                qty: item.qty + 1,
                subtotal: (item.qty + 1) * item.price,
              }
            : item,
        );
      }
      return [
        ...prevCart,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          qty: 1,
          subtotal: product.price,
        },
      ];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((item) => {
            if (item.productId === productId) {
              const newQty = item.qty + delta;
              return newQty > 0
                ? { ...item, qty: newQty, subtotal: newQty * item.price }
                : null;
            }
            return item;
          })
          .filter(Boolean) as TransactionItem[],
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  return {
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    totalAmount,
    totalQty,
  };
}
