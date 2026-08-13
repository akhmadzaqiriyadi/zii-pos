# ZII POS — Enterprise White-Label Point of Sale

[![Stack: Bun](https://img.shields.io/badge/Runtime-Bun-black?style=flat-square&logo=bun)](https://bun.sh)
[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js%2016-blue?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![Express TS](https://img.shields.io/badge/Backend-Express%20TS-emerald?style=flat-square&logo=express)](https://expressjs.com)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma%20v6-indigo?style=flat-square&logo=prisma)](https://prisma.io)
[![UI: Radix](https://img.shields.io/badge/UI-Custom%20Radix%20%2B%20Tailwind-purple?style=flat-square)](https://radix-ui.com)
[![Linter: Biome](https://img.shields.io/badge/Linter-Biome-yellow?style=flat-square)](https://biomejs.dev)

**ZII POS** adalah platform sistem kasir (*Point of Sale*) berbasis Web/PWA *multi-tenant* dan *white-label* yang dirancang untuk toko retail umum dan usaha jasa lokal (toko kelontong, distro, petshop, kedai minuman, jasa laundry/bengkel).

---

## 🏛️ Monorepo Architecture Overview

Monorepo ini dikelola menggunakan **Bun Workspaces** dengan arsitektur terisolasi per paket:

```text
zii-pos/
├── apps/
│   ├── web/               # Next.js 16 App Router (Feature-Driven Architecture)
│   └── api/               # Express TS Server (Modular Controller-Service Architecture + Scalar Docs)
│
├── packages/
│   ├── db/                # Prisma ORM Schema (5 Core Tables) & Client Instance
│   └── types/             # Shared TypeScript Interfaces & DTOs
│
├── biome.json             # Root Linter & Formatter Rules (Biome)
├── CONTRIBUTING.md        # Aturan Standard Koding Tim ZII
└── README.md              # Dokumentasi Utama
```

---

## ⚡ Quickstart Guide

### Prerequisites
- Install **Bun** (v1.1+): `curl -fsSL https://bun.sh/install | bash`

### 1. Installation
Clone repositori dan install seluruh dependensi paket:
```bash
cd zii-pos
bun install
```

### 2. Database Migration (Prisma)
Salin environment file dan jalankan Prisma Client generator:
```bash
cp .env.example .env
bun db:generate
```

### 3. Running Development Environment
Jalankan seluruh aplikasi (*Frontend* + *Backend*) sekaligus dalam mode dev:
```bash
bun dev
```

* **Frontend UI (Next.js 16):** [http://localhost:3000](http://localhost:3000)
  * `/pos` — Layar Kasir POS Interaktif
  * `/products` — Manajemen Katalog Produk
  * `/settings` — Pengaturan White-Label Merchant
* **Backend API (Express TS):** [http://localhost:4000](http://localhost:4000)
  * `/docs` — **Scalar API Reference** (Dokumentasi OpenAPI Interaktif)
  * `/health` — Status Health Check Server

---

## 🧰 Available Scripts

| Script | Deskripsi |
| :--- | :--- |
| `bun dev` | Menjalankan seluruh aplikasi (`apps/web` & `apps/api`) secara simultan |
| `bun run lint` | Menjalankan linter Biome untuk memeriksa kesalahan kode |
| `bun run lint:fix` | Memperbaiki dan merapikan format kode secara otomatis |
| `bun db:generate` | Men-generate Prisma Client dari `packages/db/prisma/schema.prisma` |
| `bun db:push` | Melakukan push perubahan schema Prisma ke database PostgreSQL |
| `bun run build` | Membuat production build untuk seluruh aplikasi |

---

## 💡 Key Features of ZII POS v1.0

1. **100% White-Label Struk:** Struk cetak thermal & WhatsApp menampilkan Logo + Nama Toko Merchant milik kustomer tanpa logo aplikasi lain.
2. **Kirim Struk via WhatsApp:** Pengiriman nota belanja digital otomatis langsung ke WhatsApp pembeli.
3. **Multi-Tenant Scoping:** Setiap request API secara otomatis diisolasi berdasarkan header `x-tenant-id`.
4. **Lightweight PWA:** Aplikasi dapat dibuka lancar di HP Android, Tablet, iPad, maupun Laptop.

---

## 🤝 Foundational Engineering Team

* **Zaqi** — PM Engineer & Integration Lead
* **Isyadi** — Frontend Lead
* **Ilham** — Fullstack & Backend Lead
