import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

/**
 * Invoice PDF Generator Service for ZII POS SaaS Subscription Billing.
 * Features a warm soft-beige background (#FAF7F2), emerald accents, 3D Zii logo,
 * clean typography, and a 3-column bottom layout for payment info, terms, and support.
 */

export interface InvoicePdfData {
  invoiceId: string;
  paidAt: Date | string;
  tenantName: string;
  tenantSubdomain?: string | null;
  customerName?: string;
  customerEmail?: string;
  planName: string;
  planCode: string;
  billingCycle: "monthly" | "yearly" | string;
  amount: number;
  paymentMethod?: string;
  expiresAt: Date | string;
}

interface CachedLogoData {
  width: number;
  height: number;
  deflatedRgb: Buffer;
  deflatedAlpha: Buffer;
}

export class InvoicePdfService {
  private static cachedLogo: CachedLogoData | null = null;

  /**
   * Loads and decodes PNG logo into deflated RGB and Alpha streams for PDF XObject embedding.
   */
  private static getLogoData(): CachedLogoData | null {
    if (InvoicePdfService.cachedLogo) {
      return InvoicePdfService.cachedLogo;
    }

    try {
      const logoPath = path.resolve(__dirname, "../../assets/logo-zii-pos.png");
      if (!fs.existsSync(logoPath)) {
        return null;
      }

      const buf = fs.readFileSync(logoPath);
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);

      let p = 8;
      const idatChunks: Buffer[] = [];
      while (p < buf.length) {
        const len = buf.readUInt32BE(p);
        const type = buf.subarray(p + 4, p + 8).toString();
        if (type === "IDAT") idatChunks.push(buf.subarray(p + 8, p + 8 + len));
        p += 12 + len;
      }

      const idat = Buffer.concat(idatChunks);
      const raw = zlib.inflateSync(idat);

      const bpp = 4;
      const rowLen = width * bpp;
      const rgb = Buffer.alloc(width * height * 3);
      const alpha = Buffer.alloc(width * height);

      const prevRow = Buffer.alloc(rowLen);
      const currRow = Buffer.alloc(rowLen);

      function paeth(a: number, b: number, c: number) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        if (pa <= pb && pa <= pc) return a;
        if (pb <= pc) return b;
        return c;
      }

      let rawOffset = 0;
      let rgbOffset = 0;
      let alphaOffset = 0;

      for (let y = 0; y < height; y++) {
        const filterType = raw[rawOffset++];
        for (let x = 0; x < rowLen; x++) {
          const rawVal = raw[rawOffset++];
          const left = x >= bpp ? currRow[x - bpp] : 0;
          const up = prevRow[x];
          const upLeft = x >= bpp ? prevRow[x - bpp] : 0;

          let val = 0;
          if (filterType === 0) val = rawVal;
          else if (filterType === 1) val = (rawVal + left) & 0xff;
          else if (filterType === 2) val = (rawVal + up) & 0xff;
          else if (filterType === 3)
            val = (rawVal + Math.floor((left + up) / 2)) & 0xff;
          else if (filterType === 4)
            val = (rawVal + paeth(left, up, upLeft)) & 0xff;

          currRow[x] = val;
        }

        for (let i = 0; i < width; i++) {
          const px = i * 4;
          rgb[rgbOffset++] = currRow[px];
          rgb[rgbOffset++] = currRow[px + 1];
          rgb[rgbOffset++] = currRow[px + 2];
          alpha[alphaOffset++] = currRow[px + 3];
        }

        currRow.copy(prevRow);
      }

      InvoicePdfService.cachedLogo = {
        width,
        height,
        deflatedRgb: zlib.deflateSync(rgb),
        deflatedAlpha: zlib.deflateSync(alpha),
      };

      return InvoicePdfService.cachedLogo;
    } catch {
      return null;
    }
  }

  /**
   * Formats a number to Indonesian Rupiah currency string.
   */
  static formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Formats a date to Indonesian localized date format.
   */
  static formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
    }).format(new Date(date));
  }

  /**
   * Formats a date to compact dot-separated format (e.g. 16.08.2026).
   */
  static formatDotDate(date: Date | string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  /**
   * Generates a sleek, modern PDF invoice in soft beige background with emerald aesthetics.
   */
  static generateInvoicePdf(data: InvoicePdfData): Buffer {
    const formattedAmount = InvoicePdfService.formatRupiah(data.amount);
    const dotDate = InvoicePdfService.formatDotDate(data.paidAt);
    const formattedExpires = InvoicePdfService.formatDate(data.expiresAt);
    const cycleLabel = data.billingCycle === "yearly" ? "1 Tahun" : "1 Bulan";
    const shortInvoiceNo = `INV-${data.invoiceId.slice(0, 8).toUpperCase()}`;

    const logoData = InvoicePdfService.getLogoData();

    // PDF Stream definitions
    const contentLines: string[] = [
      // ==========================================
      // 0. FULL-PAGE SOFT BEIGE BACKGROUND (#FAF7F2)
      // ==========================================
      "0.98 0.97 0.95 rg", // Soft warm luxury beige
      "0 0 595.28 841.89 re f",

      // ==========================================
      // 1. TOP HEADER (Logo Left, INVOICE & Billing To Right)
      // ==========================================
    ];

    if (logoData) {
      // 3D Emerald Brand Logo on Left
      contentLines.push(
        "q",
        "75 0 0 50 48 742 cm", // 1.5 : 1 ratio
        "/Logo Do",
        "Q",
      );
    } else {
      contentLines.push(
        "0.02 0.58 0.41 rg", // Emerald Box
        "48 750 34 34 re f",
        "1 1 1 rg",
        "BT",
        "/F2 13 Tf",
        "55 762 Td",
        "(ZII) Tj",
        "ET",
      );
    }

    contentLines.push(
      // Left Brand Tagline beneath logo
      "0.2 0.22 0.25 rg",
      "BT",
      "/F2 10 Tf",
      "48 726 Td",
      "(ZII POS TECHNOLOGIES) Tj",
      "ET",

      "0.48 0.5 0.55 rg",
      "BT",
      "/F1 7.5 Tf",
      "48 714 Td",
      "(Platform Kasir Multi-Tenant Indonesia) Tj",
      "ET",

      // Top Right: INVOICE Title & Date
      "0.1 0.12 0.15 rg",
      "BT",
      "/F2 26 Tf",
      "375 776 Td",
      "(INVOICE) Tj",
      "ET",

      "0.45 0.48 0.53 rg",
      "BT",
      "/F1 8.5 Tf",
      "375 760 Td",
      `(${InvoicePdfService.escapePdf(`TANGGAL: ${dotDate}`)}) Tj`,
      "ET",

      // Top Right: BILLING TO
      "0.1 0.12 0.15 rg",
      "BT",
      "/F2 8.5 Tf",
      "375 738 Td",
      "(DITAGIHKAN KEPADA:) Tj",
      "ET",

      "0.1 0.12 0.15 rg",
      "BT",
      "/F2 9.5 Tf",
      "375 723 Td",
      `(${InvoicePdfService.escapePdf(data.customerName || "Pemilik Toko")}) Tj`,
      "ET",

      "0.4 0.43 0.48 rg",
      "BT",
      "/F1 8 Tf",
      "375 710 Td",
      `(${InvoicePdfService.escapePdf(`Toko: ${data.tenantName}`)}) Tj`,
      "0 -11 Td",
      `(${InvoicePdfService.escapePdf(`Subdomain: ${data.tenantSubdomain || "-"}.ziipos.com`)}) Tj`,
      "0 -11 Td",
      `(${InvoicePdfService.escapePdf(`Email: ${data.customerEmail || "owner@zii.id"}`)}) Tj`,
      "ET",

      // ==========================================
      // 2. HERO TITLE (Big Clean Project/Product Statement)
      // ==========================================
      "0.02 0.58 0.41 rg", // Emerald green label
      "BT",
      "/F2 8.5 Tf",
      "48 668 Td",
      "(PAKET LANGGANAN SAAS:) Tj",
      "ET",

      "0.08 0.1 0.14 rg",
      "BT",
      "/F2 20 Tf",
      "48 644 Td",
      `(${InvoicePdfService.escapePdf(data.planName.toUpperCase())}) Tj`,
      "0 -22 Td",
      "(LISENSI KASIR POS AKTIF 24/7) Tj",
      "ET",

      // Small modern accent block
      "0.02 0.58 0.41 rg",
      "48 596 8 8 re f",

      // ==========================================
      // 3. TABLE SECTION (Clean Light Grid on Beige)
      // ==========================================
      // Table Header Row
      "0.12 0.15 0.2 rg",
      "BT",
      "/F2 8 Tf",
      "48 572 Td",
      "(NO) Tj",
      "28 0 Td",
      "(DESKRIPSI LAYANAN) Tj",
      "224 0 Td",
      "(HARGA) Tj",
      "75 0 Td",
      "(DURASI) Tj",
      "75 0 Td",
      "(TOTAL) Tj",
      "ET",

      // Table Header Lines
      "0.6 w",
      "0.82 0.8 0.76 RG",
      "48 584 m 547 584 l S",
      "48 562 m 547 562 l S",

      // Row 1: Paket SaaS Utama
      "0.1 0.12 0.15 rg",
      "BT",
      "/F1 8.5 Tf",
      "48 544 Td",
      "(1.) Tj",
      "28 0 Td",
      "/F2 8.5 Tf",
      `(${InvoicePdfService.escapePdf(`Langganan ${data.planName}`)}) Tj`,
      "ET",

      "0.45 0.48 0.53 rg",
      "BT",
      "/F1 7 Tf",
      "76 533 Td",
      "(Akses kasir POS, katalog produk, struk cetak & database cloud) Tj",
      "ET",

      "0.1 0.12 0.15 rg",
      "BT",
      "/F3 8.5 Tf",
      "300 544 Td",
      `(${InvoicePdfService.escapePdf(formattedAmount)}) Tj`,
      "75 0 Td",
      `(${InvoicePdfService.escapePdf(cycleLabel)}) Tj`,
      "75 0 Td",
      `(${InvoicePdfService.escapePdf(formattedAmount)}) Tj`,
      "ET",

      "0.88 0.86 0.82 RG",
      "48 522 m 547 522 l S",

      // Row 2: Subdomain & White-Label Isolation
      "0.1 0.12 0.15 rg",
      "BT",
      "/F1 8.5 Tf",
      "48 506 Td",
      "(2.) Tj",
      "28 0 Td",
      "/F2 8.5 Tf",
      "(Subdomain & Keamanan Multi-Tenant) Tj",
      "ET",

      "0.45 0.48 0.53 rg",
      "BT",
      "/F1 7 Tf",
      "76 495 Td",
      `(${InvoicePdfService.escapePdf(`Akses eksklusif ${data.tenantSubdomain || "-"}.ziipos.com & isolasi database`)}) Tj`,
      "ET",

      "0.1 0.12 0.15 rg",
      "BT",
      "/F3 8.5 Tf",
      "300 506 Td",
      "(Rp 0) Tj",
      "75 0 Td",
      "(Termasuk) Tj",
      "75 0 Td",
      "(Rp 0) Tj",
      "ET",

      "0.88 0.86 0.82 RG",
      "48 484 m 547 484 l S",

      // Row 3: Thermal Print & WA Notifications
      "0.1 0.12 0.15 rg",
      "BT",
      "/F1 8.5 Tf",
      "48 468 Td",
      "(3.) Tj",
      "28 0 Td",
      "/F2 8.5 Tf",
      "(Thermal Print Engine & WA Support) Tj",
      "ET",

      "0.45 0.48 0.53 rg",
      "BT",
      "/F1 7 Tf",
      "76 457 Td",
      "(Integrasi printer thermal kasir 58/80mm & backup otomatis) Tj",
      "ET",

      "0.1 0.12 0.15 rg",
      "BT",
      "/F3 8.5 Tf",
      "300 468 Td",
      "(Rp 0) Tj",
      "75 0 Td",
      "(Termasuk) Tj",
      "75 0 Td",
      "(Rp 0) Tj",
      "ET",

      "0.82 0.8 0.76 RG",
      "48 446 m 547 446 l S",

      // ==========================================
      // 4. TOTAL DUE CARD & SUMMARY BREAKDOWN
      // ==========================================
      // Left: Highlighted Total Due Box
      "0.92 0.95 0.93 rg", // Soft emerald-tint container
      "48 375 220 54 re f",
      "0.02 0.58 0.41 RG", // Emerald border
      "48 375 220 54 re S",

      "0.02 0.58 0.41 rg",
      "BT",
      "/F2 8 Tf",
      "60 414 Td",
      "(TOTAL DIBAYAR (LUNAS):) Tj",
      "ET",

      "0.02 0.58 0.41 rg",
      "BT",
      "/F3 16 Tf", // Huge Emerald Bold Price
      "60 388 Td",
      `(${InvoicePdfService.escapePdf(formattedAmount)}) Tj`,
      "ET",

      // Right: Subtotal & Tax Breakdown
      "0.4 0.43 0.48 rg",
      "BT",
      "/F1 8.5 Tf",
      "360 415 Td",
      "(Subtotal:) Tj",
      "0 -14 Td",
      "(Pajak PPN 11%:) Tj",
      "0 -16 Td",
      "/F2 9.5 Tf",
      "0.1 0.12 0.15 rg",
      "(Total Akhir:) Tj",
      "ET",

      "BT",
      "/F3 8.5 Tf",
      "465 415 Td",
      `(${InvoicePdfService.escapePdf(formattedAmount)}) Tj`,
      "0 -14 Td",
      "(Rp 0 (Termasuk)) Tj",
      "0 -16 Td",
      "/F3 9.5 Tf",
      "0.02 0.58 0.41 rg",
      `(${InvoicePdfService.escapePdf(formattedAmount)}) Tj`,
      "ET",

      // Divider Line above footer columns
      "0.5 w",
      "0.82 0.8 0.76 RG",
      "48 348 m 547 348 l S",

      // ==========================================
      // 5. THREE-COLUMN BOTTOM SECTION (1 Row, 3 Columns)
      // ==========================================
      // Column 1: Info Pembayaran (X = 48 -> 200)
      "0.1 0.12 0.15 rg",
      "BT",
      "/F2 9 Tf",
      "48 328 Td",
      "(Info Pembayaran:) Tj",
      "ET",

      "0.4 0.43 0.48 rg",
      "BT",
      "/F1 7.5 Tf",
      "48 312 Td",
      "(Gateway: Midtrans 24/7) Tj",
      "0 -11 Td",
      `(${InvoicePdfService.escapePdf(`No. Faktur: ${shortInvoiceNo}`)}) Tj`,
      "0 -11 Td",
      `(${InvoicePdfService.escapePdf(`Metode: ${data.paymentMethod || "QRIS / VA"}`)}) Tj`,
      "0 -11 Td",
      "(Status: LUNAS / VERIFIED) Tj",
      "ET",

      // Column 2: Syarat & Ketentuan (X = 220 -> 380)
      "0.1 0.12 0.15 rg",
      "BT",
      "/F2 9 Tf",
      "220 328 Td",
      "(Syarat & Ketentuan:) Tj",
      "ET",

      "0.4 0.43 0.48 rg",
      "BT",
      "/F1 7.5 Tf",
      "220 312 Td",
      `(${InvoicePdfService.escapePdf(`Aktif s/d ${formattedExpires}`)}) Tj`,
      "0 -11 Td",
      "(Akses kasir POS & stok aktif.) Tj",
      "0 -11 Td",
      "(Faktur digital sah tanpa) Tj",
      "0 -11 Td",
      "(tanda tangan basah fisik.) Tj",
      "ET",

      // Column 3: Bantuan & Kontak (X = 390 -> 547)
      "0.1 0.12 0.15 rg",
      "BT",
      "/F2 9 Tf",
      "390 328 Td",
      "(Bantuan & Kontak:) Tj",
      "ET",

      "0.4 0.43 0.48 rg",
      "BT",
      "/F1 7.5 Tf",
      "390 312 Td",
      "(Email: billing@ziipos.com) Tj",
      "0 -11 Td",
      "(WhatsApp Support: 24/7) Tj",
      "0 -11 Td",
      "(Portal: ziipos.com/help) Tj",
      "0 -11 Td",
      "(Solusi Kasir Ritel & Jasa) Tj",
      "ET",

      // ==========================================
      // 6. BOTTOM FOOTER BAR (Clean Monospace Center)
      // ==========================================
      "0.5 w",
      "0.82 0.8 0.76 RG",
      "48 245 m 547 245 l S",

      "0.5 0.52 0.58 rg",
      "BT",
      "/F1 7.5 Tf",
      "120 230 Td",
      "(ZII POS Cloud Infrastructure • Menara Astra Lt. 28, Jakarta • support@ziipos.com • www.ziipos.com) Tj",
      "ET",
    );

    const streamContent = contentLines.join("\n");
    const streamBuffer = Buffer.from(streamContent, "utf-8");

    // Standard PDF-1.4 document construction with Sans-serif text, Tabular Numeral fonts, and Logo XObject
    const headerParts: string[] = [
      "%PDF-1.4",
      "1 0 obj",
      "<< /Type /Catalog /Pages 2 0 R >>",
      "endobj",

      "2 0 obj",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "endobj",

      "3 0 obj",
      logoData
        ? "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> /XObject << /Logo 8 0 R >> >> >>"
        : "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> >>",
      "endobj",

      "4 0 obj",
      `<< /Length ${streamBuffer.length} >>`,
      "stream\n",
    ];

    const middleParts: string[] = [
      "\nendstream",
      "endobj",

      "5 0 obj",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      "endobj",

      "6 0 obj",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
      "endobj",

      "7 0 obj",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>",
      "endobj",
    ];

    const pdfBuffers: Buffer[] = [
      Buffer.from(headerParts.join("\n"), "utf-8"),
      streamBuffer,
      Buffer.from(middleParts.join("\n"), "utf-8"),
    ];

    let totalObjects = 7;

    if (logoData) {
      totalObjects = 9;

      const alphaObjHeader = [
        "",
        "9 0 obj",
        `<< /Type /XObject /Subtype /Image /Width ${logoData.width} /Height ${logoData.height} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode /Length ${logoData.deflatedAlpha.length} >>`,
        "stream\n",
      ].join("\n");

      const imageObjHeader = [
        "\nendstream",
        "endobj",
        "8 0 obj",
        `<< /Type /XObject /Subtype /Image /Width ${logoData.width} /Height ${logoData.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /SMask 9 0 R /Length ${logoData.deflatedRgb.length} >>`,
        "stream\n",
      ].join("\n");

      const imageObjFooter = "\nendstream\nendobj\n";

      pdfBuffers.push(
        Buffer.from(alphaObjHeader, "utf-8"),
        logoData.deflatedAlpha,
        Buffer.from(imageObjHeader, "utf-8"),
        logoData.deflatedRgb,
        Buffer.from(imageObjFooter, "utf-8"),
      );
    }

    const trailerParts = [
      "xref",
      `0 ${totalObjects + 1}`,
      "0000000000 65535 f ",
      "0000000010 00000 n ",
      "0000000060 00000 n ",
      "0000000117 00000 n ",
      "0000000281 00000 n ",
      "0000000380 00000 n ",
      "0000000459 00000 n ",
      "0000000543 00000 n ",
    ];

    if (logoData) {
      trailerParts.push("0000000620 00000 n ", "0000000750 00000 n ");
    }

    trailerParts.push(
      "trailer",
      `<< /Size ${totalObjects + 1} /Root 1 0 R >>`,
      "startxref",
      "625",
      "%%EOF",
    );

    pdfBuffers.push(Buffer.from(trailerParts.join("\n"), "utf-8"));

    return Buffer.concat(pdfBuffers);
  }

  /**
   * Escape special PDF string characters
   */
  private static escapePdf(str: string): string {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }
}
