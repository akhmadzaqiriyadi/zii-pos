# ZII POS — General Retail & Service White-Label POS Monorepo 🚀

![ZII POS Banner](https://img.shields.io/badge/Stack-Bun_Monorepo_%7C_Next.js_16_%7C_Express_TS_%7C_Prisma_v6_%7C_Radix_UI-0f172a?style=for-the-badge&logo=bun)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)
![Version](https://img.shields.io/badge/Release-v1.0.0--mvp-blue?style=for-the-badge)
![Testing](https://img.shields.io/badge/Unit_Tests-11_PASS_(76ms)-emerald?style=for-the-badge)

Dokumentasi monorepo resmi untuk **ZII POS** — Aplikasi Point of Sale (POS) Multi-Tenant & White-Label untuk Toko Ritel General dan Penyedia Jasa (Laundry, Barbershop, Repair, Distro, dll).

---

## 🏗️ Monorepo Architecture & Stack

Dikembangkan dengan arsitektur **Bun Workspaces Monorepo** performa tinggi:

```text
zii-pos/
├── apps/
│   ├── api/          # Express.js REST API (TypeScript + Bun Runtime)
│   └── web/          # Next.js 16 (App Router + Turbopack + Radix UI + Tailwind CSS)
├── packages/
│   ├── db/           # Prisma ORM v6 (PostgreSQL Client & Database Seeder)
│   └── types/        # Shared TypeScript Interfaces & Data Contracts
├── PRD.md            # Product & Technical Requirement Document
├── TESTING_GUIDE.md  # Guide & Strategy Testing (Bun Test)
├── GIT_PUSH_GUIDE.md # Panduan Developer Git & Push
└── CONTRIBUTING.md   # Code Rules & Conventions Tim ZII
```

---

## 🛠️ Modul & Tech Stack Utama

| Layer | Teknologi | Keterangan |
|:---|:---|:---|
| **Runtime & Package Manager** | **Bun 1.3+** | Super fast package manager & workspace bundler |
| **Frontend App** | **Next.js 16 (App Router)** | Tailwind CSS + Custom Radix UI Primitives (NO shadcn/ui) |
| **Backend API** | **Express.js (TypeScript)** | Running natively on Bun + Pino Logger + JWT Auth |
| **Database & ORM** | **Prisma v6 + PostgreSQL** | 5 Tabel Utama + Database Seeder Script |
| **OpenAPI Docs UI** | **Scalar API Reference** | Auto OpenAPI Docs via Zod (`/docs`) |
| **Testing Runner** | **Bun Native Test Runner** | 11 Unit Tests (`bun test`) completed in < 100ms |
| **Linter & Formatter** | **Biome JS 1.9+** | Universal linter & formatter (`bun run lint:fix`) |

---

## ⚡ Quick Start / Panduan Memulai

### 1. Prasyarat System:
* Install [Bun](https://bun.sh) (`curl -fsSL https://bun.sh/install | bash`)

### 2. Clone & Install Dependencies:
```bash
git clone https://github.com/akhmadzaqiriyadi/zii-pos.git
cd zii-pos
bun install
```

### 3. Setup Environment Variables:
Copy file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

### 4. Setup Database & Database Seeder:
```bash
# Push skema tabel Prisma ke PostgreSQL
bun db:push

# Generate Prisma Client
bun db:generate

# Seed data demo realistis (2 Tenant, Products, Users, & Transactions)
bun db:seed
```

### 5. Jalankan Mode Development (Frontend + Backend Concurrent):
```bash
bun dev
```

* **Frontend Web:** `http://localhost:3000`
* **Backend Express API:** `http://localhost:4000`
* **Interactive Scalar OpenAPI Docs:** `http://localhost:4000/docs`
* **Health Check API:** `http://localhost:4000/health`

---

## 🧪 Testing & Verification

Jalankan pengujian unit otomatis dan linter checklist:

```bash
# Run 11 Backend Unit Tests
bun test

# Run Biome Linter Fix
bun run lint:fix

# Verify Production Builds
bun run build
```

---

## 📡 Ringkasan REST API Endpoints

### 🔐 1. Authentication (`/api/v1/auth`)
- **`POST /api/v1/auth/register-tenant`** : Register Owner + Tenant Toko Baru dalam 1 DB Transaction.
- **`POST /api/v1/auth/login`** : Login User Kasir/Owner & Return JWT Token.

### 🏪 2. Tenant Profile & White-Label (`/api/v1/tenants`)
- **`GET /api/v1/tenants/profile`** : Ambil profil merchant & setting White-Label struk.
- **`PUT /api/v1/tenants/profile`** : Update logo toko, no telp, alamat, & footer nota.

### 🛍️ 3. Katalog Produk & Jasa (`/api/v1/products`)
- **`GET /api/v1/products`** : Ambil katalog produk terpaginasi.
  - Query Filters: `?page=1&limit=10&search=Kaos&isService=false&lowStock=true&minPrice=50000&maxPrice=150000&sortBy=price&sortOrder=asc`

### 💳 4. Transaksi Penjualan (`/api/v1/transactions`)
- **`GET /api/v1/transactions`** : Ambil riwayat penjualan terpaginasi.
  - Query Filters: `?page=1&limit=10&search=Budi&startDate=2026-08-01&endDate=2026-08-13&paymentMethod=qris&status=completed`
- **`POST /api/v1/transactions`** : Simpan transaksi kasir & otomatis potong stok produk non-jasa di database.

---

## 🤝 Foundational Engineering Team

* **Zaqi** — PM Engineer, Backend & Integration Lead (Express API, DB Persistence, Thermal Print Driver & WA Integration)
* **Isyadi** — Frontend Lead (Core POS Kasir UI, Products Catalog, SWR Data Fetching)
* **Ilham** — Fullstack Lead (Auth API, Halaman Login UI, JWT Auth Context & Protected Routes)
