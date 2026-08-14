import { describe, expect, it } from "bun:test";
import {
  formatWhatsAppReceipt,
  generateWhatsAppReceiptUrl,
  normalizePhoneForWhatsApp,
} from "../waReceiptFormatter";

describe("WhatsApp Receipt Formatter Unit Tests", () => {
  it("should normalize Indonesian phone numbers correctly for WhatsApp API", () => {
    expect(normalizePhoneForWhatsApp("081242163116")).toBe("6281242163116");
    expect(normalizePhoneForWhatsApp("+6281242163116")).toBe("6281242163116");
    expect(normalizePhoneForWhatsApp("6281242163116")).toBe("6281242163116");
    expect(normalizePhoneForWhatsApp("0812-4216-3116")).toBe("6281242163116");
  });

  it("should format beautiful WhatsApp receipt message with Markdown styling", () => {
    const text = formatWhatsAppReceipt({
      merchant: {
        name: "ZII Distro & Apparel Studio",
        phone: "081299887766",
        address: "Jl. Merdeka Raya No. 45",
        receiptFooter: "Terima kasih telah berbelanja!",
      },
      cart: [
        {
          productId: "1",
          productName: "Kaos Polos",
          price: 45000,
          qty: 1,
          subtotal: 45000,
        },
      ],
      paymentMethod: "cash",
      totalAmount: 45000,
      customerName: "Zaqi",
      transactionId: "TRX-101",
    });

    expect(text).toContain("*STRUK BUKTI PEMBAYARAN LUNAS*");
    expect(text).toContain("*TOKO:* *ZII DISTRO & APPAREL STUDIO*");
    expect(text).toContain("- *1x Kaos Polos*");
    expect(text).toContain("*TOTAL BELANJA:* *Rp45.000*");
    expect(text).toContain("_Terima kasih telah berbelanja!_");
  });

  it("should generate valid wa.me URL with clean international phone number", () => {
    const url = generateWhatsAppReceiptUrl("081242163116", {
      merchant: {
        name: "ZII Store",
        phone: "0812345",
        address: "Jakarta",
        receiptFooter: "Simpan nota ini.",
      },
      cart: [
        {
          productId: "1",
          productName: "Kopi",
          price: 15000,
          qty: 2,
          subtotal: 30000,
        },
      ],
      paymentMethod: "qris",
      totalAmount: 30000,
    });

    expect(url.startsWith("https://wa.me/6281242163116?text=")).toBe(true);
    expect(url).toContain("ZII%20STORE");
  });
});
