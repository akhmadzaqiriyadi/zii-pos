# ZII POS — Product & Technical Requirement Document (PRD & TRD) v2.0 📄

![Product Name](https://img.shields.io/badge/Product-ZII_POS_SaaS_v2.0.0-0f172a?style=for-the-badge)
![Monorepo Architecture](https://img.shields.io/badge/Architecture-Bun_Monorepo_v2.0.0-emerald?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-v2.0_Planning_%26_Design_Approved-blue?style=for-the-badge)

---

## 📌 1. Executive Summary & Vision (v2.0.0 Commercial SaaS)

**ZII POS v2.0.0** mentransformasi ZII POS dari aplikasi kasir internal menjadi **Platform Multi-Tenant SaaS Komersial Mandiri**. Platform ini memungkinkan merchant untuk mendaftar mandiri (*Self-Service Onboarding*), memilih/membeli paket langganan secara otomatis, dan mendapatkan subdomain toko sendiri (`toko.ziipos.com`) dengan tampilan 100% *Clean White-Label*.

### 🎯 Key Value Propositions v2.0:
1. **Self-Service Merchant Onboarding:** Calon toko mendaftar, mengatur logo, dan memilih paket langganan dalam 3 langkah mudah.
2. **Subdomain Custom Routing:** Setiap merchant mendapat subdomain terisolasi (e.g. `ziidistro.ziipos.com`).
3. **Dynamic SaaS Package CRUD:** Founders (*Zaqi, Isyadi, Ilham*) dapat mengatur nama paket, harga promo, batas kasir, dan fitur secara dinamis dari portal Super Admin.
4. **Automated Auto-Billing Payment Gateway:** Pembelian & perpanjangan lisensi terverifikasi otomatis 24/7 via Webhook Midtrans/Xendit.
5. **Super Admin SaaS Portal (`/saas-admin`):** Dashboard pemantauan total merchant, Monthly Recurring Revenue (MRR), & kontrol lisensi toko.

---

## 🏛️ 2. Extended Database Schema (Prisma ORM)

Skema database diperluas dengan **3 Tabel Baru (`Plan`, `Subscription`, `Invoice`)** dan penambahan kolom `subdomain` serta `status` pada tabel `Tenant`:

```prisma
model Tenant {
  id            String        @id @default(uuid())
  subdomain     String?       @unique // e.g. "ziidistro" -> ziidistro.ziipos.com
  name          String
  logoUrl       String?
  phone         String?
  address       String?
  receiptFooter String?       @default("Terima kasih telah berbelanja!")
  status        String        @default("trial") // trial | active | expired | suspended
  createdAt     DateTime      @default(now())
  users         User[]
  products      Product[]
  transactions  Transaction[]
  subscriptions Subscription[]
}

// 📦 TABEL BARU: Dynamic SaaS Plan Management (CRUD Paket Dinamis)
model Plan {
  id               String         @id @default(uuid())
  code             String         @unique // starter | pro | enterprise
  name             String         // e.g. "Pro Merchant White-Label"
  price            Decimal        @db.Decimal(12, 2)
  billingCycle     String         @default("monthly") // monthly | yearly
  maxCashiers      Int            @default(1) // Batas jumlah user kasir
  allowWhiteLabel  Boolean        @default(false)
  allowExportExcel Boolean        @default(false)
  featuresJson     String         // JSON Array daftar fitur paket
  isActive         Boolean        @default(true)
  createdAt        DateTime       @default(now())
  subscriptions    Subscription[]
}

// 💳 TABEL BARU: Tenant Subscription Lisensi Toko
model Subscription {
  id        String    @id @default(uuid())
  tenantId  String
  planId    String
  status    String    @default("trial") // trial | active | expired | suspended
  startsAt  DateTime  @default(now())
  expiresAt DateTime
  autoRenew Boolean   @default(true)
  createdAt DateTime  @default(now())
  tenant    Tenant    @relation(fields: [tenantId], references: [id])
  plan      Plan      @relation(fields: [planId], references: [id])
  invoices  Invoice[]
}

// 🧾 TABEL BARU: Invoice Pembayaran Lisensi SaaS
model SubscriptionInvoice {
  id                 String       @id @default(uuid())
  subscriptionId     String
  amount             Decimal      @db.Decimal(12, 2)
  paymentGatewayTxId String?
  status             String       @default("unpaid") // unpaid | paid | failed
  paidAt             DateTime?
  createdAt          DateTime     @default(now())
  subscription       Subscription @relation(fields: [subscriptionId], references: [id])
}
```

---

## 📡 3. REST API Contract & Endpoints (`apps/api`)

Seluruh endpoint baru didaftarkan secara konsisten di bawah prefix `/api/v1/`:

### 👑 A. Portal Super Admin API (`/api/v1/saas-admin`)
| Method | Endpoint | Description | Roles Allowed |
|:---|:---|:---|:---|
| `GET` | `/api/v1/saas-admin/metrics` | Rekap Total Merchant, Trial Aktif, MRR, & Churn Rate | Super Admin |
| `GET` | `/api/v1/saas-admin/tenants` | Daftar Seluruh Toko Terdaftar & Status Lisensi | Super Admin |
| `PUT` | `/api/v1/saas-admin/tenants/:id/status` | Suspend / Modifikasi Lisensi Toko Manual | Super Admin |

### 📦 B. Dynamic Plan CRUD API (`/api/v1/plans`)
| Method | Endpoint | Description | Roles Allowed |
|:---|:---|:---|:---|
| `GET` | `/api/v1/plans` | Fetch Daftar Paket Aktif (Public Onboarding) | Public |
| `POST` | `/api/v1/saas-admin/plans` | Tambah Paket Langganan Baru | Super Admin |
| `PUT` | `/api/v1/saas-admin/plans/:id` | Edit Harga, Batas Kasir, & Fitur Paket | Super Admin |
| `DELETE` | `/api/v1/saas-admin/plans/:id` | Nonaktifkan / Soft Delete Paket | Super Admin |

### 💳 C. Subscription & Billing API (`/api/v1/subscriptions`)
| Method | Endpoint | Description | Roles Allowed |
|:---|:---|:---|:---|
| `GET` | `/api/v1/subscriptions/current` | Ambil Detail Lisensi & Sisa Masa Trial Toko | Merchant Owner |
| `POST` | `/api/v1/subscriptions/checkout` | Generate QRIS / Invoice Payment Gateway | Merchant Owner |
| `POST` | `/api/v1/subscriptions/webhook` | Receive Automated Payment Success Callback | Payment Gateway |

---

## 👨‍💻 4. Execution Plan & Developer Task Assignments (Sprint v2.0.0)

### 👨‍💻 Zaqi (PM Engineer, Integration & Backend Lead)
- [x] Migrate & Push Extended Database Schema (Prisma Models `Plan`, `Subscription`, `Invoice`, & `Tenant.subdomain`).
- [x] Implementasi Service & Controller REST API Super Admin (`saas-admin.service.ts`).
- [x] Implementasi Service & Controller Dynamic Plan CRUD (`plan.service.ts`).
- [x] Implementasi Automated Payment Gateway Webhook Receiver (`subscription.service.ts`).
- [x] Penambahan Unit Tests untuk Logika Lisensi, Expiry Check, & Signature Verification.


### 🎨 Isyadi (Frontend Lead — Onboarding, Super Admin Portal & Billing UI)
- [ ] Implementasi Self-Service Merchant Onboarding Wizard 3 Langkah (`/onboarding`).
- [ ] Implementasi Super Admin Portal Dashboard (`/saas-admin` — Card MRR, Tabel Merchant, Toggles).
- [ ] Implementasi Dynamic Plan Management CRUD UI (`/saas-admin/plans` — Modal Tambah/Edit Paket & Batas Kasir).
- [ ] Implementasi Merchant Subscription Billing Page (`/settings/billing` — Status Lisensi & Tombol Checkout Upgrade).

### ⚡ Ilham (Fullstack Lead — Auth Subdomain, Trial Guard & Invoice Lead)
- [ ] Implementasi Subdomain Rewrite Middleware (`proxy.ts`) untuk `toko.ziipos.com`.
- [ ] Implementasi Subdomain Auth Context & JWT Cookie Isolation.
- [ ] Implementasi Trial Period Expiry Guard Middleware (Blokir akses kasir otomatis jika lisensi habis).
- [ ] Implementasi PDF Invoice Generator & Email Handler untuk Notifikasi Pembayaran.

---
*Official ZII POS v2.0.0 PRD & TRD Document Approved by Founders (Zaqi, Isyadi, Ilham).*
