# ZII POS — Product & Technical Requirement Document (PRD & TRD) v1.0 📄

![Product Name](https://img.shields.io/badge/Product-ZII_POS_SaaS-0f172a?style=for-the-badge)
![Monorepo Architecture](https://img.shields.io/badge/Architecture-Bun_Monorepo_v1.0.0--mvp-emerald?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Sprint_1_Completed_100%25-brightgreen?style=for-the-badge)

---

## 📌 1. Executive Summary & Vision

**ZII POS** adalah sistem Kasir & Point of Sale (POS) berbasis **Multi-Tenant SaaS White-Label** yang dirancang khusus untuk memenuhi kebutuhan **General Retail** (Toko Baju/Distro, Mini Market, Toko Kelontong, Minimarket) dan **General Service** (Laundry, Barbershop, Service Hp/Sepatu, Barbershop).

### 🎯 Key Value Propositions:
1. **White-Label Branding:** Setiap merchant/toko dapat mengubah Nama Toko, Logo, Alamat, Nomor Kontak, dan Pesan Footer Struk Cetak secara mandiri.
2. **Multi-Tenant Architecture:** Isolasi data tingkat database menggunakan `tenantId` pada setiap query.
3. **Dual Industry Support:** Mendukung produk fisik (dengan pelacakan stok otomatis) dan produk jasa/service (tanpa pemotongan stok).
4. **Integration Ready:** Cetak Struk Thermal (58mm/80mm) & Kirim Struk Otomatis via WhatsApp.

---

## 🏛️ 2. Arsitektur Data & Database Schema (Prisma ORM)

Arsitektur database terdiri dari 5 tabel utama:

```prisma
model Tenant {
  id            String        @id @default(uuid())
  name          String
  logoUrl       String?
  phone         String?
  address       String?
  receiptFooter String?       @default("Terima kasih telah berbelanja!")
  createdAt     DateTime      @default(now())
  users         User[]
  products      Product[]
  transactions  Transaction[]
}

model User {
  id           String        @id @default(uuid())
  tenantId     String
  name         String
  email        String        @unique
  passwordHash String
  role         String        @default("cashier") // owner | cashier
  createdAt    DateTime      @default(now())
  tenant       Tenant        @relation(fields: [tenantId], references: [id])
  transactions Transaction[]
}

model Product {
  id        String   @id @default(uuid())
  tenantId  String
  name      String
  price     Decimal  @db.Decimal(12, 2)
  stock     Int      @default(0)
  isService Boolean  @default(false)
  createdAt DateTime @default(now())
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
}

model Transaction {
  id            String            @id @default(uuid())
  tenantId      String
  userId        String
  customerName  String            @default("Umum")
  customerPhone String?
  paymentMethod String            @default("cash") // cash | qris | transfer
  totalAmount   Decimal           @db.Decimal(12, 2)
  status        String            @default("completed") // completed | pending | cancelled
  createdAt     DateTime          @default(now())
  tenant        Tenant            @relation(fields: [tenantId], references: [id])
  user          User              @relation(fields: [userId], references: [id])
  items         TransactionItem[]
}

model TransactionItem {
  id            String      @id @default(uuid())
  transactionId String
  productId     String
  productName   String
  price         Decimal     @db.Decimal(12, 2)
  qty           Int
  subtotal      Decimal     @db.Decimal(12, 2)
  transaction   Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
}
```

---

## 📡 3. REST API Contract & Endpoints (`apps/api`)

Seluruh endpoint REST API telah terintegrasi dengan **Zod Auto OpenAPI Generator** dan dapat dicoba secara interaktif di **Scalar UI (`http://localhost:4000/docs`)**:

| Method | Endpoint | Description | Status Codes | Status |
|:---|:---|:---|:---|:---|
| `POST` | `/api/v1/auth/register-tenant` | Registrasi Toko Baru & Owner | `201`, `400`, `500` | ✅ PASS |
| `POST` | `/api/v1/auth/login` | Login Kasir / Owner & JWT Token | `200`, `401`, `500` | ✅ PASS |
| `GET` | `/api/v1/tenants/profile` | Ambil Profil Toko & Setting White-Label | `200`, `401`, `404`, `500` | ✅ PASS |
| `PUT` | `/api/v1/tenants/profile` | Update Setting White-Label Struk | `200`, `400`, `401`, `403`, `500` | ✅ PASS |
| `GET` | `/api/v1/products` | Katalog Produk (dengan Search, Filter & Paginasi) | `200`, `401`, `500` | ✅ PASS |
| `POST` | `/api/v1/products` | Tambah Produk Baru | `201`, `400`, `401`, `500` | ✅ PASS |
| `PUT` | `/api/v1/products/:id` | Update Detail Produk | `200`, `400`, `401`, `500` | ✅ PASS |
| `DELETE` | `/api/v1/products/:id` | Hapus Produk | `200`, `400`, `401`, `500` | ✅ PASS |
| `GET` | `/api/v1/transactions` | Riwayat Transaksi (Filter Tanggal, Pembayaran & Paginasi) | `200`, `401`, `500` | ✅ PASS |
| `POST` | `/api/v1/transactions` | Simpan Transaksi Kasir & Potong Stok | `201`, `400`, `401`, `404`, `500` | ✅ PASS |

---

## 👨‍💻 4. Execution Plan & Task Distribution (Status: 100% Completed)

### 👨‍💻 Zaqi (PM Engineer, Backend & Integration Lead)
- [x] Setup Monorepo Bun Workspaces & Directory Structure.
- [x] Setup Database Schema Prisma ORM 5 Tabel & Seeder Script (`bun db:seed`).
- [x] Implementasi Scalar API Reference Documentation (`/docs`) & Pino Logger.
- [x] Implementasi CRUD API Products & Transactions DB Persistence (dengan Pagination & Search Filter).
- [x] Implementasi Bun Unit Testing Suite (11 PASS).
- [ ] Driver Cetak Struk Thermal 58mm/80mm (`useThermalPrinter.ts`) — *Siap dikoding oleh Zaqi*.
- [ ] Auto-Send WhatsApp Receipt Integration (`whatsappService.ts`) — *Siap dikoding oleh Zaqi*.

### 🎨 Isyadi (Frontend Lead — Core POS & Products Catalog UI)
- [x] Setup Project Next.js 16 + Custom Radix UI Primitives + Tailwind CSS.
- [x] Layout Utama POS (Grid Katalog Produk + Sidebar Keranjang Belanja).
- [x] Modal Pembayaran (Pilih Tunai / QRIS + Hitung Kembalian).
- [x] Integrasi TanStack Query v5 untuk fetch & mutate data Produk & Transaksi dari Express API.
- [x] Search Bar & Filter Pencarian Produk Real-Time di Layar Kasir.
- [x] Modal Form Tambah & Edit Produk Baru di `/products` dengan Zod Schema & React Hook Form.

### ⚡ Ilham (Fullstack Lead — Auth API & Auth UI)
- [x] Endpoint Backend Auth (`POST /api/v1/auth/register-tenant` & `POST /api/v1/auth/login`).
- [x] Halaman Login & Register Merchant UI (`/login` & `/register`) dengan Zod Schema & React Hook Form.
- [x] Client Auth Context & Cookie Token Handler di Next.js.
- [x] Protected Route Middleware untuk Halaman Kasir & Dashboard Owner.
