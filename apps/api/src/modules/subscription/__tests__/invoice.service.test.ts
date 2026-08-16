import { describe, expect, it } from "bun:test";
import { EmailNotificationService } from "../email-notification.service";
import { InvoicePdfService } from "../invoice-pdf.service";

describe("Invoice PDF Generator & Email Notification Unit Tests", () => {
  const mockInvoiceData = {
    invoiceId: "inv-test-12345678",
    paidAt: new Date("2026-08-16T12:00:00Z"),
    tenantName: "ZII Distro & Apparel Studio",
    tenantSubdomain: "ziidistro",
    customerName: "Zaqi Owner",
    customerEmail: "zaqi@zii.id",
    planName: "Pro Merchant White-Label",
    planCode: "pro",
    billingCycle: "monthly",
    amount: 99000,
    paymentMethod: "MIDTRANS_QRIS",
    expiresAt: new Date("2026-09-16T12:00:00Z"),
  };

  it("should generate a valid PDF buffer with PDF-1.4 header and footer", () => {
    const pdfBuffer = InvoicePdfService.generateInvoicePdf(mockInvoiceData);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(100);

    const pdfString = pdfBuffer.toString("utf-8");
    expect(pdfString).toContain("%PDF-1.4");
    expect(pdfString).toContain("%%EOF");
    expect(pdfString).toContain("ZII POS");
    expect(pdfString).toContain("INVOICE");
    expect(pdfString).toContain("TOTAL DIBAYAR");
    expect(pdfString).toContain("Pro Merchant White-Label");
  });

  it("should format currency and date correctly in Indonesian locale", () => {
    const formattedRp = InvoicePdfService.formatRupiah(99000);
    expect(formattedRp).toContain("99.000");

    const formattedDate = InvoicePdfService.formatDate("2026-08-16T12:00:00Z");
    expect(formattedDate.length).toBeGreaterThan(5);
  });

  it("should generate clean HTML email template with payment confirmation", () => {
    const html = EmailNotificationService.generateEmailHtml({
      recipientEmail: "zaqi@zii.id",
      recipientName: "Zaqi Owner",
      tenantName: "ZII Distro & Apparel Studio",
      tenantSubdomain: "ziidistro",
      invoiceId: "inv-test-12345678",
      planName: "Pro Merchant White-Label",
      planCode: "pro",
      amount: 99000,
      billingCycle: "monthly",
      expiresAt: "2026-09-16T12:00:00Z",
    });

    expect(html).toContain("ZII POS SaaS");
    expect(html).toContain("LUNAS");
    expect(html).toContain("ZII Distro & Apparel Studio");
    expect(html).toContain("ziidistro.ziipos.com");
    expect(html).toContain("Pro Merchant White-Label");
  });

  it("should successfully dispatch email notification with PDF attachment", async () => {
    const dispatchResult =
      await EmailNotificationService.sendPaymentInvoiceEmail({
        recipientEmail: "zaqi@zii.id",
        recipientName: "Zaqi Owner",
        tenantName: "ZII Distro & Apparel Studio",
        tenantSubdomain: "ziidistro",
        invoiceId: "inv-test-12345678",
        planName: "Pro Merchant White-Label",
        planCode: "pro",
        amount: 99000,
        billingCycle: "monthly",
        expiresAt: "2026-09-16T12:00:00Z",
        paymentMethod: "MIDTRANS_QRIS",
      });

    expect(dispatchResult.sent).toBe(true);
    expect(dispatchResult.recipient).toBe("zaqi@zii.id");
    expect(dispatchResult.subject).toContain("Konfirmasi Pembayaran");
    expect(dispatchResult.attachmentName).toContain("Invoice_ZII_");
  });
});
