# ZII POS — Engineering Code Rules & Guidelines

Dokumen ini berisi standar koding dan alur kerja (*Code Standard & Operating Procedures*) untuk seluruh anggota tim pengembang ZII (**Zaqi, Isyadi, dan Ilham**).

---

## 📌 1. Prinsip Utama Penggubahan Kode (Core Engineering Rules)

1. **Strict Type Safety:** Selalu gunakan TypeScript. Dilarang keras menggunakan tipe `any`. Manfaatkan tipe data terpusat di `@zii/types`.
2. **Multi-Tenant First:** Selalu sertakan `tenant_id` pada setiap query database dan route API backend untuk menjamin isolasi data merchant.
3. **No Direct DOM Mutation:** Pada Frontend, manfaatkan state React atau komponen primitive Radix UI.
4. **Linting & Formatting Check:** Sebelum membuat *Pull Request* atau *Commit*, pastikan menjalankan `bun run lint:fix`.

---

## 🎨 2. Standard Penamaan (Naming Conventions)

- **File & Folder Component/Hooks:** `PascalCase` untuk komponen UI (`ProductGrid.tsx`), `camelCase` untuk hooks (`useCart.ts`).
- **File Controller/Service/Routes (Backend):** `kebab-case` atau `dot.notation` (`product.controller.ts`, `product.service.ts`).
- **Database Tables & Columns:** `snake_case` di PostgreSQL / Prisma (`tenant_id`, `created_at`).
- **TypeScript Interfaces & Types:** `PascalCase` (`Tenant`, `Product`, `Transaction`).

---

## 🔀 3. Git Branching & Commit Message Strategy

### Branch Strategy
- `main` : Production-ready code (hanya digabung lewat PR yang sudah dites).
- `dev` : Branch pengembangan harian.
- `feature/pos-cart-ui` (Isyadi) : Branch pengerjaan fitur POS Kasir & Catalog UI.
- `feature/auth-tenant-api` (Zaqi) : Branch pengerjaan API Auth, Tenant & DB Persistence.
- `feature/auth-ui-receipt-print` (Ilham) : Branch pengerjaan Halaman Login UI & Struk WA/Thermal Print.

### Commit Format (Conventional Commits)
Format: `<type>(<scope>): <short description>`

* Contoh: `feat(pos): tambah fitur filter produk berdasarkan kategori`
* Contoh: `fix(api): perbaiki bug perhitungan total_amount pada transaction service`
* Contoh: `docs(readme): perbarui dokumentasi scalar api reference`

---

## 🧪 4. Check & Verification Checklist

Sebelum push ke repositori GitHub, pastikan 3 perintah ini berjalan hijau tanpa error:
```bash
# 1. Cek Linting & Formatting
bun run lint

# 2. Cek Kompilasi Backend Express TS
cd apps/api && bun run build

# 3. Cek Kompilasi Frontend Next.js 16
cd apps/web && bun run build
```
