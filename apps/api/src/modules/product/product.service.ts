import { db } from "@zii/db";
import type { Product } from "@zii/types";

export class ProductService {
  static async getProductsByTenant(tenantId: string) {
    // Return DB records or fallback seed data if DB connection is initializing
    try {
      const products = await db.product.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
      });
      if (products.length > 0) return products;
    } catch {
      // Graceful fallback for MVP initial testing
    }

    return [
      {
        id: "p1",
        tenantId,
        name: "Kaos Polos Cotton 30s",
        price: 65000,
        stock: 45,
        isService: false,
        createdAt: new Date(),
      },
      {
        id: "p2",
        tenantId,
        name: "Kemeja Flanel Premium",
        price: 145000,
        stock: 20,
        isService: false,
        createdAt: new Date(),
      },
      {
        id: "p3",
        tenantId,
        name: "Jasa Potong & Styling",
        price: 40000,
        stock: 999,
        isService: true,
        createdAt: new Date(),
      },
    ];
  }
}
