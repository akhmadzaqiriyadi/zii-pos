# ZII POS — Database Package (`packages/db`) 🗄️

Paket shared database untuk **ZII POS** menggunakan **Prisma ORM v6** dan **PostgreSQL**.

---

## 🛠️ Schema Models (5 Tabel Utama)

1. **`Tenant`** — Data Merchant White-Label (Nama Toko, Logo, Alamat, Footer Struk).
2. **`User`** — Data Akun User (`owner` & `cashier`) dengan password hash.
3. **`Product`** — Data Produk Fisik & Jasa Service (Stok & Harga).
4. **`Transaction`** — Data Header Transaksi Penjualan POS (Metode Bayar, Total, Status).
5. **`TransactionItem`** — Detail Item Belanja per Transaksi.

---

## ⚡ Database CLI Commands

```bash
# Push skema tabel Prisma ke PostgreSQL local/staging
bun db:push

# Generate Prisma Client singleton
bun db:generate

# Seed data demo realistis (2 Tenant, Users, Products, & Transactions)
bun db:seed
```
