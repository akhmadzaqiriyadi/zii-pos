# CHANGELOG — ZII POS Release History

Semua perubahan penting pada proyek ZII POS dicatat dalam dokumen ini. Format berbasis [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) dan mematuhi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0-saas] - 2026-08-16

### 📦 Added (Commercial SaaS Platform & Database Models)
- **Extended Database Schema (Prisma ORM):** Added `Plan`, `Subscription`, `SubscriptionInvoice` tables, and updated `Tenant` model with unique `subdomain` and `status` (`trial` | `active` | `expired` | `suspended`).
- **Dynamic SaaS Plan Management (`/api/v1/plans` & `/api/v1/saas-admin/plans`):** Full CRUD for subscription plans with configurable prices, cashier limits, white-label toggles, and Excel export permissions.
- **Super Admin SaaS Metrics & Management Portal API (`/api/v1/saas-admin`):**
  - `GET /api/v1/saas-admin/metrics`: Real-time calculation of Total Merchants, Active Trials, Active Paid Subscriptions, MRR (Monthly Recurring Revenue), and Churn Rate.
  - `GET /api/v1/saas-admin/tenants`: Paginated list of registered stores with status filters and search.
  - `PUT /api/v1/saas-admin/tenants/:id/status`: Manual store status management and license suspension.
- **Automated Subscription & Payment Webhook Receiver (`/api/v1/subscriptions`):**
  - `GET /api/v1/subscriptions/current`: License details, days remaining, cashier quota, and feature permissions.
  - `POST /api/v1/subscriptions/checkout`: Generates payment gateway invoices, QRIS payload, and checkout URLs.
  - `POST /api/v1/subscriptions/webhook`: Automated 24/7 payment callback verification via Midtrans SHA512 signature, invoice settlement, and automatic store license activation/renewal.
- **Scalar OpenAPI Specification:** Registered Zod OpenAPI schemas for Plans, Super Admin, and Subscription modules (`/docs` and `/docs.json`).

### 🧪 Testing & Quality
- **31 Unit Tests Passed:** Added comprehensive unit test suites for Plan CRUD, Super Admin metrics & pagination, and Subscription webhook/signature verification with 100% pass rate (`bun test`).

---

## [1.1.0] - 2026-08-14

### 🖨️ Added & Enhanced (Thermal Printing & Hardware Architecture)
- **WebUSB Direct ESC/POS Byte Streaming:** Direct USB thermal printer communication via WebUSB (`navigator.usb.requestDevice()` & `device.transferOut()`) for POS-V29DD to bypass OS/browser print dialogs.
- **32-Column ESC/POS Binary Encoder (`escPosFormatter.ts`):** Standard binary ESC/POS formatting with centered header, bold store name, column-32 aligned item pricing, bold total line, and auto paper cut (`GS V 0`).
- **Interactive Header Printer Badge:** Top navbar status badge (`🟢 Printer: POS-V29DD`) opening a modular printer settings modal (`PrinterSettingsModal.tsx`).
- **Thermal Receipt Portal (`ThermalReceiptPrintPortal.tsx`):** Fixed browser print blank page issue by portaling receipt layout directly to `document.body`.

### 📲 Added (WhatsApp Digital Receipt)
- **Indonesian Phone Normalizer (`waReceiptFormatter.ts`):** Converts local numbers (`08xx`, `+628xx`) to international format `628xx`.
- **WhatsApp Markdown Digital Receipt Generator:** Generates formatted receipt strings with WhatsApp Markdown (`*bold*`, `_italic_`, `=` line dividers) for direct customer sharing via `wa.me`.
- **Unicode Character Encoding Fix:** Resolved multi-byte surrogate character URL encoding corruption.

### 🧩 Refactored (Hyper-Modular Feature Architecture)
- **Presenter & Hook Separation:** Decomposed all dashboard pages (`/pos`, `/products`, `/transactions`, `/settings`) into presenter components (< 100 lines) delegating state and side-effects to custom hooks (`usePosDashboard`, `useProductsDashboard`, `useTransactionsDashboard`, `useTenantSettingsForm`).
- **Atomic Subcomponents:** Created `ProductCard.tsx`, `CartItemRow.tsx`, `PaymentMethodSelector.tsx`, `PaymentCashCalculator.tsx`, `ProductTypeSelector.tsx`, `ProductDeleteModal.tsx`, `TransactionMetricCards.tsx`, `TransactionDetailModal.tsx`, `PrinterStatusCard.tsx`, `PrinterModeSelector.tsx`, and `TenantSettingsForm.tsx`.
- **Cart Cleanup:** Removed redundant customer info form section from `CartSidebar.tsx` (handled cleanly in `PaymentModal.tsx`).

### 🎨 Design System & Layout
- **Full-Width Responsive Layout:** Converted all dashboard pages to 100% full-width edge-to-edge rendering (`w-full`).
- **Emerald Green Theme Harmonization:** Standardized all active filter pills, pagination buttons, and primary action buttons to Emerald Green (`bg-emerald-600 hover:bg-emerald-700 text-white`).

### 🧪 Testing
- **15 Unit Tests Passed:** Expanded test suite across Auth, Tenant, Product, Transaction, and WhatsApp Formatter modules (`bun test`).

---

## [1.0.0-mvp] - 2026-08-12

### 🚀 Added
- **Monorepo Setup:** Inisialisasi Bun Workspaces (`apps/web`, `apps/api`, `packages/db`, `packages/types`).
- **Frontend App (`apps/web`):** Next.js 16 (App Router), Feature-Driven Domain Architecture, Custom Radix UI Primitives + Tailwind CSS Design System.
- **Backend API (`apps/api`):** Express TS running natively di Bun, Modular Controller-Service-Middleware Pattern.
- **OpenAPI Documentation:** Integrated **Scalar API Reference** di `http://localhost:4000/docs`.
- **Logging System:** Pino HTTP Logger dengan `pino-pretty` di development mode.
- **Database (`packages/db`):** Prisma ORM v6 dengan 5 core tables (`tenants`, `users`, `products`, `transactions`, `transaction_items`).
- **Linter & Formatter:** Biome Linter & Formatter terkonfigurasi di root monorepo.
- **Documentation:** `README.md`, `PRD.md`, `CONTRIBUTING.md`, `GIT_PUSH_GUIDE.md`.
