import { apiReference } from "@scalar/express-api-reference";
import cors from "cors";
import express from "express";
import pinoHttp from "pino-http";

// 1. Register All Zod Auto-OpenAPI Specifications First
import "./modules/auth/auth.openapi";
import "./modules/product/product.openapi";
import "./modules/tenant/tenant.openapi";
import "./modules/transaction/transaction.openapi";
import "./modules/plan/plan.openapi";
import "./modules/saas-admin/saas-admin.openapi";
import "./modules/subscription/subscription.openapi";

// 2. Import Swagger Spec Generator AFTER All OpenAPI Specs are Registered
import { getSwaggerSpec } from "./config/swagger";
import { authRouter } from "./modules/auth/auth.routes";
import { planRouter } from "./modules/plan/plan.routes";
import { productRouter } from "./modules/product/product.routes";
import { roleRouter } from "./modules/role/role.routes";
import { saasAdminRouter } from "./modules/saas-admin/saas-admin.routes";
import { subscriptionRouter } from "./modules/subscription/subscription.routes";
import { tenantRouter } from "./modules/tenant/tenant.routes";
import { transactionRouter } from "./modules/transaction/transaction.routes";
import { logger } from "./utils/logger";

export const app = express();

app.use(cors());
app.use(express.json());

// Pino HTTP Logger Middleware
app.use(
  pinoHttp({
    logger,
    autoLogging: process.env.NODE_ENV !== "test",
  }),
);

// Dynamic OpenAPI Specification JSON Endpoint
app.get("/docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(getSwaggerSpec());
});

// Dynamic Scalar API Reference (Fetches OpenAPI Spec via /docs.json)
app.use(
  "/docs",
  apiReference({
    spec: {
      url: "/docs.json",
    },
    theme: "purple",
  }),
);

// Health Check Endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "ZII POS Modular Express API",
    version: "2.0.0-saas",
    timestamp: new Date().toISOString(),
    docs: "/docs",
  });
});

// Register Domain Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tenants", tenantRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/plans", planRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/saas-admin", saasAdminRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
