import { apiReference } from "@scalar/express-api-reference";
import cors from "cors";
import express from "express";
import pinoHttp from "pino-http";
import { swaggerSpec } from "./config/swagger";
import { productRouter } from "./modules/product/product.routes";
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

// Scalar API Reference Endpoint (Modern Interactive OpenAPI UI)
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

// Health Check
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
app.use("/api/v1/products", productRouter);
