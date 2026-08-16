export interface ReceiptData {
  merchant: {
    name: string;
    address: string;
    phone: string;
    receiptFooter: string;
  };
  cart: {
    productName: string;
    qty: number;
    subtotal: number;
  }[];
  totalAmount: number;
  paymentMethod: string;
}

/**
 * Formats receipt data into exact ESC/POS 58mm (32 column) binary byte array.
 * Features centered headers, bold titles, right-aligned prices, and clean padding.
 */
export function formatEscPosReceipt(data: ReceiptData): Uint8Array {
  const bytes: number[] = [];
  const encoder = new TextEncoder();

  const pushText = (str: string) => {
    const encoded = encoder.encode(str);
    encoded.forEach((b) => bytes.push(b));
  };

  // 1. ESC @ (Initialize Printer)
  bytes.push(0x1b, 0x40);

  // 2. Center Align (ESC a 1) & Bold ON (ESC E 1) for Store Header
  bytes.push(0x1b, 0x61, 0x01);
  bytes.push(0x1b, 0x45, 0x01);
  pushText(`${data.merchant.name.toUpperCase()}\n`);

  // Bold OFF (ESC E 0)
  bytes.push(0x1b, 0x45, 0x00);
  pushText(`${data.merchant.address}\n`);
  pushText(`Telp: ${data.merchant.phone}\n`);
  pushText("--------------------------------\n");

  // 3. Left Align (ESC a 0) for Cart Items
  bytes.push(0x1b, 0x61, 0x00);

  data.cart.forEach((item) => {
    const qtyPrefix = `${item.qty}x `;
    const priceStr = `Rp ${item.subtotal.toLocaleString("id-ID")}`;
    const maxLineLen = 32;

    const reservedLen = qtyPrefix.length + priceStr.length + 1;
    const nameMaxLen = Math.max(8, maxLineLen - reservedLen);

    let name = item.productName;
    if (name.length > nameMaxLen) {
      name = `${name.substring(0, nameMaxLen - 1)}.`;
    }

    const padLen = Math.max(
      1,
      maxLineLen - (qtyPrefix.length + name.length + priceStr.length),
    );
    pushText(`${qtyPrefix}${name}${" ".repeat(padLen)}${priceStr}\n`);
  });

  // Divider
  pushText("--------------------------------\n");

  // 4. Bold ON for Total Row
  bytes.push(0x1b, 0x45, 0x01);
  const totalLabel = `TOTAL (${data.paymentMethod.toUpperCase()})`;
  const totalVal = `Rp ${data.totalAmount.toLocaleString("id-ID")}`;
  const totalPad = Math.max(1, 32 - (totalLabel.length + totalVal.length));
  pushText(`${totalLabel}${" ".repeat(totalPad)}${totalVal}\n`);
  bytes.push(0x1b, 0x45, 0x00);

  pushText("--------------------------------\n");

  // 5. Center Align Footer
  bytes.push(0x1b, 0x61, 0x01);
  pushText(`${data.merchant.receiptFooter}\n`);
  pushText("Powered by ZII POS SaaS\n");

  // 6. Paper Feed (4 lines) & Cut (GS V 0)
  pushText("\n\n\n\n");
  bytes.push(0x1d, 0x56, 0x00);

  return new Uint8Array(bytes);
}
