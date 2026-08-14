import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://postgres:postgres@localhost:5432/zii_pos_db";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
