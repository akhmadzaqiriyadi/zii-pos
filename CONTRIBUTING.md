# ZII POS — Engineering Code Rules & Conventions 📜

Dokumen ini berisi standar koding, aturan monorepo, dan konvensi pengembangan software untuk tim ZII (**Zaqi, Isyadi, Ilham**).

---

## 🛠️ Stack & Standards

- **Runtime & PM:** Bun Workspaces Monorepo
- **Linter & Formatter:** Biome JS 1.9+ (`bun run lint:fix`)
- **Backend Framework:** Express.js TypeScript (Running natively on Bun)
- **Frontend Framework:** Next.js 16 (App Router + Turbopack + Radix UI + Tailwind CSS)
- **Database:** Prisma ORM v6 + PostgreSQL (`bun db:seed`)
- **Testing:** Bun Native Test Runner (`bun test`) — **15 Unit Tests PASSED (100%)**

---

## 📌 Rekap Alokasi & Penyelesaian Tugas Tim ZII

### 🚀 Sprint 2 (v1.1.0 — Completed 100%):
- **Zaqi (Integration & Hardware Architecture Lead):**
  - WebUSB Direct ESC/POS Byte Streaming ke Printer POS-V29DD (`useThermalPrinter.ts`, `escPosFormatter.ts`).
  - WhatsApp Markdown Receipt Normalizer (`waReceiptFormatter.ts`, `08xx` -> `628xx`).
  - Modularisasi Presenter & Custom Hooks (`usePosDashboard`, `useProductsDashboard`, `useTransactionsDashboard`, `useTenantSettingsForm`).
  - Refaktoring Komponen Atomik (`ProductCard`, `CartItemRow`, `PaymentMethodSelector`, `PaymentCashCalculator`, `TenantSettingsForm`, dll).
  - Penataan Layout Full-Width 100% Responsive (`w-full`) & Harmonisasi Tema Warna Hijau Emerald.
  - Ekspansi Suite Unit Testing Monorepo menjadi **15 PASS / 0 FAIL**.

### 🚀 Sprint 1 (v1.0.0 MVP — Completed 100%):
- **Zaqi (Backend Lead):**
  - Express REST API, Multi-Tenant Header Middleware, Prisma DB Persistence & Seeder, Scalar OpenAPI Docs & Zod Models.
  - Driver Cetak Struk Thermal 58mm/80mm HTML Print Engine (`ThermalReceiptPrintPortal.tsx`).
- **Isyadi (Frontend Lead):**
  - Layar POS Kasir UI (`/pos`) & Modal Pembayaran (Tunai/QRIS/Transfer + Hitung Kembalian).
  - Halaman Riwayat Transaksi & Laporan Omset UI (`/transactions`) beserta Modal Detail Struk Belanja.
  - Search Bar & Filter Pencarian Produk Real-Time.
  - Form Modal Tambah & Edit Produk Baru di `/products`.
- **Ilham (Fullstack Lead):**
  - Endpoint Backend Auth (`POST /api/v1/auth/register-tenant` & `/login`).
  - Halaman Login & Register Merchant UI (`/login` & `/register`).
  - Protected Route Middleware untuk Halaman Kasir & Dashboard Owner.
