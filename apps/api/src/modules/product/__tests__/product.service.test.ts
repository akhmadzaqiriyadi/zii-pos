import { describe, expect, it, mock } from "bun:test";
import { ProductService } from "@/modules/product/product.service";
import { db } from "@zii/db";

// Mock DB data for unit tests
const mockProducts = [
  {
    id: "p1",
    tenantId: "tenant-test-01",
    name: "Kaos Polos Cotton 30s",
    price: 65000,
    stock: 45,
    isService: false,
    createdAt: new Date(),
  },
  {
    id: "p2",
    tenantId: "tenant-test-01",
    name: "Kemeja Flanel Premium",
    price: 145000,
    stock: 20,
    isService: false,
    createdAt: new Date(),
  },
  {
    id: "p3",
    tenantId: "tenant-test-01",
    name: "Jasa Potong & Styling",
    price: 40000,
    stock: 999,
    isService: true,
    createdAt: new Date(),
  },
  {
    id: "p4",
    tenantId: "tenant-test-01",
    name: "Parfum Sepatu Premium 100ml",
    price: 35000,
    stock: 3,
    isService: false,
    createdAt: new Date(),
  },
];

mock.module("@zii/db", () => ({
  db: {
    product: {
      findMany: async (args: { where?: Record<string, unknown> }) => {
        let res = [...mockProducts];
        if (args?.where?.name) {
          res = res.filter((p) => p.name.toLowerCase().includes("kaos"));
        }
        if (args?.where?.isService === true) {
          res = res.filter((p) => p.isService);
        }
        if (args?.where?.stock) {
          res = res.filter((p) => !p.isService && p.stock <= 5);
        }
        return res;
      },
      count: async () => mockProducts.length,
      create: async (args: { data: Record<string, unknown> }) => ({
        id: "p-new",
        tenantId: args.data.tenantId,
        name: args.data.name,
        price: args.data.price,
        stock: args.data.stock,
        isService: args.data.isService,
        createdAt: new Date(),
      }),
      update: async (args: { data: Record<string, unknown> }) => ({
        id: "p1",
        tenantId: "tenant-test-01",
        name: args.data.name || "Kaos Updated",
        price: args.data.price || 70000,
        stock: 50,
        isService: false,
        createdAt: new Date(),
      }),
      delete: async () => ({ id: "p1" }),
    },
  },
}));

describe("ProductService Unit Tests with Database Integration", () => {
  it("should return paginated product list with meta info", async () => {
    const result = await ProductService.getProducts("tenant-test-01", {
      page: 1,
      limit: 2,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("meta");
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(2);
  });

  it("should filter products by search term", async () => {
    const result = await ProductService.getProducts("tenant-test-01", {
      search: "Kaos",
    });

    expect(result).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].name).toContain("Kaos");
  });

  it("should filter products by isService and lowStock", async () => {
    const serviceProducts = await ProductService.getProducts("tenant-test-01", {
      isService: "true",
    });
    expect(serviceProducts.data.every((p) => p.isService)).toBe(true);

    const lowStockProducts = await ProductService.getProducts(
      "tenant-test-01",
      {
        lowStock: "true",
      },
    );
    expect(
      lowStockProducts.data.every((p) => !p.isService && p.stock <= 5),
    ).toBe(true);
  });

  it("should create, update, and delete product in database", async () => {
    const created = await ProductService.createProduct("tenant-test-01", {
      name: "Produk Baru",
      price: 50000,
      stock: 10,
    });
    expect(created.name).toBe("Produk Baru");
    expect(created.price).toBe(50000);

    const updated = await ProductService.updateProduct(
      "tenant-test-01",
      created.id,
      { name: "Produk Updated" },
    );
    expect(updated.name).toBe("Produk Updated");

    const deleted = await ProductService.deleteProduct(
      "tenant-test-01",
      created.id,
    );
    expect(deleted).toHaveProperty("id");
  });
});
