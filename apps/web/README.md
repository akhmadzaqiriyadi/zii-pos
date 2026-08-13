# ZII POS — Frontend Application (`@zii/web`)

Aplikasi Frontend ZII POS berbasis **Next.js 16 (App Router)** dengan **Feature-Driven Domain Architecture** dan **Custom Radix UI Primitives + Tailwind CSS Design System**.

---

## 📐 Architecture & Structure

Aplikasi ini tidak menggunakan library UI eksternal opiniated seperti shadcn/ui. Semua komponen UI dibangun secara kustom memanfaatkan primitive headless dari Radix UI untuk aksesibilitas maksimal dan Tailwind CSS untuk styling.

```text
apps/web/src/
├── app/                       # App Router Pages
│   ├── (dashboard)/
│   │   ├── pos/page.tsx       # Route: /pos
│   │   ├── products/page.tsx  # Route: /products
│   │   └── settings/page.tsx  # Route: /settings
│   └── page.tsx               # Route: / (Enterprise Navigation)
│
├── components/                # Shared Design System
│   ├── ui/                    # Primitives (Button, Dialog, Badge, Card, Input)
│   └── layout/                # Navbar & Shared Layouts
│
├── features/                  # Feature Modules
│   ├── pos/                   # ProductGrid, CartSidebar, ReceiptModal, useCart
│   ├── products/              # ProductTable
│   └── settings/              # TenantBrandingForm
│
├── hooks/                     # Shared Custom Hooks (useDebounce)
└── lib/                       # Global Utilities (api-client, cn, utils)
```

---

## 🚀 Running Locally

```bash
# Dari root monorepo:
bun --filter '@zii/web' dev
```

Akses di browser: `http://localhost:3000`

---

## 🎨 Design System Principles

- **Primary Brand Color:** Emerald (`#16a34a` / `emerald-600`)
- **Base Typography:** System UI / Inter font stack
- **Accessibility:** Setiap interaktif elemen menggunakan atribut ARIA dan prop `type="button"` eksplisit sesuai aturan linter Biome.
