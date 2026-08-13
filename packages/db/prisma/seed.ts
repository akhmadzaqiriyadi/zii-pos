import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Starting ZII POS Database Seeding...");

  // Clean existing data in reverse order of foreign keys
  await db.transactionItem.deleteMany();
  await db.transaction.deleteMany();
  await db.product.deleteMany();
  await db.user.deleteMany();
  await db.tenant.deleteMany();

  const passwordHash = await Bun.password.hash("password123");

  // 1. Create Demo Tenant 1 (Apparel Distro)
  const tenantDistro = await db.tenant.create({
    data: {
      name: "ZII Distro & Apparel Studio",
      logoUrl: "https://placehold.co/120x120/1e293b/ffffff?text=ZII+DISTRO",
      phone: "0812-9988-7766",
      address: "Jl. Merdeka Raya No. 45, Jakarta Selatan",
      receiptFooter:
        "Terima kasih telah berbelanja di ZII Distro! Simpan nota ini sebagai bukti garansi penukaran 7 hari.",
    },
  });

  // 2. Create Demo Tenant 2 (Barbershop & Grooming)
  const tenantBarber = await db.tenant.create({
    data: {
      name: "ZII Barbershop & Grooming",
      logoUrl: "https://placehold.co/120x120/0f172a/ffffff?text=ZII+BARBER",
      phone: "0819-8765-4321",
      address: "Jl. Sudirman Plaza No. 12, Bandung",
      receiptFooter:
        "Terima kasih telah memilih ZII Barbershop! Tunjukkan nota ini untuk mendapatkan diskon 10% di kunjungan berikutnya.",
    },
  });

  // 3. Create Demo Users (Owner & Cashier)
  const userOwner = await db.user.create({
    data: {
      tenantId: tenantDistro.id,
      name: "Zaqi (PM Owner)",
      email: "zaqi@zii.id",
      passwordHash,
      role: "owner",
    },
  });

  const userKasir = await db.user.create({
    data: {
      tenantId: tenantDistro.id,
      name: "Budi (Kasir Shift 1)",
      email: "kasir@zii.id",
      passwordHash,
      role: "cashier",
    },
  });

  // 4. Create Realistic Products & Services for Tenant 1 (Distro)
  const p1 = await db.product.create({
    data: {
      tenantId: tenantDistro.id,
      name: "Kaos Polos Cotton Combed 30s",
      price: 65000,
      stock: 45,
      isService: false,
    },
  });

  const p2 = await db.product.create({
    data: {
      tenantId: tenantDistro.id,
      name: "Kemeja Flanel Premium Vintage",
      price: 145000,
      stock: 20,
      isService: false,
    },
  });

  const p3 = await db.product.create({
    data: {
      tenantId: tenantDistro.id,
      name: "Jaket Hoodie Fleece Oversize",
      price: 210000,
      stock: 15,
      isService: false,
    },
  });

  const p4 = await db.product.create({
    data: {
      tenantId: tenantDistro.id,
      name: "Celana Chino Slim Fit Stretch",
      price: 175000,
      stock: 30,
      isService: false,
    },
  });

  const p5 = await db.product.create({
    data: {
      tenantId: tenantDistro.id,
      name: "Parfum Sepatu Premium 100ml",
      price: 35000,
      stock: 3, // Low stock demo
      isService: false,
    },
  });

  const p6 = await db.product.create({
    data: {
      tenantId: tenantDistro.id,
      name: "Shoe Cleaner Concentrate 250ml",
      price: 45000,
      stock: 12,
      isService: false,
    },
  });

  // 5. Create Products & Services for Tenant 2 (Barbershop)
  await db.product.create({
    data: {
      tenantId: tenantBarber.id,
      name: "Jasa Cut & Hair Styling Gentle",
      price: 50000,
      stock: 999,
      isService: true,
    },
  });

  await db.product.create({
    data: {
      tenantId: tenantBarber.id,
      name: "Jasa Hair Coloring & Bleaching",
      price: 135000,
      stock: 999,
      isService: true,
    },
  });

  await db.product.create({
    data: {
      tenantId: tenantBarber.id,
      name: "Pomade Waterbased Hold 100g",
      price: 85000,
      stock: 18,
      isService: false,
    },
  });

  // 6. Create Realistic Completed Demo Transactions
  await db.transaction.create({
    data: {
      tenantId: tenantDistro.id,
      userId: userKasir.id,
      customerName: "Andi Prasetya",
      customerPhone: "081234567890",
      paymentMethod: "cash",
      totalAmount: 210000,
      status: "completed",
      items: {
        create: [
          {
            productId: p1.id,
            productName: p1.name,
            price: Number(p1.price),
            qty: 1,
            subtotal: 65000,
          },
          {
            productId: p2.id,
            productName: p2.name,
            price: Number(p2.price),
            qty: 1,
            subtotal: 145000,
          },
        ],
      },
    },
  });

  await db.transaction.create({
    data: {
      tenantId: tenantDistro.id,
      userId: userOwner.id,
      customerName: "Siti Rahmawati",
      customerPhone: "081987654321",
      paymentMethod: "qris",
      totalAmount: 210000,
      status: "completed",
      items: {
        create: [
          {
            productId: p3.id,
            productName: p3.name,
            price: Number(p3.price),
            qty: 1,
            subtotal: 210000,
          },
        ],
      },
    },
  });

  await db.transaction.create({
    data: {
      tenantId: tenantDistro.id,
      userId: userKasir.id,
      customerName: "Dewi Lestari",
      customerPhone: "085611223344",
      paymentMethod: "transfer",
      totalAmount: 70000,
      status: "completed",
      items: {
        create: [
          {
            productId: p5.id,
            productName: p5.name,
            price: Number(p5.price),
            qty: 2,
            subtotal: 70000,
          },
        ],
      },
    },
  });

  console.log(
    "✅ Database ZII POS successfully seeded with demo tenants, users, products, & transactions!",
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
