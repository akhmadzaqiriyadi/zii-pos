# ZII POS — Testing Guide & Quality Assurance 🧪

Dokumentasi resmi strategi testing untuk Backend (`apps/api`) dan Frontend (`apps/web`) tim ZII.

---

## ⚡ 1. Unit Testing Strategy (`bun test`)

ZII POS menggunakan **Bun Native Test Runner (`bun test`)** yang sangat cepat (15 pengujian unit selesai dalam < 500ms).

### Menjalankan Testing Monorepo:
```bash
# Dari root monorepo
bun test
```

### Cakupan Pengujian (15 PASS / 0 FAIL):
- **`AuthService` Unit Tests (`apps/api`):**
  - Validasi email/password kosong saat login.
  - Validasi kelengkapan data pendaftaran merchant baru.
- **`TenantService` Unit Tests (`apps/api`):**
  - Ambil profil toko & fallback setting White-Label.
  - Update data profil & pesan footer struk merchant.
- **`TransactionService` Unit Tests (`apps/api`):**
  - Validasi keranjang belanja kosong.
  - Perhitungan akurasi total nominal transaksi & pemotongan stok.
  - Filter riwayat transaksi berdasarkan rentang tanggal (`startDate`, `endDate`) dan metode pembayaran (`paymentMethod`).
- **`ProductService` Unit Tests (`apps/api`):**
  - Filter pencarian teks nama produk (`search`).
  - Filter jenis produk (`isService`), alert stok menipis (`lowStock`), dan rentang harga (`minPrice`, `maxPrice`).
  - Pengujian metadata paginasi (`meta`).
- **`WhatsApp Receipt Formatter` Unit Tests (`apps/web`):**
  - Normalisasi nomor HP Indonesia (`08xx` -> `628xx`, `+628xx` -> `628xx`).
  - Format pesan nota belanja WhatsApp dengan WhatsApp Markdown (`*bold*`, `_italic_`).
  - Generasi URL `https://wa.me/628xx?text=...` yang valid & terhindar dari karakter corrupt.

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
