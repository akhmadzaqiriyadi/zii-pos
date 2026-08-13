# ZII POS — Testing Guide & Quality Assurance 🧪

Dokumentasi resmi strategi testing untuk Backend (`apps/api`) dan Frontend (`apps/web`) tim ZII.

---

## ⚡ 1. Backend Testing Strategy (`apps/api`)

Backend ZII POS menggunakan **Bun Native Test Runner (`bun test`)** yang sangat cepat (6 pengujian unit selesai dalam < 100ms).

### Menjalankan Testing Backend:
```bash
# Dari root monorepo
bun --filter '@zii/api' test

# Atau masuk ke folder apps/api
cd apps/api && bun test
```

### Cakupan Pengujian Backend (Task Zaqi):
- **`AuthService` Unit Tests:**
  - Validasi email/password kosong saat login.
  - Validasi kelengkapan data pendaftaran merchant baru.
- **`TenantService` Unit Tests:**
  - Ambil profil toko & fallback setting White-Label.
  - Update data profil & pesan footer struk merchant.
- **`TransactionService` Unit Tests:**
  - Validasi keranjang belanja kosong.
  - Perhitungan akurasi total nominal transaksi & pemotongan stok.

---

## 🎨 2. Frontend Testing Strategy (`apps/web`)

Frontend ZII POS diuji menggunakan:
1. **Component Testing / Unit Testing:** `bun test` dengan React Testing Library.
2. **End-to-End (E2E) Flow Testing:** Playwright / Cypress untuk alur Kasir -> Transaksi -> Print Struk.

### Menjalankan Testing Frontend:
```bash
# Dari root monorepo
bun --filter '@zii/web' test
```

---

## 🚨 3. Pre-Push Verification Rule

Sebelum *Pull Request* diajukan oleh developer:
```bash
# 1. Biome Linter Check
bun run lint

# 2. Backend Unit Testing
cd apps/api && bun test

# 3. Next.js 16 Production Build Check
cd apps/web && bun run build
```
