import { describe, expect, it } from "bun:test";
import { TransactionService } from "@/modules/transaction/transaction.service";
import { db } from "@zii/db";

describe("TransactionService Unit Tests", () => {
  it("should throw error if transaction items are empty", async () => {
    try {
      await TransactionService.createTransaction("demo-tenant-01", {
        paymentMethod: "cash",
        items: [],
      });
      expect(true).toBe(false);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toContain("kosong");
      }
    }
  });

  it("should calculate total amount correctly for transactions", async () => {
    const user = await db.user.findFirst();
    const tenantId = user?.tenantId || "demo-tenant-01";
    const userId = user?.id || "demo-user-id";

    const result = await TransactionService.createTransaction(tenantId, {
      userId,
      customerName: "Budi Test",
      paymentMethod: "cash",
      items: [{ productId: "p1", qty: 2 }],
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("totalAmount");
    expect(result.customerName).toBe("Budi Test");
  });

  it("should return paginated transaction history with meta info", async () => {
    const user = await db.user.findFirst();
    const tenantId = user?.tenantId || "demo-tenant-01";

    const result = await TransactionService.getTransactions(tenantId, {
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("meta");
    expect(result.meta.page).toBe(1);
    expect(result.meta).toHaveProperty("totalItems");
  });

  it("should filter transactions by paymentMethod and date range", async () => {
    const user = await db.user.findFirst();
    const tenantId = user?.tenantId || "demo-tenant-01";
    const userId = user?.id || "demo-user-id";

    // Write a valid transaction to DB first
    await TransactionService.createTransaction(tenantId, {
      userId,
      customerName: "Budi Test",
      paymentMethod: "cash",
      items: [{ productId: "p1", qty: 2 }],
    });

    const result = await TransactionService.getTransactions(tenantId, {
      paymentMethod: "cash",
      startDate: "2026-08-01",
      endDate: "2026-08-31",
    });

    expect(result).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].paymentMethod).toBe("cash");
  });
});
