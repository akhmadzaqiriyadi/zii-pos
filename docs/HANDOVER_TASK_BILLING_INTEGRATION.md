# 🚀 DEVELOPER TASK HANDOVER: INTEGRASI FRONTEND MERCHANT BILLING & SAAS SUBSCRIPTION

Dokumen ini ditujukan sebagai **panduan teknis lengkap (*step-by-step developer task*)** untuk developer frontend yang akan mengintegrasikan halaman **Billing & Lisensi Toko (`/settings/billing`)** dengan Backend API ZII POS yang sudah selesai 100% di branch `main`.

---

## 📌 Ringkasan Backend (Status: 100% Ready di Branch `main`)

| Endpoint | Method | Keterangan | Auth Header |
|---|:---:|---|:---:|
| `/api/v1/subscriptions/current` | `GET` | Mengambil info paket, sisa hari, metrik utilisasi kasir & level urgensi lisensi | `Bearer Token` + `x-tenant-id` |
| `/api/v1/subscriptions/invoices` | `GET` | Mengambil seluruh riwayat invoice pembayaran milik toko | `Bearer Token` + `x-tenant-id` |
| `/api/v1/subscriptions/checkout` | `POST` | Memulai checkout paket (Snap / QRIS Midtrans) | `Bearer Token` + `x-tenant-id` |
| `/api/v1/subscriptions/auto-renew` | `PATCH` | Mengubah toggle perpanjangan lisensi otomatis | `Bearer Token` + `x-tenant-id` |
| `/api/v1/subscriptions/invoice/:id/pdf`| `GET` | Mengunduh file PDF resmi invoice pembayaran | *Public Stream / Direct Link* |
| `/api/v1/subscriptions/webhook` | `POST` | Simulasi pembayaran instan (Mode Sandbox / Dev) | *Public* |

---

## 📝 Daftar Task Developer (Langkah Demi Langkah)

### 🔹 TASK 1: Update Tipe Data & API Service
📁 **File:** [`apps/web/src/features/subscription/services/subscriptionApi.ts`](file:///Users/zaq/howpm/zii-pos/apps/web/src/features/subscription/services/subscriptionApi.ts)

**Tugas:**
1. Perbarui interface `CurrentSubscriptionData`:
```typescript
export interface CurrentSubscriptionData {
  subscriptionId: string;
  tenantId: string;
  status: "active" | "trial" | "expired" | "suspended";
  tenantStatus: string;
  startsAt: string;
  expiresAt: string;
  daysRemaining: number;
  isExpired: boolean;
  autoRenew: boolean;
  plan: CurrentSubscriptionPlan | null;
  usage: {
    activeCashiers: number;
    maxCashiers: number;
    cashierUsagePercent: number;
    isCashierLimitReached: boolean;
    totalProducts: number;
    totalTransactions: number;
  };
  urgency: {
    urgencyLevel: "safe" | "expiring_soon" | "critical" | "locked";
    daysRemaining: number;
    autoLockAt: string;
    isGracePeriod: boolean;
  };
}

export interface MerchantSubscriptionInvoice {
  id: string;
  amount: number;
  paymentMethod: string;
  status: "paid" | "unpaid" | "failed" | string;
  paidAt: string | null;
  createdAt: string;
  planName: string;
  planCode: string;
  billingCycle: string;
  pdfUrl: string;
}
```
2. Tambahkan method pada class `SubscriptionApiService`:
   - `static async getInvoices(): Promise<MerchantSubscriptionInvoice[]>` (Panggil `GET /api/v1/subscriptions/invoices`).
   - `static async toggleAutoRenew(autoRenew: boolean): Promise<{ autoRenew: boolean; message: string }>` (Panggil `PATCH /api/v1/subscriptions/auto-renew` dengan body `{ autoRenew }`).

---

### 🔹 TASK 2: Update Hook `useMerchantBilling.ts`
📁 **File:** [`apps/web/src/features/subscription/hooks/useMerchantBilling.ts`](file:///Users/zaq/howpm/zii-pos/apps/web/src/features/subscription/hooks/useMerchantBilling.ts)

**Tugas:**
1. Tambahkan query `invoicesQuery`:
```typescript
const {
  data: invoices = [],
  isLoading: isLoadingInvoices,
  refetch: refetchInvoices,
} = useQuery({
  queryKey: ["merchantInvoices"],
  queryFn: SubscriptionApiService.getInvoices,
});
```
2. Tambahkan mutasi `autoRenewMutation`:
```typescript
const autoRenewMutation = useMutation({
  mutationFn: (autoRenew: boolean) => SubscriptionApiService.toggleAutoRenew(autoRenew),
  onSuccess: (res) => {
    queryClient.invalidateQueries({ queryKey: ["currentSubscription"] });
    toast.success(res.message);
  },
  onError: (err: unknown) => {
    toast.error(parseApiErrorMessage(err, "Gagal mengubah pengaturan auto-renew."));
  },
});
```
3. Return data baru dari hook: `invoices`, `isLoadingInvoices`, `refetchInvoices`, `toggleAutoRenew: autoRenewMutation.mutate`, `isTogglingAutoRenew: autoRenewMutation.isPending`.

---

### 🔹 TASK 3: Upgrade Komponen `CurrentLicenseCard.tsx`
📁 **File:** [`apps/web/src/features/subscription/components/CurrentLicenseCard.tsx`](file:///Users/zaq/howpm/zii-pos/apps/web/src/features/subscription/components/CurrentLicenseCard.tsx)

**Tugas:**
1. **Urgency Alert Banner:**
   - Jika `subscription.urgency.urgencyLevel === "expiring_soon"` (sisa ≤ 3 hari), munculkan banner peringatan warna amber di bagian atas kartu: *"Masa aktif paket Anda tersisa X hari lagi. Segera perpanjang agar operasional kasir tidak terganggu!"*.
   - Jika `subscription.urgency.urgencyLevel === "locked"`, munculkan banner merah: *"Lisensi Anda telah habis. Akses transaksi kasir dibekukan sementara hingga perpanjangan dilakukan."*.
2. **Progress Bar Kuota Kasir (*Usage vs Limit*):**
   - Tampilkan baris visual kuota kasir:
     - Teks: `Penggunaan Kasir: ${subscription.usage.activeCashiers} / ${subscription.usage.maxCashiers} Akun (${subscription.usage.cashierUsagePercent}%)`
     - Komponen progress bar: `<div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: '${subscription.usage.cashierUsagePercent}%' }} /></div>`
     - Jika `subscription.usage.isCashierLimitReached` true, beri badge `Kuota Penuh (100%)`.
3. **Auto-Renew Switch:**
   - Tambahkan switch interaktif menggunakan `<Switch checked={subscription.autoRenew} onCheckedChange={(val) => onToggleAutoRenew(val)} disabled={isTogglingAutoRenew} />`.

---

### 🔹 TASK 4: Buat Komponen Baru `MerchantInvoiceHistory.tsx`
📁 **File Baru:** `apps/web/src/features/subscription/components/MerchantInvoiceHistory.tsx`

**Tugas:**
1. Buat tabel menggunakan standard Radix UI components (`<Table>`, `<TableHeader>`, `<TableBody>`, `<TableRow>`, `<TableCell>`) untuk menampilkan riwayat invoice:
   - **Kolom 1:** `Invoice ID` (font mono font-bold)
   - **Kolom 2:** `Paket SaaS` (`<Badge variant="blue">{inv.planName}</Badge>`)
   - **Kolom 3:** `Nominal` (`formatRupiah(inv.amount)`)
   - **Kolom 4:** `Metode Bayar` (QRIS / Midtrans)
   - **Kolom 5:** `Tanggal Lunas` (`inv.paidAt ? new Date(inv.paidAt).toLocaleDateString("id-ID") : "-"`)
   - **Kolom 6:** `Status` (`<Badge variant={inv.status === "paid" ? "emerald" : "amber"}>{inv.status.toUpperCase()}</Badge>`)
   - **Kolom 7:** `Aksi` (Tombol `<Button variant="outline" size="sm" asChild><a href={inv.pdfUrl} target="_blank"><Download className="h-3.5 w-3.5" /><span>PDF</span></a></Button>`)
2. Handle state loading (`<Loader2 className="animate-spin" />`) dan empty state jika belum ada invoice.

---

### 🔹 TASK 5: Upgrade Komponen `UpgradePlanGrid.tsx`
📁 **File:** [`apps/web/src/features/subscription/components/UpgradePlanGrid.tsx`](file:///Users/zaq/howpm/zii-pos/apps/web/src/features/subscription/components/UpgradePlanGrid.tsx)

**Tugas:**
1. **Disable Kartu Trial untuk Merchant Lama:**
   - Pada kartu paket gratis (*Starter / Rp 0*):
     - Ubah tombol menjadi disabled: `<Button disabled className="opacity-60 cursor-not-allowed">Khusus Toko Baru</Button>`.
     - Berikan keterangan kecil: *"Hanya dapat dipilih 1x saat pendaftaran akun toko baru."*.
2. **Indikator Paket Saat Ini:**
   - Jika `plan.code === currentPlanCode`, ubah teks tombol menjadi *"Perpanjang Paket Ini"* dengan badge *"Paket Aktif"*.
3. **Toggle Siklus Bulanan / Tahunan:**
   - Tampilkan badge *"Hemat 2 Bulan"* saat memilih opsi tahunan.

---

### 🔹 TASK 6: Susun di Halaman `page.tsx`
📁 **File:** [`apps/web/src/app/(dashboard)/settings/billing/page.tsx`](file:///Users/zaq/howpm/zii-pos/apps/web/src/app/%28dashboard%29/settings/billing/page.tsx)

**Tugas:**
Susun layout secara vertikal:
1. `<header>` Judul Halaman & Deskripsi
2. `<CurrentLicenseCard />` (Status lisensi, progress bar kuota kasir, switch auto-renew)
3. `<UpgradePlanGrid />` (Pilihan upgrade & perpanjangan paket)
4. `<MerchantInvoiceHistory />` (Tabel riwayat pembayaran & tombol download PDF)
5. `<PaymentCheckoutModal />` (Modal popup pembayaran QRIS & simulasi pelunasan)

---

### 🔹 TASK 7: Verifikasi & Build Monorepo
Jalankan di terminal root:
```bash
# 1. Jalankan test suite backend & frontend
bun test

# 2. Pastikan build Next.js sukses tanpa error TypeScript
bun --filter '@zii/web' build
```

---

## 🎯 Kriteria Penerimaan (*Definition of Done / DoD*)
* [ ] Merchant bisa melihat sisa hari masa aktif dan persentase kuota kasir yang sudah terpakai.
* [ ] Banner peringatan otomatis muncul jika masa aktif tersisa ≤ 3 hari.
* [ ] Merchant bisa klik tombol switch untuk mengaktifkan/menonaktifkan auto-renew.
* [ ] Merchant tidak bisa mengklik checkout paket trial gratis.
* [ ] Tabel riwayat invoice menampilkan daftar invoice lunas beserta tombol unduh PDF resmi.
* [ ] Klik tombol download PDF membuka file PDF invoice berstandar resmi di tab baru.
* [ ] `bun test` dan `bun build` lulus 100% tanpa error.
