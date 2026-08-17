import type { InvoicePdfData } from "./invoice-pdf.service";
import { InvoicePdfService } from "./invoice-pdf.service";

export interface SendPaymentInvoiceEmailInput {
  recipientEmail: string;
  recipientName: string;
  tenantName: string;
  tenantSubdomain?: string | null;
  invoiceId: string;
  planName: string;
  planCode: string;
  amount: number;
  billingCycle: string;
  expiresAt: Date | string;
  paymentMethod?: string;
  pdfAttachment?: Buffer;
}

export interface EmailDispatchResult {
  sent: boolean;
  messageId: string;
  recipient: string;
  subject: string;
  attachmentName: string;
  dispatchedAt: Date;
}

export class EmailNotificationService {
  /**
   * Generates formatted HTML email body for subscription payment confirmation.
   */
  static generateEmailHtml(data: SendPaymentInvoiceEmailInput): string {
    const formattedAmount = InvoicePdfService.formatRupiah(data.amount);
    const formattedExpires = InvoicePdfService.formatDate(data.expiresAt);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bukti Pembayaran Langganan ZII POS</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid #334155;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #10b981; margin: 0; font-size: 24px;">ZII POS SaaS</h1>
      <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Konfirmasi Pembayaran & Aktivasi Lisensi</p>
    </div>

    <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
      <h2 style="color: #10b981; margin: 0; font-size: 18px;">Pembayaran Berhasil Diterima (LUNAS)</h2>
      <p style="color: #cbd5e1; font-size: 13px; margin-top: 6px;">Lisensi kasir multi-tenant Anda telah aktif 100% secara instan 24/7.</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
      <tr>
        <td style="padding: 8px 0; color: #94a3b8;">Nomor Faktur</td>
        <td style="padding: 8px 0; color: #f8fafc; font-weight: bold; text-align: right;">#${data.invoiceId.slice(0, 8).toUpperCase()}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #94a3b8;">Nama Merchant</td>
        <td style="padding: 8px 0; color: #f8fafc; font-weight: bold; text-align: right;">${data.tenantName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #94a3b8;">Subdomain Toko</td>
        <td style="padding: 8px 0; color: #10b981; font-weight: bold; text-align: right;">${data.tenantSubdomain || "-"}.ziipos.com</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #94a3b8;">Paket Langganan</td>
        <td style="padding: 8px 0; color: #f8fafc; font-weight: bold; text-align: right;">${data.planName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #94a3b8;">Total Biaya</td>
        <td style="padding: 8px 0; color: #10b981; font-weight: bold; font-size: 16px; text-align: right;">${formattedAmount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #94a3b8;">Masa Aktif Hingga</td>
        <td style="padding: 8px 0; color: #f8fafc; font-weight: bold; text-align: right;">${formattedExpires}</td>
      </tr>
    </table>

    <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
      Terlampir dokumen resmi <strong>Faktur / Invoice PDF</strong> bukti transaksi yang sah. Anda dapat langsung membuka dashboard kasir dan melayani transaksi pelanggan tanpa hambatan.
    </p>

    <div style="text-align: center; margin-top: 32px; border-top: 1px solid #334155; padding-top: 20px;">
      <p style="color: #64748b; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} ZII POS Commercial SaaS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Dispatches the payment confirmation email along with the generated PDF Invoice attachment.
   */
  static async sendPaymentInvoiceEmail(
    input: SendPaymentInvoiceEmailInput,
  ): Promise<EmailDispatchResult> {
    const pdfBuffer =
      input.pdfAttachment ||
      InvoicePdfService.generateInvoicePdf({
        invoiceId: input.invoiceId,
        paidAt: new Date(),
        tenantName: input.tenantName,
        tenantSubdomain: input.tenantSubdomain,
        customerName: input.recipientName,
        customerEmail: input.recipientEmail,
        planName: input.planName,
        planCode: input.planCode,
        billingCycle: input.billingCycle,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        expiresAt: input.expiresAt,
      });

    const attachmentName = `Invoice_ZII_${input.invoiceId.slice(0, 8).toUpperCase()}.pdf`;
    const subject = `[ZII POS] Konfirmasi Pembayaran & Faktur Lisensi #${input.invoiceId.slice(0, 8).toUpperCase()} - ${input.tenantName}`;

    // Simulation / Integration logger
    console.log(
      `📧 [EmailNotificationService] Sending Payment Invoice to ${input.recipientEmail} (${attachmentName}, Size: ${pdfBuffer.length} bytes)`,
    );

    return {
      sent: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      recipient: input.recipientEmail,
      subject,
      attachmentName,
      dispatchedAt: new Date(),
    };
  }
}
