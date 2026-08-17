export interface PermissionDefinition {
  code: string;
  name: string;
  description: string;
  category: "pos" | "products" | "transactions" | "staff" | "settings" | "saas";
}

export const PERMISSIONS_CATALOG: PermissionDefinition[] = [
  // 🛒 POS & Transaksi Kasir
  {
    code: "pos:access",
    name: "Akses Kasir POS",
    description: "Membuka antarmuka kasir dan membuat pesanan baru",
    category: "pos",
  },
  {
    code: "pos:discount",
    name: "Beri Diskon Manual",
    description: "Memberikan diskon kustom atau potongan harga saat checkout",
    category: "pos",
  },
  {
    code: "pos:void_tx",
    name: "Batalkan Transaksi (Void)",
    description: "Membatalkan transaksi penjualan yang telah selesai",
    category: "pos",
  },

  // 📦 Katalog Produk & Stok
  {
    code: "products:read",
    name: "Lihat Produk",
    description: "Melihat daftar katalog barang dan stok produk",
    category: "products",
  },
  {
    code: "products:create",
    name: "Tambah Produk Baru",
    description: "Menambahkan barang retail atau layanan jasa baru",
    category: "products",
  },
  {
    code: "products:update",
    name: "Edit Produk & Harga",
    description: "Mengubah nama, harga jual, dan stok barang",
    category: "products",
  },
  {
    code: "products:delete",
    name: "Hapus Produk",
    description: "Menghapus barang/jasa dari katalog toko",
    category: "products",
  },

  // 📊 Laporan & Keuangan
  {
    code: "transactions:read",
    name: "Lihat Riwayat Transaksi",
    description: "Melihat histori penjualan dan detail nota transaksi",
    category: "transactions",
  },
  {
    code: "transactions:export",
    name: "Ekspor Laporan Excel / CSV",
    description: "Mengunduh file rekap omset dan laporan penjualan",
    category: "transactions",
  },

  // 👥 Staf & Pengaturan Toko
  {
    code: "cashiers:manage",
    name: "Kelola Staf Kasir",
    description: "Menambah, mengedit, dan menghapus akun staf kasir",
    category: "staff",
  },
  {
    code: "roles:manage",
    name: "Kelola Role & Hak Akses",
    description: "Membuat dan mengubah role kustom serta matriks izin toko",
    category: "staff",
  },
  {
    code: "settings:manage",
    name: "Pengaturan Profil & Struk",
    description: "Mengubah logo toko, nama, nomor telepon, dan footer struk",
    category: "settings",
  },
  {
    code: "billing:manage",
    name: "Billing & Lisensi SaaS",
    description: "Melihat invoice dan melakukan perpanjangan paket langganan",
    category: "settings",
  },

  // 👑 Super Admin SaaS
  {
    code: "saas:admin",
    name: "Super Admin SaaS Portal",
    description: "Akses pemantauan platform, MRR, dan manajemen tenant global",
    category: "saas",
  },
];

// Default System Roles Preset Permissions
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  superadmin: ["*"], // Wildcard: Full access
  owner: [
    "pos:access",
    "pos:discount",
    "pos:void_tx",
    "products:read",
    "products:create",
    "products:update",
    "products:delete",
    "transactions:read",
    "transactions:export",
    "cashiers:manage",
    "roles:manage",
    "settings:manage",
    "billing:manage",
  ],
  cashier: ["pos:access", "products:read", "transactions:read"],
};
