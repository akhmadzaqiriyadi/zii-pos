import { describe, expect, it, mock } from "bun:test";
import { TransactionService } from "@/modules/transaction/transaction.service";

const mockTransactions = [
  {
    id: "trx-1",
    tenantId: "tenant-test-01",
    userId: "user-test-01",
    customerName: "Budi Test",
    customerPhone: "081234567890",
    paymentMethod: "cash",
    totalAmount: 130000,
    status: "completed",
    createdAt: new Date(),
    items: [
      {
        id: "ti-1",
        transactionId: "trx-1",
        productId: "p1",
        productName: "Kaos Polos Cotton 30s",
        price: 65000,
        qty: 2,
        subtotal: 130000,
      },
    ],
  },
];

mock.module("@zii/db", () => ({
  db: {
    tenant: {
      findUnique: async () => ({ id: "tenant-test-01", name: "Test Store" }),
      findFirst: async () => ({ id: "tenant-test-01", name: "Test Store" }),
      create: async () => ({ id: "tenant-test-01", name: "Test Store" }),
    },
    user: {
      findFirst: async () => ({
        id: "user-test-01",
        tenantId: "tenant-test-01",
      }),
      create: async () => ({ id: "user-test-01", tenantId: "tenant-test-01" }),
    },
    product: {
      findMany: async () => [
        {
          id: "p1",
          tenantId: "tenant-test-01",
          name: "Kaos Polos Cotton 30s",
          price: 65000,
          stock: 50,
          isService: false,
        },
      ],
      updateMany: async () => ({ count: 1 }),
    },
    transaction: {
      findMany: async () => mockTransactions,
      count: async () => mockTransactions.length,
      create: async (args: { data: Record<string, unknown> }) => ({
        id: "trx-new",
        tenantId: args.data.tenantId,
        userId: args.data.userId,
        customerName: args.data.customerName,
        paymentMethod: args.data.paymentMethod,
        totalAmount: args.data.totalAmount,
        status: "completed",
        createdAt: new Date(),
        items: [
          {
            id: "ti-new",
            transactionId: "trx-new",
            productId: "p1",
            productName: "Kaos Polos Cotton 30s",
            price: 65000,
            qty: 2,
            subtotal: 130000,
          },
        ],
      }),
    },
    $transaction: async (fn: (tx: unknown) => unknown) => {
      return await fn({
        transaction: {
          create: async (args: { data: Record<string, unknown> }) => ({
            id: "trx-new",
            tenantId: args.data.tenantId,
            userId: args.data.userId,
            customerName: args.data.customerName,
            paymentMethod: args.data.paymentMethod,
            totalAmount: args.data.totalAmount,
            status: "completed",
            createdAt: new Date(),
            items: [
              {
                id: "ti-new",
                transactionId: "trx-new",
                productId: "p1",
                productName: "Kaos Polos Cotton 30s",
                price: 65000,
                qty: 2,
                subtotal: 130000,
              },
            ],
          }),
        },
        product: {
          updateMany: async () => ({ count: 1 }),
        },
      });
    },
  },
}));

describe("TransactionService Unit Tests", () => {
  it("should throw error if transaction items are empty", async () => {
    try {
      await TransactionService.createTransaction("tenant-test-01", {
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
      "tenant-test-01",
      {
        userId: "user-test-01",
        customerName: "Budi Test",
        paymentMethod: "cash",
        items: [{ productId: "p1", qty: 2 }],
      },
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty("totalAmount");
    expect(result.customerName).toBe("Budi Test");
    expect(result.totalAmount).toBe(130000);
  });

  it("should return paginated transaction history with meta info", async () => {
    const result = await TransactionService.getTransactions("tenant-test-01", {
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("meta");
    expect(result.meta.page).toBe(1);
  });

  it("should filter transactions by paymentMethod and date range", async () => {
    const result = await TransactionService.getTransactions("tenant-test-01", {
      paymentMethod: "cash",
      startDate: "2026-08-01",
      endDate: "2026-08-31",
    });

    expect(result).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].paymentMethod).toBe("cash");
  });
});
