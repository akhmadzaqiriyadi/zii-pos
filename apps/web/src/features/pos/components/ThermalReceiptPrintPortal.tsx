"use client";

import type { TransactionItem } from "@zii/types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { formatRupiah } from "../../../lib/utils";

interface MerchantInfo {
  name: string;
  phone: string;
  address: string;
  receiptFooter: string;
}

interface ThermalReceiptPrintPortalProps {
  merchant: MerchantInfo;
  cart: TransactionItem[];
  paymentMethod: string;
  totalAmount: number;
}

/**
 * Portals the 58mm HTML receipt layout directly to document.body.
 * Ensures Chrome print engine targets body > #thermal-receipt-print without Radix modal clipping.
 */
export function ThermalReceiptPrintPortal({
  merchant,
  cart,
  paymentMethod,
  totalAmount,
}: ThermalReceiptPrintPortalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <div id="thermal-receipt-print">
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <strong style={{ fontSize: "13px", display: "block" }}>
          {merchant.name}
        </strong>
        <div>{merchant.address}</div>
        <div>Telp: {merchant.phone}</div>
        <div>--------------------------------</div>
      </div>

      <div style={{ marginBottom: "4px" }}>
        {cart.map((item) => (
          <div
            key={item.productId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2px",
            }}
          >
            <span>
              {item.qty}x {item.productName}
            </span>
            <span>{formatRupiah(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: "1px dashed #000",
          paddingTop: "4px",
          marginTop: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          <span>TOTAL ({paymentMethod.toUpperCase()})</span>
          <span>{formatRupiah(totalAmount)}</span>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "8px",
          paddingTop: "4px",
          borderTop: "1px dashed #000",
        }}
      >
        <div>{merchant.receiptFooter}</div>
        <div style={{ fontSize: "8px", marginTop: "4px", opacity: 0.8 }}>
          Powered by ZII POS SaaS
        </div>
      </div>
    </div>,
    document.body,
  );
}
