# ZII POS — Database Package (`@zii/db`)

Package manajemen database PostgreSQL berbasis **Prisma ORM v6**.

---

## 📊 Core Database Schema (5 Tables)

1. `tenants`: Profil Toko & Setting White-Label Struk (Logo, Header/Footer).
2. `users`: Kasir & Owner Login dengan `tenant_id`.
3. `products`: Katalog Barang & Jasa (`price`, `stock`, `is_service`).
4. `transactions`: Header Penjualan (`customer_name`, `payment_method`, `total_amount`).
5. `transaction_items`: Detail Barang/Jasa yang Dibeli.

---

## 🛠️ Commands

```bash
# Push schema ke database PostgreSQL
bun db:push

# Generate Prisma Client
bun db:generate
```
