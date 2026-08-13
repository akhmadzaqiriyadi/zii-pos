# ZII POS — Express TS Backend (`@zii/api`)

Backend API REST ZII POS berbasis **Express TS running natively di Bun** dengan pola **Modular Controller-Service-Middleware Architecture**.

---

## 📐 Architecture & Structure

```text
apps/api/src/
├── config/                  # Environment & OpenAPI Specs Config
│   ├── env.ts               # Validated env variables
│   └── swagger.ts           # OpenAPI JSDoc Configuration
├── middlewares/             # Express Middlewares
│   ├── tenant.middleware.ts # Multi-Tenant Header Extractor (`x-tenant-id`)
│   └── error.middleware.ts  # Global Error Handler
├── modules/                 # Modular Domain Architecture
│   └── product/             # product.controller.ts, product.service.ts, product.routes.ts
├── utils/                   # Helper Utilities
│   ├── api-response.ts      # Standardized JSON Response
│   └── logger.ts            # High-Performance Pino Logger
├── app.ts                   # Express Application Router Mount
└── index.ts                 # Entry Server Listener (Port 4000)
```

---

## 📖 API Documentation (Scalar API Reference)

Dokumentasi API interaktif berbasis OpenAPI v3 dapat diakses saat server berjalan di:
- **Interactive UI:** [http://localhost:4000/docs](http://localhost:4000/docs)
- **JSON Specification:** [http://localhost:4000/docs.json](http://localhost:4000/docs.json)

---

## 🔒 Multi-Tenant Header Specification

Setiap request yang membutuhkan isolasi data merchant wajib menyertakan header:
```http
x-tenant-id: <TENANT_UUID>
```
*Jika header tidak dikirim saat pengujian development, sistem akan menggunakan fallback `demo-tenant-01`.*
