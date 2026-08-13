# ZII POS — Testing Guide & Quality Assurance 🧪

Dokumentasi resmi strategi testing untuk Backend (`apps/api`) dan Frontend (`apps/web`) tim ZII.

---

## ⚡ 1. Backend Testing Strategy (`apps/api`)

Backend ZII POS menggunakan **Bun Native Test Runner (`bun test`)** yang sangat cepat (11 pengujian unit selesai dalam < 100ms).

### Menjalankan Testing Backend:
```bash
# Dari root monorepo
bun test

# Atau masuk ke folder apps/api
cd apps/api && bun test
```

### Cakupan Pengujian Backend (11 PASS / 0 FAIL):
- **`AuthService` Unit Tests:**
  - Validasi email/password kosong saat login.
  - Validasi kelengkapan data pendaftaran merchant baru.
- **`TenantService` Unit Tests:**
  - Ambil profil toko & fallback setting White-Label.
  - Update data profil & pesan footer struk merchant.
- **`TransactionService` Unit Tests:**
  - Validasi keranjang belanja kosong.
  - Perhitungan akurasi total nominal transaksi & pemotongan stok.
  - Filter riwayat transaksi berdasarkan rentang tanggal (`startDate`, `endDate`) dan metode pembayaran (`paymentMethod`).
- **`ProductService` Unit Tests:**
  - Filter pencarian teks nama produk (`search`).
  - Filter jenis produk (`isService`), alert stok menipis (`lowStock`), dan rentang harga (`minPrice`, `maxPrice`).
  - Pengujian metadata paginasi (`meta`).

---

## 🗄️ 2. Database Seeder Testing Setup (`packages/db`)

Untuk menguji fitur API secara langsung di lingkungan lokal dengan data realistis:

```bash
# Populate 2 Demo Tenant, User Owner & Kasir, 9 Produk, dan 3 Transaksi Penjualan
bun db:seed
```

---

## 🎨 3. Frontend Testing Strategy (`apps/web`)

Frontend ZII POS diuji menggunakan:
1. **Component Testing / Unit Testing:** `bun test` dengan React Testing Library.
2. **End-to-End (E2E) Flow Testing:** Playwright / Cypress untuk alur Kasir -> Transaksi -> Print Struk.

---

## 🚨 4. Pre-Push Verification Rule

Sebelum *Pull Request* diajukan oleh developer:
```bash
# 1. Biome Linter Check
bun run lint:fix

# 2. Backend Unit Testing (11 PASS)
bun test

# 3. Next.js 16 Production Build Check
cd apps/web && bun run build
```
