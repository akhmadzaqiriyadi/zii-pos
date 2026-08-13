# ZII POS — Express REST API (`apps/api`) ⚡

Backend REST API untuk **ZII POS** yang berjalan secara cepat dan ringan menggunakan **TypeScript** pada **Bun Runtime**.

---

## 🛠️ Features & Stack

- **Framework:** Express.js + TypeScript
- **Runtime:** Bun 1.3+
- **Logger:** Pino Logger (`pino-http` + `pino-pretty`)
- **Database:** Prisma ORM v6 + PostgreSQL
- **Auth:** Bun Native Password Hashing (`Bun.password.hash`) + JWT (`jsonwebtoken`)
- **Documentation:** Scalar API Reference (`@scalar/express-api-reference`) via Zod Auto OpenAPI Generator
- **Testing:** Bun Native Test Runner (`bun test`) — 11 Unit Tests PASSED in < 100ms

---

## ⚡ Development Commands

```bash
# Jalankan Dev Server dengan Bun Watch Mode (Port 4000)
bun dev

# Tes Kompilasi TypeScript
bun run build

# Menjalankan 11 Unit Tests
bun test
```

---

## 📖 Interactive OpenAPI Docs (Scalar UI)

Buka browser di:
👉 **`http://localhost:4000/docs`**

Atau ambil format JSON OpenAPI spesifikasi dinamis:
👉 **`http://localhost:4000/docs.json`**

---

## 📡 Rincian API Endpoints & Query Filters

### 🔐 Auth Domain (`/api/v1/auth`)
| Method | Endpoint | Deskripsi |
|:---|:---|:---|
| `POST` | `/api/v1/auth/register-tenant` | Registrasi Toko/Tenant Baru & Akun Owner |
| `POST` | `/api/v1/auth/login` | Login Kasir / Owner & Dapatkan JWT Token |

### 🏪 Tenant Domain (`/api/v1/tenants`)
| Method | Endpoint | Deskripsi |
|:---|:---|:---|
| `GET` | `/api/v1/tenants/profile` | Ambil profil merchant & setting White-Label |
| `PUT` | `/api/v1/tenants/profile` | Update logo, telepon, alamat, & footer struk |

### 🛍️ Products Domain (`/api/v1/products`)
| Method | Endpoint | Deskripsi & Query Filters |
|:---|:---|:---|
| `GET` | `/api/v1/products` | Ambil katalog produk terpaginasi |
| | | `?page=1&limit=10` : Paginasi halaman |
| | | `?search=Kaos` : Filter pencarian nama |
| | | `?isService=true\|false` : Filter jenis (Jasa / Barang) |
| | | `?lowStock=true` : Filter produk dengan stok <= 5 item |
| | | `?minPrice=50000&maxPrice=150000` : Filter rentang harga |
| | | `?sortBy=price&sortOrder=asc` : Sorting kolom |

### 💳 Transactions Domain (`/api/v1/transactions`)
| Method | Endpoint | Deskripsi & Query Filters |
|:---|:---|:---|
| `GET` | `/api/v1/transactions` | Ambil riwayat transaksi terpaginasi |
| | | `?page=1&limit=10` : Paginasi halaman |
| | | `?search=Budi` : Filter pencarian nama/nohp/ID |
| | | `?startDate=2026-08-01&endDate=2026-08-13` : Filter tanggal |
| | | `?paymentMethod=cash\|qris\|transfer` : Filter pembayaran |
| | | `?status=completed\|pending\|cancelled` : Filter status |
| `POST` | `/api/v1/transactions` | Simpan transaksi baru & potong stok otomatis |
