# ZII POS — Engineering Code Rules & Conventions 📜

Dokumen ini berisi standar koding, aturan monorepo, dan konvensi pengembangan software untuk tim ZII (**Zaqi, Isyadi, Ilham**).

---

## 🛠️ Stack & Standards

- **Runtime & PM:** Bun Workspaces Monorepo
- **Linter & Formatter:** Biome JS 1.9+ (`bun run lint:fix`)
- **Backend Framework:** Express.js TypeScript (Running natively on Bun)
- **Frontend Framework:** Next.js 16 (App Router + Turbopack + Radix UI + Tailwind CSS)
- **Database:** Prisma ORM v6 + PostgreSQL (`bun db:seed`)
- **Testing:** Bun Native Test Runner (`bun test`) — 11 Unit Tests PASSED

---

## 📌 Alokasi Tugas Resmi Tim ZII (Sprint 1)

- **`feature/receipt-wa-print` (Zaqi — Integration & Backend Lead):**
  - Express REST API, Multi-Tenant Header Middleware, Prisma DB Persistence & Seeder, Scalar OpenAPI Docs & Zod Models, Bun Unit Testing Suite (11 PASS).
  - Driver Cetak Struk Thermal 58mm/80mm (`useThermalPrinter.ts`).
  - Auto-Send WhatsApp Receipt Integration (`whatsappService.ts`).

- **`feature/pos-cart-ui` (Isyadi — Frontend Lead):**
  - POS Layar Kasir UI (`/pos`) & Modal Pembayaran (Tunai/QRIS + Hitung Kembalian).
  - Search Bar & Filter Pencarian Produk Real-Time.
  - SWR Data Fetching Integration dengan Express REST API.
  - Modal Form Tambah & Edit Produk Baru di `/products`.

- **`feature/auth-fullstack` (Ilham — Fullstack Lead):**
  - Endpoint Backend Auth (`POST /api/v1/auth/register-tenant` & `/login`).
  - Halaman Login & Register Merchant UI (`/login` & `/register`).
  - Client Auth Context & LocalStorage / Cookie Token Handler di Next.js.
  - Protected Route Middleware untuk Halaman Kasir & Dashboard Owner.
