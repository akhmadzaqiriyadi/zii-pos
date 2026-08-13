import { describe, expect, it } from "bun:test";
import { ProductService } from "@/modules/product/product.service";

describe("ProductService Unit Tests with Pagination & Search Filter", () => {
  it("should return paginated product list with meta info", async () => {
    const result = await ProductService.getProducts("demo-tenant-01", {
      page: 1,
      limit: 2,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("meta");
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(2);
    expect(result.meta).toHaveProperty("totalItems");
    expect(result.meta).toHaveProperty("totalPages");
  });

  it("should filter products by search term", async () => {
    const result = await ProductService.getProducts("demo-tenant-01", {
      search: "Kaos",
    });

    expect(result).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].name).toContain("Kaos");
  });
});
