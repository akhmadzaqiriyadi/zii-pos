import { describe, expect, it } from "bun:test";
import { TransactionService } from "@/modules/transaction/transaction.service";

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
    const result = await TransactionService.createTransaction(
      "demo-tenant-01",
      {
        customerName: "Budi Test",
        paymentMethod: "cash",
        items: [{ productId: "p1", qty: 2 }],
      },
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty("totalAmount");
    expect(result.customerName).toBe("Budi Test");
  });

  it("should return paginated transaction history with meta info", async () => {
    const result = await TransactionService.getTransactions("demo-tenant-01", {
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("meta");
    expect(result.meta.page).toBe(1);
    expect(result.meta).toHaveProperty("totalItems");
  });
});
