# ZII POS — Developer Git & Push Guide 🚀

Dokumen ini adalah **Panduan Resmi Git & Push** untuk developer tim ZII (**Zaqi, Isyadi, Ilham**). Ikuti alur kerja ini untuk menjaga repositori tetap bersih, rapi, dan bebas dari *conflict*.

---

## 📌 1. Aturan Cabang Git (Branching Strategy)

- **`main`** : Cabang Production. Hanya bisa di-merge dari `dev` setelah pengujian UAT selesai.
- **`dev`** : Cabang Integrasi Utama. Tempat penggabungan harian seluruh fitur.
- **`feature/<nama-fitur>`** : Cabang pengerjaan fitur baru.
- **`fix/<nama-bug>`** : Cabang perbaikan bug/error.

### Contoh Penamaan Branch Resmi Tim ZII:
* `feature/receipt-wa-print` (Tugas Zaqi — Thermal Print Driver & WA Receipt Integration)
* `feature/pos-cart-ui` (Tugas Isyadi — Core POS Kasir UI & Products Catalog)
* `feature/auth-fullstack` (Tugas Ilham — Auth API, Halaman Login UI & JWT Context)

---

## 🛠️ 2. Langkah Demi Langkah: Pengerjaan & Push Kode

### Langkah A: Tarik Update Terbaru dari `dev` / `main`
Sebelum mulai koding fitur baru, pastikan branch lokal kamu sudah paling terbaru:
```bash
git checkout main
git pull origin main
```

### Langkah B: Buat Branch Baru
Buat branch khusus fitur yang akan kamu kerjakan:
```bash
git checkout -b feature/nama-fitur-kamu
```

### Langkah C: Koding & Jalankan Pre-Push Checklist (WAJIB!)
Sebelum melakukan commit dan push, jalankan 3 perintah wajib ini di terminal kamu:

```bash
# 1. Jalankan Linter & Auto-Format kode
bun run lint:fix

# 2. Jalankan 11 Backend Unit Tests
bun test

# 3. Tes Kompilasi Frontend Next.js 16
cd apps/web && bun run build && cd ../..
```
*⚠️ Pastikan semua command di atas keluar dengan **SUCCESS / 0 Error**!*

---

## 💬 3. Aturan Commit Message (Conventional Commits)

Format commit wajib mengikuti aturan *Conventional Commits*:

$$\text{type(scope): deskripsi singkat}$$

### Pilihan Type:
- **`feat`** : Menambahkan fitur baru (Contoh: `feat(pos): tambah fitur hitung kembalian kasir`)
- **`fix`** : Memperbaiki bug (Contoh: `fix(api): perbaiki error kalkulasi total_amount`)
- **`docs`** : Mengubah/menambah dokumentasi (Contoh: `docs(readme): perbarui panduan git push`)
- **`style`** : Perubahan styling/UI tanpa mengubah logika (Contoh: `style(ui): perbarui warna button emerald`)
- **`refactor`** : Merapikan struktur kode tanpa menambah fitur baru

---

## 🚀 4. Push Branch ke GitHub & Buat Pull Request (PR)

### Push Branch ke Remote:
```bash
git push origin feature/nama-fitur-kamu
```

### Buat Pull Request (PR) di GitHub:
1. Buka repositori GitHub **`zii-pos`**.
2. Klik tombol **"Compare & Pull Request"**.
3. Atur target merge: `base: main` ⬅️ `compare: feature/nama-fitur-kamu`.
4. Isi judul & deskripsi singkat mengenai apa saja yang kamu buat/ubah.
5. Tag Zaqi/rekan tim untuk melakukan *Code Review*.
