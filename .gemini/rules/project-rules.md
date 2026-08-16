# 🛡️ ZII POS — Project Workflow & Git Conflict Prevention Rules

Panduan dan aturan kerja tim (*Zaqi - PM/BE Lead*, *Isyadi - FE Lead*, *Ilham - Fullstack Lead*) untuk menjaga kualitas kodingan, konsistensi UI Component, dan bebas konflik Git.

---

### 1. 🧩 Gunakan Shared UI Components (DILARANG Pakai Native HTML Input/Button)
- **TIDAK BOLEH** menggunakan tag HTML biasa `<input ... />` atau `<button ... />` secara langsung di halaman/fitur.
- **WAJIB** mengimpor dan menggunakan komponen shared yang sudah ada di `src/components/ui/`:
  - `<Input />` dari `@/components/ui/input`
  - `<Button />` dari `@/components/ui/button`
  - `<Textarea />` dari `@/components/ui/textarea`
  - `<Badge />` dari `@/components/ui/badge`
  - `<Card />` dari `@/components/ui/card`
  - `<Dialog />` dari `@/components/ui/dialog`

---

### 2. 🔄 Golden Rule Git: Selalu Tarik `main` Terbaru Sebelum & Saat Koding
Konflik terjadi jika membuat branch dari `main` yang basi/ketinggalan commit.

**Sebelum membuat branch baru:**
```bash
git checkout main
git pull origin main
git checkout -b feature/nama-fitur-baru
```

**Setiap pagi atau sebelum membuat Pull Request (PR):**
```bash
git fetch origin
git merge origin/main
```

---

### 3. 📦 Pecah File Besar Menjadi Komponent Modular (Hindari File Rebutan)
- Jangan menumpuk seluruh logika di file bersama seperti `middleware.ts`, `AuthContext.tsx`, atau `settings/page.tsx`.
- Buat helper modular terpisah:
  - Helper Auth/Guard: `src/lib/trial-guard.ts` / `subdomain.ts`.
  - Feature UI & Hook: `src/features/subscription/`, `src/features/onboarding/`, `src/features/saas-admin/`.
- File utama (`middleware.ts` / `settings/page.tsx`) hanya memanggil helper modular tersebut (10-20 baris).

---

### 4. 🎯 Pembagian Wilayah Kekuasaan File per Sprint
- Sepakati kepemilikan file shared/inti saat Sprint Planning:
  - **Ilham (Fullstack/Auth)**: Pemilik utama `middleware.ts` dan logika Auth Token/Cookie.
  - **Isyadi (Frontend Lead)**: Pemilik utama halaman UI baru (`/settings/billing`, `/onboarding`, `/saas-admin`) dan komponen UI visual.
- Jika butuh mendaftarkan route baru di `middleware.ts`, koordinasikan agar tidak mengedit file shared bersamaan.

---

### 5. ⚡ Pull Request (PR) Kecil & Sering Merge (*Small PRs*)
- Selesaikan 1 modul/halaman ➔ buka PR ke GitHub ➔ review ➔ merge ke `main`.
- Hindari menahan kodingan seminggu dalam branch besar. Semakin cepat masuk `main`, semakin mulus workflow tim.
