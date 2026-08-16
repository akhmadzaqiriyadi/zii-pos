import type { TransactionItem } from "@zii/types";
import { formatRupiah } from "../../../lib/utils";

interface MerchantInfo {
  name: string;
  phone: string;
  address: string;
  receiptFooter: string;
}

interface FormatWaReceiptParams {
  merchant: MerchantInfo;
  cart: TransactionItem[];
  paymentMethod: string;
  totalAmount: number;
  customerName?: string;
  transactionId?: string;
}

/**
 * Normalizes Indonesian phone numbers into international format required by WhatsApp API.
 * Example:
 *  "081242163116"   => "6281242163116"
 *  "+6281242163116" => "6281242163116"
 *  "6281242163116"  => "6281242163116"
 */
export function normalizePhoneForWhatsApp(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.startsWith("0")) {
    return `62${digitsOnly.slice(1)}`;
  }
  if (digitsOnly.startsWith("62")) {
    return digitsOnly;
  }
  return digitsOnly;
}

/**
 * Formats a clean, professional WhatsApp receipt message using WhatsApp Markdown formatting (*bold*, _italic_).
 */
export function formatWhatsAppReceipt({
  merchant,
  cart,
  paymentMethod,
  totalAmount,
  customerName,
  transactionId,
}: FormatWaReceiptParams): string {
  const now = new Date().toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const itemsList = cart
    .map((item) => {
      const priceFormatted = formatRupiah(item.price);
      const subtotalFormatted = formatRupiah(item.subtotal);
      return `- *${item.qty}x ${item.productName}*\n  @ ${priceFormatted} = *${subtotalFormatted}*`;
    })
    .join("\n\n");

  const lines = [
    "*STRUK BUKTI PEMBAYARAN LUNAS*",
    "*========================================*",
    `*TOKO:* *${merchant.name.toUpperCase()}*`,
    merchant.address ? `*Alamat:* ${merchant.address}` : "",
    merchant.phone ? `*Telp:* ${merchant.phone}` : "",
    "----------------------------------------",
    transactionId ? `*ID Transaksi:* #${transactionId}` : "",
    `*Tanggal:* ${now}`,
    customerName ? `*Pelanggan:* ${customerName}` : "",
    `*Metode Bayar:* *${paymentMethod.toUpperCase()}*`,
    "----------------------------------------",
    "*DETAIL ITEM BELANJA:*",
    itemsList,
    "----------------------------------------",
    `*TOTAL BELANJA:* *${formatRupiah(totalAmount)}*`,
    "*========================================*",
    merchant.receiptFooter
      ? `_${merchant.receiptFooter}_`
      : "_Terima kasih telah berbelanja di toko kami!_",
    "_Powered by ZII POS SaaS_",
  ].filter(Boolean);

  return lines.join("\n");
}

/**
 * Generates an official wa.me direct URL with properly formatted phone number and encoded text payload.
 */
export function generateWhatsAppReceiptUrl(
  phone: string,
  params: FormatWaReceiptParams,
): string {
  const cleanPhone = normalizePhoneForWhatsApp(phone);
  const messageText = formatWhatsAppReceipt(params);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
}
