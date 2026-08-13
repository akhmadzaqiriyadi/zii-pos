import { apiReference } from "@scalar/express-api-reference";
import cors from "cors";
import express from "express";
import pinoHttp from "pino-http";

import { swaggerSpec } from "./config/swagger";
import { authRouter } from "./modules/auth/auth.routes";
import { productRouter } from "./modules/product/product.routes";
import { tenantRouter } from "./modules/tenant/tenant.routes";
import { transactionRouter } from "./modules/transaction/transaction.routes";
import { logger } from "./utils/logger";

// Register Auto OpenAPI Specs via Zod
import "./modules/auth/auth.openapi";
import "./modules/tenant/tenant.openapi";
import "./modules/transaction/transaction.openapi";

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

// Scalar API Reference Endpoint (Interactive Auto OpenAPI UI)
app.use(
  "/docs",
  apiReference({
    spec: {
      content: swaggerSpec,
    },
    theme: "purple",
  }),
);

app.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ZII POS Modular Express API",
    version: "1.0.0-mvp",
    timestamp: new Date().toISOString(),
    docs: "/docs",
  });
});

// Register Domain Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tenants", tenantRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/transactions", transactionRouter);
