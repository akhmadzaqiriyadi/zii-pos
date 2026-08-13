# CHANGELOG — ZII POS Release History

Semua perubahan penting pada proyek ZII POS dicatat dalam dokumen ini. Format berbasis [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) dan mematuhi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-mvp] - 2026-08-12

### 🚀 Added
- **Monorepo Setup:** Inisialisasi Bun Workspaces (`apps/web`, `apps/api`, `packages/db`, `packages/types`).
- **Frontend App (`apps/web`):** Next.js 16 (App Router), Feature-Driven Domain Architecture, Custom Radix UI Primitives + Tailwind CSS Design System.
- **Backend API (`apps/api`):** Express TS running natively di Bun, Modular Controller-Service-Middleware Pattern.
- **OpenAPI Documentation:** Integrated **Scalar API Reference** di `http://localhost:4000/docs`.
- **Logging System:** Pino HTTP Logger dengan `pino-pretty` di development mode.
- **Database (`packages/db`):** Prisma ORM v6 dengan 5 core tables (`tenants`, `users`, `products`, `transactions`, `transaction_items`).
- **Linter & Formatter:** Biome Linter & Formatter terkonfigurasi di root monorepo.
- **Documentation:** `README.md`, `PRD.md`, `CONTRIBUTING.md`, `GIT_PUSH_GUIDE.md`.
